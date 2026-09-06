// ==UserScript==
// @name         HF Compatibility - Spinny WebP Short Test Companion
// @namespace    https://github.com/Knight-Witch/HeroForge.Compatibility
// @version      0.1.0
// @description  Diagnostic companion for the Spinny Mini WebP profile test. Captures a short contiguous partial arc at the selected resolution/speed so render fidelity can be checked without a full revolution.
// @author       Knight Witch
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        none
// @sandbox      raw
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

  const GLOBAL = 'HFSpinnyMiniWebPShortTest';
  const BASE_GLOBAL = 'HFSpinnyMiniWebPProfilesTest';
  const BASE_PANEL_ID = 'hfc-spinny-mini-webp-profiles-test';
  const BUTTON_CLASS = 'hfc-short-test';
  const STATUS_CLASS = 'hfc-short-test-status';
  const STYLE_ID = 'hfc-spinny-mini-webp-short-test-style';
  const BUILD = '0.1.0-short-test-16f-partial-arc';
  const SHORT_TEST_FRAMES = 16;
  const DEFAULT_QUALITY = 0.95;
  const LOOP_COUNT = 0;

  let busy = false;
  let cancelled = false;
  let button = null;
  let statusEl = null;
  let attachTimer = null;
  let controlLockTimer = null;
  let lastCapture = null;

  const diagnostics = {
    build: BUILD,
    busy: false,
    shortTestFrames: SHORT_TEST_FRAMES,
    lastCapture: null
  };

  function getBase() {
    const value = window[BASE_GLOBAL];
    return value && typeof value === 'object' ? value : null;
  }

  function getCK() { return window.CK || null; }
  function getBT() { return window.BT || null; }

  function nextFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }

  async function waitForOcclusion(display, maxFrames = 180) {
    const occlusion = display && display.sunOcclusion;
    if (!occlusion || typeof occlusion !== 'object' || !('isDone' in occlusion)) {
      await nextFrame();
      return;
    }
    for (let i = 0; i < maxFrames; i += 1) {
      const state = occlusion.isDone;
      if (state === undefined || state === null) {
        await nextFrame();
        return;
      }
      if (state) return;
      await nextFrame();
    }
    throw new Error('Timed out waiting for HeroForge occlusion refresh.');
  }

  function refreshScene(CK) {
    const displays = CK && CK.allDisplays;
    if (displays && typeof displays === 'object') {
      for (const display of Object.values(displays)) {
        if (!display) continue;
        try { if (typeof display.requestAnimationRefresh === 'function') display.requestAnimationRefresh(); } catch (_) {}
        try { if (typeof display.animation === 'function') display.animation(); } catch (_) {}
        try { if (display.sunOcclusion && typeof display.sunOcclusion.refresh === 'function') display.sunOcclusion.refresh(); } catch (_) {}
        try { if (display.sunOcclusion && typeof display.sunOcclusion.render === 'function') display.sunOcclusion.render(); } catch (_) {}
      }
    }
    try {
      if (CK && CK.renderManager && typeof CK.renderManager.requestShadowUpdate === 'function') {
        CK.renderManager.requestShadowUpdate();
      }
    } catch (_) {}
    try {
      if (CK && CK.scene && typeof CK.scene.updateMatrixWorld === 'function') CK.scene.updateMatrixWorld(true);
    } catch (_) {}
    try {
      if (CK && CK.GameLoop && typeof CK.GameLoop.requestRenderRefresh === 'function') CK.GameLoop.requestRenderRefresh();
    } catch (_) {}
  }

  function getSelectedSettings() {
    const base = getBase();
    const panel = document.getElementById(BASE_PANEL_ID);
    if (!base || !panel) throw new Error('Spinny Mini WebP Profiles TEST must be installed and visible first.');

    const resolutionSelect = panel.querySelector('.hfc-resolution');
    const speedSelect = panel.querySelector('.hfc-speed');
    if (!resolutionSelect || !speedSelect) throw new Error('Spinny profile selectors unavailable.');

    const resolution = base.resolutions && base.resolutions[resolutionSelect.value];
    const speed = base.speeds && base.speeds[speedSelect.value];
    if (!resolution || !speed) throw new Error('Selected Spinny profile metadata unavailable.');

    const size = Number(resolution.size);
    const fullFrames = Number(speed.frames);
    const frameDurationMs = Number(speed.frameDurationMs);
    if (!Number.isInteger(size) || size < 1) throw new Error('Invalid selected resolution.');
    if (!Number.isInteger(fullFrames) || fullFrames < SHORT_TEST_FRAMES) throw new Error('Invalid selected full-spin frame count.');
    if (!Number.isInteger(frameDurationMs) || frameDurationMs < 1) throw new Error('Invalid selected frame duration.');
    if (size === 4096 || size === 8192 || size > 3072) {
      throw new Error('Short Test intentionally refuses 4096/8192+ while the TRUE-resolution still provider owns those sizes.');
    }

    const quality = Number(base.diagnostics && base.diagnostics.selectedProfile && base.diagnostics.selectedProfile.quality);
    const angularStepRad = (2 * Math.PI) / fullFrames;
    const angularStepDeg = 360 / fullFrames;
    const arcDegrees = angularStepDeg * (SHORT_TEST_FRAMES - 1);

    return {
      resolutionId: String(resolution.id),
      resolutionLabel: String(resolution.label || `${size}px`),
      speedId: String(speed.id),
      speedLabel: String(speed.label || speed.id),
      size,
      fullFrames,
      frameDurationMs,
      quality: Number.isFinite(quality) ? quality : DEFAULT_QUALITY,
      frames: SHORT_TEST_FRAMES,
      durationMs: SHORT_TEST_FRAMES * frameDurationMs,
      angularStepRad,
      angularStepDeg,
      arcDegrees,
      loopCount: LOOP_COUNT
    };
  }

  function readCapabilities() {
    const base = getBase();
    if (!base) return { ok: false, reason: 'Install/enable Spinny Mini WebP Profiles TEST first.' };
    if (base.busy) return { ok: false, reason: 'Full Spinny capture is currently active.' };
    const CK = getCK();
    const BT = getBT();
    if (!CK) return { ok: false, reason: 'CK unavailable', CK, BT };
    if (!BT || !BT.maker || BT.maker.enabled !== true) return { ok: false, reason: 'Open Photo Booth first', CK, BT };
    if (typeof BT.maker.takeScreenshot !== 'function') return { ok: false, reason: 'BT.maker.takeScreenshot unavailable', CK, BT };
    const display = CK.character && CK.character.display;
    if (!display || !display.rotation || !Number.isFinite(Number(display.rotation.y))) {
      return { ok: false, reason: 'Character display rotation unavailable', CK, BT };
    }
    if (typeof HTMLCanvasElement === 'undefined' || typeof HTMLCanvasElement.prototype.toBlob !== 'function') {
      return { ok: false, reason: 'Canvas WebP encoder unavailable', CK, BT };
    }
    return { ok: true, reason: 'Ready', CK, BT, display };
  }

  function setStatus(text, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.dataset.error = isError ? '1' : '0';
  }

  function getBaseControls() {
    const panel = document.getElementById(BASE_PANEL_ID);
    if (!panel) return [];
    return [
      panel.querySelector('.hfc-capture'),
      panel.querySelector('.hfc-cancel'),
      panel.querySelector('.hfc-resolution'),
      panel.querySelector('.hfc-speed')
    ].filter(Boolean);
  }

  function lockBaseControls() {
    if (!busy) return;
    for (const control of getBaseControls()) control.disabled = true;
    if (button) {
      button.disabled = false;
      button.textContent = 'Cancel Test';
      button.title = 'Cancel the short test after the current frame finishes.';
    }
  }

  function startControlLock() {
    stopControlLock();
    lockBaseControls();
    controlLockTimer = window.setInterval(lockBaseControls, 200);
  }

  function stopControlLock() {
    if (controlLockTimer !== null) {
      clearInterval(controlLockTimer);
      controlLockTimer = null;
    }
  }

  function restoreBaseControls() {
    stopControlLock();
    const base = getBase();
    try { if (base && typeof base.refresh === 'function') base.refresh(); } catch (_) {}
    if (button) {
      button.disabled = false;
      button.textContent = 'Short Test';
      button.title = `${SHORT_TEST_FRAMES}-frame partial-spin diagnostic using the selected profile's normal angular spacing.`;
    }
  }

  function canvasToWebP(canvas, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Canvas WebP encoding returned no Blob.'));
          if (blob.type && blob.type !== 'image/webp') return reject(new Error(`Browser returned ${blob.type} instead of image/webp.`));
          resolve(blob);
        },
        'image/webp',
        quality
      );
    });
  }

  function ascii4(text) {
    return new Uint8Array([text.charCodeAt(0), text.charCodeAt(1), text.charCodeAt(2), text.charCodeAt(3)]);
  }

  function writeU16LE(target, offset, value) {
    target[offset] = value & 0xff;
    target[offset + 1] = (value >>> 8) & 0xff;
  }

  function writeU24LE(target, offset, value) {
    target[offset] = value & 0xff;
    target[offset + 1] = (value >>> 8) & 0xff;
    target[offset + 2] = (value >>> 16) & 0xff;
  }

  function writeU32LE(target, offset, value) {
    target[offset] = value & 0xff;
    target[offset + 1] = (value >>> 8) & 0xff;
    target[offset + 2] = (value >>> 16) & 0xff;
    target[offset + 3] = (value >>> 24) & 0xff;
  }

  function readU16LE(source, offset) {
    return source[offset] | (source[offset + 1] << 8);
  }

  function readU24LE(source, offset) {
    return source[offset] | (source[offset + 1] << 8) | (source[offset + 2] << 16);
  }

  function readU32LE(source, offset) {
    return (source[offset] | (source[offset + 1] << 8) | (source[offset + 2] << 16) | (source[offset + 3] << 24)) >>> 0;
  }

  function readFourCC(source, offset) {
    return String.fromCharCode(source[offset], source[offset + 1], source[offset + 2], source[offset + 3]);
  }

  function makeChunk(fourCC, payload) {
    const pad = payload.length & 1;
    const out = new Uint8Array(8 + payload.length + pad);
    out.set(ascii4(fourCC), 0);
    writeU32LE(out, 4, payload.length);
    out.set(payload, 8);
    return out;
  }

  function concatBytes(parts) {
    const total = parts.reduce((sum, part) => sum + part.length, 0);
    const out = new Uint8Array(total);
    let offset = 0;
    for (const part of parts) {
      out.set(part, offset);
      offset += part.length;
    }
    return out;
  }

  function losslessChunkHasAlpha(chunkData) {
    if (chunkData.length < 5 || chunkData[0] !== 0x2f) return false;
    const bits = (chunkData[1] | (chunkData[2] << 8) | (chunkData[3] << 16) | (chunkData[4] << 24)) >>> 0;
    return ((bits >>> 28) & 1) === 1;
  }

  async function extractStillWebPFrame(blob) {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    if (bytes.length < 20 || readFourCC(bytes, 0) !== 'RIFF' || readFourCC(bytes, 8) !== 'WEBP') {
      throw new Error('Browser WebP encoder returned an invalid RIFF/WebP frame.');
    }
    const imageChunks = [];
    let hasAlpha = false;
    let imageChunkCount = 0;
    let offset = 12;
    while (offset + 8 <= bytes.length) {
      const fourCC = readFourCC(bytes, offset);
      const size = readU32LE(bytes, offset + 4);
      const dataOffset = offset + 8;
      const end = dataOffset + size;
      if (end > bytes.length) throw new Error(`Malformed static WebP ${fourCC} chunk.`);
      if (fourCC === 'VP8X' && size >= 1) {
        hasAlpha = hasAlpha || ((bytes[dataOffset] & 0x10) !== 0);
      } else if (fourCC === 'ALPH') {
        hasAlpha = true;
        imageChunks.push(bytes.slice(offset, end + (size & 1)));
      } else if (fourCC === 'VP8 ' || fourCC === 'VP8L') {
        if (fourCC === 'VP8L') hasAlpha = hasAlpha || losslessChunkHasAlpha(bytes.subarray(dataOffset, end));
        imageChunkCount += 1;
        imageChunks.push(bytes.slice(offset, end + (size & 1)));
      }
      offset = end + (size & 1);
    }
    if (imageChunkCount !== 1) throw new Error(`Expected one WebP image payload chunk; found ${imageChunkCount}.`);
    return { chunks: imageChunks, hasAlpha, encodedBytes: blob.size };
  }

  function makeVP8X(width, height, hasAlpha) {
    const payload = new Uint8Array(10);
    payload[0] = 0x02 | (hasAlpha ? 0x10 : 0x00);
    writeU24LE(payload, 4, width - 1);
    writeU24LE(payload, 7, height - 1);
    return makeChunk('VP8X', payload);
  }

  function makeANIM(loopCount) {
    const payload = new Uint8Array(6);
    writeU32LE(payload, 0, 0xffffffff);
    writeU16LE(payload, 4, loopCount);
    return makeChunk('ANIM', payload);
  }

  function makeANMF(width, height, durationMs, frameChunks) {
    const header = new Uint8Array(16);
    writeU24LE(header, 0, 0);
    writeU24LE(header, 3, 0);
    writeU24LE(header, 6, width - 1);
    writeU24LE(header, 9, height - 1);
    writeU24LE(header, 12, durationMs);
    header[15] = 0x02;
    return makeChunk('ANMF', concatBytes([header, ...frameChunks]));
  }

  function makeAnimatedWebP(width, height, durationMs, loopCount, frames) {
    const hasAlpha = frames.some((frame) => frame.hasAlpha);
    const chunks = [makeVP8X(width, height, hasAlpha), makeANIM(loopCount)];
    for (const frame of frames) chunks.push(makeANMF(width, height, durationMs, frame.chunks));
    const body = concatBytes([ascii4('WEBP'), ...chunks]);
    const out = new Uint8Array(8 + body.length);
    out.set(ascii4('RIFF'), 0);
    writeU32LE(out, 4, body.length);
    out.set(body, 8);
    return new Blob([out], { type: 'image/webp' });
  }

  function parseAnimatedWebPMetrics(bytes) {
    const result = { width: null, height: null, loopCount: null, frameCount: 0, totalDurationMs: 0, durations: {} };
    let offset = 12;
    while (offset + 8 <= bytes.length) {
      const fourCC = readFourCC(bytes, offset);
      const size = readU32LE(bytes, offset + 4);
      const dataOffset = offset + 8;
      const end = dataOffset + size;
      if (end > bytes.length) break;
      if (fourCC === 'VP8X' && size >= 10) {
        result.width = 1 + readU24LE(bytes, dataOffset + 4);
        result.height = 1 + readU24LE(bytes, dataOffset + 7);
      } else if (fourCC === 'ANIM' && size >= 6) {
        result.loopCount = readU16LE(bytes, dataOffset + 4);
      } else if (fourCC === 'ANMF' && size >= 16) {
        const duration = readU24LE(bytes, dataOffset + 12);
        result.frameCount += 1;
        result.totalDurationMs += duration;
        result.durations[duration] = (result.durations[duration] || 0) + 1;
      }
      offset = end + (size & 1);
    }
    return result;
  }

  function validateOutput(parsed, profile) {
    if (parsed.width !== profile.size || parsed.height !== profile.size) {
      throw new Error(`Mux verification dimensions failed: ${parsed.width}x${parsed.height}.`);
    }
    if (parsed.frameCount !== profile.frames) {
      throw new Error(`Mux verification frame count failed: ${parsed.frameCount}/${profile.frames}.`);
    }
    if (parsed.totalDurationMs !== profile.durationMs) {
      throw new Error(`Mux verification duration failed: ${parsed.totalDurationMs}/${profile.durationMs} ms.`);
    }
    if (parsed.loopCount !== profile.loopCount) {
      throw new Error(`Mux verification loop count failed: ${parsed.loopCount}/${profile.loopCount}.`);
    }
    const keys = Object.keys(parsed.durations);
    if (keys.length !== 1 || Number(keys[0]) !== profile.frameDurationMs || parsed.durations[keys[0]] !== profile.frames) {
      throw new Error(`Mux verification frame timing failed: ${JSON.stringify(parsed.durations)}.`);
    }
  }

  function downloadBlob(blob, profile) {
    const url = URL.createObjectURL(blob);
    const CK = getCK();
    const name = (CK && CK.data && CK.data.meta && CK.data.meta.character_name) || 'Hero';
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${name}_Spinny_SHORT_TEST_${profile.size}px_${profile.speedId}_${profile.frames}f_${stamp}.webp`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  async function captureShortTest() {
    if (busy) return false;
    const capability = readCapabilities();
    if (!capability.ok) {
      setStatus(capability.reason, true);
      return false;
    }

    let profile;
    try {
      profile = getSelectedSettings();
    } catch (error) {
      setStatus(error && error.message ? error.message : String(error), true);
      return false;
    }

    const { CK, BT, display } = capability;
    const baseRotation = Number(display.rotation.y);
    const frames = [];
    const returnedCanvasSizes = {};
    let encodedFrameBytes = 0;
    let outputBlob = null;

    busy = true;
    cancelled = false;
    diagnostics.busy = true;
    startControlLock();

    lastCapture = {
      build: BUILD,
      mode: 'short-test',
      status: 'running',
      startedAt: new Date().toISOString(),
      completedAt: null,
      requested: { ...profile },
      baseRotation,
      framesRendered: 0,
      framesEncoded: 0,
      returnedCanvasSizes,
      encodedFrameBytes: 0,
      outputBytes: null,
      parsed: null,
      elapsedMs: null,
      rotationRestored: false,
      error: null
    };
    diagnostics.lastCapture = lastCapture;
    const startedPerf = performance.now();

    try {
      for (let index = 0; index < profile.frames; index += 1) {
        if (cancelled) throw new Error('Short Test cancelled.');
        display.rotation.y = baseRotation + profile.angularStepRad * index;
        refreshScene(CK);
        await waitForOcclusion(display);
        await nextFrame();
        lockBaseControls();

        setStatus(`Short Test: rendering ${index + 1}/${profile.frames} at ${profile.size}px…`);
        const canvas = BT.maker.takeScreenshot(profile.size, profile.size);
        if (!canvas || typeof canvas.toBlob !== 'function') throw new Error('BT.maker.takeScreenshot did not return an encodable canvas.');
        const sizeKey = `${canvas.width}x${canvas.height}`;
        returnedCanvasSizes[sizeKey] = (returnedCanvasSizes[sizeKey] || 0) + 1;
        if (canvas.width !== profile.size || canvas.height !== profile.size) {
          throw new Error(`HeroForge returned ${canvas.width}x${canvas.height}; expected ${profile.size}x${profile.size}.`);
        }
        lastCapture.framesRendered = index + 1;

        setStatus(`Short Test: encoding ${index + 1}/${profile.frames} at ${profile.size}px…`);
        const stillBlob = await canvasToWebP(canvas, profile.quality);
        const frame = await extractStillWebPFrame(stillBlob);
        encodedFrameBytes += frame.encodedBytes;
        frames.push(frame);
        lastCapture.framesEncoded = index + 1;
        lastCapture.encodedFrameBytes = encodedFrameBytes;

        canvas.width = 1;
        canvas.height = 1;
        if ((index + 1) % 4 === 0) await nextFrame();
      }

      if (cancelled) throw new Error('Short Test cancelled.');
      setStatus('Short Test: assembling partial WebP…');
      outputBlob = makeAnimatedWebP(profile.size, profile.size, profile.frameDurationMs, profile.loopCount, frames);
      const bytes = new Uint8Array(await outputBlob.arrayBuffer());
      const parsed = parseAnimatedWebPMetrics(bytes);
      validateOutput(parsed, profile);
      lastCapture.outputBytes = outputBlob.size;
      lastCapture.parsed = parsed;

      downloadBlob(outputBlob, profile);
      lastCapture.status = 'downloaded';
      lastCapture.completedAt = new Date().toISOString();
      lastCapture.elapsedMs = performance.now() - startedPerf;
      setStatus(`Short Test downloaded: ${profile.size}px · ${profile.frames} frames · ${profile.arcDegrees.toFixed(1)}° arc · ${(outputBlob.size / 1048576).toFixed(1)} MiB`);
      return true;
    } catch (error) {
      const message = error && error.message ? error.message : String(error);
      lastCapture.status = cancelled ? 'cancelled' : 'failed';
      lastCapture.completedAt = new Date().toISOString();
      lastCapture.elapsedMs = performance.now() - startedPerf;
      lastCapture.error = message;
      setStatus(message, !cancelled);
      console.error('[HF Spinny WebP Short Test]', error);
      return false;
    } finally {
      try {
        display.rotation.y = baseRotation;
        refreshScene(CK);
        await nextFrame();
        lastCapture.rotationRestored = Math.abs(Number(display.rotation.y) - baseRotation) < 1e-8;
      } catch (_) {}
      frames.length = 0;
      outputBlob = null;
      busy = false;
      cancelled = false;
      diagnostics.busy = false;
      restoreBaseControls();
    }
  }

  function cancelShortTest() {
    if (!busy) return false;
    cancelled = true;
    setStatus('Cancelling Short Test after current frame…');
    return true;
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
#${BASE_PANEL_ID} .${STATUS_CLASS}{min-height:15px;margin-top:5px;opacity:.82;font-size:11px;overflow-wrap:anywhere}
#${BASE_PANEL_ID} .${STATUS_CLASS}[data-error="1"]{color:#ff8a8a;opacity:1}
#${BASE_PANEL_ID} .${BUTTON_CLASS}{border-color:#7862a8}
#${BASE_PANEL_ID} .${BUTTON_CLASS}:hover:not(:disabled){background:#403653}
`;
    document.head.appendChild(style);
  }

  function attach() {
    const base = getBase();
    const panel = document.getElementById(BASE_PANEL_ID);
    if (!base || !panel) return false;
    const actions = panel.querySelector('.hfc-actions');
    if (!actions) return false;

    ensureStyle();
    button = actions.querySelector(`.${BUTTON_CLASS}`);
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = BUTTON_CLASS;
      button.textContent = 'Short Test';
      button.title = `${SHORT_TEST_FRAMES}-frame partial-spin diagnostic using the selected profile's normal angular spacing.`;
      button.addEventListener('click', () => {
        if (busy) cancelShortTest();
        else captureShortTest();
      });
      actions.insertBefore(button, actions.querySelector('.hfc-cancel') || null);
    }

    statusEl = panel.querySelector(`.${STATUS_CLASS}`);
    if (!statusEl) {
      statusEl = document.createElement('div');
      statusEl.className = STATUS_CLASS;
      statusEl.dataset.error = '0';
      statusEl.textContent = `Short Test ready — ${SHORT_TEST_FRAMES} contiguous frames, normal angular spacing.`;
      actions.insertAdjacentElement('afterend', statusEl);
    }
    return true;
  }

  function refreshAttachment() {
    if (button && button.isConnected && statusEl && statusEl.isConnected) {
      if (busy) lockBaseControls();
      return;
    }
    attach();
  }

  function dispose() {
    if (busy) return false;
    if (attachTimer !== null) {
      clearInterval(attachTimer);
      attachTimer = null;
    }
    stopControlLock();
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
    shortTestFrames: SHORT_TEST_FRAMES,
    diagnostics,
    capture: captureShortTest,
    cancel: cancelShortTest,
    get busy() { return busy; },
    get lastCapture() { return lastCapture; },
    attach,
    dispose
  };

  window[GLOBAL] = api;
  attach();
  attachTimer = window.setInterval(refreshAttachment, 1000);
})();
