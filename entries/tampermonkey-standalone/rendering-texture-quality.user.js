// ==UserScript==
// @name         HF Compatibility - Protected 2048 Textures TEST
// @namespace    https://github.com/Knight-Witch/HeroForge.Compatibility
// @version      0.1.2
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
  const BUILD = '0.1.2-protected-2048-live-baseline';
  const PANEL_ID = 'hfc-protected-texture-quality-test';
  const STYLE_ID = `${PANEL_ID}-style`;
  const ATLAS_WIDTH = 8192;
  const ATLAS_HEIGHT = 4096;
  const TARGET_SIZE = 2048;
  const BODY_MASK_SIZE = 1024;
  const TARGET_SLOTS = ['bodyLower', 'bodyUpper', 'face'];
  const BODY_MASK_SLOTS = ['bodyLower', 'bodyUpper'];
  const RESOURCE_OWNER = 82042048;
  const BAKE_WAIT_MS = 5500;
  const WATCH_INTERVAL_MS = 2000;
  const LOSS_GRACE_MS = 2500;
  const REAPPLY_COOLDOWN_MS = 8000;
  const MAX_REAPPLY_FAILURES = 3;

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

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const getCK = () => window.CK || null;

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
      if (snapshot.hadOwn && snapshot.descriptor) Object.defineProperty(snapshot.object, snapshot.key, snapshot.descriptor);
      else delete snapshot.object[snapshot.key];
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
    return renderer && renderer.capabilities ? Number(renderer.capabilities.maxTextureSize) || null : null;
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
    if (!data.atlasScale || typeof data.atlasScale !== 'object') return { ok: false, reason: 'atlasScale policy unavailable' };
    if (maxTextureSize !== null && maxTextureSize < ATLAS_WIDTH) {
      return { ok: false, reason: `GPU texture limit ${maxTextureSize}px is below ${ATLAS_WIDTH}px` };
    }
    for (const slot of TARGET_SLOTS) {
      if (!parts[slot] || !meshes[slot]) return { ok: false, reason: `${slot} capability unavailable` };
      if (BODY_MASK_SLOTS.includes(slot) && typeof parts[slot].getMaskPath !== 'function') {
        return { ok: false, reason: `${slot}.getMaskPath unavailable` };
      }
    }
    if (!display.atlas || typeof display.atlas.getUV !== 'function') {
      return { ok: false, reason: 'Current HeroForge atlas unavailable' };
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

  function partSignature(parts) {
    return Object.keys(parts).sort().map((slot) => {
      const part = parts[slot];
      return `${slot}:${part && part.id !== undefined ? part.id : part && part.name || '?'}`;
    }).join('|');
  }

  function captureAllocationCaps(atlas, parts) {
    const caps = {};
    for (const slot of Object.keys(parts)) {
      let a = null;
      try { a = allocation(atlas, slot); } catch (_) {}
      if (a) caps[slot] = Math.min(a.width, a.height);
    }
    return caps;
  }

  function compareAllocations(baselineAtlas, protectedAtlas, parts) {
    const changes = [];
    const regressions = [];
    for (const slot of Object.keys(parts)) {
      let baseline = null;
      let protectedAllocation = null;
      try {
        baseline = allocation(baselineAtlas, slot);
        protectedAllocation = allocation(protectedAtlas, slot);
      } catch (_) {}
      if (!baseline || !protectedAllocation) continue;
      if (baseline.width === protectedAllocation.width && baseline.height === protectedAllocation.height) continue;
      const row = {
        slot,
        baseline: [baseline.width, baseline.height],
        protected: [protectedAllocation.width, protectedAllocation.height]
      };
      changes.push(row);
      if (!TARGET_SLOTS.includes(slot)
        && (protectedAllocation.width < baseline.width || protectedAllocation.height < baseline.height)) {
        regressions.push(row);
      }
    }
    return { changes, regressions };
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

  function makeSession(capability) {
    const { CK, display, modded, parts, meshes, data } = capability;
    const baselineAtlas = display.atlas;
    const baselineCaps = captureAllocationCaps(baselineAtlas, parts);
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
      originalResolvedBuildAtlas: modded.buildAtlas,
      baselineActiveAtlas: baselineAtlas,
      baselineResourceAtlas: modded.resourceAtlas,
      baselineCaps,
      baselineSignature: partSignature(parts),
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
      protectedAtlas: null,
      lastComparison: null,
      lastAttempt: null,
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

  async function restoreBaselineAtlas(session, rebake = true) {
    if (!session) return;
    restoreSessionMetadata(session);
    const CK = getCK();
    if (!CK || !CK.character || CK.character.display !== session.display) return;
    session.modded.resourceAtlas = session.baselineResourceAtlas;
    session.display.atlas = session.baselineActiveAtlas;
    if (rebake) {
      session.display.colorBake.invalidateCache();
      session.display.colorBake.refresh(true);
      await sleep(BAKE_WAIT_MS);
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
  }

  function buildProtectedAtlas(session) {
    const { CK, data, modded } = session;
    applyProtectedTargetMetadata(session);

    const caps = Object.assign({}, session.baselineCaps);
    for (const slot of TARGET_SLOTS) caps[slot] = TARGET_SIZE;

    const currentSignature = partSignature(modded.parts);
    if (currentSignature !== session.baselineSignature) {
      throw new Error('HeroForge part set changed; protected atlas must be reinitialized.');
    }

    const scale = Object.assign({}, data.atlasScale || {});
    scale.bodyLower = 4;
    scale.bodyUpper = 4;
    scale.face = 4;

    const protectedAtlas = new CK.Atlas(
      Object.assign({}, modded.parts),
      ATLAS_WIDTH,
      ATLAS_HEIGHT,
      caps,
      data.isUHD(),
      scale
    );

    const attempted = {};
    for (const slot of TARGET_SLOTS) {
      const a = allocation(protectedAtlas, slot);
      attempted[slot] = a ? [a.width, a.height] : null;
    }
    session.lastAttempt = {
      baselineAtlas: [session.baselineActiveAtlas.width, session.baselineActiveAtlas.height],
      protectedAtlas: [protectedAtlas.width, protectedAtlas.height],
      allocations: attempted
    };

    for (const slot of TARGET_SLOTS) {
      const a = allocation(protectedAtlas, slot);
      if (!a || a.width !== TARGET_SIZE || a.height !== TARGET_SIZE) {
        throw new Error(`Protected atlas could not allocate ${TARGET_SIZE}px for ${slot} (got ${a ? `${a.width}px` : 'none'}).`);
      }
    }

    const comparison = compareAllocations(session.baselineActiveAtlas, protectedAtlas, modded.parts);
    session.lastComparison = comparison;
    if (comparison.regressions.length) {
      const first = comparison.regressions[0];
      throw new Error(`Protected atlas would reduce ${first.slot} below the pre-enable allocation.`);
    }

    session.protectedAtlas = protectedAtlas;
    return protectedAtlas;
  }

  function installProtectedBuildAtlas(session) {
    const wrapper = function protectedBuildAtlas() {
      if (!enabled || activeSession !== session || this !== session.modded) {
        return session.originalResolvedBuildAtlas.apply(this, arguments);
      }
      const atlas = buildProtectedAtlas(session);
      this.resourceAtlas = atlas;
      return atlas;
    };

    Object.defineProperty(session.modded, 'buildAtlas', {
      configurable: true,
      enumerable: session.original.buildAtlas.descriptor ? !!session.original.buildAtlas.descriptor.enumerable : false,
      writable: true,
      value: wrapper
    });
    if (session.modded.buildAtlas !== wrapper) throw new Error('Could not install reversible protected atlas builder.');
  }

  function verifyProtectedState(session = activeSession) {
    if (!session) return { ok: false, reason: 'No active protected-texture session' };
    const CK = getCK();
    if (!CK || !CK.character || CK.character.display !== session.display) return { ok: false, reason: 'HeroForge display changed' };
    const atlas = session.display.atlas;
    if (!atlas || Number(atlas.width) !== ATLAS_WIDTH || Number(atlas.height) !== ATLAS_HEIGHT) {
      return { ok: false, reason: 'Protected atlas dimensions lost' };
    }

    const allocations = {};
    for (const slot of TARGET_SLOTS) {
      const a = allocation(atlas, slot);
      allocations[slot] = a ? [a.width, a.height] : null;
      if (!a || a.width !== TARGET_SIZE || a.height !== TARGET_SIZE) {
        return { ok: false, reason: `${slot} allocation is not ${TARGET_SIZE}px`, allocations };
      }
      const displayAllocation = materialAllocation(session.display.meshes[slot] && session.display.meshes[slot].material, atlas);
      if (!displayAllocation || displayAllocation.width !== TARGET_SIZE || displayAllocation.height !== TARGET_SIZE) {
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
    return { ok: true, allocations };
  }

  function failureDiagnostics(session, error, capability) {
    return {
      featureId: FEATURE_ID,
      build: BUILD,
      status: 'error',
      message: error && error.message || String(error),
      baselineAtlas: session && session.baselineActiveAtlas
        ? [session.baselineActiveAtlas.width, session.baselineActiveAtlas.height]
        : null,
      baselineTargetAllocations: session && session.baselineActiveAtlas ? Object.fromEntries(TARGET_SLOTS.map((slot) => {
        const a = allocation(session.baselineActiveAtlas, slot);
        return [slot, a ? [a.width, a.height] : null];
      })) : null,
      attempted: session && session.lastAttempt || null,
      regressions: session && session.lastComparison ? session.lastComparison.regressions : [],
      maxTextureSize: capability && capability.maxTextureSize || null,
      failedAt: new Date().toISOString()
    };
  }

  async function applyFreshSession() {
    const capability = readCapabilities();
    if (!capability.ok) throw new Error(capability.reason);
    const session = makeSession(capability);

    try {
      lastDiagnostics = {
        featureId: FEATURE_ID,
        build: BUILD,
        status: 'applying',
        baselineAtlas: [session.baselineActiveAtlas.width, session.baselineActiveAtlas.height],
        baselineTargetAllocations: Object.fromEntries(TARGET_SLOTS.map((slot) => {
          const a = allocation(session.baselineActiveAtlas, slot);
          return [slot, a ? [a.width, a.height] : null];
        }))
      };

      await loadBodyMasks(capability, session);
      applyProtectedTargetMetadata(session);
      const protectedAtlas = buildProtectedAtlas(session);
      installProtectedBuildAtlas(session);
      session.modded.resourceAtlas = protectedAtlas;
      session.display.atlas = protectedAtlas;
      session.display.colorBake.invalidateCache();
      session.display.colorBake.refresh(true);
      await sleep(BAKE_WAIT_MS);

      activeSession = session;
      const verification = verifyProtectedState(session);
      if (!verification.ok) throw new Error(verification.reason);

      session.appliedAt = new Date().toISOString();
      lastDiagnostics = {
        featureId: FEATURE_ID,
        build: BUILD,
        status: 'active',
        atlas: [ATLAS_WIDTH, ATLAS_HEIGHT],
        baselineAtlas: [session.baselineActiveAtlas.width, session.baselineActiveAtlas.height],
        targetSize: TARGET_SIZE,
        allocations: verification.allocations,
        allocationChanges: session.lastComparison ? session.lastComparison.changes : [],
        allocationRegressions: session.lastComparison ? session.lastComparison.regressions : [],
        maskPaths: session.maskPaths,
        maxTextureSize: capability.maxTextureSize,
        appliedAt: session.appliedAt
      };
      return session;
    } catch (error) {
      if (activeSession === session) activeSession = null;
      lastDiagnostics = failureDiagnostics(session, error, capability);
      await restoreBaselineAtlas(session, true);
      throw error;
    }
  }

  async function reapplySession(session) {
    const CK = getCK();
    if (!session || !CK || !CK.character || CK.character.display !== session.display) throw new Error('Current display changed.');
    if (partSignature(session.modded.parts) !== session.baselineSignature) throw new Error('HeroForge part set changed.');
    applyProtectedTargetMetadata(session);
    const atlas = session.modded.buildAtlas();
    session.protectedAtlas = atlas;
    session.display.atlas = atlas;
    session.display.colorBake.invalidateCache();
    session.display.colorBake.refresh(true);
    await sleep(BAKE_WAIT_MS);

    const verification = verifyProtectedState(session);
    if (!verification.ok) throw new Error(verification.reason);
    session.appliedAt = new Date().toISOString();
    if (lastDiagnostics) {
      lastDiagnostics.status = 'active';
      lastDiagnostics.allocations = verification.allocations;
      lastDiagnostics.appliedAt = session.appliedAt;
    }
  }

  function sessionMatchesCurrent(session) {
    const CK = getCK();
    const display = CK && CK.character && CK.character.display;
    if (!session || !display || display !== session.display) return false;
    const parts = display.modded && display.modded.parts;
    return !!parts
      && parts.bodyLower === session.parts.bodyLower
      && parts.bodyUpper === session.parts.bodyUpper
      && parts.face === session.parts.face
      && partSignature(parts) === session.baselineSignature;
  }

  async function enableFeature() {
    if (disposed || busy || enabled) return;
    busy = true;
    enabled = true;
    if (toggle) toggle.checked = true;
    setStatus('Applying protected 2048 textures…');
    setDetail('Using the atlas HeroForge is displaying right now as the native baseline.');

    try {
      activeSession = await applyFreshSession();
      unhealthySince = null;
      reapplyFailures = 0;
      setStatus('Protected 2048 textures active');
      setDetail('8192×4096 atlas; bodyLower/bodyUpper/face protected at 2048px.');
    } catch (error) {
      enabled = false;
      activeSession = null;
      if (toggle) toggle.checked = false;
      setStatus(`Not enabled: ${error.message}`, true);
      const attempt = lastDiagnostics && lastDiagnostics.attempted;
      setDetail(attempt && attempt.allocations
        ? `Baseline ${lastDiagnostics.baselineAtlas.join('×')}; attempted BL ${attempt.allocations.bodyLower && attempt.allocations.bodyLower[0] || '?'} / BU ${attempt.allocations.bodyUpper && attempt.allocations.bodyUpper[0] || '?'} / face ${attempt.allocations.face && attempt.allocations.face[0] || '?'} px. Native display restored.`
        : 'The exact pre-enable HeroForge atlas was restored.');
      console.error('[HFC texture quality] enable failed', error, lastDiagnostics);
    } finally {
      busy = false;
    }
  }

  async function disableFeature({ silent = false } = {}) {
    if (busy) return;
    enabled = false;
    unhealthySince = null;
    reapplyFailures = 0;
    if (toggle) toggle.checked = false;

    const session = activeSession;
    activeSession = null;
    if (!session) {
      if (!silent) {
        setStatus('Native HeroForge textures');
        setDetail('Protected texture policy is disabled.');
      }
      return;
    }

    busy = true;
    if (!silent) setStatus('Restoring exact pre-enable HeroForge texture state…');
    try {
      await restoreBaselineAtlas(session, true);
      lastDiagnostics = {
        featureId: FEATURE_ID,
        build: BUILD,
        status: 'disabled',
        restoredAtlas: session.baselineActiveAtlas ? [session.baselineActiveAtlas.width, session.baselineActiveAtlas.height] : null,
        disabledAt: new Date().toISOString()
      };
      if (!silent) {
        setStatus('Pre-enable HeroForge texture state restored');
        setDetail('The atlas object and owned metadata from before enable are back in control.');
      }
    } catch (error) {
      if (!silent) {
        setStatus(`Disable completed with warning: ${error.message}`, true);
        setDetail('Refresh HeroForge if the renderer does not look native.');
      }
      console.error('[HFC texture quality] disable restore warning', error);
    } finally {
      busy = false;
    }
  }

  async function watcherTick() {
    if (disposed || busy) return;

    if (!enabled) {
      const capability = readCapabilities();
      if (capability.ok) {
        setStatus('Ready — protected texture policy is off');
        setDetail('Enable to protect body/head atlas allocations at 2048px.');
      } else {
        setStatus(capability.reason, true);
        setDetail('Waiting for a compatible HeroForge character renderer.');
      }
      return;
    }

    if (!sessionMatchesCurrent(activeSession)) {
      busy = true;
      setStatus('HeroForge character/part set changed — reinitializing…');
      try {
        const previous = activeSession;
        activeSession = null;
        if (previous) {
          const CK = getCK();
          if (CK && CK.character && CK.character.display === previous.display) await restoreBaselineAtlas(previous, true);
          else restoreSessionMetadata(previous);
        }
        activeSession = await applyFreshSession();
        unhealthySince = null;
        reapplyFailures = 0;
        setStatus('Protected 2048 textures active');
        setDetail('Protected policy initialized against the current HeroForge atlas.');
      } catch (error) {
        enabled = false;
        activeSession = null;
        if (toggle) toggle.checked = false;
        setStatus(`Auto-disabled: ${error.message}`, true);
        setDetail('Required capability failed; HeroForge native behavior left in control.');
        console.error('[HFC texture quality] character-change reinitialize failed', error);
      } finally {
        busy = false;
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
    busy = true;
    setStatus('Texture allocation changed — restoring protected 2048 state…');
    try {
      await reapplySession(activeSession);
      unhealthySince = null;
      reapplyFailures = 0;
      setStatus('Protected 2048 textures active');
      setDetail('Protected atlas lifecycle restored automatically.');
    } catch (error) {
      reapplyFailures += 1;
      console.error('[HFC texture quality] lifecycle reapply failed', error);
      if (reapplyFailures >= MAX_REAPPLY_FAILURES) {
        const failedSession = activeSession;
        activeSession = null;
        enabled = false;
        if (toggle) toggle.checked = false;
        try { await restoreBaselineAtlas(failedSession, true); } catch (_) {}
        setStatus(`Auto-disabled after repeated failures: ${error.message}`, true);
        setDetail('The pre-enable HeroForge state was restored where possible.');
      } else {
        setStatus(`Protected state lost; retry ${reapplyFailures}/${MAX_REAPPLY_FAILURES}`, true);
        setDetail(error.message);
      }
    } finally {
      busy = false;
    }
  }

  function mountUI() {
    if (document.getElementById(PANEL_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${PANEL_ID} {
        position: fixed; right: 16px; bottom: 16px; z-index: 2147483600;
        width: 350px; padding: 12px 14px; border: 1px solid rgba(255,255,255,.18);
        border-radius: 10px; background: rgba(20,20,24,.94); color: #f2f2f5;
        box-shadow: 0 10px 30px rgba(0,0,0,.35); font: 12px/1.35 system-ui, sans-serif;
      }
      #${PANEL_ID} .hfc-title { font-size: 13px; font-weight: 700; margin-bottom: 8px; }
      #${PANEL_ID} .hfc-row { display: flex; align-items: center; gap: 8px; }
      #${PANEL_ID} .hfc-row label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 600; }
      #${PANEL_ID} .hfc-status { margin-top: 8px; font-weight: 600; }
      #${PANEL_ID} .hfc-status[data-error="1"] { color: #ffb4b4; }
      #${PANEL_ID} .hfc-detail { margin-top: 4px; opacity: .72; }
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

  window[GLOBAL] = {
    featureId: FEATURE_ID,
    build: BUILD,
    enable: enableFeature,
    disable: disableFeature,
    applyNow: async () => {
      if (!enabled) return enableFeature();
      if (!activeSession) return false;
      return reapplySession(activeSession);
    },
    verify: () => verifyProtectedState(activeSession),
    get enabled() { return enabled; },
    get busy() { return busy; },
    get diagnostics() { return lastDiagnostics; },
    dispose
  };

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
