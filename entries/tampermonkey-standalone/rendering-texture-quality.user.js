// ==UserScript==
// @name         HF Compatibility - Protected 2048 Textures TEST
// @namespace    https://github.com/Knight-Witch/HeroForge.Compatibility
// @version      0.1.0
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
  const BUILD = '0.1.0-protected-2048-experimental';
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

  function getCK() {
    return window.CK || null;
  }

  function ownSnapshot(object, key) {
    return {
      object,
      key,
      hadOwn: Object.prototype.hasOwnProperty.call(object, key),
      descriptor: Object.prototype.hasOwnProperty.call(object, key)
        ? Object.getOwnPropertyDescriptor(object, key)
        : null,
      value: object[key]
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
    if (statusEl) {
      statusEl.textContent = text;
      statusEl.dataset.error = error ? '1' : '0';
    }
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
    if (!CK) return { ok: false, reason: 'CK unavailable', CK: null };
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
      return { ok: false, reason: 'HeroForge character renderer not ready', CK };
    }
    if (window.CK.Settings && window.CK.Settings.shadersUseTextureAtlas !== true) {
      return { ok: false, reason: 'Native texture-atlas mode is required', CK };
    }
    if (typeof CK.Atlas !== 'function') return { ok: false, reason: 'CK.Atlas unavailable', CK };
    if (!Resources || typeof Resources.getResource !== 'function' || typeof Resources.getNow !== 'function') {
      return { ok: false, reason: 'CK.Resources texture loader unavailable', CK };
    }
    if (typeof modded.buildAtlas !== 'function') return { ok: false, reason: 'modded.buildAtlas unavailable', CK };
    if (typeof colorBake.invalidateCache !== 'function' || typeof colorBake.refresh !== 'function') {
      return { ok: false, reason: 'Color-bake refresh capability unavailable', CK };
    }
    if (typeof data.isUHD !== 'function') return { ok: false, reason: 'data.isUHD unavailable', CK };
    if (!data.atlasScale || typeof data.atlasScale !== 'object') {
      return { ok: false, reason: 'atlasScale policy unavailable', CK };
    }
    if (maxTextureSize !== null && maxTextureSize < ATLAS_WIDTH) {
      return { ok: false, reason: `GPU texture limit ${maxTextureSize}px is below ${ATLAS_WIDTH}px`, CK };
    }

    for (const slot of TARGET_SLOTS) {
      if (!parts[slot] || !meshes[slot]) return { ok: false, reason: `${slot} capability unavailable`, CK };
      if (typeof parts[slot].getMaskPath !== 'function' && BODY_MASK_SLOTS.includes(slot)) {
        return { ok: false, reason: `${slot}.getMaskPath unavailable`, CK };
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

  function compareAllocations(nativeAtlas, protectedAtlas, parts) {
    const regressions = [];
    const changes = [];
    for (const slot of Object.keys(parts)) {
      let nativeAllocation;
      let protectedAllocation;
      try {
        nativeAllocation = allocation(nativeAtlas, slot);
        protectedAllocation = allocation(protectedAtlas, slot);
      } catch (_) {
        continue;
      }
      if (!nativeAllocation || !protectedAllocation) continue;
      if (nativeAllocation.width !== protectedAllocation.width || nativeAllocation.height !== protectedAllocation.height) {
        const row = {
          slot,
          native: [nativeAllocation.width, nativeAllocation.height],
          protected: [protectedAllocation.width, protectedAllocation.height]
        };
        changes.push(row);
        if (protectedAllocation.width < nativeAllocation.width || protectedAllocation.height < nativeAllocation.height) {
          regressions.push(row);
        }
      }
    }
    return { changes, regressions };
  }

  function verifyProtectedState(session = activeSession) {
    if (!session) return { ok: false, reason: 'No active protected-texture session' };
    const { display, parts } = session;
    if (!display || display !== (getCK() && getCK().character && getCK().character.display)) {
      return { ok: false, reason: 'HeroForge display changed' };
    }
    const atlas = display.atlas;
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
    }

    const displayLower = materialAllocation(display.meshes.bodyLower && display.meshes.bodyLower.material, atlas);
    const bakeLower = materialAllocation(
      display.meshes.bodyLower
      && display.meshes.bodyLower.bakeMaterials
      && display.meshes.bodyLower.bakeMaterials.color,
      atlas
    );
    if (!displayLower || displayLower.width !== TARGET_SIZE || displayLower.height !== TARGET_SIZE) {
      return { ok: false, reason: 'bodyLower display material is not bound to protected allocation', allocations };
    }
    if (!bakeLower || bakeLower.width !== TARGET_SIZE || bakeLower.height !== TARGET_SIZE) {
      return { ok: false, reason: 'bodyLower color bake is not bound to protected allocation', allocations };
    }

    const decals = display.meshes.bodyLower
      && display.meshes.bodyLower.bakeMaterials
      && display.meshes.bodyLower.bakeMaterials.colorDecals;
    if (Array.isArray(decals) && decals.length > 0) {
      const decalLower = materialAllocation(decals[0], atlas);
      if (!decalLower || decalLower.width !== TARGET_SIZE || decalLower.height !== TARGET_SIZE) {
        return { ok: false, reason: 'bodyLower decal bake is not bound to protected allocation', allocations };
      }
    }

    if (parts.bodyLower._usedTextureSize !== BODY_MASK_SIZE || parts.bodyUpper._usedTextureSize !== BODY_MASK_SIZE) {
      return { ok: false, reason: 'Body mask source size drifted from protected 1024px input', allocations };
    }

    return { ok: true, allocations };
  }

  function makeSession(capability) {
    const { display, modded, parts, meshes, data } = capability;
    return {
      display,
      modded,
      data,
      parts: {
        bodyLower: parts.bodyLower,
        bodyUpper: parts.bodyUpper,
        face: parts.face
      },
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
      originalResolvedBuildAtlas: modded.buildAtlas,
      nativeAtlas: null,
      maskPaths: null,
      maskTextures: null,
      protectedAtlas: null,
      appliedAt: null
    };
  }

  function restoreSessionMetadata(session) {
    if (!session) return;
    const originals = session.original;
    restoreOwnSnapshot(originals.bodyLowerBakeSize);
    restoreOwnSnapshot(originals.bodyUpperBakeSize);
    restoreOwnSnapshot(originals.faceBakeSize);
    restoreOwnSnapshot(originals.bodyLowerUsedSize);
    restoreOwnSnapshot(originals.bodyUpperUsedSize);
    restoreOwnSnapshot(originals.faceUsedSize);
    restoreOwnSnapshot(originals.lowerMaskOverride);
    restoreOwnSnapshot(originals.upperMaskOverride);
    restoreOwnSnapshot(originals.buildAtlas);
  }

  async function rebuildNativeAfterRestore(session) {
    if (!session) return;
    const CK = getCK();
    if (!CK || CK.character.display !== session.display) return;
    const display = session.display;
    if (!display.modded || typeof display.modded.buildAtlas !== 'function') return;
    display.modded.buildAtlas();
    if (display.modded.resourceAtlas) display.atlas = display.modded.resourceAtlas;
    if (display.colorBake && typeof display.colorBake.invalidateCache === 'function') display.colorBake.invalidateCache();
    if (display.colorBake && typeof display.colorBake.refresh === 'function') display.colorBake.refresh(true);
    await sleep(BAKE_WAIT_MS);
  }

  async function rollbackFailedApply(session) {
    restoreSessionMetadata(session);
    if (session && session.display && getCK() && getCK().character.display === session.display) {
      try {
        if (session.nativeAtlas) {
          session.display.modded.resourceAtlas = session.nativeAtlas;
          session.display.atlas = session.nativeAtlas;
        } else {
          session.originalResolvedBuildAtlas.call(session.modded);
          session.display.atlas = session.modded.resourceAtlas;
        }
        session.display.colorBake.invalidateCache();
        session.display.colorBake.refresh(true);
        await sleep(BAKE_WAIT_MS);
      } catch (_) {}
    }
  }

  async function loadBodyMasks(capability, session) {
    const { Resources, display } = capability;
    const hiRez = display.modded && display.modded.settings
      ? display.modded.settings.hiRez
      : false;

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
    return session.maskTextures;
  }

  function installProtectedBuildAtlas(capability, session) {
    const { CK, modded } = capability;
    const wrapper = function protectedBuildAtlas() {
      const scale = Object.assign({}, this.data.atlasScale || {});
      scale.bodyLower = 4;
      scale.bodyUpper = 4;
      scale.face = 4;
      this.resourceAtlas = new CK.Atlas(
        Object.assign({}, this.parts),
        ATLAS_WIDTH,
        ATLAS_HEIGHT,
        undefined,
        this.data.isUHD(),
        scale
      );
      return this.resourceAtlas;
    };

    Object.defineProperty(modded, 'buildAtlas', {
      configurable: true,
      enumerable: session.original.buildAtlas.descriptor
        ? !!session.original.buildAtlas.descriptor.enumerable
        : false,
      writable: true,
      value: wrapper
    });
    if (modded.buildAtlas !== wrapper) throw new Error('Could not install reversible protected atlas builder.');
  }

  function buildNativeReference(capability) {
    const { CK, modded, data } = capability;
    return new CK.Atlas(
      Object.assign({}, modded.parts),
      undefined,
      undefined,
      undefined,
      data.isUHD(),
      data.atlasScale
    );
  }

  async function applyFreshSession() {
    const capability = readCapabilities();
    if (!capability.ok) throw new Error(capability.reason);
    const session = makeSession(capability);

    try {
      session.nativeAtlas = buildNativeReference(capability);
      await loadBodyMasks(capability, session);

      session.parts.bodyLower.bakeSize = TARGET_SIZE;
      session.parts.bodyUpper.bakeSize = TARGET_SIZE;
      session.parts.face.bakeSize = TARGET_SIZE;
      capability.meshes.bodyLower.masksMapOverride = session.maskTextures.bodyLower;
      capability.meshes.bodyUpper.masksMapOverride = session.maskTextures.bodyUpper;

      installProtectedBuildAtlas(capability, session);
      const protectedAtlas = capability.modded.buildAtlas();
      session.protectedAtlas = protectedAtlas;

      for (const slot of TARGET_SLOTS) {
        const a = allocation(protectedAtlas, slot);
        if (!a || a.width !== TARGET_SIZE || a.height !== TARGET_SIZE) {
          throw new Error(`Protected atlas could not allocate ${TARGET_SIZE}px for ${slot}.`);
        }
      }

      const comparison = compareAllocations(session.nativeAtlas, protectedAtlas, capability.modded.parts);
      if (comparison.regressions.length > 0) {
        throw new Error(`Protected atlas would reduce ${comparison.regressions[0].slot} below native allocation.`);
      }

      capability.display.atlas = protectedAtlas;
      capability.colorBake.invalidateCache();
      capability.colorBake.refresh(true);
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
        targetSize: TARGET_SIZE,
        allocations: verification.allocations,
        nativeAtlas: [session.nativeAtlas.width, session.nativeAtlas.height],
        allocationChanges: comparison.changes,
        allocationRegressions: comparison.regressions,
        maskPaths: session.maskPaths,
        maxTextureSize: capability.maxTextureSize,
        appliedAt: session.appliedAt
      };
      return session;
    } catch (error) {
      if (activeSession === session) activeSession = null;
      await rollbackFailedApply(session);
      throw error;
    }
  }

  async function reapplySession(session) {
    const CK = getCK();
    if (!session || !CK || CK.character.display !== session.display) throw new Error('Current display changed.');
    session.parts.bodyLower.bakeSize = TARGET_SIZE;
    session.parts.bodyUpper.bakeSize = TARGET_SIZE;
    session.parts.face.bakeSize = TARGET_SIZE;
    session.parts.bodyLower._usedTextureSize = BODY_MASK_SIZE;
    session.parts.bodyUpper._usedTextureSize = BODY_MASK_SIZE;
    session.parts.face._usedTextureSize = BODY_MASK_SIZE;
    session.display.meshes.bodyLower.masksMapOverride = session.maskTextures.bodyLower;
    session.display.meshes.bodyUpper.masksMapOverride = session.maskTextures.bodyUpper;

    const atlas = session.modded.buildAtlas();
    session.protectedAtlas = atlas;
    for (const slot of TARGET_SLOTS) {
      const a = allocation(atlas, slot);
      if (!a || a.width !== TARGET_SIZE || a.height !== TARGET_SIZE) {
        throw new Error(`Rebuilt atlas did not preserve ${TARGET_SIZE}px ${slot}.`);
      }
    }
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
      && parts.face === session.parts.face;
  }

  async function enableFeature() {
    if (disposed || busy || enabled) return;
    busy = true;
    enabled = true;
    if (toggle) toggle.checked = true;
    setStatus('Applying protected 2048 textures…');
    setDetail('This may take several seconds while HeroForge rebakes color/decal textures.');
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
      setDetail('HeroForge was restored to native behavior where possible.');
      console.error('[HFC texture quality] enable failed', error);
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
    if (!silent) setStatus('Restoring native HeroForge texture policy…');
    try {
      restoreSessionMetadata(session);
      await rebuildNativeAfterRestore(session);
      if (!silent) {
        setStatus('Native HeroForge textures restored');
        setDetail('Reload is not required unless HeroForge itself is in a bad renderer state.');
      }
      lastDiagnostics = {
        featureId: FEATURE_ID,
        build: BUILD,
        status: 'disabled',
        disabledAt: new Date().toISOString()
      };
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
      setStatus('HeroForge character changed — reapplying…');
      try {
        if (activeSession) restoreSessionMetadata(activeSession);
        activeSession = await applyFreshSession();
        unhealthySince = null;
        reapplyFailures = 0;
        setStatus('Protected 2048 textures active');
        setDetail('Protected policy reapplied to the current character.');
      } catch (error) {
        enabled = false;
        activeSession = null;
        if (toggle) toggle.checked = false;
        setStatus(`Auto-disabled: ${error.message}`, true);
        setDetail('Required capability failed; native HeroForge behavior left in control.');
        console.error('[HFC texture quality] character-change reapply failed', error);
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
        try {
          restoreSessionMetadata(failedSession);
          await rebuildNativeAfterRestore(failedSession);
        } catch (_) {}
        setStatus(`Auto-disabled after repeated failures: ${error.message}`, true);
        setDetail('Native HeroForge behavior was restored where possible.');
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
        width: 300px; padding: 12px 14px; border: 1px solid rgba(255,255,255,.18);
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
    watcher = setInterval(() => { watcherTick().catch((error) => console.error('[HFC texture quality] watcher', error)); }, WATCH_INTERVAL_MS);
    watcherTick().catch((error) => console.error('[HFC texture quality] initial probe', error));
  }

  initialize();
})();
