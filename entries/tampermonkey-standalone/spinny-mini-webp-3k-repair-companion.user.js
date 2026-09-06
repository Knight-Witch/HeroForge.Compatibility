// ==UserScript==
// @name         HF Compatibility - Spinny TRUE 3K Repair Companion
// @namespace    https://github.com/Knight-Witch/HeroForge.Compatibility
// @version      0.1.0
// @description  Diagnostic TRUE-3072 frame-source repair for the existing Spinny WebP Short Test companion.
// @author       Knight Witch
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        none
// @sandbox      raw
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

  const GLOBAL = 'HFSpinnyMiniWebP3KRepair';
  const BASE_GLOBAL = 'HFSpinnyMiniWebPProfilesTest';
  const SHORT_GLOBAL = 'HFSpinnyMiniWebPShortTest';
  const BASE_PANEL_ID = 'hfc-spinny-mini-webp-profiles-test';
  const BUTTON_CLASS = 'hfc-true3k-repair-test';
  const STATUS_CLASS = 'hfc-true3k-repair-status';
  const STYLE_ID = 'hfc-spinny-true3k-repair-style';
  const BUILD = '0.1.0-3072-effects-source-phase-feed';
  const TARGET_SIZE = 3072;
  const MIN_NATIVE_TILE_SIZE = 256;
  const MAX_PHASE_GRID = 32;

  let busy = false;
  let button = null;
  let statusEl = null;
  let attachTimer = null;
  let lastRun = null;

  const diagnostics = {
    build: BUILD,
    busy: false,
    targetSize: TARGET_SIZE,
    lastRun: null
  };

  function getBase() { return window[BASE_GLOBAL] || null; }
  function getShort() { return window[SHORT_GLOBAL] || null; }
  function getCK() { return window.CK || null; }

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
    return { maxTextureSize, maxRenderbufferSize };
  }

  function selectedResolutionSize() {
    const base = getBase();
    const panel = document.getElementById(BASE_PANEL_ID);
    const select = panel && panel.querySelector('.hfc-resolution');
    const resolution = base && select && base.resolutions && base.resolutions[select.value];
    return resolution ? Number(resolution.size) : null;
  }

  function readCapabilities() {
    const base = getBase();
    const short = getShort();
    const CK = getCK();
    const info = rendererInfo(CK);
    if (!base) return { ok: false, reason: 'Spinny Mini WebP Profiles TEST is unavailable.' };
    if (!short || typeof short.capture !== 'function' || typeof short.cancel !== 'function') {
      return { ok: false, reason: 'Install/enable the Spinny WebP Short Test companion first.' };
    }
    if (base.busy) return { ok: false, reason: 'Full Spinny capture is active.' };
    if (short.busy) return { ok: false, reason: 'Baseline Short Test is active.' };
    if (selectedResolutionSize() !== TARGET_SIZE) return { ok: false, reason: 'Select 3072px first.' };
    if (!CK || !CK.Effects || typeof CK.Effects.renderToCanvas !== 'function') {
      return { ok: false, reason: 'CK.Effects.renderToCanvas unavailable.' };
    }
    if (info.maxTextureSize !== null && info.maxTextureSize < TARGET_SIZE) {
      return { ok: false, reason: `GPU texture limit ${info.maxTextureSize}px is below ${TARGET_SIZE}px.` };
    }
    if (info.maxRenderbufferSize !== null && info.maxRenderbufferSize < TARGET_SIZE) {
      return { ok: false, reason: `GPU renderbuffer limit ${info.maxRenderbufferSize}px is below ${TARGET_SIZE}px.` };
    }
    return { ok: true, CK, short, ...info };
  }

  function setStatus(text, error = false) {
    if (!statusEl) return;
    statusEl.textContent = String(text || '');
    statusEl.dataset.error = error ? '1' : '0';
  }

  function installTemporaryMethod(object, key, replacement) {
    const hadOwn = Object.prototype.hasOwnProperty.call(object, key);
    const descriptor = hadOwn ? Object.getOwnPropertyDescriptor(object, key) : null;
    const original = object[key];
    if (typeof original !== 'function') throw new Error(`${key} is not callable.`);

    if (descriptor && descriptor.configurable) Object.defineProperty(object, key, { ...descriptor, value: replacement });
    else object[key] = replacement;
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

  function classifyModelRender(width, height, camera) {
    const w = Number(width);
    const h = Number(height);
    if (!Number.isFinite(w) || w <= 0 || w !== h) return null;
    if (!camera || Number(camera.width) !== TARGET_SIZE || Number(camera.height) !== TARGET_SIZE || !camera.view) return null;
    for (const value of [camera.view.offsetX, camera.view.offsetY, camera.view.width, camera.view.height]) {
      if (!Number.isFinite(Number(value))) return null;
    }
    if (w === TARGET_SIZE) return { mode: 'native-true-resolution', tileSize: w, grid: 1, expectedPhases: 1 };
    if (w < MIN_NATIVE_TILE_SIZE || TARGET_SIZE % w !== 0) return null;
    const grid = TARGET_SIZE / w;
    if (!Number.isInteger(grid) || grid < 2 || grid > MAX_PHASE_GRID) return null;
    return { mode: 'tiled-repair', tileSize: w, grid, expectedPhases: grid * grid };
  }

  function phaseCoordinateFromOffset(actual, base, step, grid, axis) {
    const raw = (actual - base) / step;
    const phase = Math.round(raw);
    const expected = base + phase * step;
    const tolerance = Math.max(1e-7, Math.abs(step) * 0.05);
    if (!Number.isFinite(actual) || !Number.isFinite(base) || !Number.isFinite(step) || step === 0
      || phase < 0 || phase >= grid || Math.abs(actual - expected) > tolerance) {
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
    if (!ctx) throw new Error('Could not create phase canvas context.');
    const imageData = ctx.createImageData(tileSize, tileSize);
    const output32 = new Uint32Array(imageData.data.buffer);
    let dest = 0;
    for (let y = 0; y < tileSize; y += 1) {
      let source = ((sourceStride * y + localY) * TARGET_SIZE) + localX;
      for (let x = 0; x < tileSize; x += 1, dest += 1, source += sourceStride) {
        output32[dest] = source32[source];
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  function makeRepairWrapper(CK, currentRenderToCanvas, run) {
    let creatingSource = false;
    let frame = null;

    function finishFrame() {
      if (!frame) return;
      run.frames.push({
        index: frame.index,
        tileSize: frame.tileSize,
        grid: frame.grid,
        expectedPhases: frame.expectedPhases,
        suppliedPhases: frame.suppliedPhases,
        uniquePhases: frame.seen.size,
        sourceRenders: frame.sourceRenders,
        sourceSize: TARGET_SIZE
      });
      frame.sourcePixels = null;
      frame = null;
    }

    function startFrame(topology, camera) {
      const sourceStride = TARGET_SIZE / topology.tileSize;
      if (!Number.isInteger(sourceStride) || sourceStride < 1 || topology.grid !== sourceStride) {
        throw new Error(`Unsupported 3K topology: tile ${topology.tileSize}px, grid ${topology.grid}, stride ${sourceStride}.`);
      }
      frame = {
        index: run.frames.length,
        tileSize: topology.tileSize,
        grid: topology.grid,
        expectedPhases: topology.expectedPhases,
        suppliedPhases: 0,
        sourceStride,
        baseOffsetX: Number(camera.view.offsetX),
        baseOffsetY: Number(camera.view.offsetY),
        stepX: Number(camera.view.width) / TARGET_SIZE,
        stepY: Number(camera.view.height) / TARGET_SIZE,
        seen: new Set(),
        sourcePixels: null,
        sourceRenders: 0
      };
      if (!Number.isFinite(frame.stepX) || !Number.isFinite(frame.stepY) || frame.stepX === 0 || frame.stepY === 0) {
        throw new Error('Unsupported native Booth phase geometry.');
      }
    }

    const wrapper = function(width, height, camera) {
      if (creatingSource) return currentRenderToCanvas.apply(this, arguments);
      const topology = classifyModelRender(width, height, camera);
      if (!topology) return currentRenderToCanvas.apply(this, arguments);

      if (topology.mode === 'native-true-resolution') {
        run.nativeTrueResolutionCalls += 1;
        run.frames.push({
          index: run.frames.length,
          tileSize: TARGET_SIZE,
          grid: 1,
          expectedPhases: 1,
          suppliedPhases: 1,
          uniquePhases: 1,
          sourceRenders: 0,
          sourceSize: TARGET_SIZE,
          nativeTrueResolution: true
        });
        return currentRenderToCanvas.apply(this, arguments);
      }

      if (frame && frame.suppliedPhases === frame.expectedPhases) finishFrame();
      if (!frame) startFrame(topology, camera);
      else if (frame.tileSize !== topology.tileSize || frame.grid !== topology.grid) {
        throw new Error('Native Booth 3K tile topology changed mid-frame.');
      }

      const phaseX = phaseCoordinateFromOffset(Number(camera.view.offsetX), frame.baseOffsetX, frame.stepX, frame.grid, 'X');
      const phaseY = phaseCoordinateFromOffset(Number(camera.view.offsetY), frame.baseOffsetY, frame.stepY, frame.grid, 'Y');
      const key = `${phaseX},${phaseY}`;
      if (frame.seen.has(key)) throw new Error(`Native Booth requested duplicate model phase ${key}.`);
      frame.seen.add(key);

      if (!frame.sourcePixels) {
        creatingSource = true;
        let sourceCanvas;
        try {
          sourceCanvas = withCameraOffsets(camera, frame.baseOffsetX, frame.baseOffsetY, () => (
            currentRenderToCanvas.call(this, TARGET_SIZE, TARGET_SIZE, camera, 1)
          ));
        } finally {
          creatingSource = false;
        }
        if (!sourceCanvas || Number(sourceCanvas.width) !== TARGET_SIZE || Number(sourceCanvas.height) !== TARGET_SIZE) {
          throw new Error(`TRUE 3K Effects source was not ${TARGET_SIZE}x${TARGET_SIZE}.`);
        }
        const sourceCtx = sourceCanvas.getContext('2d', { willReadFrequently: true });
        if (!sourceCtx) throw new Error('TRUE 3K Effects source context unavailable.');
        const imageData = sourceCtx.getImageData(0, 0, TARGET_SIZE, TARGET_SIZE);
        frame.sourcePixels = new Uint32Array(imageData.data.buffer);
        frame.sourceRenders += 1;
        sourceCanvas.width = 1;
        sourceCanvas.height = 1;
        sourceCanvas = null;
      }

      const phaseCanvas = makePhaseCanvas(frame.sourcePixels, frame.tileSize, frame.sourceStride, phaseX, phaseY);
      frame.suppliedPhases += 1;
      run.totalPhases += 1;
      if (frame.suppliedPhases === frame.expectedPhases) {
        if (frame.seen.size !== frame.expectedPhases) throw new Error(`Incomplete 3K phase set ${frame.seen.size}/${frame.expectedPhases}.`);
        finishFrame();
      }
      return phaseCanvas;
    };

    wrapper.finish = () => {
      if (frame) {
        if (frame.suppliedPhases !== frame.expectedPhases) {
          throw new Error(`Short Test ended with incomplete 3K phase feed ${frame.suppliedPhases}/${frame.expectedPhases}.`);
        }
        finishFrame();
      }
    };
    return wrapper;
  }

  async function runTrue3KShortTest() {
    if (busy) return false;
    const cap = readCapabilities();
    if (!cap.ok) {
      setStatus(cap.reason, true);
      refreshButton();
      return false;
    }

    const { CK, short, maxTextureSize, maxRenderbufferSize } = cap;
    const currentRenderToCanvas = CK.Effects.renderToCanvas;
    let guard = null;
    const run = {
      build: BUILD,
      status: 'running',
      startedAt: new Date().toISOString(),
      completedAt: null,
      targetSize: TARGET_SIZE,
      maxTextureSize,
      maxRenderbufferSize,
      frames: [],
      totalPhases: 0,
      nativeTrueResolutionCalls: 0,
      shortTestResult: null,
      shortTestCapture: null,
      effectsRestored: false,
      error: null
    };
    lastRun = run;
    diagnostics.lastRun = run;
    diagnostics.busy = true;
    busy = true;
    button.textContent = 'Cancel TRUE 3K';
    setStatus('TRUE 3K repair active — feeding native 3K compositor from real 3072 Effects sources…');

    try {
      const wrapper = makeRepairWrapper(CK, currentRenderToCanvas, run);
      guard = installTemporaryMethod(CK.Effects, 'renderToCanvas', wrapper);
      const result = await short.capture();
      wrapper.finish();
      run.shortTestResult = !!result;
      run.shortTestCapture = short.lastCapture ? {
        status: short.lastCapture.status,
        framesRendered: short.lastCapture.framesRendered,
        framesEncoded: short.lastCapture.framesEncoded,
        outputBytes: short.lastCapture.outputBytes,
        parsed: short.lastCapture.parsed,
        rotationRestored: short.lastCapture.rotationRestored,
        error: short.lastCapture.error
      } : null;

      if (!result) throw new Error((short.lastCapture && short.lastCapture.error) || 'Baseline Short Test reported failure.');
      if (run.frames.length !== short.shortTestFrames) {
        throw new Error(`TRUE 3K repaired frame count ${run.frames.length}/${short.shortTestFrames}.`);
      }
      const bad = run.frames.find(item => item.suppliedPhases !== item.expectedPhases || (!item.nativeTrueResolution && item.sourceRenders !== 1));
      if (bad) throw new Error(`Invalid TRUE 3K frame feed at frame ${bad.index + 1}.`);

      run.status = 'passed';
      run.completedAt = new Date().toISOString();
      const first = run.frames[0] || {};
      setStatus(`TRUE 3K Short Test PASS — ${run.frames.length} frames, ${first.tileSize || '?'}px native tiles, ${first.expectedPhases || '?'} phases/frame, one real 3072 source/frame. Check downloaded WebP at native size.`);
      return true;
    } catch (error) {
      run.status = 'failed';
      run.completedAt = new Date().toISOString();
      run.error = error && error.message ? error.message : String(error);
      setStatus(`TRUE 3K repair failed: ${run.error}`, true);
      console.error('[HF Spinny TRUE 3K Repair]', error);
      return false;
    } finally {
      if (guard) {
        try { guard.restore(); } catch (_) {}
      }
      run.effectsRestored = CK.Effects.renderToCanvas === currentRenderToCanvas;
      busy = false;
      diagnostics.busy = false;
      button.textContent = 'TRUE 3K Test';
      refreshButton();
    }
  }

  function cancel() {
    const short = getShort();
    if (!busy || !short || typeof short.cancel !== 'function') return false;
    setStatus('Cancelling TRUE 3K Short Test after current frame…');
    return short.cancel();
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
#${BASE_PANEL_ID} .${BUTTON_CLASS}{border-color:#61a779}
#${BASE_PANEL_ID} .${BUTTON_CLASS}:hover:not(:disabled){background:#31503b}
#${BASE_PANEL_ID} .${STATUS_CLASS}{min-height:15px;margin-top:5px;color:#b9e7c6;font-size:11px;overflow-wrap:anywhere}
#${BASE_PANEL_ID} .${STATUS_CLASS}[data-error="1"]{color:#ff8a8a}
`;
    document.head.appendChild(style);
  }

  function refreshButton() {
    if (!button || busy) return;
    const cap = readCapabilities();
    button.disabled = !cap.ok;
    button.title = cap.ok
      ? 'Run the existing 16-frame Short Test with TRUE 3072 Effects-source phase repair.'
      : cap.reason;
  }

  function attach() {
    const panel = document.getElementById(BASE_PANEL_ID);
    const short = getShort();
    if (!panel || !short) return false;
    const actions = panel.querySelector('.hfc-actions');
    if (!actions) return false;
    ensureStyle();

    button = actions.querySelector(`.${BUTTON_CLASS}`);
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = BUTTON_CLASS;
      button.textContent = 'TRUE 3K Test';
      button.addEventListener('click', () => {
        if (busy) cancel();
        else runTrue3KShortTest();
      });
      actions.insertBefore(button, actions.querySelector('.hfc-cancel') || null);
    }

    statusEl = panel.querySelector(`.${STATUS_CLASS}`);
    if (!statusEl) {
      statusEl = document.createElement('div');
      statusEl.className = STATUS_CLASS;
      statusEl.dataset.error = '0';
      statusEl.textContent = 'TRUE 3K repair ready — select 3072px, then click TRUE 3K Test.';
      actions.insertAdjacentElement('afterend', statusEl);
    }
    refreshButton();
    return true;
  }

  function refreshAttachment() {
    if (!button || !button.isConnected || !statusEl || !statusEl.isConnected) attach();
    else refreshButton();
  }

  function dispose() {
    if (busy) return false;
    if (attachTimer !== null) clearInterval(attachTimer);
    attachTimer = null;
    if (button) button.remove();
    if (statusEl) statusEl.remove();
    const style = document.getElementById(STYLE_ID);
    if (style) style.remove();
    button = null;
    statusEl = null;
    if (window[GLOBAL] === api) delete window[GLOBAL];
    return true;
  }

  const api = {
    build: BUILD,
    targetSize: TARGET_SIZE,
    diagnostics,
    run: runTrue3KShortTest,
    cancel,
    get busy() { return busy; },
    get lastRun() { return lastRun; },
    attach,
    dispose
  };

  window[GLOBAL] = api;
  attach();
  attachTimer = window.setInterval(refreshAttachment, 1000);
})();