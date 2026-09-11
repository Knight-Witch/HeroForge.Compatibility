// ==UserScript==
// @name         HF Compatibility - Protected 2048 Textures TEST
// @namespace    https://github.com/Knight-Witch/HeroForge.Compatibility
// @version      0.1.5
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
  const BUILD = '0.1.5-protected-2048-rectangular-atlas';
  const PANEL_ID = 'hfc-protected-texture-quality-test';
  const STYLE_ID = `${PANEL_ID}-style`;
  const TARGET_SIZE = 2048;
  const BODY_MASK_SIZE = 1024;
  const TARGET_SLOTS = ['bodyLower', 'bodyUpper', 'face'];
  const BODY_MASK_SLOTS = ['bodyLower', 'bodyUpper'];
  const ATLAS_CANDIDATES = [
    [8192, 4096],
    [8192, 5120],
    [8192, 6144],
    [8192, 7168]
  ];
  const RESOURCE_OWNER = 82042048;
  const BAKE_WAIT_MS = 5500;
  const WATCH_INTERVAL_MS = 1250;
  const LOSS_GRACE_MS = 2200;
  const RECOVERY_COOLDOWN_MS = 7000;
  const RECOVERY_STABLE_WINDOW_MS = 1800;
  const RECOVERY_STABLE_POLL_MS = 300;
  const RECOVERY_STABLE_TIMEOUT_MS = 9000;
  const RECOVERY_BURST_WINDOW_MS = 30000;
  const MAX_RECOVERIES_PER_BURST = 2;
  const MAX_ATTEMPT_HISTORY = 28;
  const MAX_TIMELINE = 180;
  const EPSILON = 1e-8;

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
  let lastRecoveryAttempt = 0;
  let recoveryBurstCount = 0;
  let recoveryBurstStartedAt = 0;
  let lastDiagnostics = null;
  let lastError = null;
  let lastVerification = null;
  const attemptHistory = [];
  const timeline = [];
  let lastTimelineFingerprint = null;
  let api = null;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const nowIso = () => new Date().toISOString();

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
    api.lastVerification = cloneDiagnostic(lastVerification);
    api.attemptHistory = cloneDiagnostic(attemptHistory);
    api.timeline = cloneDiagnostic(timeline);
  }

  function recordAttempt(stage, data = {}) {
    attemptHistory.push({ at: nowIso(), stage, ...cloneDiagnostic(data) });
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
    if (!display.atlas || typeof display.atlas.getUV !== 'function') {
      return { ok: false, reason: 'Current display atlas unavailable' };
    }
    if (!modded.resourceAtlas || typeof modded.resourceAtlas.getUV !== 'function') {
      return { ok: false, reason: 'Current resource atlas unavailable' };
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
      height: Math.round(Number(uv.w) * Number(atlas.height)),
      uv
    };
  }

  function uvArray(value) {
    if (!value) return null;
    const out = [Number(value.x), Number(value.y), Number(value.z), Number(value.w)];
    return out.every(Number.isFinite) ? out : null;
  }

  function sameUV(a, b) {
    const aa = uvArray(a);
    const bb = uvArray(b);
    return !!aa && !!bb && aa.every((value, index) => Math.abs(value - bb[index]) <= EPSILON);
  }

  function materialUV(material) {
    return material && material.uniforms && material.uniforms.uvPosScl
      ? material.uniforms.uvPosScl.value
      : null;
  }

  function materialMatchesAtlasSlot(material, atlas, slot) {
    if (!material || !atlas || typeof atlas.getUV !== 'function') return false;
    let expected = null;
    try { expected = atlas.getUV(slot); } catch (_) { return false; }
    return sameUV(materialUV(material), expected);
  }

  function targetAllocations(atlas) {
    const result = {};
    for (const slot of TARGET_SLOTS) {
      const a = allocation(atlas, slot);
      result[slot] = a ? [a.width, a.height] : null;
    }
    return result;
  }

  function targetPacking(atlas) {
    const result = {};
    for (const slot of TARGET_SLOTS) {
      let a = null;
      try { a = allocation(atlas, slot); } catch (_) {}
      result[slot] = a ? {
        size: [a.width, a.height],
        uv: uvArray(a.uv),
        packed: atlas.packed && atlas.packed[slot]
          ? [Number(atlas.packed[slot].x), Number(atlas.packed[slot].y)]
          : null
      } : null;
    }
    return result;
  }

  function atlasDescriptor(atlas) {
    return atlas ? [Number(atlas.width), Number(atlas.height)] : null;
  }

  function partSignature(parts) {
    return Object.keys(parts || {}).sort().map((slot) => {
      const part = parts[slot];
      const id = part && part.id !== undefined ? part.id : '';
      const baseName = part && part.baseName ? part.baseName : '';
      return `${slot}:${id}:${baseName}`;
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

  function ownershipSnapshot(session = activeSession) {
    const CK = getCK();
    const display = CK && CK.character && CK.character.display;
    const modded = display && display.modded;
    return {
      displayMatchesSession: !!session && display === session.display,
      moddedMatchesSession: !!session && modded === session.modded,
      buildAtlasOwned: !!session && modded === session.modded && modded.buildAtlas === session.protectedBuildAtlas,
      displayAtlasMatchesProtected: !!session && display === session.display && display.atlas === session.protectedAtlas,
      resourceAtlasMatchesProtected: !!session && modded === session.modded && modded.resourceAtlas === session.protectedAtlas,
      displayResourceSameObject: !!display && !!modded && display.atlas === modded.resourceAtlas,
      displayAtlas: atlasDescriptor(display && display.atlas),
      resourceAtlas: atlasDescriptor(modded && modded.resourceAtlas),
      displayPacking: display && display.atlas ? targetPacking(display.atlas) : null,
      resourcePacking: modded && modded.resourceAtlas ? targetPacking(modded.resourceAtlas) : null
    };
  }

  function recordTimeline() {
    const CK = getCK();
    const display = CK && CK.character && CK.character.display;
    const modded = display && display.modded;
    const parts = modded && modded.parts;
    const atlas = display && display.atlas;
    const ownership = ownershipSnapshot(activeSession);
    const snapshot = {
      at: nowIso(),
      build: BUILD,
      enabled,
      busy,
      atlas: atlasDescriptor(atlas),
      resourceAtlas: atlasDescriptor(modded && modded.resourceAtlas),
      allocations: atlas && parts ? targetAllocations(atlas) : null,
      displayResourceSameObject: ownership.displayResourceSameObject,
      displayMatchesSession: ownership.displayMatchesSession,
      moddedMatchesSession: ownership.moddedMatchesSession,
      buildAtlasOwned: ownership.buildAtlasOwned,
      displayAtlasMatchesProtected: ownership.displayAtlasMatchesProtected,
      resourceAtlasMatchesProtected: ownership.resourceAtlasMatchesProtected,
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
      verification: lastVerification ? {
        ok: lastVerification.ok,
        kind: lastVerification.kind || null,
        reason: lastVerification.reason || null
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
      at: nowIso(),
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
      protectedBuildAtlas: null,
      partSetChanged: false,
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
        changes: comparison.changes,
        packing: targetPacking(atlas)
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

    session.protectedBuildAtlas = wrapper;
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

  function verifyTargetBindings(session, atlas) {
    for (const slot of TARGET_SLOTS) {
      const mesh = session.display.meshes[slot];
      if (!mesh || !materialMatchesAtlasSlot(mesh.material, atlas, slot)) {
        return { ok: false, kind: 'binding', reason: `${slot} display UV does not match protected atlas location` };
      }
      const bakeMaterials = mesh.bakeMaterials || {};
      if (bakeMaterials.color && !materialMatchesAtlasSlot(bakeMaterials.color, atlas, slot)) {
        return { ok: false, kind: 'binding', reason: `${slot} color-bake UV does not match protected atlas location` };
      }
      const colorDecals = bakeMaterials.colorDecals;
      if (Array.isArray(colorDecals)) {
        for (let index = 0; index < colorDecals.length; index += 1) {
          if (colorDecals[index] && !materialMatchesAtlasSlot(colorDecals[index], atlas, slot)) {
            return { ok: false, kind: 'binding', reason: `${slot} decal-bake UV[${index}] does not match protected atlas location` };
          }
        }
      }
    }
    return { ok: true };
  }

  function verifyProtectedState(session = activeSession) {
    if (!session) return { ok: false, kind: 'ownership', reason: 'No active protected-texture session' };
    const CK = getCK();
    const display = CK && CK.character && CK.character.display;
    if (!CK || !CK.character || !display || display !== session.display) {
      return { ok: false, kind: 'ownership', reason: 'HeroForge display changed' };
    }
    if (display.modded !== session.modded) {
      return { ok: false, kind: 'ownership', reason: 'HeroForge modded renderer changed' };
    }
    if (session.modded.buildAtlas !== session.protectedBuildAtlas) {
      return { ok: false, kind: 'ownership', reason: 'Protected buildAtlas ownership was replaced' };
    }
    if (display.atlas !== session.protectedAtlas) {
      return { ok: false, kind: 'coherence', reason: 'Display atlas is not the owned protected atlas' };
    }
    if (session.modded.resourceAtlas !== session.protectedAtlas) {
      return { ok: false, kind: 'coherence', reason: 'Resource atlas diverged from the owned protected atlas' };
    }
    if (display.atlas !== session.modded.resourceAtlas) {
      return { ok: false, kind: 'coherence', reason: 'Display/resource atlas objects diverged' };
    }

    const atlas = display.atlas;
    const selected = session.selectedAtlasSize;
    if (!selected || !atlas || Number(atlas.width) !== selected[0] || Number(atlas.height) !== selected[1]) {
      return { ok: false, kind: 'allocation', reason: 'Protected atlas dimensions lost' };
    }

    const allocations = targetAllocations(atlas);
    for (const slot of TARGET_SLOTS) {
      const a = allocations[slot];
      if (!a || a[0] !== TARGET_SIZE || a[1] !== TARGET_SIZE) {
        return { ok: false, kind: 'allocation', reason: `${slot} allocation is not ${TARGET_SIZE}px`, allocations };
      }
    }

    for (const slot of BODY_MASK_SLOTS) {
      const mesh = display.meshes[slot];
      const texture = session.maskTextures && session.maskTextures[slot];
      if (!mesh || !texture || mesh.masksMapOverride !== texture) {
        return { ok: false, kind: 'mask', reason: `${slot} protected mask override was lost`, allocations };
      }
      const width = texture.image ? Number(texture.image.width) : 0;
      if (width !== BODY_MASK_SIZE) {
        return { ok: false, kind: 'mask', reason: `${slot} mask is not ${BODY_MASK_SIZE}px`, allocations };
      }
    }

    const binding = verifyTargetBindings(session, atlas);
    if (!binding.ok) return { ...binding, allocations };

    const comparison = compareAgainstBaseline(session.baselineAllocations, atlas, session.modded.parts);
    if (comparison.regressions.length) {
      return {
        ok: false,
        kind: 'regression',
        reason: `${comparison.regressions[0].slot} fell below pre-enable allocation`,
        allocations,
        comparison
      };
    }

    return {
      ok: true,
      kind: 'healthy',
      allocations,
      comparison,
      ownership: ownershipSnapshot(session),
      packing: targetPacking(atlas)
    };
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

  function releaseStaleSessionMetadata(session) {
    if (!session) return;
    try { restoreSessionMetadata(session); } catch (error) {
      console.error('[HFC texture quality] stale-session metadata restore warning', error);
    }
  }

  function rendererFingerprint(capability) {
    if (!capability || !capability.ok) return null;
    return {
      display: capability.display,
      modded: capability.modded,
      resourceAtlas: capability.modded.resourceAtlas,
      displayAtlas: capability.display.atlas,
      signature: partSignature(capability.parts),
      resourceDims: atlasDescriptor(capability.modded.resourceAtlas),
      displayDims: atlasDescriptor(capability.display.atlas)
    };
  }

  function sameRendererFingerprint(a, b) {
    return !!a && !!b
      && a.display === b.display
      && a.modded === b.modded
      && a.resourceAtlas === b.resourceAtlas
      && a.displayAtlas === b.displayAtlas
      && a.signature === b.signature
      && JSON.stringify(a.resourceDims) === JSON.stringify(b.resourceDims)
      && JSON.stringify(a.displayDims) === JSON.stringify(b.displayDims);
  }

  async function waitForRendererStable() {
    const deadline = Date.now() + RECOVERY_STABLE_TIMEOUT_MS;
    let previous = null;
    let stableSince = 0;
    while (Date.now() < deadline) {
      const capability = readCapabilities();
      if (!capability.ok) {
        previous = null;
        stableSince = 0;
        await sleep(RECOVERY_STABLE_POLL_MS);
        continue;
      }
      const current = rendererFingerprint(capability);
      if (sameRendererFingerprint(previous, current)) {
        if (!stableSince) stableSince = Date.now();
        if (Date.now() - stableSince >= RECOVERY_STABLE_WINDOW_MS) return capability;
      } else {
        previous = current;
        stableSince = Date.now();
      }
      await sleep(RECOVERY_STABLE_POLL_MS);
    }
    throw new Error('HeroForge renderer did not settle after lifecycle change.');
  }

  async function alignCurrentDisplayToResourceAtlas(capability) {
    const { display, modded, colorBake } = capability;
    const resourceAtlas = modded.resourceAtlas;
    if (!resourceAtlas || typeof resourceAtlas.getUV !== 'function') {
      throw new Error('Current HeroForge resource atlas is unavailable during lifecycle recovery.');
    }
    if (display.atlas === resourceAtlas) return false;

    recordAttempt('lifecycle-align-native', {
      displayAtlasBefore: atlasDescriptor(display.atlas),
      resourceAtlas: atlasDescriptor(resourceAtlas),
      displayPackingBefore: display.atlas ? targetPacking(display.atlas) : null,
      resourcePacking: targetPacking(resourceAtlas)
    });

    display.atlas = resourceAtlas;
    colorBake.invalidateCache();
    colorBake.refresh(true);
    await sleep(BAKE_WAIT_MS);
    if (display.atlas !== resourceAtlas) display.atlas = resourceAtlas;
    return true;
  }

  async function applyFreshSession() {
    const capability = readCapabilities();
    if (!capability.ok) throw new Error(capability.reason);
    const session = makeSession(capability);

    recordAttempt('enable-start', {
      baselineAtlas: atlasDescriptor(session.originalActiveAtlas),
      baselineResourceAtlas: atlasDescriptor(session.originalResourceAtlas),
      baselineSameObject: session.originalActiveAtlas === session.originalResourceAtlas,
      baselineTargetAllocations: session.baselineTargetAllocations,
      maxTextureSize: capability.maxTextureSize,
      partCount: Object.keys(capability.parts).length
    });

    try {
      await loadBodyMasks(capability, session);
      applyProtectedTargetMetadata(session);
      const protectedAtlas = chooseProtectedAtlas(session);
      activeSession = session;
      installProtectedBuildAtlas(session);
      session.modded.resourceAtlas = protectedAtlas;
      session.display.atlas = protectedAtlas;

      recordAttempt('atlas-assigned', {
        selectedAtlas: session.selectedAtlasSize,
        allocations: targetAllocations(protectedAtlas),
        packing: targetPacking(protectedAtlas),
        ownership: ownershipSnapshot(session)
      });

      session.display.colorBake.invalidateCache();
      session.display.colorBake.refresh(true);
      await sleep(BAKE_WAIT_MS);

      const verification = verifyProtectedState(session);
      lastVerification = verification;
      if (!verification.ok) {
        const error = new Error(verification.reason);
        error.hfcVerification = verification;
        throw error;
      }

      session.appliedAt = nowIso();
      lastDiagnostics = {
        featureId: FEATURE_ID,
        build: BUILD,
        status: 'active',
        baselineAtlas: atlasDescriptor(session.originalActiveAtlas),
        baselineResourceAtlas: atlasDescriptor(session.originalResourceAtlas),
        baselineSameObject: session.originalActiveAtlas === session.originalResourceAtlas,
        baselineTargetAllocations: session.baselineTargetAllocations,
        selectedAtlas: session.selectedAtlasSize,
        targetSize: TARGET_SIZE,
        allocations: verification.allocations,
        packing: verification.packing,
        ownership: verification.ownership,
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
        baselineResourceAtlas: atlasDescriptor(session.originalResourceAtlas),
        baselineSameObject: session.originalActiveAtlas === session.originalResourceAtlas,
        baselineTargetAllocations: session.baselineTargetAllocations,
        candidateResults: session.candidateResults,
        maskPaths: session.maskPaths,
        maxTextureSize: capability.maxTextureSize,
        verification: error.hfcVerification || lastVerification,
        ownership: ownershipSnapshot(session)
      };
      if (activeSession === session) activeSession = null;
      await restoreExactBaseline(session);
      error.hfcDiagnostic = diagnostic;
      throw error;
    }
  }

  function sessionMatchesCurrent(session) {
    const CK = getCK();
    const display = CK && CK.character && CK.character.display;
    if (!session || !display || display !== session.display) return false;
    if (display.modded !== session.modded) return false;
    const parts = display.modded && display.modded.parts;
    return !!parts
      && parts.bodyLower === session.parts.bodyLower
      && parts.bodyUpper === session.parts.bodyUpper
      && parts.face === session.parts.face;
  }

  function sessionExactRestoreIsSafe(session) {
    return sessionMatchesCurrent(session)
      && session.modded.buildAtlas === session.protectedBuildAtlas
      && session.display.atlas === session.protectedAtlas
      && session.modded.resourceAtlas === session.protectedAtlas;
  }

  function bumpRecoveryBurst() {
    const now = Date.now();
    if (!recoveryBurstStartedAt || now - recoveryBurstStartedAt > RECOVERY_BURST_WINDOW_MS) {
      recoveryBurstStartedAt = now;
      recoveryBurstCount = 0;
    }
    recoveryBurstCount += 1;
    return recoveryBurstCount;
  }

  async function recoverLifecycle(reason, verification = null) {
    const count = bumpRecoveryBurst();
    if (count > MAX_RECOVERIES_PER_BURST) {
      throw new Error(`HeroForge renderer repeatedly replaced the protected atlas lifecycle (${count} times in ${Math.round(RECOVERY_BURST_WINDOW_MS / 1000)}s).`);
    }

    const staleSession = activeSession;
    activeSession = null;
    unhealthySince = null;

    recordAttempt('lifecycle-loss', {
      reason,
      verification: cloneDiagnostic(verification),
      ownership: ownershipSnapshot(staleSession),
      recoveryCount: count
    });

    releaseStaleSessionMetadata(staleSession);

    let capability = await waitForRendererStable();
    await alignCurrentDisplayToResourceAtlas(capability);
    capability = await waitForRendererStable();

    recordAttempt('lifecycle-native-settled', {
      atlas: atlasDescriptor(capability.display.atlas),
      resourceAtlas: atlasDescriptor(capability.modded.resourceAtlas),
      sameObject: capability.display.atlas === capability.modded.resourceAtlas,
      allocations: targetAllocations(capability.display.atlas)
    });

    activeSession = await applyFreshSession();
    lastRecoveryAttempt = Date.now();
    const [w, h] = activeSession.selectedAtlasSize;
    setStatus('Protected 2048 textures active');
    setDetail(`Renderer lifecycle recovered cleanly using ${w}×${h}; body/head remain protected at 2048px.`);
    recordAttempt('lifecycle-recovery-success', {
      selectedAtlas: activeSession.selectedAtlasSize,
      ownership: ownershipSnapshot(activeSession)
    });
    syncApi();
  }

  async function enableFeature() {
    if (disposed || busy || enabled) return;
    clearErrorLatch();
    lastVerification = null;
    setBusy(true);
    enabled = true;
    recoveryBurstCount = 0;
    recoveryBurstStartedAt = 0;
    syncApi();
    if (toggle) toggle.checked = true;
    setStatus('Applying protected 2048 textures…');
    setDetail('Testing bounded rectangular atlas candidates from 8192×4096 through 8192×7168; selecting the smallest safe fit.');
    recordTimeline();

    try {
      let capability = await waitForRendererStable();
      if (capability.display.atlas !== capability.modded.resourceAtlas) {
        setStatus('HeroForge atlas state is still transitioning — normalizing before enable…');
        setDetail('Waiting for the current resource/display atlas pair to become coherent before the protected bake starts.');
        await alignCurrentDisplayToResourceAtlas(capability);
        capability = await waitForRendererStable();
      }
      activeSession = await applyFreshSession();
      unhealthySince = null;
      const [w, h] = activeSession.selectedAtlasSize;
      setStatus('Protected 2048 textures active');
      setDetail(`${w}×${h} atlas; bodyLower/bodyUpper/face protected at 2048px.${h > 4096 ? ' Expanded atlas-area mode is active.' : ''}`);
      recordTimeline();
    } catch (error) {
      const verification = error.hfcVerification;
      const lifecycleKind = verification && (verification.kind === 'ownership' || verification.kind === 'coherence');
      if (lifecycleKind) {
        try {
          setStatus('HeroForge changed renderer state during apply — waiting for it to settle…');
          setDetail(verification.reason);
          await recoverLifecycle(`initial apply: ${verification.reason}`, verification);
          recordTimeline();
          return;
        } catch (recoveryError) {
          error = recoveryError;
        }
      }

      enabled = false;
      if (activeSession) {
        try { await restoreExactBaseline(activeSession); } catch (_) {}
      }
      activeSession = null;
      if (toggle) toggle.checked = false;
      const diagnostic = error.hfcDiagnostic || {
        verification: error.hfcVerification || lastVerification,
        ownership: ownershipSnapshot(null)
      };
      const rows = diagnostic.candidateResults || [];
      const detail = rows.length
        ? `${describeCandidateRows(rows)}. Renderer restored where possible. This error remains latched.`
        : 'Renderer restored where possible. This error remains latched.';
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
    recoveryBurstCount = 0;
    recoveryBurstStartedAt = 0;
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
    if (!silent) setStatus('Restoring pre-enable texture state…');
    try {
      if (sessionExactRestoreIsSafe(session)) {
        await restoreExactBaseline(session);
        lastDiagnostics = {
          featureId: FEATURE_ID,
          build: BUILD,
          status: 'disabled',
          restoredAtlas: atlasDescriptor(session.originalActiveAtlas),
          disabledAt: nowIso()
        };
      } else {
        releaseStaleSessionMetadata(session);
        const capability = await waitForRendererStable();
        await alignCurrentDisplayToResourceAtlas(capability);
        lastDiagnostics = {
          featureId: FEATURE_ID,
          build: BUILD,
          status: 'disabled-after-lifecycle-change',
          restoredAtlas: atlasDescriptor(capability.modded.resourceAtlas),
          disabledAt: nowIso()
        };
      }
      clearErrorLatch();
      recordAttempt('disable-success', lastDiagnostics);
      if (!silent) {
        setStatus('HeroForge texture state restored');
        setDetail('Protected atlas ownership was released and the current renderer was returned to a coherent HeroForge state.');
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

    const verification = verifyProtectedState(activeSession);
    lastVerification = verification;
    syncApi();
    if (verification.ok) {
      unhealthySince = null;
      if (recoveryBurstStartedAt && Date.now() - recoveryBurstStartedAt > RECOVERY_BURST_WINDOW_MS) {
        recoveryBurstCount = 0;
        recoveryBurstStartedAt = 0;
      }
      return;
    }

    const now = Date.now();
    if (unhealthySince === null) {
      unhealthySince = now;
      recordAttempt('verification-loss-detected', {
        verification,
        ownership: ownershipSnapshot(activeSession)
      });
      return;
    }
    if (now - unhealthySince < LOSS_GRACE_MS || now - lastRecoveryAttempt < RECOVERY_COOLDOWN_MS) return;

    lastRecoveryAttempt = now;
    setBusy(true);
    setStatus('HeroForge renderer changed — rebuilding a coherent protected session…');
    setDetail(verification.reason);
    try {
      await recoverLifecycle(verification.reason, verification);
      unhealthySince = null;
    } catch (error) {
      const failedSession = activeSession;
      activeSession = null;
      enabled = false;
      if (toggle) toggle.checked = false;
      try {
        releaseStaleSessionMetadata(failedSession);
        const capability = await waitForRendererStable();
        await alignCurrentDisplayToResourceAtlas(capability);
      } catch (_) {}
      latchError(error, {
        stage: 'lifecycle',
        verification,
        ownership: ownershipSnapshot(null),
        recoveryBurstCount
      }, 'Auto-disabled after renderer lifecycle recovery failed. HeroForge was returned to its current coherent resource atlas where possible.');
      console.error('[HFC texture quality] lifecycle recovery failed', error);
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
        width: 390px; padding: 12px 14px; border: 1px solid rgba(255,255,255,.18);
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
    lastVerification: null,
    attemptHistory: [],
    timeline: [],
    enable: enableFeature,
    disable: disableFeature,
    applyNow: async () => {
      if (!enabled) return enableFeature();
      if (busy) return false;
      const verification = verifyProtectedState(activeSession);
      if (verification.ok) return true;
      setBusy(true);
      try {
        await recoverLifecycle(`manual applyNow: ${verification.reason}`, verification);
        return true;
      } finally {
        setBusy(false);
      }
    },
    verify: () => {
      const result = verifyProtectedState(activeSession);
      lastVerification = result;
      syncApi();
      return result;
    },
    getOwnership: () => cloneDiagnostic(ownershipSnapshot(activeSession)),
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
