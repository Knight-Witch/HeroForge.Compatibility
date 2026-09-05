// ==UserScript==
// @name         HF Compatibility - Photo Booth True Resolution TEST
// @namespace    https://github.com/Knight-Witch/HeroForge.Compatibility
// @version      0.2.0
// @description  Standalone true-4K Photo Booth test that preserves HeroForge's native Booth capture/compositing path while upgrading its internal scene render.
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
  const BUILD = '0.2.0-native-pipeline-4k';
  const TEST_SIZE = 4096;
  const NATIVE_RENDER_TARGET_MAX = 2048;
  const NATIVE_RENDER_TARGET_MIN = 1024;

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
    if (!CK.Capture || typeof CK.Capture.renderToImage !== 'function') {
      return { ok: false, reason: 'CK.Capture.renderToImage unavailable', CK, BT, maxTextureSize };
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

  function snapshotRenderTarget(target) {
    if (!target) return null;
    const width = Number(target.width);
    const height = Number(target.height);
    return {
      width: Number.isFinite(width) ? width : null,
      height: Number.isFinite(height) ? height : null
    };
  }

  function restoreRenderTarget(CK, priorTarget, priorSize) {
    const current = CK && CK.Capture ? CK.Capture.renderTarget : null;
    if (!current) return;

    if (priorTarget) {
      if (current === priorTarget && priorSize && typeof current.setSize === 'function') {
        if (Number.isFinite(priorSize.width) && Number.isFinite(priorSize.height)) {
          current.setSize(priorSize.width, priorSize.height);
        }
      }
      return;
    }

    try {
      if (typeof current.dispose === 'function') current.dispose();
    } catch (_) {}

    try {
      CK.Capture.renderTarget = null;
    } catch (_) {}
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

  async function capture4096() {
    if (busy) return false;

    const capability = readCapabilities();
    if (!capability.ok) {
      setStatus(capability.reason, true);
      refresh();
      return false;
    }

    const { CK, BT, maxTextureSize } = capability;
    const priorTarget = CK.Capture.renderTarget || null;
    const priorSize = snapshotRenderTarget(priorTarget);
    const currentRenderToImage = CK.Capture.renderToImage;
    const interceptedCalls = [];
    let upgraded = false;
    let methodGuard = null;
    let nativeResult;

    busy = true;
    refresh();
    setStatus(`Running native Photo Booth capture with a true ${TEST_SIZE}px scene render…`);

    lastCapture = {
      build: BUILD,
      requestedWidth: TEST_SIZE,
      requestedHeight: TEST_SIZE,
      maxTextureSize,
      startedAt: new Date().toISOString(),
      status: 'running',
      priorRenderTarget: priorSize,
      boothMode: BT.currentMode || null,
      boothAspect: BT.display && BT.display.state ? Number(BT.display.state.aspect) : null,
      interceptedCalls
    };

    try {
      const wrapper = function(width, height, camera, aaFactor, refreshAfter) {
        const inputWidth = Number(width);
        const inputHeight = Number(height);
        const effectiveAA = Number.isFinite(Number(aaFactor)) ? Number(aaFactor) : 2;
        const nativeTargetWidth = inputWidth * effectiveAA;
        const nativeTargetHeight = inputHeight * effectiveAA;
        const call = {
          inputWidth,
          inputHeight,
          inputAA: effectiveAA,
          nativeTargetWidth,
          nativeTargetHeight,
          cameraAspect: camera && Number.isFinite(Number(camera.aspect)) ? Number(camera.aspect) : null,
          boothAspect: BT.display && BT.display.state && Number.isFinite(Number(BT.display.state.aspect))
            ? Number(BT.display.state.aspect)
            : null,
          upgraded: false
        };
        interceptedCalls.push(call);

        const square = inputWidth === inputHeight && inputWidth > 0;
        const looksLikeCappedPrimaryRender = square
          && nativeTargetWidth === nativeTargetHeight
          && nativeTargetWidth >= NATIVE_RENDER_TARGET_MIN
          && nativeTargetWidth <= NATIVE_RENDER_TARGET_MAX;

        if (!upgraded && looksLikeCappedPrimaryRender) {
          upgraded = true;
          call.upgraded = true;
          call.overrideWidth = TEST_SIZE;
          call.overrideHeight = TEST_SIZE;
          call.overrideAA = 1;

          const output = currentRenderToImage.call(this, TEST_SIZE, TEST_SIZE, camera, 1, refreshAfter);
          const target = snapshotRenderTarget(CK.Capture.renderTarget);
          const outputCanvas = getCanvasLike(output);
          call.actualRenderTarget = target;
          call.outputCanvasWidth = outputCanvas ? Number(outputCanvas.width) : null;
          call.outputCanvasHeight = outputCanvas ? Number(outputCanvas.height) : null;
          return output;
        }

        return currentRenderToImage.apply(this, arguments);
      };

      methodGuard = installTemporaryMethod(CK.Capture, 'renderToImage', wrapper);

      nativeResult = BT.maker.takeScreenshot(TEST_SIZE, TEST_SIZE);
      if (nativeResult && typeof nativeResult.then === 'function') {
        nativeResult = await nativeResult;
      }

      lastCapture.nativeResultType = resultType(nativeResult);
      lastCapture.upgraded = upgraded;

      if (!upgraded) {
        throw new Error(
          `Native Booth capture did not expose the expected capped scene render. Intercepted ${interceptedCalls.length} renderToImage call(s).`
        );
      }

      const upgradedCall = interceptedCalls.find((call) => call.upgraded);
      if (!upgradedCall || !upgradedCall.actualRenderTarget
          || upgradedCall.actualRenderTarget.width !== TEST_SIZE
          || upgradedCall.actualRenderTarget.height !== TEST_SIZE) {
        const target = upgradedCall && upgradedCall.actualRenderTarget;
        throw new Error(
          `Internal render override did not reach ${TEST_SIZE}x${TEST_SIZE}; got ${target ? `${target.width}x${target.height}` : 'unknown target'}.`
        );
      }

      const download = await downloadNativeResult(nativeResult);
      lastCapture.download = download;
      lastCapture.status = 'downloaded';
      lastCapture.completedAt = new Date().toISOString();

      const aspectNote = upgradedCall.cameraAspect !== null
        ? ` camera aspect at native render=${upgradedCall.cameraAspect.toFixed(4)}`
        : '';
      setStatus(
        `PASS: native Booth pipeline used a true ${TEST_SIZE}x${TEST_SIZE} scene render; downloaded ${download.type}.${aspectNote}`
      );
      console.log('[HF True Resolution TEST] native-pipeline capture result', lastCapture);
      return true;
    } catch (error) {
      lastCapture.status = 'failed';
      lastCapture.error = error && error.message ? error.message : String(error);
      lastCapture.completedAt = new Date().toISOString();
      console.error('[HF True Resolution TEST] native-pipeline capture failed', error, lastCapture);
      setStatus(`Capture failed: ${lastCapture.error}`, true);
      return false;
    } finally {
      if (methodGuard) methodGuard.restore();
      restoreRenderTarget(CK, priorTarget, priorSize);
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
        ? `Ready | native Booth pipeline + ${TEST_SIZE}px internal render${max}`
        : `${capability.reason}${max}`;
    }
    if (!busy && statusEl && !lastCapture) {
      setStatus(capability.ok ? 'Ready for native-pipeline 4K test.' : capability.reason, !capability.ok);
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
    title.textContent = 'HF True Resolution TEST — 4K v0.2';

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
    note.textContent = 'v0.2 preserves BT.maker.takeScreenshot so HeroForge owns Booth framing/aspect/effects. Only the capped internal CK.Capture.renderToImage call is temporarily upgraded, then restored.';

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
    GM_registerMenuCommand('HF True Resolution TEST: Native-pipeline 4096px', capture4096);
    GM_registerMenuCommand('HF True Resolution TEST: Refresh', refresh);
    GM_registerMenuCommand('HF True Resolution TEST: Dispose', dispose);
  }

  if (document.body) mount();
  else window.addEventListener('DOMContentLoaded', mount, { once: true });
})();
