// ==UserScript==
// @name         HF Compatibility - Photo Booth True 4K/8K TEST
// @namespace    https://github.com/Knight-Witch/HeroForge.Compatibility
// @version      0.6.0
// @description  Adaptive true-resolution Photo Booth still capture: one 4096 Effects source for 4K and four shifted 4096 sources for low-pressure true 8K.
// @author       Knight Witch
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        none
// @sandbox      raw
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

  const GLOBAL = 'HFPhotoBoothTrueResolutionTest';
  const PANEL_ID = 'hfc-photo-booth-true-resolution-test';
  const STYLE_ID = `${PANEL_ID}-style`;
  const BUILD = '0.6.0-adaptive-grouped-4096-source-4k-8k';
  const SOURCE_SIZE = 4096;
  const ALLOWED_SIZES = new Set([4096, 8192]);
  const MIN_NATIVE_TILE_SIZE = 256;
  const MAX_PHASE_GRID = 32;

  let busy = false;
  let panel = null;
  let statusEl = null;
  let capabilityEl = null;
  let button4K = null;
  let button8K = null;
  let refreshTimer = null;
  let lastCapture = null;

  function getCK() { return window.CK || null; }
  function getBT() { return window.BT || null; }

  function rendererInfo(CK) {
    const renderer = (CK && CK.renderManager && CK.renderManager.renderer)
      || (CK && CK.Capture && CK.Capture.renderer)
      || null;
    const maxTextureSize = renderer && renderer.capabilities
      ? Number(renderer.capabilities.maxTextureSize) || null
      : null;
    let maxRenderbufferSize = null;
    try {
      const gl = renderer && typeof renderer.getContext === 'function' ? renderer.getContext() : null;
      if (gl) maxRenderbufferSize = Number(gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)) || null;
    } catch (_) {}
    return { renderer, maxTextureSize, maxRenderbufferSize };
  }

  function readCapabilities() {
    const CK = getCK();
    const BT = getBT();
    const info = rendererInfo(CK);
    if (!CK) return { ok: false, reason: 'CK unavailable', CK, BT, ...info };
    if (!BT || !BT.maker || BT.maker.enabled !== true) {
      return { ok: false, reason: 'Open Photo Booth first', CK, BT, ...info };
    }
    if (typeof BT.maker.takeScreenshot !== 'function') {
      return { ok: false, reason: 'BT.maker.takeScreenshot unavailable', CK, BT, ...info };
    }
    if (!CK.Effects || typeof CK.Effects.renderToCanvas !== 'function') {
      return { ok: false, reason: 'CK.Effects.renderToCanvas unavailable', CK, BT, ...info };
    }
    if (info.maxTextureSize !== null && info.maxTextureSize < SOURCE_SIZE) {
      return { ok: false, reason: `GPU texture limit ${info.maxTextureSize}px is below ${SOURCE_SIZE}px`, CK, BT, ...info };
    }
    if (info.maxRenderbufferSize !== null && info.maxRenderbufferSize < SOURCE_SIZE) {
      return { ok: false, reason: `GPU renderbuffer limit ${info.maxRenderbufferSize}px is below ${SOURCE_SIZE}px`, CK, BT, ...info };
    }
    return { ok: true, CK, BT, ...info };
  }

  function setStatus(text, isError = false) {
    if (statusEl) {
      statusEl.textContent = text;
      statusEl.dataset.error = isError ? '1' : '0';
    }
  }

  function installTemporaryMethod(object, key, replacement) {
    const hadOwn = Object.prototype.hasOwnProperty.call(object, key);
    const descriptor = hadOwn ? Object.getOwnPropertyDescriptor(object, key) : null;
    const original = object[key];
    if (typeof original !== 'function') throw new Error(`${key} is not callable.`);

    if (descriptor && descriptor.configurable) {
      Object.defineProperty(object, key, { ...descriptor, value: replacement });
    } else {
      object[key] = replacement;
    }
    if (object[key] !== replacement) throw new Error(`Could not temporarily wrap ${key}.`);

    return {
      original,
      restore() {
        try {
          if (hadOwn && descriptor) Object.defineProperty(object, key, descriptor);
          else delete object[key];
        } catch (_) {
          try { object[key] = original; } catch (_) {}
        }
      }
    };
  }

  function classifyModelRender(width, height, camera, targetSize) {
    const w = Number(width);
    const h = Number(height);
    if (!Number.isFinite(w) || w <= 0 || w !== h) return null;
    if (!camera || Number(camera.width) !== targetSize || Number(camera.height) !== targetSize || !camera.view) return null;
    for (const value of [camera.view.offsetX, camera.view.offsetY, camera.view.width, camera.view.height]) {
      if (!Number.isFinite(Number(value))) return null;
    }
    if (w === targetSize) return { mode: 'native-true-resolution', tileSize: w, grid: 1, expectedPhases: 1 };
    if (w < MIN_NATIVE_TILE_SIZE || targetSize % w !== 0) return null;
    const grid = targetSize / w;
    if (!Number.isInteger(grid) || grid < 2 || grid > MAX_PHASE_GRID) return null;
    return { mode: 'tiled-repair', tileSize: w, grid, expectedPhases: grid * grid };
  }

  function phaseCoordinateFromOffset(actual, base, step, grid, axis) {
    if (!Number.isFinite(actual) || !Number.isFinite(base) || !Number.isFinite(step) || step === 0) {
      throw new Error(`Invalid native Booth ${axis}-phase geometry.`);
    }
    const raw = (actual - base) / step;
    const phase = Math.round(raw);
    const expected = base + phase * step;
    const tolerance = Math.max(1e-7, Math.abs(step) * 0.05);
    if (phase < 0 || phase >= grid || Math.abs(actual - expected) > tolerance) {
      throw new Error(`Native Booth ${axis}-phase topology changed.`);
    }
    return phase;
  }

  function withCameraOffsets(camera, offsetX, offsetY, callback) {
    const view = camera && camera.view;
    if (!view) throw new Error('Capture camera view unavailable.');
    const oldX = Number(view.offsetX);
    const oldY = Number(view.offsetY);
    view.offsetX = offsetX;
    view.offsetY = offsetY;
    try {
      if (typeof camera.updateProjectionMatrix === 'function') camera.updateProjectionMatrix();
      return callback();
    } finally {
      view.offsetX = oldX;
      view.offsetY = oldY;
      if (typeof camera.updateProjectionMatrix === 'function') camera.updateProjectionMatrix();
    }
  }

  function makePhaseCanvas(source32, tileSize, sourceStride, localX, localY) {
    const canvas = document.createElement('canvas');
    canvas.width = tileSize;
    canvas.height = tileSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create 2D context for phase canvas.');
    const imageData = ctx.createImageData(tileSize, tileSize);
    const output32 = new Uint32Array(imageData.data.buffer);
    let dest = 0;
    for (let y = 0; y < tileSize; y += 1) {
      let source = ((sourceStride * y + localY) * SOURCE_SIZE) + localX;
      for (let x = 0; x < tileSize; x += 1, dest += 1, source += sourceStride) {
        output32[dest] = source32[source];
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Canvas PNG encoding returned no Blob.')), 'image/png');
    });
  }

  function downloadBlob(blob, size) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    anchor.href = url;
    anchor.download = `HeroForge_TRUE_${size}px_${stamp}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  async function captureTrueResolution(targetSize) {
    if (busy) return false;
    if (!ALLOWED_SIZES.has(targetSize)) throw new Error(`Unsupported capture size ${targetSize}.`);

    const capability = readCapabilities();
    if (!capability.ok) {
      setStatus(capability.reason, true);
      refresh();
      return false;
    }

    const { CK, BT, maxTextureSize, maxRenderbufferSize } = capability;
    const currentRenderToCanvas = CK.Effects.renderToCanvas;
    let methodGuard = null;
    let tileSize = null;
    let grid = null;
    let expectedPhases = null;
    let suppliedPhaseCount = 0;
    let baseOffsetX = null;
    let baseOffsetY = null;
    let stepX = null;
    let stepY = null;
    let creatingSource = false;
    let nativeTrueResolutionDetected = false;
    let groupsPerAxis = null;
    let sourceStride = null;
    let phasesPerGroup = null;
    const seenPhaseKeys = new Set();
    const groupSources = new Map();

    busy = true;
    refresh();
    setStatus(targetSize === 8192
      ? 'Running TRUE 8192px capture via 4 × 4096 Effects sources…'
      : 'Running TRUE 4096px capture via 1 × 4096 Effects source…');

    lastCapture = {
      build: BUILD,
      requestedWidth: targetSize,
      requestedHeight: targetSize,
      sourceSize: SOURCE_SIZE,
      maxTextureSize,
      maxRenderbufferSize,
      startedAt: new Date().toISOString(),
      completedAt: null,
      status: 'running',
      captureMode: null,
      nativeTrueResolutionDetected: false,
      boothMode: BT.currentMode || null,
      boothAspect: BT.display && BT.display.state ? Number(BT.display.state.aspect) : null,
      tileSize: null,
      grid: null,
      expectedPhases: null,
      suppliedPhaseCount: 0,
      uniquePhaseCount: 0,
      expectedSourceGroups: null,
      sourceGroupsRendered: 0,
      sourceGroupsReleased: 0,
      result: null,
      effectsRestored: false,
      error: null
    };

    try {
      const wrapper = function(width, height, camera) {
        if (creatingSource) return currentRenderToCanvas.apply(this, arguments);

        const topology = classifyModelRender(width, height, camera, targetSize);
        if (!topology) return currentRenderToCanvas.apply(this, arguments);

        if (topology.mode === 'native-true-resolution') {
          if (tileSize !== null || suppliedPhaseCount > 0) {
            throw new Error('Native Booth mixed full-resolution and tiled model paths in one screenshot.');
          }
          nativeTrueResolutionDetected = true;
          lastCapture.captureMode = 'native-true-resolution';
          lastCapture.nativeTrueResolutionDetected = true;
          return currentRenderToCanvas.apply(this, arguments);
        }
        if (nativeTrueResolutionDetected) {
          throw new Error('Native Booth switched from full-resolution to tiled model capture mid-screenshot.');
        }

        if (tileSize === null) {
          tileSize = topology.tileSize;
          grid = topology.grid;
          expectedPhases = topology.expectedPhases;
          baseOffsetX = Number(camera.view.offsetX);
          baseOffsetY = Number(camera.view.offsetY);
          stepX = Number(camera.view.width) / targetSize;
          stepY = Number(camera.view.height) / targetSize;
          if (!Number.isFinite(stepX) || !Number.isFinite(stepY) || stepX === 0 || stepY === 0) {
            throw new Error('Unsupported native Booth phase geometry.');
          }
          if (SOURCE_SIZE % tileSize !== 0 || targetSize % SOURCE_SIZE !== 0) {
            throw new Error(`Unsupported grouped topology: tile ${tileSize}px, source ${SOURCE_SIZE}px, output ${targetSize}px.`);
          }

          groupsPerAxis = targetSize / SOURCE_SIZE;
          sourceStride = SOURCE_SIZE / tileSize;
          if (!Number.isInteger(groupsPerAxis) || groupsPerAxis < 1 || !Number.isInteger(sourceStride) || sourceStride < 1) {
            throw new Error('Grouped source geometry is not integral.');
          }
          if (grid !== groupsPerAxis * sourceStride) {
            throw new Error(`Grouped topology mismatch: grid ${grid}, groups ${groupsPerAxis}, stride ${sourceStride}.`);
          }
          phasesPerGroup = sourceStride * sourceStride;

          Object.assign(lastCapture, {
            captureMode: 'adaptive-grouped-phase-feed',
            tileSize,
            grid,
            expectedPhases,
            groupsPerAxis,
            sourceStride,
            phasesPerGroup,
            expectedSourceGroups: groupsPerAxis * groupsPerAxis,
            baseOffsetX,
            baseOffsetY,
            stepX,
            stepY
          });
        } else if (topology.tileSize !== tileSize || topology.grid !== grid) {
          throw new Error('Native Booth model tile topology changed mid-capture.');
        }

        if (suppliedPhaseCount >= expectedPhases) {
          throw new Error(`Native Booth requested more than ${expectedPhases} model phases.`);
        }

        const phaseX = phaseCoordinateFromOffset(Number(camera.view.offsetX), baseOffsetX, stepX, grid, 'X');
        const phaseY = phaseCoordinateFromOffset(Number(camera.view.offsetY), baseOffsetY, stepY, grid, 'Y');
        const phaseKey = `${phaseX},${phaseY}`;
        if (seenPhaseKeys.has(phaseKey)) throw new Error(`Native Booth requested duplicate model phase ${phaseKey}.`);
        seenPhaseKeys.add(phaseKey);

        const groupX = phaseX % groupsPerAxis;
        const groupY = phaseY % groupsPerAxis;
        const groupKey = `${groupX},${groupY}`;
        let group = groupSources.get(groupKey);

        if (!group) {
          const sourceOffsetX = baseOffsetX + groupX * stepX;
          const sourceOffsetY = baseOffsetY + groupY * stepY;
          creatingSource = true;
          let sourceCanvas;
          try {
            sourceCanvas = withCameraOffsets(camera, sourceOffsetX, sourceOffsetY, () => (
              currentRenderToCanvas.call(this, SOURCE_SIZE, SOURCE_SIZE, camera, 1)
            ));
          } finally {
            creatingSource = false;
          }

          if (!sourceCanvas || Number(sourceCanvas.width) !== SOURCE_SIZE || Number(sourceCanvas.height) !== SOURCE_SIZE) {
            throw new Error(`Grouped Effects source ${groupKey} was not ${SOURCE_SIZE}x${SOURCE_SIZE}.`);
          }
          const sourceCtx = sourceCanvas.getContext('2d', { willReadFrequently: true });
          if (!sourceCtx) throw new Error(`Grouped Effects source ${groupKey} 2D context unavailable.`);
          const sourceImageData = sourceCtx.getImageData(0, 0, SOURCE_SIZE, SOURCE_SIZE);
          const pixels = new Uint32Array(sourceImageData.data.buffer);
          sourceCanvas.width = 1;
          sourceCanvas.height = 1;
          sourceCanvas = null;

          group = { pixels, remaining: phasesPerGroup };
          groupSources.set(groupKey, group);
          lastCapture.sourceGroupsRendered += 1;
        }

        const localX = Math.floor(phaseX / groupsPerAxis);
        const localY = Math.floor(phaseY / groupsPerAxis);
        if (localX < 0 || localX >= sourceStride || localY < 0 || localY >= sourceStride) {
          throw new Error(`Grouped local phase out of range for ${phaseKey}.`);
        }

        const phaseCanvas = makePhaseCanvas(group.pixels, tileSize, sourceStride, localX, localY);
        group.remaining -= 1;
        if (group.remaining === 0) {
          group.pixels = null;
          groupSources.delete(groupKey);
          lastCapture.sourceGroupsReleased += 1;
        }

        suppliedPhaseCount += 1;
        lastCapture.suppliedPhaseCount = suppliedPhaseCount;
        lastCapture.uniquePhaseCount = seenPhaseKeys.size;
        return phaseCanvas;
      };

      methodGuard = installTemporaryMethod(CK.Effects, 'renderToCanvas', wrapper);
      let nativeResult = BT.maker.takeScreenshot(targetSize, targetSize);
      if (nativeResult && typeof nativeResult.then === 'function') nativeResult = await nativeResult;

      if (!nativeResult || Number(nativeResult.width) !== targetSize || Number(nativeResult.height) !== targetSize) {
        throw new Error(`Final native Booth result was not ${targetSize}x${targetSize}.`);
      }
      if (!nativeTrueResolutionDetected) {
        if (!expectedPhases || suppliedPhaseCount !== expectedPhases || seenPhaseKeys.size !== expectedPhases) {
          throw new Error(`Incomplete model phase feed ${suppliedPhaseCount}/${expectedPhases}.`);
        }
        if (groupSources.size !== 0) {
          throw new Error(`Grouped Effects sources were not fully released (${groupSources.size} remain).`);
        }
      }

      methodGuard.restore();
      methodGuard = null;
      lastCapture.effectsRestored = CK.Effects.renderToCanvas === currentRenderToCanvas;
      if (!lastCapture.effectsRestored) throw new Error('CK.Effects.renderToCanvas restoration failed.');

      setStatus(`Encoding TRUE ${targetSize}px PNG…`);
      const blob = await canvasToBlob(nativeResult);
      downloadBlob(blob, targetSize);

      lastCapture.result = {
        width: Number(nativeResult.width),
        height: Number(nativeResult.height),
        blobBytes: blob.size
      };
      lastCapture.status = 'passed';
      lastCapture.completedAt = new Date().toISOString();
      setStatus(
        `PASS: TRUE ${targetSize}px downloaded — ${lastCapture.sourceGroupsRendered} × 4096 source${lastCapture.sourceGroupsRendered === 1 ? '' : 's'}, `
        + `${suppliedPhaseCount}/${expectedPhases || 1} phases.`
      );
      return true;
    } catch (error) {
      lastCapture.status = 'failed';
      lastCapture.error = error && error.message ? error.message : String(error);
      lastCapture.completedAt = new Date().toISOString();
      setStatus(`Capture failed: ${lastCapture.error}`, true);
      console.error('[HF Photo Booth True Resolution]', error);
      return false;
    } finally {
      if (methodGuard) {
        try { methodGuard.restore(); } catch (_) {}
      }
      for (const group of groupSources.values()) group.pixels = null;
      groupSources.clear();
      if (lastCapture && lastCapture.status !== 'running') {
        lastCapture.effectsRestored = CK.Effects.renderToCanvas === currentRenderToCanvas;
      }
      busy = false;
      refresh();
    }
  }

  function refresh() {
    const capability = readCapabilities();
    if (capabilityEl) {
      if (!capability.ok) capabilityEl.textContent = capability.reason;
      else capabilityEl.textContent = `Ready — 4096 source supported${capability.maxTextureSize ? ` (GPU max ${capability.maxTextureSize}px)` : ''}.`;
    }
    if (button4K) button4K.disabled = busy || !capability.ok;
    if (button8K) button8K.disabled = busy || !capability.ok;
  }

  function mount() {
    if (document.getElementById(PANEL_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${PANEL_ID} {
        position: fixed; right: 18px; bottom: 18px; z-index: 2147483646;
        width: 330px; padding: 12px; border-radius: 8px;
        background: rgba(20,20,24,.96); color: #eee;
        font: 12px/1.35 Arial,sans-serif; box-shadow: 0 4px 18px rgba(0,0,0,.45);
      }
      #${PANEL_ID} .title { font-weight: 700; margin-bottom: 8px; }
      #${PANEL_ID} .buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
      #${PANEL_ID} button {
        padding: 8px; border: 1px solid #666; border-radius: 5px;
        background: #333; color: #fff; cursor: pointer; font-weight: 700;
      }
      #${PANEL_ID} button:disabled { opacity: .5; cursor: default; }
      #${PANEL_ID} .capability { margin-top: 8px; opacity: .78; }
      #${PANEL_ID} .status { margin-top: 7px; min-height: 34px; }
      #${PANEL_ID} .status[data-error="1"] { color: #ff9d9d; }
      #${PANEL_ID} .note { margin-top: 6px; opacity: .68; font-size: 11px; }
    `;
    document.head.appendChild(style);

    panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="title">Photo Booth TRUE Resolution — v0.6.0</div>
      <div class="buttons">
        <button type="button" data-size="4096">TRUE 4K</button>
        <button type="button" data-size="8192">TRUE 8K</button>
      </div>
      <div class="capability">Checking Photo Booth…</div>
      <div class="status">Ready.</div>
      <div class="note">4K uses one 4096 Effects source. 8K uses four shifted 4096 sources; no 8192 WebGL Effects target.</div>
    `;
    document.body.appendChild(panel);
    capabilityEl = panel.querySelector('.capability');
    statusEl = panel.querySelector('.status');
    button4K = panel.querySelector('[data-size="4096"]');
    button8K = panel.querySelector('[data-size="8192"]');
    button4K.addEventListener('click', () => { captureTrueResolution(4096); });
    button8K.addEventListener('click', () => { captureTrueResolution(8192); });
    refresh();
    refreshTimer = window.setInterval(refresh, 1000);
  }

  function dispose() {
    if (busy) throw new Error('Cannot dispose during an active capture.');
    if (refreshTimer) window.clearInterval(refreshTimer);
    refreshTimer = null;
    panel?.remove();
    document.getElementById(STYLE_ID)?.remove();
    panel = null;
    statusEl = null;
    capabilityEl = null;
    button4K = null;
    button8K = null;
    try { delete window[GLOBAL]; } catch (_) { window[GLOBAL] = undefined; }
    return true;
  }

  window[GLOBAL] = {
    build: BUILD,
    capture4096: () => captureTrueResolution(4096),
    capture8192: () => captureTrueResolution(8192),
    get lastCapture() { return lastCapture; },
    dispose
  };

  mount();
})();
