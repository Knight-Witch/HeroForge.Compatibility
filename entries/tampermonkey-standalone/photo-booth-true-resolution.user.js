// ==UserScript==
// @name         HF Compatibility - Photo Booth True Resolution TEST
// @namespace    https://github.com/Knight-Witch/HeroForge.Compatibility
// @version      0.1.0
// @description  Standalone 4K Photo Booth capture test using HeroForge's named CK.Capture renderer directly.
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
  const BUILD = '0.1.0-test-4k';
  const TEST_SIZE = 4096;

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

  function getCamera(CK, BT) {
    return (
      BT && BT.maker && BT.maker.cameras && BT.maker.cameras.currentCamera
    ) || (
      CK && CK.renderManager && CK.renderManager.camera
    ) || null;
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
    const camera = getCamera(CK, BT);
    const maxTextureSize = getMaxTextureSize(CK);

    if (!CK) return { ok: false, reason: 'CK unavailable', CK, BT, camera, maxTextureSize };
    if (!BT || !BT.maker || BT.maker.enabled !== true) {
      return { ok: false, reason: 'Open Photo Booth first', CK, BT, camera, maxTextureSize };
    }
    if (!CK.Capture || typeof CK.Capture.renderToImage !== 'function') {
      return { ok: false, reason: 'CK.Capture.renderToImage unavailable', CK, BT, camera, maxTextureSize };
    }
    if (!camera) return { ok: false, reason: 'Photo Booth camera unavailable', CK, BT, camera, maxTextureSize };
    if (maxTextureSize !== null && TEST_SIZE > maxTextureSize) {
      return {
        ok: false,
        reason: `GPU texture limit ${maxTextureSize}px is below ${TEST_SIZE}px`,
        CK,
        BT,
        camera,
        maxTextureSize
      };
    }

    return { ok: true, CK, BT, camera, maxTextureSize };
  }

  function setStatus(text, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.dataset.error = isError ? '1' : '0';
  }

  function emitBoothEvent(CK, name) {
    try {
      if (CK && CK.Events && typeof CK.Events.emit === 'function') {
        CK.Events.emit(name);
      }
    } catch (error) {
      console.warn(`[HF True Resolution TEST] ${name} emit failed`, error);
    }
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

  function downloadBlob(blob, size) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    anchor.href = url;
    anchor.download = `HeroForge_TRUE_${size}px_${stamp}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function captureTargetSnapshot(target) {
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

  async function capture4096() {
    if (busy) return false;

    const capability = readCapabilities();
    if (!capability.ok) {
      setStatus(capability.reason, true);
      refresh();
      return false;
    }

    const { CK, camera, maxTextureSize } = capability;
    const priorTarget = CK.Capture.renderTarget || null;
    const priorSize = captureTargetSnapshot(priorTarget);
    let canvas = null;
    let renderedTarget = null;

    busy = true;
    refresh();
    setStatus(`Rendering true ${TEST_SIZE}px…`);

    lastCapture = {
      build: BUILD,
      requestedWidth: TEST_SIZE,
      requestedHeight: TEST_SIZE,
      antialiasFactor: 1,
      maxTextureSize,
      startedAt: new Date().toISOString(),
      status: 'running',
      priorRenderTarget: priorSize
    };

    emitBoothEvent(CK, 'boothScreenshotStarted');

    try {
      // HeroForge's current renderToImage signature defaults to 2x AA.
      // Pass 1 explicitly so a 4096px proof capture uses a 4096px render
      // target rather than allocating an 8192px supersample target.
      canvas = CK.Capture.renderToImage(TEST_SIZE, TEST_SIZE, camera, 1, true);
      renderedTarget = captureTargetSnapshot(CK.Capture.renderTarget);

      const canvasWidth = Number(canvas && canvas.width);
      const canvasHeight = Number(canvas && canvas.height);
      lastCapture.renderTarget = renderedTarget;
      lastCapture.canvasWidth = Number.isFinite(canvasWidth) ? canvasWidth : null;
      lastCapture.canvasHeight = Number.isFinite(canvasHeight) ? canvasHeight : null;

      if (!canvas || typeof canvas.toBlob !== 'function') {
        throw new Error('CK.Capture.renderToImage did not return a downloadable canvas.');
      }
      if (canvasWidth !== TEST_SIZE || canvasHeight !== TEST_SIZE) {
        throw new Error(`Returned canvas is ${canvasWidth}x${canvasHeight}, expected ${TEST_SIZE}x${TEST_SIZE}.`);
      }
      if (!renderedTarget || renderedTarget.width !== TEST_SIZE || renderedTarget.height !== TEST_SIZE) {
        throw new Error(
          `Render target is ${renderedTarget ? `${renderedTarget.width}x${renderedTarget.height}` : 'unavailable'}, expected ${TEST_SIZE}x${TEST_SIZE}.`
        );
      }
    } catch (error) {
      lastCapture.status = 'render-failed';
      lastCapture.error = error && error.message ? error.message : String(error);
      console.error('[HF True Resolution TEST] render failed', error);
      setStatus(`Render failed: ${lastCapture.error}`, true);
      busy = false;
      refresh();
      return false;
    } finally {
      emitBoothEvent(CK, 'boothScreenshotFinished');
      restoreRenderTarget(CK, priorTarget, priorSize);
    }

    try {
      const blob = await canvasToBlob(canvas);
      downloadBlob(blob, TEST_SIZE);
      lastCapture.status = 'downloaded';
      lastCapture.blobBytes = blob.size;
      lastCapture.completedAt = new Date().toISOString();
      setStatus(
        `PASS: rendered ${renderedTarget.width}x${renderedTarget.height}; downloaded ${TEST_SIZE}px PNG.`
      );
      console.log('[HF True Resolution TEST] capture result', lastCapture);
      return true;
    } catch (error) {
      lastCapture.status = 'download-failed';
      lastCapture.error = error && error.message ? error.message : String(error);
      console.error('[HF True Resolution TEST] download failed', error);
      setStatus(`PNG download failed: ${lastCapture.error}`, true);
      return false;
    } finally {
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
        ? `Ready | ${TEST_SIZE}px direct render${max}`
        : `${capability.reason}${max}`;
    }
    if (!busy && statusEl && !lastCapture) {
      setStatus(capability.ok ? 'Ready for the 4K proof capture.' : capability.reason, !capability.ok);
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
        width: 290px;
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
      #${PANEL_ID} .hfc-status { margin-top: 8px; min-height: 32px; }
      #${PANEL_ID} .hfc-status[data-error="1"] { color: #ff9d9d; }
      #${PANEL_ID} .hfc-note { opacity: .64; margin-top: 7px; font-size: 11px; }
    `;
    document.documentElement.appendChild(style);

    panel = document.createElement('div');
    panel.id = PANEL_ID;

    const title = document.createElement('div');
    title.className = 'hfc-title';
    title.textContent = 'HF True Resolution TEST — 4K';

    capabilityEl = document.createElement('div');
    capabilityEl.className = 'hfc-meta';

    captureButton = document.createElement('button');
    captureButton.type = 'button';
    captureButton.textContent = 'Capture TRUE 4096px PNG';
    captureButton.addEventListener('click', capture4096);

    statusEl = document.createElement('div');
    statusEl.className = 'hfc-status';
    statusEl.textContent = 'Waiting for HeroForge…';

    const note = document.createElement('div');
    note.className = 'hfc-note';
    note.textContent = 'Standalone proof only. Does not patch boothui.js and does not change native capture buttons. 8K remains disabled until this 4K path is validated.';

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
    GM_registerMenuCommand('HF True Resolution TEST: Capture 4096px', capture4096);
    GM_registerMenuCommand('HF True Resolution TEST: Refresh', refresh);
    GM_registerMenuCommand('HF True Resolution TEST: Dispose', dispose);
  }

  if (document.body) mount();
  else window.addEventListener('DOMContentLoaded', mount, { once: true });
})();
