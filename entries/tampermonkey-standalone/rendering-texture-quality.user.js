// ==UserScript==
// @name         HF Compatibility - Protected 2048 Textures TEST
// @namespace    https://github.com/Knight-Witch/HeroForge.Compatibility
// @version      0.1.3
// @description  Experimental protected 2048 body/head texture atlas policy for HeroForge complex scenes.
// @author       Knight Witch
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        none
// @sandbox      raw
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

  const GLOBAL = 'HFProtectedTextureQualityTest';
  const FEATURE_ID = 'rendering.texture-quality';
  const BUILD = '0.1.3-protected-2048-adaptive-atlas';
  const PANEL_ID = 'hfc-protected-texture-quality-test';
  const STYLE_ID = `${PANEL_ID}-style`;
  const TARGET_SIZE = 2048;
  const BODY_MASK_SIZE = 1024;
  const TARGET_SLOTS = ['bodyLower', 'bodyUpper', 'face'];
  const BODY_MASK_SLOTS = ['bodyLower', 'bodyUpper'];
  const ATLAS_CANDIDATES = [
    [8192, 4096],
    [8192, 8192]
  ];
  const RESOURCE_OWNER = 82042048;
  const BAKE_WAIT_MS = 5500;
  const WATCH_INTERVAL_MS = 1500;
  const LOSS_GRACE_MS = 2500;
  const REAPPLY_COOLDOWN_MS = 8000;
  const MAX_REAPPLY_FAILURES = 3;
  const MAX_ATTEMPT_HISTORY = 20;
  const MAX_TIMELINE = 160;

  let enabled = false;
  let disposed = false;
  let busy = false;
  let panel = null;
  let toggle = null;
  let statusEl = null;
  let detailEl = null;
  let watcher = null;
  let activeSession = null;
  let unhealthySince = null;
  let lastReapplyAttempt = 0;
  let reapplyFailures = 0;
  let lastDiagnostics = null;
  let lastError = null;
  const attemptHistory = [];
  const timeline = [];
  let lastTimelineFingerprint = null;
  let api = null;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function cloneDiagnostic(value) {
    if (value === undefined) return undefined;
    try { return JSON.parse(JSON.stringify(value)); } catch (_) { return String(value); }
  }

  function syncApi() {
    if (!api) return;
    api.enabled = enabled;
    api.busy = busy;
    api.diagnostics = cloneDiagnostic(lastDiagnostics);
    api.lastError = cloneDiagnostic(lastError);
    api.attemptHistory = cloneDiagnostic(attemptHistory);
    api.timeline = cloneDiagnostic(timeline);
  }

  function recordAttempt(stage, data = {}) {
    attemptHistory.push({ at: new Date().toISOString(), stage, ...cloneDiagnostic(data) });
    while (attemptHistory.length > MAX_ATTEMPT_HISTORY) attemptHistory.shift();
    syncApi();
  }

  function getCK() {
    return window.CK || null;
  }

  function ownSnapshot(object, key) {
    const hadOwn = !!object && Object.prototype.hasOwnProperty.call(object, key);
    return {
      object,
      key,
      hadOwn,
      descriptor: hadOwn ? Object.getOwnPropertyDescriptor(object, key) : null,
      value: object ? object[key] : undefined
    };
  }

  function restoreOwnSnapshot(snapshot) {
    if (!snapshot || !snapshot.object) return;
    try {
      if (snapshot.hadOwn && snapshot.descriptor) {
        Object.defineProperty(snapshot.object, snapshot.key, snapshot.descriptor);
      } else {
        delete snapshot.object[snapshot.key];
      }
    } catch (_) {
      try { snapshot.object[snapshot.key] = snapshot.value; } catch (_) {}
    }
  }

  function setStatus(text, error = false) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.dataset.error = error ? '1' : '0';
  }

  function setDetail(text) {
    if (detailEl) detailEl.textContent = text || '';
  }

  function rendererMaxTextureSize(CK) {
    const renderer = (CK && CK.renderManager && CK.renderManager.renderer)
      || (CK && CK.Capture && CK.Capture.renderer)
      || null;
    return renderer && renderer.capabilities
      ? Number(renderer.capabilities.maxTextureSize) || null
      : null;
  }

  function readCapabilities() {
    const CK = getCK();
    if (!CK) return { ok: false, reason: 'CK unavailable' };

    const character = CK.character;
    const display = character && character.display;
    const modded = display && display.modded;
    const parts = modded && modded.parts;
    const meshes = display && display.meshes;
    const data = character && character.data;
    const colorBake = display && display.colorBake;
    const Resources = CK.Resources;
    const maxTextureSize = rendererMaxTextureSize(CK);

    if (!character || !display || !modded || !parts || !meshes || !data || !colorBake) {
      return { ok: false, reason: 'HeroForge character renderer not ready' };
    }
    if (CK.Settings && CK.Settings.shadersUseTextureAtlas !== true) {
      return { ok: false, reason: 'Native texture-atlas mode is required' };
    }
    if (typeof CK.Atlas !== 'function') return { ok: false, reason: 'CK.Atlas unavailable' };
    if (!Resources || typeof Resources.getResource !== 'function' || typeof Resources.getNow !== 'function') {
      return { ok: false, reason: 'CK.Resources texture loader unavailable' };
    }
    if (typeof modded.buildAtlas !== 'function') return { ok: false, reason: 'modded.buildAtlas unavailable' };
    if (typeof colorBake.invalidateCache !== 'function' || typeof colorBake.refresh !== 'function') {
      return { ok: false, reason: 'Color-bake refresh capability unavailable' };
    }
    if (typeof data.isUHD !== 'function') return { ok: false, reason: 'data.isUHD unavailable' };
    if (!data.atlasScale || typeof data.atlasScale !== 'object') {
      return { ok: false, reason: 'atlasScale policy unavailable' };
    }
    if (maxTextureSize !== null && maxTextureSize < 8192) {
      return { ok: false, reason: `GPU texture limit ${maxTextureSize}px is below 8192px` };
    }

    for (const slot of TARGET_SLOTS) {
      if (!parts[slot] || !meshes[slot]) return { ok: false, reason: `${slot} capability unavailable` };
      if (BODY_MASK_SLOTS.includes(slot) && typeof parts[slot].getMaskPath !== 'function') {
        return { ok: false, reason: `${slot}.getMaskPath unavailable` };
      }
    }

    return { ok: true, CK, character, display, modded, parts, meshes, data, colorBake, Resources, maxTextureSize };
  }

  function allocation(atlas, slot) {
    if (!atlas || typeof atlas.getUV !== 'function') return null;
    const uv = atlas.getUV(slot);
    if (!uv) return null;
    return {
      width: Math.round(Number(uv.z) * Number(atlas.width)),
      height: Math.round(Number(uv.w) * Number(atlas.height))
    };
  }

  function materialAllocation(material, atlas) {
    const uv = material && material.uniforms && material.uniforms.uvPosScl
      ? material.uniforms.uvPosScl.value
      : null;
    if (!uv || !atlas) return null;
    return {
      width: Math.round(Number(uv.z) * Number(atlas.width)),
      height: Math.round(Number(uv.w) * Number(atlas.height))
    };
  }

  function targetAllocations(atlas) {
    const result = {};
    for (const slot of TARGET_SLOTS) {
      const a = allocation(atlas, slot);
      result[slot] = a ? [a.width, a.height] : null;
    }
    return result;
  }

  function atlasDescriptor(atlas) {
    return atlas ? [Number(atlas.width), Number(atlas.height)] : null;
  }

  function partSignature(parts) {
    return Object.keys(parts || {}).sort().map((slot) => {
      const part = parts[slot];
      return `${slot}:${part && part.baseName ? part.baseName : ''}`;
    }).join('|');
  }

  function snapshotAllocations(atlas, parts) {
    const out = {};
    for (const slot of Object.keys(parts || {})) {
      try {
        const a = allocation(atlas, slot);
        if (a) out[slot] = [a.width, a.height];
      } catch (_) {}
    }
    return out;
  }

  function capsFromBaseline(baselineAllocations) {
    const caps = {};
    for (const [slot, size] of Object.entries(baselineAllocations || {})) {
      if (!Array.isArray(size) || size.length < 2) continue;
      caps[slot] = Math.min(Number(size[0]) || 0, Number(size[1]) || 0);
    }
    for (const slot of TARGET_SLOTS) caps[slot] = TARGET_SIZE;
    return caps;
  }

  function compareAgainstBaseline(baselineAllocations, protectedAtlas, parts) {
    const changes = [];
    const regressions = [];
    for (const slot of Object.keys(parts || {})) {
      const base = baselineAllocations[slot];
      if (!base) continue;
      let current = null;
      try {
        const a = allocation(protectedAtlas, slot);
        if (a) current = [a.width, a.height];
      } catch (_) {}
      if (!current) {
        const row = { slot, baseline: base, protected: null };
        changes.push(row);
        if (!TARGET_SLOTS.includes(slot)) regressions.push(row);
        continue;
      }
      if (current[0] === base[0] && current[1] === base[1]) continue;
      const row = { slot, baseline: base, protected: current };
      changes.push(row);
      if (!TARGET_SLOTS.includes(slot)
        && (current[0] < base[0] || current[1] < base[1])) {
        regressions.push(row);
      }
    }
    return { changes, regressions };
  }

  function describeCandidateRows(rows) {
    return rows.map((row) => {
      const a = row.allocations || {};
      const one = (slot) => (a[slot] && a[slot][0]) || '?';
      const suffix = row.regressions && row.regressions.length
        ? `; ${row.regressions.length} unrelated regression${row.regressions.length === 1 ? '' : 's'}`
        : '';
      return `${row.atlas[0]}×${row.atlas[1]} → BL ${one('bodyLower')} / BU ${one('bodyUpper')} / face ${one('face')}${suffix}`;
    }).join(' | ');
  }

  function recordTimeline() {
    const CK = getCK();
    const display = CK && CK.character && CK.character.display;
    const modded = display && display.modded;
    const parts = modded && modded.parts;
    const atlas = display && display.atlas;
    const snapshot = {
      at: new Date().toISOString(),
      build: BUILD,
      enabled,
      busy,
      atlas: atlasDescriptor(atlas),
      allocations: atlas && parts ? targetAllocations(atlas) : null,
      bakeSize: parts ? {
        bodyLower: parts.bodyLower && parts.bodyLower.bakeSize,
        bodyUpper: parts.bodyUpper && parts.bodyUpper.bakeSize,
        face: parts.face && parts.face.bakeSize
      } : null,
      usedTextureSize: parts ? {
        bodyLower: parts.bodyLower && parts.bodyLower._usedTextureSize,
        bodyUpper: parts.bodyUpper && parts.bodyUpper._usedTextureSize,
        face: parts.face && parts.face._usedTextureSize
      } : null,
      status: statusEl ? statusEl.textContent : null,
      detail: detailEl ? detailEl.textContent : null,
      lastError: lastError ? lastError.message : null
    };
    const fingerprint = JSON.stringify({ ...snapshot, at: null });
    if (fingerprint === lastTimelineFingerprint) return;
    lastTimelineFingerprint = fingerprint;
    timeline.push(snapshot);
    while (timeline.length > MAX_TIMELINE) timeline.shift();
    syncApi();
  }

  function setBusy(value) {
    busy = !!value;
    syncApi();
    recordTimeline();
  }

  function clearErrorLatch() {
    lastError = null;
    syncApi();
  }

  function latchError(error, diagnostics, detailText = '') {
    const message = error && error.message ? error.message : String(error);
    lastError = {
      at: new Date().toISOString(),
      message,
      diagnostics: cloneDiagnostic(diagnostics)
    };
    lastDiagnostics = {
      featureId: FEATURE_ID,
      build: BUILD,
      status: 'error',
      message,
      ...cloneDiagnostic(diagnostics),
      failedAt: lastError.at
    };
    setStatus(`Not enabled: ${message}`, true);
    setDetail(detailText || 'The last error will remain here until the next explicit enable attempt or page reload.');
    recordAttempt('error', lastDiagnostics);
    syncApi();
    recordTimeline();
  }

  function makeSession(capability) {
    const { CK, display, modded, parts, meshes, data } = capability;
    const baselineAtlas = display.atlas;
    const baselineResourceAtlas = modded.resourceAtlas;
    const baselineAllocations = snapshotAllocations(baselineAtlas, parts);
    return {
      CK,
      display,
      modded,
      data,
      parts: {
        bodyLower: parts.bodyLower,
        bodyUpper: parts.bodyUpper,
        face: parts.face
      },
      partSignature: partSignature(parts),
      originalResolvedBuildAtlas: modded.buildAtlas,
      originalActiveAtlas: baselineAtlas,
      originalResourceAtlas: baselineResourceAtlas,
      baselineAllocations,
      baselineTargetAllocations: targetAllocations(baselineAtlas),
      nativeCaps: capsFromBaseline(baselineAllocations),
      original: {
        bodyLowerBakeSize: ownSnapshot(parts.bodyLower, 'bakeSize'),
        bodyUpperBakeSize: ownSnapshot(parts.bodyUpper, 'bakeSize'),
        faceBakeSize: ownSnapshot(parts.face, 'bakeSize'),
        bodyLowerUsedSize: ownSnapshot(parts.bodyLower, '_usedTextureSize'),
        bodyUpperUsedSize: ownSnapshot(parts.bodyUpper, '_usedTextureSize'),
        faceUsedSize: ownSnapshot(parts.face, '_usedTextureSize'),
        lowerMaskOverride: ownSnapshot(meshes.bodyLower, 'masksMapOverride'),
        upperMaskOverride: ownSnapshot(meshes.bodyUpper, 'masksMapOverride'),
        buildAtlas: ownSnapshot(modded, 'buildAtlas')
      },
      maskPaths: null,
      maskTextures: null,
      candidateResults: [],
      selectedAtlasSize: null,
      protectedAtlas: null,
      appliedAt: null
    };
  }

  function restoreSessionMetadata(session) {
    if (!session) return;
    restoreOwnSnapshot(session.original.bodyLowerBakeSize);
    restoreOwnSnapshot(session.original.bodyUpperBakeSize);
    restoreOwnSnapshot(session.original.faceBakeSize);
    restoreOwnSnapshot(session.original.bodyLowerUsedSize);
    restoreOwnSnapshot(session.original.bodyUpperUsedSize);
    restoreOwnSnapshot(session.original.faceUsedSize);
    restoreOwnSnapshot(session.original.lowerMaskOverride);
    restoreOwnSnapshot(session.original.upperMaskOverride);
    restoreOwnSnapshot(session.original.buildAtlas);
  }

  function applyProtectedTargetMetadata(session) {
    session.parts.bodyLower.bakeSize = TARGET_SIZE;
    session.parts.bodyUpper.bakeSize = TARGET_SIZE;
    session.parts.face.bakeSize = TARGET_SIZE;
    session.parts.bodyLower._usedTextureSize = BODY_MASK_SIZE;
    session.parts.bodyUpper._usedTextureSize = BODY_MASK_SIZE;
    session.parts.face._usedTextureSize = BODY_MASK_SIZE;
    if (session.maskTextures) {
      session.display.meshes.bodyLower.masksMapOverride = session.maskTextures.bodyLower;
      session.display.meshes.bodyUpper.masksMapOverride = session.maskTextures.bodyUpper;
    }
  }

  async function loadBodyMasks(capability, session) {
    const { Resources, display } = capability;
    const hiRez = display.modded && display.modded.settings ? display.modded.settings.hiRez : false;

    session.parts.bodyLower._usedTextureSize = BODY_MASK_SIZE;
    session.parts.bodyUpper._usedTextureSize = BODY_MASK_SIZE;
    session.parts.face._usedTextureSize = BODY_MASK_SIZE;

    const lowerPath = session.parts.bodyLower.getMaskPath(hiRez, BODY_MASK_SIZE);
    const upperPath = session.parts.bodyUpper.getMaskPath(hiRez, BODY_MASK_SIZE);
    if (!lowerPath || !upperPath) throw new Error('Could not resolve 1024px body mask paths.');

    await Promise.all([
      Promise.resolve(Resources.getResource(lowerPath, 'webp', RESOURCE_OWNER)),
      Promise.resolve(Resources.getResource(upperPath, 'webp', RESOURCE_OWNER))
    ]);

    const deadline = Date.now() + 5000;
    while (Date.now() < deadline) {
      const lowerLoaded = typeof Resources.loaded === 'function' ? Resources.loaded(lowerPath) : !!Resources.getNow(lowerPath);
      const upperLoaded = typeof Resources.loaded === 'function' ? Resources.loaded(upperPath) : !!Resources.getNow(upperPath);
      if (lowerLoaded && upperLoaded) break;
      await sleep(100);
    }

    const lowerTexture = Resources.getNow(lowerPath);
    const upperTexture = Resources.getNow(upperPath);
    const lowerWidth = lowerTexture && lowerTexture.image ? Number(lowerTexture.image.width) : 0;
    const upperWidth = upperTexture && upperTexture.image ? Number(upperTexture.image.width) : 0;
    if (!lowerTexture || !upperTexture || lowerWidth !== BODY_MASK_SIZE || upperWidth !== BODY_MASK_SIZE) {
      throw new Error('Valid 1024px body masks did not load; refusing high-resolution rebake.');
    }

    session.maskPaths = { bodyLower: lowerPath, bodyUpper: upperPath };
    session.maskTextures = { bodyLower: lowerTexture, bodyUpper: upperTexture };
    recordAttempt('masks-loaded', {
      paths: session.maskPaths,
      sizes: { bodyLower: lowerWidth, bodyUpper: upperWidth }
    });
  }

  function buildCandidate(session, atlasSize) {
    const [width, height] = atlasSize;
    const scale = Object.assign({}, session.data.atlasScale || {});
    scale.bodyLower = 4;
    scale.bodyUpper = 4;
    scale.face = 4;

    const atlas = new session.CK.Atlas(
      Object.assign({}, session.modded.parts),
      width,
      height,
      session.nativeCaps,
      session.data.isUHD(),
      scale
    );
    const allocations = targetAllocations(atlas);
    const comparison = compareAgainstBaseline(session.baselineAllocations, atlas, session.modded.parts);
    const targetOk = TARGET_SLOTS.every((slot) => {
      const value = allocations[slot];
      return value && value[0] === TARGET_SIZE && value[1] === TARGET_SIZE;
    });
    return {
      atlas,
      result: {
        atlas: [width, height],
        allocations,
        targetOk,
        regressions: comparison.regressions,
        changes: comparison.changes
      }
    };
  }

  function chooseProtectedAtlas(session) {
    session.candidateResults = [];
    for (const atlasSize of ATLAS_CANDIDATES) {
      const built = buildCandidate(session, atlasSize);
      session.candidateResults.push(built.result);
      recordAttempt('atlas-candidate', built.result);
      if (built.result.targetOk && built.result.regressions.length === 0) {
        session.selectedAtlasSize = atlasSize.slice();
        session.protectedAtlas = built.atlas;
        return built.atlas;
      }
    }

    const first = session.candidateResults[0];
    const last = session.candidateResults[session.candidateResults.length - 1];
    const got = first && first.allocations && first.allocations.bodyLower
      ? first.allocations.bodyLower[0]
      : '?';
    const regressionNote = last && last.regressions && last.regressions.length
      ? `; ${last.regressions.length} unrelated slot regression${last.regressions.length === 1 ? '' : 's'} remained at ${last.atlas[0]}×${last.atlas[1]}`
      : '';
    throw new Error(`No safe atlas candidate reached ${TARGET_SIZE}px body/head (first bodyLower ${got}px${regressionNote}).`);
  }

  function buildSelectedAtlas(session) {
    if (!session.selectedAtlasSize) throw new Error('No selected protected atlas size.');
    const built = buildCandidate(session, session.selectedAtlasSize);
    if (!built.result.targetOk) throw new Error('Selected protected atlas no longer reaches 2048px body/head.');
    if (built.result.regressions.length) {
      throw new Error(`Selected protected atlas now reduces ${built.result.regressions[0].slot} below baseline.`);
    }
    session.protectedAtlas = built.atlas;
    session.candidateResults = [built.result];
    return built.atlas;
  }

  function installProtectedBuildAtlas(session) {
    const wrapper = function protectedBuildAtlas() {
      if (!enabled || activeSession !== session || this !== session.modded) {
        return session.originalResolvedBuildAtlas.apply(this, arguments);
      }
      if (partSignature(this.parts) !== session.partSignature) {
        session.partSetChanged = true;
        return session.originalResolvedBuildAtlas.apply(this, arguments);
      }
      const atlas = buildSelectedAtlas(session);
      this.resourceAtlas = atlas;
      return atlas;
    };

    Object.defineProperty(session.modded, 'buildAtlas', {
      configurable: true,
      enumerable: session.original.buildAtlas.descriptor ? !!session.original.buildAtlas.descriptor.enumerable : false,
      writable: true,
      value: wrapper
    });
    if (session.modded.buildAtlas !== wrapper) {
      throw new Error('Could not install reversible protected atlas builder.');
    }
  }

  function verifyProtectedState(session = activeSession) {
    if (!session) return { ok: false, reason: 'No active protected-texture session' };
    const CK = getCK();
    if (!CK || !CK.character || CK.character.display !== session.display) {
      return { ok: false, reason: 'HeroForge display changed' };
    }

    const atlas = session.display.atlas;
    const selected = session.selectedAtlasSize;
    if (!selected || !atlas || Number(atlas.width) !== selected[0] || Number(atlas.height) !== selected[1]) {
      return { ok: false, reason: 'Protected atlas dimensions lost' };
    }

    const allocations = targetAllocations(atlas);
    for (const slot of TARGET_SLOTS) {
      const a = allocations[slot];
      if (!a || a[0] !== TARGET_SIZE || a[1] !== TARGET_SIZE) {
        return { ok: false, reason: `${slot} allocation is not ${TARGET_SIZE}px`, allocations };
      }
      const displayMaterial = session.display.meshes[slot] && session.display.meshes[slot].material;
      const bound = materialAllocation(displayMaterial, atlas);
      if (!bound || bound.width !== TARGET_SIZE || bound.height !== TARGET_SIZE) {
        return { ok: false, reason: `${slot} display material is not bound to protected allocation`, allocations };
      }
    }

    for (const slot of BODY_MASK_SLOTS) {
      const mesh = session.display.meshes[slot];
      const texture = session.maskTextures && session.maskTextures[slot];
      if (!mesh || !texture || mesh.masksMapOverride !== texture) {
        return { ok: false, reason: `${slot} protected mask override was lost`, allocations };
      }
      const width = texture.image ? Number(texture.image.width) : 0;
      if (width !== BODY_MASK_SIZE) return { ok: false, reason: `${slot} mask is not ${BODY_MASK_SIZE}px`, allocations };
    }

    const lowerBake = session.display.meshes.bodyLower
      && session.display.meshes.bodyLower.bakeMaterials
      && session.display.meshes.bodyLower.bakeMaterials.color;
    const lowerBakeAllocation = materialAllocation(lowerBake, atlas);
    if (!lowerBakeAllocation || lowerBakeAllocation.width !== TARGET_SIZE || lowerBakeAllocation.height !== TARGET_SIZE) {
      return { ok: false, reason: 'bodyLower color bake is not bound to protected allocation', allocations };
    }

    const lowerDecals = session.display.meshes.bodyLower
      && session.display.meshes.bodyLower.bakeMaterials
      && session.display.meshes.bodyLower.bakeMaterials.colorDecals;
    if (Array.isArray(lowerDecals) && lowerDecals.length) {
      const decalAllocation = materialAllocation(lowerDecals[0], atlas);
      if (!decalAllocation || decalAllocation.width !== TARGET_SIZE || decalAllocation.height !== TARGET_SIZE) {
        return { ok: false, reason: 'bodyLower decal bake is not bound to protected allocation', allocations };
      }
    }

    const comparison = compareAgainstBaseline(session.baselineAllocations, atlas, session.modded.parts);
    if (comparison.regressions.length) {
      return { ok: false, reason: `${comparison.regressions[0].slot} fell below pre-enable allocation`, allocations };
    }

    return { ok: true, allocations, comparison };
  }

  async function restoreExactBaseline(session) {
    if (!session) return;
    restoreSessionMetadata(session);
    const CK = getCK();
    if (!CK || !CK.character || CK.character.display !== session.display) return;
    try {
      session.modded.resourceAtlas = session.originalResourceAtlas;
      session.display.atlas = session.originalActiveAtlas;
      session.display.colorBake.invalidateCache();
      session.display.colorBake.refresh(true);
      await sleep(BAKE_WAIT_MS);
      session.modded.resourceAtlas = session.originalResourceAtlas;
      session.display.atlas = session.originalActiveAtlas;
    } catch (error) {
      console.error('[HFC texture quality] exact-baseline restore warning', error);
      try {
        session.modded.resourceAtlas = session.originalResourceAtlas;
        session.display.atlas = session.originalActiveAtlas;
      } catch (_) {}
    }
  }

  async function applyFreshSession() {
    const capability = readCapabilities();
    if (!capability.ok) throw new Error(capability.reason);
    const session = makeSession(capability);

    recordAttempt('enable-start', {
      baselineAtlas: atlasDescriptor(session.originalActiveAtlas),
      baselineTargetAllocations: session.baselineTargetAllocations,
      maxTextureSize: capability.maxTextureSize,
      partCount: Object.keys(capability.parts).length
    });

    try {
      await loadBodyMasks(capability, session);
      applyProtectedTargetMetadata(session);
      const protectedAtlas = chooseProtectedAtlas(session);
      installProtectedBuildAtlas(session);
      activeSession = session;
      session.modded.resourceAtlas = protectedAtlas;
      session.display.atlas = protectedAtlas;

      recordAttempt('atlas-assigned', {
        selectedAtlas: session.selectedAtlasSize,
        allocations: targetAllocations(protectedAtlas)
      });

      session.display.colorBake.invalidateCache();
      session.display.colorBake.refresh(true);
      await sleep(BAKE_WAIT_MS);

      const verification = verifyProtectedState(session);
      if (!verification.ok) throw new Error(verification.reason);

      session.appliedAt = new Date().toISOString();
      lastDiagnostics = {
        featureId: FEATURE_ID,
        build: BUILD,
        status: 'active',
        baselineAtlas: atlasDescriptor(session.originalActiveAtlas),
        baselineTargetAllocations: session.baselineTargetAllocations,
        selectedAtlas: session.selectedAtlasSize,
        targetSize: TARGET_SIZE,
        allocations: verification.allocations,
        candidateResults: session.candidateResults,
        maskPaths: session.maskPaths,
        maxTextureSize: capability.maxTextureSize,
        appliedAt: session.appliedAt
      };
      lastError = null;
      recordAttempt('enable-success', lastDiagnostics);
      syncApi();
      return session;
    } catch (error) {
      const diagnostic = {
        baselineAtlas: atlasDescriptor(session.originalActiveAtlas),
        baselineTargetAllocations: session.baselineTargetAllocations,
        candidateResults: session.candidateResults,
        maskPaths: session.maskPaths,
        maxTextureSize: capability.maxTextureSize
      };
      if (activeSession === session) activeSession = null;
      await restoreExactBaseline(session);
      error.hfcDiagnostic = diagnostic;
      throw error;
    }
  }

  async function reapplySession(session) {
    const CK = getCK();
    if (!session || !CK || !CK.character || CK.character.display !== session.display) {
      throw new Error('Current display changed.');
    }
    if (partSignature(session.modded.parts) !== session.partSignature) {
      throw new Error('Current part set changed; fresh protected session required.');
    }
    applyProtectedTargetMetadata(session);
    const atlas = buildSelectedAtlas(session);
    session.modded.resourceAtlas = atlas;
    session.display.atlas = atlas;
    session.display.colorBake.invalidateCache();
    session.display.colorBake.refresh(true);
    await sleep(BAKE_WAIT_MS);

    const verification = verifyProtectedState(session);
    if (!verification.ok) throw new Error(verification.reason);
    session.appliedAt = new Date().toISOString();
    lastDiagnostics = {
      ...lastDiagnostics,
      status: 'active',
      selectedAtlas: session.selectedAtlasSize,
      allocations: verification.allocations,
      appliedAt: session.appliedAt
    };
    recordAttempt('reapply-success', {
      selectedAtlas: session.selectedAtlasSize,
      allocations: verification.allocations
    });
    syncApi();
  }

  function sessionMatchesCurrent(session) {
    const CK = getCK();
    const display = CK && CK.character && CK.character.display;
    if (!session || !display || display !== session.display) return false;
    const parts = display.modded && display.modded.parts;
    return !!parts
      && parts.bodyLower === session.parts.bodyLower
      && parts.bodyUpper === session.parts.bodyUpper
      && parts.face === session.parts.face;
  }

  async function enableFeature() {
    if (disposed || busy || enabled) return;
    clearErrorLatch();
    setBusy(true);
    enabled = true;
    syncApi();
    if (toggle) toggle.checked = true;
    setStatus('Applying protected 2048 textures…');
    setDetail('Testing 8192×4096 first, then 8192×8192 only if more atlas area is required.');
    recordTimeline();

    try {
      activeSession = await applyFreshSession();
      unhealthySince = null;
      reapplyFailures = 0;
      const [w, h] = activeSession.selectedAtlasSize;
      setStatus('Protected 2048 textures active');
      setDetail(`${w}×${h} atlas; bodyLower/bodyUpper/face protected at 2048px.${h === 8192 ? ' High-atlas-area mode is active.' : ''}`);
      recordTimeline();
    } catch (error) {
      enabled = false;
      activeSession = null;
      if (toggle) toggle.checked = false;
      const diagnostic = error.hfcDiagnostic || {};
      const rows = diagnostic.candidateResults || [];
      const detail = rows.length
        ? `${describeCandidateRows(rows)}. Exact pre-enable display restored. This error remains latched.`
        : 'Exact pre-enable display restored. This error remains latched.';
      latchError(error, diagnostic, detail);
      console.error('[HFC texture quality] enable failed', error, diagnostic);
    } finally {
      setBusy(false);
    }
  }

  async function disableFeature({ silent = false } = {}) {
    if (busy) return;
    enabled = false;
    unhealthySince = null;
    reapplyFailures = 0;
    if (toggle) toggle.checked = false;
    syncApi();

    const session = activeSession;
    activeSession = null;
    if (!session) {
      if (!silent && !lastError) {
        setStatus('Native HeroForge textures');
        setDetail('Protected texture policy is disabled.');
      }
      recordTimeline();
      return;
    }

    setBusy(true);
    if (!silent) setStatus('Restoring exact pre-enable texture state…');
    try {
      await restoreExactBaseline(session);
      lastDiagnostics = {
        featureId: FEATURE_ID,
        build: BUILD,
        status: 'disabled',
        restoredAtlas: atlasDescriptor(session.originalActiveAtlas),
        disabledAt: new Date().toISOString()
      };
      clearErrorLatch();
      recordAttempt('disable-success', lastDiagnostics);
      if (!silent) {
        setStatus('Pre-enable HeroForge textures restored');
        setDetail('The atlas and runtime metadata captured before enable were restored.');
      }
    } catch (error) {
      if (!silent) latchError(error, { stage: 'disable' }, 'Disable completed with a warning. Refresh HeroForge if the renderer does not look native.');
      console.error('[HFC texture quality] disable restore warning', error);
    } finally {
      setBusy(false);
      syncApi();
    }
  }

  async function watcherTick() {
    if (disposed) return;
    recordTimeline();
    if (busy) return;

    if (!enabled) {
      if (lastError) return;
      const capability = readCapabilities();
      if (capability.ok) {
        setStatus('Ready — protected texture policy is off');
        setDetail('Enable to protect body/head atlas allocations at 2048px.');
      } else {
        setStatus(capability.reason, true);
        setDetail('Waiting for a compatible HeroForge character renderer.');
      }
      recordTimeline();
      return;
    }

    if (!sessionMatchesCurrent(activeSession) || (activeSession && activeSession.partSetChanged)) {
      setBusy(true);
      setStatus('HeroForge character/part set changed — rebuilding protected session…');
      try {
        if (activeSession && sessionMatchesCurrent(activeSession)) {
          await restoreExactBaseline(activeSession);
        } else if (activeSession) {
          restoreSessionMetadata(activeSession);
        }
        activeSession = await applyFreshSession();
        unhealthySince = null;
        reapplyFailures = 0;
        const [w, h] = activeSession.selectedAtlasSize;
        setStatus('Protected 2048 textures active');
        setDetail(`Protected policy reapplied using ${w}×${h}.`);
      } catch (error) {
        enabled = false;
        activeSession = null;
        if (toggle) toggle.checked = false;
        latchError(error, error.hfcDiagnostic || { stage: 'character-change' }, 'Auto-disabled; the last error remains visible.');
        console.error('[HFC texture quality] character-change reapply failed', error);
      } finally {
        setBusy(false);
      }
      return;
    }

    const verification = verifyProtectedState(activeSession);
    if (verification.ok) {
      unhealthySince = null;
      return;
    }

    const now = Date.now();
    if (unhealthySince === null) unhealthySince = now;
    if (now - unhealthySince < LOSS_GRACE_MS || now - lastReapplyAttempt < REAPPLY_COOLDOWN_MS) return;

    lastReapplyAttempt = now;
    setBusy(true);
    setStatus('Texture allocation changed — restoring protected 2048 state…');
    try {
      await reapplySession(activeSession);
      unhealthySince = null;
      reapplyFailures = 0;
      setStatus('Protected 2048 textures active');
      setDetail(`Protected atlas lifecycle restored automatically using ${activeSession.selectedAtlasSize[0]}×${activeSession.selectedAtlasSize[1]}.`);
    } catch (error) {
      reapplyFailures += 1;
      recordAttempt('reapply-failure', { message: error.message, count: reapplyFailures });
      console.error('[HFC texture quality] lifecycle reapply failed', error);
      if (reapplyFailures >= MAX_REAPPLY_FAILURES) {
        const failedSession = activeSession;
        activeSession = null;
        enabled = false;
        if (toggle) toggle.checked = false;
        try { await restoreExactBaseline(failedSession); } catch (_) {}
        latchError(error, { stage: 'lifecycle', reapplyFailures }, 'Auto-disabled after repeated lifecycle failures; error remains visible.');
      } else {
        setStatus(`Protected state lost; retry ${reapplyFailures}/${MAX_REAPPLY_FAILURES}`, true);
        setDetail(error.message);
      }
    } finally {
      setBusy(false);
    }
  }

  function mountUI() {
    if (document.getElementById(PANEL_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${PANEL_ID} {
        position: fixed; right: 16px; bottom: 16px; z-index: 2147483600;
        width: 360px; padding: 12px 14px; border: 1px solid rgba(255,255,255,.18);
        border-radius: 10px; background: rgba(20,20,24,.94); color: #f2f2f5;
        box-shadow: 0 10px 30px rgba(0,0,0,.35); font: 12px/1.35 system-ui, sans-serif;
      }
      #${PANEL_ID} .hfc-title { font-size: 13px; font-weight: 700; margin-bottom: 8px; }
      #${PANEL_ID} .hfc-row { display: flex; align-items: center; gap: 8px; }
      #${PANEL_ID} .hfc-row label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 600; }
      #${PANEL_ID} .hfc-status { margin-top: 8px; font-weight: 600; }
      #${PANEL_ID} .hfc-status[data-error="1"] { color: #ffb4b4; }
      #${PANEL_ID} .hfc-detail { margin-top: 4px; opacity: .78; white-space: normal; }
      #${PANEL_ID} .hfc-build { margin-top: 8px; opacity: .45; font-size: 10px; }
    `;
    document.head.appendChild(style);

    panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="hfc-title">Protected 2048 Textures — TEST</div>
      <div class="hfc-row"><label><input type="checkbox"> Enable protected textures</label></div>
      <div class="hfc-status" data-error="0">Waiting for HeroForge…</div>
      <div class="hfc-detail"></div>
      <div class="hfc-build">${FEATURE_ID} · ${BUILD}</div>
    `;
    document.body.appendChild(panel);

    toggle = panel.querySelector('input[type="checkbox"]');
    statusEl = panel.querySelector('.hfc-status');
    detailEl = panel.querySelector('.hfc-detail');
    toggle.addEventListener('change', () => {
      if (toggle.checked) enableFeature();
      else disableFeature();
    });
  }

  async function dispose() {
    if (disposed) return;
    await disableFeature({ silent: true });
    disposed = true;
    if (watcher) clearInterval(watcher);
    watcher = null;
    if (panel) panel.remove();
    panel = null;
    const style = document.getElementById(STYLE_ID);
    if (style) style.remove();
    try { delete window[GLOBAL]; } catch (_) { window[GLOBAL] = null; }
  }

  const prior = window[GLOBAL];
  if (prior && typeof prior.dispose === 'function') {
    try { prior.dispose(); } catch (_) {}
  }

  api = {
    featureId: FEATURE_ID,
    build: BUILD,
    enabled: false,
    busy: false,
    diagnostics: null,
    lastError: null,
    attemptHistory: [],
    timeline: [],
    enable: enableFeature,
    disable: disableFeature,
    applyNow: async () => {
      if (!enabled) return enableFeature();
      if (!activeSession) return false;
      return reapplySession(activeSession);
    },
    verify: () => verifyProtectedState(activeSession),
    clearLastError: () => {
      clearErrorLatch();
      setStatus('Ready — protected texture policy is off');
      setDetail('Enable to protect body/head atlas allocations at 2048px.');
      recordTimeline();
    },
    dispose
  };
  window[GLOBAL] = api;
  syncApi();

  function initialize() {
    if (disposed) return;
    if (!document.body || !document.head) {
      setTimeout(initialize, 250);
      return;
    }
    mountUI();
    watcher = setInterval(() => {
      watcherTick().catch((error) => console.error('[HFC texture quality] watcher', error));
    }, WATCH_INTERVAL_MS);
    watcherTick().catch((error) => console.error('[HFC texture quality] initial probe', error));
  }

  initialize();
})();
