// ==UserScript==
// @name         HF Compatibility - Spinny Mini WebP HQ TEST
// @namespace    https://github.com/Knight-Witch/HeroForge.Compatibility
// @version      0.1.0
// @description  Standalone 1024px / 250-frame animated WebP Spinny Mini parity test.
// @author       Knight Witch
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        none
// @sandbox      raw
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

  const GLOBAL = 'HFSpinnyMiniWebPHQTest';
  const PANEL_ID = 'hfc-spinny-mini-webp-hq-test';
  const STYLE_ID = `${PANEL_ID}-style`;
  const BUILD = '0.1.0-runtime-rotation-webp-mux';

  const PARITY = Object.freeze({
    size: 1024,
    frames: 250,
    frameDurationMs: 40,
    quality: 0.95,
    loopCount: 0
  });

  let busy = false;
  let cancelled = false;
  let panel = null;
  let statusEl = null;
  let capabilityEl = null;
  let button = null;
  let cancelButton = null;
  let refreshTimer = null;
  let lastCapture = null;

  function getCK() { return window.CK || null; }
  function getBT() { return window.BT || null; }

  function readCapabilities() {
    const CK = getCK();
    const BT = getBT();
    if (!CK) return { ok: false, reason: 'CK unavailable', CK, BT };
    if (!BT || !BT.maker || BT.maker.enabled !== true) {
      return { ok: false, reason: 'Open Photo Booth first', CK, BT };
    }
    if (typeof BT.maker.takeScreenshot !== 'function') {
      return { ok: false, reason: 'BT.maker.takeScreenshot unavailable', CK, BT };
    }
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

  function setProgress(frameIndex, frameCount, phase = 'render') {
    const done = Math.max(0, Math.min(frameCount, frameIndex));
    const percent = Math.round((done / frameCount) * 100);
    const label = phase === 'encode' ? 'Encoding' : phase === 'mux' ? 'Assembling' : 'Rendering';
    setStatus(`${label}: ${done}/${frameCount} (${percent}%)`);
  }

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
      if (CK.renderManager && typeof CK.renderManager.requestShadowUpdate === 'function') {
        CK.renderManager.requestShadowUpdate();
      }
    } catch (_) {}
    try {
      if (CK.scene && typeof CK.scene.updateMatrixWorld === 'function') CK.scene.updateMatrixWorld(true);
    } catch (_) {}
    try {
      if (CK.GameLoop && typeof CK.GameLoop.requestRenderRefresh === 'function') CK.GameLoop.requestRenderRefresh();
    } catch (_) {}
  }

  function canvasToWebP(canvas, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Canvas WebP encoding returned no Blob.'));
          if (blob.type && blob.type !== 'image/webp') {
            return reject(new Error(`Browser returned ${blob.type} instead of image/webp.`));
          }
          resolve(blob);
        },
        'image/webp',
        quality
      );
    });
  }

  function ascii4(text) {
    return new Uint8Array([
      text.charCodeAt(0), text.charCodeAt(1), text.charCodeAt(2), text.charCodeAt(3)
    ]);
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

  function readU32LE(source, offset) {
    return (
      source[offset]
      | (source[offset + 1] << 8)
      | (source[offset + 2] << 16)
      | (source[offset + 3] << 24)
    ) >>> 0;
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
    const bits = (
      chunkData[1]
      | (chunkData[2] << 8)
      | (chunkData[3] << 16)
      | (chunkData[4] << 24)
    ) >>> 0;
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

    if (imageChunkCount !== 1) {
      throw new Error(`Expected one WebP image payload chunk; found ${imageChunkCount}.`);
    }

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
    const payload = concatBytes([header, ...frameChunks]);
    return makeChunk('ANMF', payload);
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

  function parseAnimatedWebPMetrics(blobBytes) {
    const bytes = blobBytes;
    const result = { width: null, height: null, frameCount: 0, totalDurationMs: 0, durations: {} };
    let offset = 12;
    while (offset + 8 <= bytes.length) {
      const fourCC = readFourCC(bytes, offset);
      const size = readU32LE(bytes, offset + 4);
      const dataOffset = offset + 8;
      const end = dataOffset + size;
      if (end > bytes.length) break;
      if (fourCC === 'VP8X' && size >= 10) {
        result.width = 1 + bytes[dataOffset + 4] + (bytes[dataOffset + 5] << 8) + (bytes[dataOffset + 6] << 16);
        result.height = 1 + bytes[dataOffset + 7] + (bytes[dataOffset + 8] << 8) + (bytes[dataOffset + 9] << 16);
      } else if (fourCC === 'ANMF' && size >= 16) {
        const duration = bytes[dataOffset + 12] + (bytes[dataOffset + 13] << 8) + (bytes[dataOffset + 14] << 16);
        result.frameCount += 1;
        result.totalDurationMs += duration;
        result.durations[duration] = (result.durations[duration] || 0) + 1;
      }
      offset = end + (size & 1);
    }
    return result;
  }

  function downloadBlob(blob) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const name = (getCK() && getCK().data && getCK().data.meta && getCK().data.meta.character_name) || 'Hero';
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    anchor.href = url;
    anchor.download = `${name}_HQ_Spinny_1024px_250f_${stamp}.webp`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  async function captureParity() {
    if (busy) return false;
    const capability = readCapabilities();
    if (!capability.ok) {
      setStatus(capability.reason, true);
      refresh();
      return false;
    }

    const { CK, BT, display } = capability;
    const baseRotation = Number(display.rotation.y);
    const encodedFrames = [];
    let encodedBytes = 0;
    let outputBlob = null;

    busy = true;
    cancelled = false;
    refresh();

    lastCapture = {
      build: BUILD,
      status: 'running',
      startedAt: new Date().toISOString(),
      completedAt: null,
      requested: { ...PARITY },
      baseRotation,
      framesRendered: 0,
      framesEncoded: 0,
      encodedFrameBytes: 0,
      outputBytes: null,
      parsed: null,
      rotationRestored: false,
      error: null
    };

    try {
      for (let index = 0; index < PARITY.frames; index += 1) {
        if (cancelled) throw new Error('Capture cancelled.');

        display.rotation.y = baseRotation + (2 * Math.PI * index / PARITY.frames);
        refreshScene(CK);
        await waitForOcclusion(display);
        await nextFrame();

        setProgress(index, PARITY.frames, 'render');
        const canvas = BT.maker.takeScreenshot(PARITY.size, PARITY.size);
        if (!canvas || typeof canvas.toBlob !== 'function') {
          throw new Error('BT.maker.takeScreenshot did not return an encodable canvas.');
        }
        if (canvas.width !== PARITY.size || canvas.height !== PARITY.size) {
          throw new Error(`HeroForge returned ${canvas.width}x${canvas.height}; expected ${PARITY.size}x${PARITY.size}.`);
        }
        lastCapture.framesRendered = index + 1;

        setProgress(index, PARITY.frames, 'encode');
        const stillBlob = await canvasToWebP(canvas, PARITY.quality);
        const frame = await extractStillWebPFrame(stillBlob);
        encodedBytes += frame.encodedBytes;
        encodedFrames.push(frame);
        lastCapture.framesEncoded = index + 1;
        lastCapture.encodedFrameBytes = encodedBytes;

        canvas.width = 1;
        canvas.height = 1;

        setProgress(index + 1, PARITY.frames, 'render');
        if ((index + 1) % 5 === 0) await nextFrame();
      }

      if (cancelled) throw new Error('Capture cancelled.');
      setProgress(PARITY.frames, PARITY.frames, 'mux');
      outputBlob = makeAnimatedWebP(
        PARITY.size,
        PARITY.size,
        PARITY.frameDurationMs,
        PARITY.loopCount,
        encodedFrames
      );

      const outputBytes = new Uint8Array(await outputBlob.arrayBuffer());
      const parsed = parseAnimatedWebPMetrics(outputBytes);
      lastCapture.outputBytes = outputBlob.size;
      lastCapture.parsed = parsed;

      if (parsed.width !== PARITY.size || parsed.height !== PARITY.size) {
        throw new Error(`Mux verification dimensions failed: ${parsed.width}x${parsed.height}.`);
      }
      if (parsed.frameCount !== PARITY.frames) {
        throw new Error(`Mux verification frame count failed: ${parsed.frameCount}/${PARITY.frames}.`);
      }
      if (parsed.totalDurationMs !== PARITY.frames * PARITY.frameDurationMs) {
        throw new Error(`Mux verification duration failed: ${parsed.totalDurationMs} ms.`);
      }

      downloadBlob(outputBlob);
      lastCapture.status = 'downloaded';
      lastCapture.completedAt = new Date().toISOString();
      setStatus(`Downloaded 1024px WebP: ${PARITY.frames} frames / 10.0 s / ${(outputBlob.size / 1048576).toFixed(1)} MiB`);
      return true;
    } catch (error) {
      const message = error && error.message ? error.message : String(error);
      if (lastCapture) {
        lastCapture.status = cancelled ? 'cancelled' : 'failed';
        lastCapture.completedAt = new Date().toISOString();
        lastCapture.error = message;
      }
      setStatus(message, !cancelled);
      console.error('[HF Spinny Mini WebP HQ TEST]', error);
      return false;
    } finally {
      try {
        display.rotation.y = baseRotation;
        refreshScene(CK);
        await nextFrame();
        if (lastCapture) lastCapture.rotationRestored = Math.abs(Number(display.rotation.y) - baseRotation) < 1e-8;
      } catch (_) {}
      encodedFrames.length = 0;
      outputBlob = null;
      busy = false;
      cancelled = false;
      refresh();
    }
  }

  function cancelCapture() {
    if (!busy) return false;
    cancelled = true;
    setStatus('Cancelling after current frame…');
    refresh();
    return true;
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
#${PANEL_ID}{position:fixed;left:12px;bottom:12px;z-index:2147483646;width:310px;padding:10px;border:1px solid #555;border-radius:8px;background:rgba(18,18,20,.95);color:#eee;font:12px/1.35 Arial,sans-serif;box-shadow:0 5px 18px rgba(0,0,0,.45)}
#${PANEL_ID} .hfc-title{font-size:13px;font-weight:700;margin-bottom:6px}
#${PANEL_ID} .hfc-cap{opacity:.78;margin-bottom:7px}
#${PANEL_ID} .hfc-status{min-height:30px;margin-top:7px;overflow-wrap:anywhere}
#${PANEL_ID} .hfc-status[data-error="1"]{color:#ff8a8a}
#${PANEL_ID} .hfc-actions{display:flex;gap:6px}
#${PANEL_ID} button{flex:1;border:1px solid #666;border-radius:5px;padding:7px 8px;background:#29292d;color:#fff;cursor:pointer}
#${PANEL_ID} button:hover:not(:disabled){background:#36363b}
#${PANEL_ID} button:disabled{opacity:.42;cursor:not-allowed}
#${PANEL_ID} .hfc-meta{opacity:.7;margin-top:7px;font-size:11px}
`;
    document.head.appendChild(style);
  }

  function ensurePanel() {
    if (panel && panel.isConnected) return panel;
    ensureStyle();
    panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="hfc-title">Spinny Mini WebP HQ TEST</div>
      <div class="hfc-cap"></div>
      <div class="hfc-actions">
        <button type="button" class="hfc-capture">Capture 1024 HQ WebP</button>
        <button type="button" class="hfc-cancel">Cancel</button>
      </div>
      <div class="hfc-status" data-error="0">Waiting for Photo Booth…</div>
      <div class="hfc-meta">Parity target: 1024px · 250 frames · 25 FPS · 10.0 s</div>
    `;
    document.body.appendChild(panel);
    capabilityEl = panel.querySelector('.hfc-cap');
    statusEl = panel.querySelector('.hfc-status');
    button = panel.querySelector('.hfc-capture');
    cancelButton = panel.querySelector('.hfc-cancel');
    button.addEventListener('click', () => { captureParity(); });
    cancelButton.addEventListener('click', cancelCapture);
    return panel;
  }

  function refresh() {
    ensurePanel();
    const capability = readCapabilities();
    if (capabilityEl) capabilityEl.textContent = capability.ok ? 'Photo Booth capture capability ready' : capability.reason;
    if (button) button.disabled = busy || !capability.ok;
    if (cancelButton) cancelButton.disabled = !busy;
  }

  function dispose() {
    if (busy) return false;
    if (refreshTimer !== null) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
    if (panel) panel.remove();
    panel = null;
    const style = document.getElementById(STYLE_ID);
    if (style) style.remove();
    if (window[GLOBAL] === api) delete window[GLOBAL];
    return true;
  }

  const api = {
    build: BUILD,
    parity: PARITY,
    capture: captureParity,
    cancel: cancelCapture,
    get busy() { return busy; },
    get lastCapture() { return lastCapture; },
    refresh,
    dispose
  };

  window[GLOBAL] = api;
  ensurePanel();
  refresh();
  refreshTimer = window.setInterval(refresh, 1000);
})();
