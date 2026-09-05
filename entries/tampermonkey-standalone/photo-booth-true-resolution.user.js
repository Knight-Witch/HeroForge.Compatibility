// ==UserScript==
// @name         HF Compatibility - Photo Booth True Resolution TEST
// @namespace    https://github.com/Knight-Witch/HeroForge.Compatibility
// @version      0.4.0
// @description  Standalone adaptive true-4K Photo Booth test that preserves HeroForge's native Booth compositor and repairs detected low-resolution Effects tiling.
// @author       Knight Witch
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

  const UW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const GLOBAL_NAME = 'HFPhotoBoothTrueResolutionTest';
  const PANEL_ID = 'hfc-photo-booth-true-resolution-test';
  const STYLE_ID = `${PANEL_ID}-style`;
  const BUILD = '0.4.0-adaptive-native-effects-phase-feed-4k';
  const TEST_SIZE = 4096;
  const MIN_NATIVE_TILE_SIZE = 256;
  const MAX_PHASE_GRID = 16;

  let panel = null;
  let captureButton = null;
  let statusEl = null;
  let capabilityEl = null;
  let refreshTimer = null;
  let busy = false;
  let lastCapture = null;

  function getCK() {
    return UW && UW.CK ? UW.CK : null;
  }

  function getBT() {
    return UW && UW.BT ? UW.BT : null;
  }

  function getMaxTextureSize(CK) {
    const candidates = [
      CK && CK.Capture && CK.Capture.renderer && CK.Capture.renderer.capabilities && CK.Capture.renderer.capabilities.maxTextureSize,
      CK && CK.renderManager && CK.renderManager.renderer && CK.renderManager.renderer.capabilities && CK.renderManager.renderer.capabilities.maxTextureSize
    ];
    for (const value of candidates) {
      const number = Number(value);
      if (Number.isFinite(number) && number > 0) return number;
    }
    return null;
  }

  function readCapabilities() {
    const CK = getCK();
    const BT = getBT();
    const maxTextureSize = getMaxTextureSize(CK);

    if (!CK) return { ok: false, reason: 'CK unavailable', CK, BT, maxTextureSize };
    if (!BT || !BT.maker || BT.maker.enabled !== true) {
      return { ok: false, reason: 'Open Photo Booth first', CK, BT, maxTextureSize };
    }
    if (typeof BT.maker.takeScreenshot !== 'function') {
      return { ok: false, reason: 'BT.maker.takeScreenshot unavailable', CK, BT, maxTextureSize };
    }
    if (!CK.Effects || typeof CK.Effects.renderToCanvas !== 'function') {
      return { ok: false, reason: 'CK.Effects.renderToCanvas unavailable', CK, BT, maxTextureSize };
    }
    if (maxTextureSize !== null && TEST_SIZE > maxTextureSize) {
      return {
        ok: false,
        reason: `GPU texture limit ${maxTextureSize}px is below ${TEST_SIZE}px`,
        CK,
        BT,
        maxTextureSize
      };
    }

    return { ok: true, CK, BT, maxTextureSize };
  }

  function setStatus(text, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.dataset.error = isError ? '1' : '0';
  }

  function installTemporaryMethod(object, key, replacement) {
    const hadOwn = Object.prototype.hasOwnProperty.call(object, key);
    const descriptor = hadOwn ? Object.getOwnPropertyDescriptor(object, key) : null;
    const original = object[key];

    if (typeof original !== 'function') {
      throw new Error(`${key} is not callable.`);
    }

    let installed = false;
    try {
      if (descriptor && descriptor.configurable) {
        Object.defineProperty(object, key, { ...descriptor, value: replacement });
      } else {
        object[key] = replacement;
      }
      installed = object[key] === replacement;
    } catch (error) {
      throw new Error(`Could not temporarily wrap ${key}: ${error && error.message ? error.message : error}`);
    }

    if (!installed) throw new Error(`Could not temporarily wrap ${key}.`);

    return {
      original,
      restore() {
        try {
          if (hadOwn && descriptor) {
            Object.defineProperty(object, key, descriptor);
          } else {
            delete object[key];
          }
        } catch (_) {
          try { object[key] = original; } catch (_) {}
        }
      }
    };
  }

  function getCanvasLike(value) {
    if (!value) return null;
    if (typeof value.toBlob === 'function' && Number.isFinite(Number(value.width)) && Number.isFinite(Number(value.height))) {
      return value;
    }
    const candidates = [value.canvas, value.image, value.output, value.result];
    for (const candidate of candidates) {
      if (candidate && typeof candidate.toBlob === 'function') return candidate;
    }
    return null;
  }

  function resultType(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof Blob !== 'undefined' && value instanceof Blob) return 'Blob';
    if (getCanvasLike(value)) return 'canvas';
    return typeof value === 'object'
      ? (value.constructor && value.constructor.name ? value.constructor.name : 'object')
      : typeof value;
  }

  function downloadUrl(url, size) {
    const anchor = document.createElement('a');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    anchor.href = url;
    anchor.download = `HeroForge_TRUE_NATIVE_${size}px_${stamp}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  function downloadBlob(blob, size) {
    const url = URL.createObjectURL(blob);
    downloadUrl(url, size);
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      try {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas PNG encoding returned no Blob.'));
        }, 'image/png');
      } catch (error) {
        reject(error);
      }
    });
  }

  async function downloadNativeResult(value) {
    const canvas = getCanvasLike(value);
    if (canvas) {
      if (Number(canvas.width) !== TEST_SIZE || Number(canvas.height) !== TEST_SIZE) {
        throw new Error(`Native Booth result was ${canvas.width}x${canvas.height}, expected ${TEST_SIZE}x${TEST_SIZE}.`);
      }
      const blob = await canvasToBlob(canvas);
      downloadBlob(blob, TEST_SIZE);
      return {
        type: 'canvas',
        width: Number(canvas.width),
        height: Number(canvas.height),
        blobBytes: blob.size
      };
    }

    if (typeof Blob !== 'undefined' && value instanceof Blob) {
      downloadBlob(value, TEST_SIZE);
      return { type: 'Blob', blobBytes: value.size };
    }

    if (typeof value === 'string' && /^(blob:|data:|https?:)/i.test(value)) {
      downloadUrl(value, TEST_SIZE);
      return { type: 'url' };
    }

    throw new Error(`Native Booth capture returned ${resultType(value)} instead of a downloadable canvas/blob/url.`);
  }

  function classifyModelRender(width, height, camera) {
    const w = Number(width);
    const h = Number(height);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0 || w !== h) return null;
    if (!camera || Number(camera.width) !== TEST_SIZE || Number(camera.height) !== TEST_SIZE) return null;
    const view = camera.view;
    if (!view) return null;
    if (![view.offsetX, view.offsetY, view.width, view.height].every((value) => Number.isFinite(Number(value)))) {
      return null;
    }

    if (w === TEST_SIZE) {
      return { mode: 'native-true-resolution', tileSize: w, grid: 1, expectedPhases: 1 };
    }

    if (w < MIN_NATIVE_TILE_SIZE || TEST_SIZE % w !== 0) return null;
    const grid = TEST_SIZE / w;
    if (!Number.isInteger(grid) || grid < 2 || grid > MAX_PHASE_GRID) return null;

    return {
      mode: 'tiled-repair',
      tileSize: w,
      grid,
      expectedPhases: grid * grid
    };
  }

  function makePhaseCanvas(source32, tileSize, grid, phaseX, phaseY) {
    const canvas = document.createElement('canvas');
    canvas.width = tileSize;
    canvas.height = tileSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create 2D context for phase canvas.');

    const imageData = ctx.createImageData(tileSize, tileSize);
    const output32 = new Uint32Array(imageData.data.buffer);
    let dest = 0;

    for (let y = 0; y < tileSize; y += 1) {
      let source = ((grid * y + phaseY) * TEST_SIZE) + phaseX;
      for (let x = 0; x < tileSize; x += 1, dest += 1, source += grid) {
        output32[dest] = source32[source];
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  function phaseCoordinateFromOffset(actual, base, step, grid, axis) {
    if (!Number.isFinite(actual) || !Number.isFinite(base) || !Number.isFinite(step) || step === 0) {
      throw new Error(`Invalid native Booth ${axis}-phase offset geometry.`);
    }
    const raw = (actual - base) / step;
    const phase = Math.round(raw);
    const expected = base + phase * step;
    const tolerance = Math.max(1e-7, Math.abs(step) * 0.05);

    if (phase < 0 || phase >= grid || Math.abs(actual - expected) > tolerance) {
      throw new Error(
        `Native Booth ${axis}-phase topology changed: offset ${actual}, `
        + `base ${base}, step ${step}, derived phase ${raw}.`
      );
    }
    return phase;
  }

  async function capture4096() {
    if (busy) return false;

    const capability = readCapabilities();
    if (!capability.ok) {
      setStatus(capability.reason, true);
      refresh();
      return false;
    }

    const { CK, BT, maxTextureSize } = capability;
    const currentRenderToCanvas = CK.Effects.renderToCanvas;
    let methodGuard = null;
    let nativeResult;
    let sourceCanvas = null;
    let sourcePixels32 = null;
    let tileSize = null;
    let grid = null;
    let expectedPhases = null;
    let phaseIndex = 0;
    let baseOffsetX = null;
    let baseOffsetY = null;
    let stepX = null;
    let stepY = null;
    let creatingSource = false;
    let nativeTrueResolutionDetected = false;
    const suppliedPhases = [];
    const seenPhaseKeys = new Set();

    busy = true;
    refresh();
    setStatus(`Running native Photo Booth capture with a true ${TEST_SIZE}px Effects source…`);

    lastCapture = {
      build: BUILD,
      requestedWidth: TEST_SIZE,
      requestedHeight: TEST_SIZE,
      maxTextureSize,
      startedAt: new Date().toISOString(),
      status: 'running',
      captureMode: null,
      nativeTrueResolutionDetected: false,
      boothMode: BT.currentMode || null,
      boothAspect: BT.display && BT.display.state ? Number(BT.display.state.aspect) : null,
      tileSize: null,
      grid: null,
      expectedPhases: null,
      suppliedPhases
    };

    try {
      const wrapper = function(width, height, camera) {
        if (creatingSource) return currentRenderToCanvas.apply(this, arguments);

        const topology = classifyModelRender(width, height, camera);
        if (!topology) return currentRenderToCanvas.apply(this, arguments);

        if (topology.mode === 'native-true-resolution') {
          if (tileSize !== null || phaseIndex > 0) {
            throw new Error('Native Booth mixed full-resolution and tiled model capture paths in one screenshot.');
          }
          nativeTrueResolutionDetected = true;
          lastCapture.captureMode = 'native-true-resolution';
          lastCapture.nativeTrueResolutionDetected = true;
          return currentRenderToCanvas.apply(this, arguments);
        }

        if (nativeTrueResolutionDetected) {
          throw new Error('Native Booth switched from a full-resolution model render to a tiled model render mid-capture.');
        }

        if (tileSize === null) {
          tileSize = topology.tileSize;
          grid = topology.grid;
          expectedPhases = topology.expectedPhases;
          baseOffsetX = Number(camera.view.offsetX);
          baseOffsetY = Number(camera.view.offsetY);
          stepX = Number(camera.view.width) / TEST_SIZE;
          stepY = Number(camera.view.height) / TEST_SIZE;

          if (!Number.isFinite(stepX) || !Number.isFinite(stepY) || stepX === 0 || stepY === 0) {
            throw new Error(`Unsupported native Booth phase geometry from tile ${tileSize}px.`);
          }

          creatingSource = true;
          try {
            sourceCanvas = currentRenderToCanvas.call(this, TEST_SIZE, TEST_SIZE, camera, 1);
          } finally {
            creatingSource = false;
          }

          const source = getCanvasLike(sourceCanvas);
          if (!source || Number(source.width) !== TEST_SIZE || Number(source.height) !== TEST_SIZE) {
            throw new Error(
              `True Effects source did not produce ${TEST_SIZE}x${TEST_SIZE}; got `
              + `${source ? `${source.width}x${source.height}` : resultType(sourceCanvas)}.`
            );
          }

          const sourceCtx = source.getContext('2d', { willReadFrequently: true });
          if (!sourceCtx) throw new Error('Could not read true Effects source canvas.');
          const sourceImageData = sourceCtx.getImageData(0, 0, TEST_SIZE, TEST_SIZE);
          sourcePixels32 = new Uint32Array(sourceImageData.data.buffer);

          lastCapture.captureMode = 'adaptive-tiled-repair';
          lastCapture.tileSize = tileSize;
          lastCapture.grid = grid;
          lastCapture.expectedPhases = expectedPhases;
          lastCapture.trueEffectsRender = {
            width: TEST_SIZE,
            height: TEST_SIZE,
            cameraAspect: Number.isFinite(Number(camera.aspect)) ? Number(camera.aspect) : null,
            baseOffsetX,
            baseOffsetY,
            viewWidth: Number(camera.view.width),
            viewHeight: Number(camera.view.height),
            stepX,
            stepY
          };
        } else if (topology.tileSize !== tileSize || topology.grid !== grid) {
          throw new Error(
            `Native Booth model tile topology changed mid-capture: `
            + `${topology.tileSize}px/${topology.grid}x vs ${tileSize}px/${grid}x.`
          );
        }

        if (phaseIndex >= expectedPhases) {
          throw new Error(`Native Booth requested more than ${expectedPhases} model phases.`);
        }

        const actualOffsetX = Number(camera.view.offsetX);
        const actualOffsetY = Number(camera.view.offsetY);
        const phaseX = phaseCoordinateFromOffset(actualOffsetX, baseOffsetX, stepX, grid, 'X');
        const phaseY = phaseCoordinateFromOffset(actualOffsetY, baseOffsetY, stepY, grid, 'Y');
        const phaseKey = `${phaseX},${phaseY}`;
        if (seenPhaseKeys.has(phaseKey)) {
          throw new Error(`Native Booth requested duplicate model phase ${phaseKey}.`);
        }
        seenPhaseKeys.add(phaseKey);

        const phaseCanvas = makePhaseCanvas(sourcePixels32, tileSize, grid, phaseX, phaseY);
        suppliedPhases.push({
          index: phaseIndex,
          x: phaseX,
          y: phaseY,
          offsetX: actualOffsetX,
          offsetY: actualOffsetY
        });
        phaseIndex += 1;
        return phaseCanvas;
      };

      methodGuard = installTemporaryMethod(CK.Effects, 'renderToCanvas', wrapper);

      nativeResult = BT.maker.takeScreenshot(TEST_SIZE, TEST_SIZE);
      if (nativeResult && typeof nativeResult.then === 'function') {
        nativeResult = await nativeResult;
      }

      lastCapture.nativeResultType = resultType(nativeResult);
      lastCapture.suppliedPhaseCount = phaseIndex;

      if (nativeTrueResolutionDetected) {
        if (sourcePixels32 || phaseIndex !== 0) {
          throw new Error('Native Booth full-resolution path was mixed with an injected tiled repair.');
        }
      } else {
        if (!sourcePixels32 || tileSize === null || expectedPhases === null) {
          throw new Error('Native Booth did not expose a recognized full-resolution or tiled model capture path.');
        }
        if (phaseIndex !== expectedPhases || seenPhaseKeys.size !== expectedPhases) {
          throw new Error(
            `Native Booth consumed ${phaseIndex}/${expectedPhases} model phases `
            + `(${seenPhaseKeys.size} unique).`
          );
        }
      }

      const download = await downloadNativeResult(nativeResult);
      lastCapture.download = download;
      lastCapture.status = 'downloaded';
      lastCapture.completedAt = new Date().toISOString();

      if (nativeTrueResolutionDetected) {
        setStatus(
          `PASS: HeroForge exposed a native true-${TEST_SIZE}px Effects path; no phase repair was injected. `
          + `Downloaded ${download.type}.`
        );
      } else {
        setStatus(
          `PASS: true ${TEST_SIZE}px Effects source phase-fed through native Booth compositor `
          + `(${phaseIndex}× ${tileSize}px phases, detected ${grid}×${grid} topology); downloaded ${download.type}.`
        );
      }
      console.log('[HF True Resolution TEST] native Effects phase-feed capture result', lastCapture);
      return true;
    } catch (error) {
      lastCapture.status = 'failed';
      lastCapture.suppliedPhaseCount = phaseIndex;
      lastCapture.error = error && error.message ? error.message : String(error);
      lastCapture.completedAt = new Date().toISOString();
      console.error('[HF True Resolution TEST] native Effects phase-feed capture failed', error, lastCapture);
      setStatus(`Capture failed: ${lastCapture.error}`, true);
      return false;
    } finally {
      if (methodGuard) methodGuard.restore();
      sourcePixels32 = null;
      if (sourceCanvas && Number.isFinite(Number(sourceCanvas.width))) {
        try {
          sourceCanvas.width = 0;
          sourceCanvas.height = 0;
        } catch (_) {}
      }
      sourceCanvas = null;
      busy = false;
      refresh();
    }
  }

  function refresh() {
    const capability = readCapabilities();
    if (captureButton) captureButton.disabled = busy || !capability.ok;
    if (capabilityEl) {
      const max = capability.maxTextureSize ? ` | GPU max ${capability.maxTextureSize}px` : '';
      capabilityEl.textContent = capability.ok
        ? `Ready | native Booth compositor + true ${TEST_SIZE}px Effects source${max}`
        : `${capability.reason}${max}`;
    }
    if (!busy && statusEl && !lastCapture) {
      setStatus(capability.ok ? 'Ready for native-compositor true-4K test.' : capability.reason, !capability.ok);
    }
  }

  function mount() {
    if (document.getElementById(PANEL_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${PANEL_ID} {
        position: fixed;
        right: 14px;
        bottom: 14px;
        z-index: 2147483646;
        width: 310px;
        box-sizing: border-box;
        padding: 10px;
        border: 1px solid rgba(255,255,255,.22);
        border-radius: 8px;
        background: rgba(20,20,24,.96);
        color: #f5f5f5;
        font: 12px/1.35 Arial, sans-serif;
        box-shadow: 0 4px 18px rgba(0,0,0,.45);
      }
      #${PANEL_ID} .hfc-title { font-weight: 700; margin-bottom: 8px; }
      #${PANEL_ID} .hfc-meta { opacity: .78; margin: 5px 0; }
      #${PANEL_ID} button {
        width: 100%;
        margin-top: 7px;
        background: #2d2d34;
        color: #fff;
        border: 1px solid #555;
        border-radius: 4px;
        padding: 7px 9px;
        cursor: pointer;
      }
      #${PANEL_ID} button:hover:not(:disabled) { background: #3b3b44; }
      #${PANEL_ID} button:disabled { opacity: .45; cursor: default; }
      #${PANEL_ID} .hfc-status { margin-top: 8px; min-height: 38px; }
      #${PANEL_ID} .hfc-status[data-error="1"] { color: #ff9d9d; }
      #${PANEL_ID} .hfc-note { opacity: .64; margin-top: 7px; font-size: 11px; }
    `;
    document.documentElement.appendChild(style);

    panel = document.createElement('div');
    panel.id = PANEL_ID;

    const title = document.createElement('div');
    title.className = 'hfc-title';
    title.textContent = 'HF True Resolution TEST — 4K v0.4';

    capabilityEl = document.createElement('div');
    capabilityEl.className = 'hfc-meta';

    captureButton = document.createElement('button');
    captureButton.type = 'button';
    captureButton.textContent = 'Capture TRUE 4096px via Native Booth';
    captureButton.addEventListener('click', capture4096);

    statusEl = document.createElement('div');
    statusEl.className = 'hfc-status';
    statusEl.textContent = 'Waiting for HeroForge…';

    const note = document.createElement('div');
    note.className = 'hfc-note';
    note.textContent = 'v0.4 detects the native model-capture topology at runtime. Low-resolution tiled paths are repaired through one true 4096px Effects frame; an already-true 4096px native path is left untouched. The named method is restored after capture.';

    panel.append(title, capabilityEl, captureButton, statusEl, note);
    document.body.appendChild(panel);

    refresh();
    refreshTimer = window.setInterval(refresh, 750);
  }

  function dispose() {
    if (refreshTimer !== null) {
      window.clearInterval(refreshTimer);
      refreshTimer = null;
    }
    if (captureButton) captureButton.removeEventListener('click', capture4096);
    captureButton = null;
    capabilityEl = null;
    statusEl = null;
    if (panel) {
      panel.remove();
      panel = null;
    }
    const style = document.getElementById(STYLE_ID);
    if (style) style.remove();
    try {
      delete UW[GLOBAL_NAME];
    } catch (_) {
      UW[GLOBAL_NAME] = undefined;
    }
  }

  const prior = UW[GLOBAL_NAME];
  if (prior && typeof prior.dispose === 'function') {
    try { prior.dispose(); } catch (_) {}
  }

  const API = {
    build: BUILD,
    capture4096,
    refresh,
    dispose
  };
  Object.defineProperty(API, 'lastCapture', {
    enumerable: true,
    get() { return lastCapture; }
  });
  UW[GLOBAL_NAME] = API;

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('HF True Resolution TEST: Native-compositor 4096px', capture4096);
    GM_registerMenuCommand('HF True Resolution TEST: Refresh', refresh);
    GM_registerMenuCommand('HF True Resolution TEST: Dispose', dispose);
  }

  if (document.body) mount();
  else window.addEventListener('DOMContentLoaded', mount, { once: true });
})();
