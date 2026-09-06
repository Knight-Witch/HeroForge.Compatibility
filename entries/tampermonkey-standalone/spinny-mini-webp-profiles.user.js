// ==UserScript==
// @name         HF Compatibility - Spinny Mini WebP Profiles TEST
// @namespace    https://github.com/Knight-Witch/HeroForge.Compatibility
// @version      0.2.1
// @description  Standalone configurable-resolution / configurable-speed animated WebP Spinny Mini test with progress and device-relative ETA.
// @author       Knight Witch
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        none
// @sandbox      raw
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

  const GLOBAL = 'HFSpinnyMiniWebPProfilesTest';
  const PANEL_ID = 'hfc-spinny-mini-webp-profiles-test';
  const STYLE_ID = `${PANEL_ID}-style`;
  const BUILD = '0.2.1-progress-eta-runtime-rotation-webp-mux';

  const QUALITY = 0.95;
  const LOOP_COUNT = 0;
  const ETA_MIN_SAMPLES = 5;
  const ETA_EMA_ALPHA = 0.18;
  const RESOLUTIONS = Object.freeze({
    '1024': Object.freeze({ id: '1024', label: '1024px — HQ parity', size: 1024 }),
    '2048': Object.freeze({ id: '2048', label: '2048px — experimental', size: 2048 })
  });
  const SPEEDS = Object.freeze({
    standard: Object.freeze({ id: 'standard', label: 'Standard', durationMs: 10000, frames: 250, frameDurationMs: 40 }),
    slow: Object.freeze({ id: 'slow', label: 'Slow', durationMs: 15000, frames: 375, frameDurationMs: 40 }),
    slower: Object.freeze({ id: 'slower', label: 'Slower', durationMs: 20000, frames: 500, frameDurationMs: 40 }),
    verySlow: Object.freeze({ id: 'verySlow', label: 'Very Slow', durationMs: 30000, frames: 750, frameDurationMs: 40 })
  });
  const VALIDATED_BASELINE_PIXEL_SAMPLES = 1024 * 1024 * 250;

  let busy = false;
  let cancelled = false;
  let panel = null;
  let statusEl = null;
  let capabilityEl = null;
  let metaEl = null;
  let progressTrackEl = null;
  let progressFillEl = null;
  let timingEl = null;
  let button = null;
  let cancelButton = null;
  let resolutionSelect = null;
  let speedSelect = null;
  let refreshTimer = null;
  let lastCapture = null;
  let activeTiming = null;

  // Intentionally session-only: do not persist timing across reloads or figures.
  const timingHistory = {};

  const diagnostics = {
    build: BUILD,
    busy: false,
    selectedProfile: null,
    activeTiming: null,
    timingHistory,
    lastCapture: null
  };

  function getCK() { return window.CK || null; }
  function getBT() { return window.BT || null; }

  function getSelectedProfile() {
    const resolutionId = resolutionSelect ? resolutionSelect.value : '1024';
    const speedId = speedSelect ? speedSelect.value : 'standard';
    const resolution = RESOLUTIONS[resolutionId] || RESOLUTIONS['1024'];
    const speed = SPEEDS[speedId] || SPEEDS.standard;
    const profile = {
      resolutionId: resolution.id,
      resolutionLabel: resolution.label,
      speedId: speed.id,
      speedLabel: speed.label,
      size: resolution.size,
      frames: speed.frames,
      frameDurationMs: speed.frameDurationMs,
      durationMs: speed.durationMs,
      fps: 1000 / speed.frameDurationMs,
      quality: QUALITY,
      loopCount: LOOP_COUNT
    };
    profile.pixelSamples = profile.size * profile.size * profile.frames;
    profile.workloadMultiplier = profile.pixelSamples / VALIDATED_BASELINE_PIXEL_SAMPLES;
    return profile;
  }

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

  function setProgressBar(fraction) {
    const clamped = Math.max(0, Math.min(1, Number(fraction) || 0));
    const percent = clamped * 100;
    if (progressFillEl) progressFillEl.style.width = `${percent.toFixed(1)}%`;
    if (progressTrackEl) progressTrackEl.setAttribute('aria-valuenow', String(Math.round(percent)));
  }

  function setProgress(frameIndex, frameCount, phase = 'render', phaseFraction = 0) {
    const done = Math.max(0, Math.min(frameCount, Number(frameIndex) || 0));
    const progressUnits = Math.max(0, Math.min(frameCount, done + phaseFraction));
    const percent = Math.round((progressUnits / frameCount) * 100);
    const label = phase === 'encode' ? 'Encoding' : phase === 'mux' ? 'Assembling' : 'Rendering';
    setStatus(`${label}: ${Math.floor(done)}/${frameCount} (${percent}%)`);
    setProgressBar(progressUnits / frameCount);
  }

  function formatDuration(ms) {
    if (!Number.isFinite(ms) || ms < 0) return '—';
    const totalSeconds = Math.max(0, Math.round(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    if (minutes > 0) return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
    return `${seconds}s`;
  }

  function createTimingState(profile) {
    const history = timingHistory[String(profile.size)] || null;
    const initialFrameMs = history && Number.isFinite(history.frameMs) ? history.frameMs : null;
    const tailEstimateMs = history && Number.isFinite(history.tailMs) ? history.tailMs : 0;
    return {
      startedPerfMs: performance.now(),
      frameLoopCompletedPerfMs: null,
      completedFrames: 0,
      sampleTotalMs: 0,
      sampleAverageFrameMs: null,
      emaFrameMs: initialFrameMs,
      predictedFrameMs: initialFrameMs,
      tailEstimateMs,
      estimatedTotalMs: initialFrameMs === null ? null : initialFrameMs * profile.frames + tailEstimateMs,
      estimateSource: initialFrameMs === null ? 'warming-up' : 'same-session-resolution-history',
      lastSampleMs: null
    };
  }

  function updateTimingAfterFrame(profile, sampleMs) {
    if (!activeTiming || !Number.isFinite(sampleMs) || sampleMs < 0) return;
    activeTiming.completedFrames += 1;
    activeTiming.sampleTotalMs += sampleMs;
    activeTiming.lastSampleMs = sampleMs;
    activeTiming.sampleAverageFrameMs = activeTiming.sampleTotalMs / activeTiming.completedFrames;

    if (!Number.isFinite(activeTiming.emaFrameMs)) {
      activeTiming.emaFrameMs = sampleMs;
    } else {
      activeTiming.emaFrameMs = activeTiming.emaFrameMs * (1 - ETA_EMA_ALPHA) + sampleMs * ETA_EMA_ALPHA;
    }

    if (activeTiming.completedFrames >= ETA_MIN_SAMPLES) {
      activeTiming.predictedFrameMs = activeTiming.emaFrameMs * 0.7 + activeTiming.sampleAverageFrameMs * 0.3;
      activeTiming.estimateSource = 'live-current-capture';
    }

    if (Number.isFinite(activeTiming.predictedFrameMs)) {
      activeTiming.estimatedTotalMs = activeTiming.predictedFrameMs * profile.frames + activeTiming.tailEstimateMs;
    }
  }

  function renderTimingDisplay() {
    if (!timingEl) return;
    if (busy && activeTiming) {
      const elapsed = performance.now() - activeTiming.startedPerfMs;
      if (!Number.isFinite(activeTiming.predictedFrameMs) || (activeTiming.completedFrames < ETA_MIN_SAMPLES && activeTiming.estimateSource === 'warming-up')) {
        timingEl.textContent = `Time: ${formatDuration(elapsed)} elapsed · estimating…`;
        return;
      }
      const remaining = Math.max(0, activeTiming.estimatedTotalMs - elapsed);
      timingEl.textContent = `Time: ${formatDuration(elapsed)} elapsed · ~${formatDuration(remaining)} left · ~${formatDuration(activeTiming.estimatedTotalMs)} total`;
      return;
    }
    if (lastCapture && Number.isFinite(lastCapture.elapsedMs)) {
      timingEl.textContent = `Completed in ${formatDuration(lastCapture.elapsedMs)}`;
      return;
    }
    timingEl.textContent = 'ETA learns from measured frame time on this device during each capture.';
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

  function readU16LE(source, offset) {
    return source[offset] | (source[offset + 1] << 8);
  }

  function readU24LE(source, offset) {
    return source[offset] | (source[offset + 1] << 8) | (source[offset + 2] << 16);
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

  function parseAnimatedWebPMetrics(bytes) {
    const result = {
      width: null,
      height: null,
      loopCount: null,
      frameCount: 0,
      totalDurationMs: 0,
      durations: {}
    };
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

  function validateAnimatedWebPMetrics(parsed, profile) {
    if (parsed.width !== profile.size || parsed.height !== profile.size) {
      throw new Error(`Mux verification dimensions failed: ${parsed.width}x${parsed.height}.`);
    }
    if (parsed.frameCount !== profile.frames) {
      throw new Error(`Mux verification frame count failed: ${parsed.frameCount}/${profile.frames}.`);
    }
    if (parsed.totalDurationMs !== profile.durationMs) {
      throw new Error(`Mux verification duration failed: ${parsed.totalDurationMs} ms / ${profile.durationMs} ms.`);
    }
    if (parsed.loopCount !== profile.loopCount) {
      throw new Error(`Mux verification loop count failed: ${parsed.loopCount}/${profile.loopCount}.`);
    }
    const durationKeys = Object.keys(parsed.durations);
    if (durationKeys.length !== 1 || Number(durationKeys[0]) !== profile.frameDurationMs || parsed.durations[durationKeys[0]] !== profile.frames) {
      throw new Error(`Mux verification frame timing failed: ${JSON.stringify(parsed.durations)}.`);
    }
  }

  function downloadBlob(blob, profile) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const name = (getCK() && getCK().data && getCK().data.meta && getCK().data.meta.character_name) || 'Hero';
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    anchor.href = url;
    anchor.download = `${name}_Spinny_${profile.size}px_${profile.speedId}_${profile.frames}f_${stamp}.webp`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  async function captureSelectedProfile() {
    if (busy) return false;
    const capability = readCapabilities();
    if (!capability.ok) {
      setStatus(capability.reason, true);
      refresh();
      return false;
    }

    const profile = getSelectedProfile();
    const { CK, BT, display } = capability;
    const baseRotation = Number(display.rotation.y);
    const encodedFrames = [];
    let encodedBytes = 0;
    let outputBlob = null;

    busy = true;
    cancelled = false;
    diagnostics.busy = true;
    diagnostics.selectedProfile = { ...profile };
    activeTiming = createTimingState(profile);
    diagnostics.activeTiming = activeTiming;
    setProgress(0, profile.frames, 'render', 0);
    refresh();

    lastCapture = {
      build: BUILD,
      status: 'running',
      startedAt: new Date().toISOString(),
      completedAt: null,
      requested: { ...profile },
      baseRotation,
      framesRendered: 0,
      framesEncoded: 0,
      encodedFrameBytes: 0,
      outputBytes: null,
      parsed: null,
      elapsedMs: null,
      timing: null,
      rotationRestored: false,
      error: null
    };
    diagnostics.lastCapture = lastCapture;

    try {
      for (let index = 0; index < profile.frames; index += 1) {
        if (cancelled) throw new Error('Capture cancelled.');
        const frameStartedPerfMs = performance.now();

        display.rotation.y = baseRotation + (2 * Math.PI * index / profile.frames);
        refreshScene(CK);
        await waitForOcclusion(display);
        await nextFrame();

        setProgress(index, profile.frames, 'render', 0.15);
        const canvas = BT.maker.takeScreenshot(profile.size, profile.size);
        if (!canvas || typeof canvas.toBlob !== 'function') {
          throw new Error('BT.maker.takeScreenshot did not return an encodable canvas.');
        }
        if (canvas.width !== profile.size || canvas.height !== profile.size) {
          throw new Error(`HeroForge returned ${canvas.width}x${canvas.height}; expected ${profile.size}x${profile.size}.`);
        }
        lastCapture.framesRendered = index + 1;

        setProgress(index, profile.frames, 'encode', 0.65);
        const stillBlob = await canvasToWebP(canvas, profile.quality);
        const frame = await extractStillWebPFrame(stillBlob);
        encodedBytes += frame.encodedBytes;
        encodedFrames.push(frame);
        lastCapture.framesEncoded = index + 1;
        lastCapture.encodedFrameBytes = encodedBytes;

        canvas.width = 1;
        canvas.height = 1;

        updateTimingAfterFrame(profile, performance.now() - frameStartedPerfMs);
        setProgress(index + 1, profile.frames, 'render', 0);
        renderTimingDisplay();
        if ((index + 1) % 5 === 0) await nextFrame();
      }

      activeTiming.frameLoopCompletedPerfMs = performance.now();
      if (cancelled) throw new Error('Capture cancelled.');
      setProgress(profile.frames, profile.frames, 'mux', 0);
      outputBlob = makeAnimatedWebP(
        profile.size,
        profile.size,
        profile.frameDurationMs,
        profile.loopCount,
        encodedFrames
      );

      const outputBytes = new Uint8Array(await outputBlob.arrayBuffer());
      const parsed = parseAnimatedWebPMetrics(outputBytes);
      lastCapture.outputBytes = outputBlob.size;
      lastCapture.parsed = parsed;
      validateAnimatedWebPMetrics(parsed, profile);

      downloadBlob(outputBlob, profile);
      lastCapture.status = 'downloaded';
      lastCapture.completedAt = new Date().toISOString();
      lastCapture.elapsedMs = performance.now() - activeTiming.startedPerfMs;
      const tailMs = Math.max(0, performance.now() - activeTiming.frameLoopCompletedPerfMs);
      lastCapture.timing = {
        completedFrames: activeTiming.completedFrames,
        sampleAverageFrameMs: activeTiming.sampleAverageFrameMs,
        emaFrameMs: activeTiming.emaFrameMs,
        predictedFrameMs: activeTiming.predictedFrameMs,
        tailMs,
        estimatedTotalMs: activeTiming.estimatedTotalMs,
        actualTotalMs: lastCapture.elapsedMs
      };
      timingHistory[String(profile.size)] = {
        frameMs: activeTiming.sampleAverageFrameMs,
        tailMs,
        frames: profile.frames,
        updatedAt: lastCapture.completedAt
      };
      setProgressBar(1);
      setStatus(`Downloaded ${profile.size}px ${profile.speedLabel}: ${profile.frames} frames / ${(profile.durationMs / 1000).toFixed(1)} s / ${(outputBlob.size / 1048576).toFixed(1)} MiB`);
      return true;
    } catch (error) {
      const message = error && error.message ? error.message : String(error);
      if (lastCapture) {
        lastCapture.status = cancelled ? 'cancelled' : 'failed';
        lastCapture.completedAt = new Date().toISOString();
        lastCapture.elapsedMs = activeTiming ? performance.now() - activeTiming.startedPerfMs : null;
        lastCapture.error = message;
      }
      setStatus(message, !cancelled);
      console.error('[HF Spinny Mini WebP Profiles TEST]', error);
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
      diagnostics.busy = false;
      diagnostics.activeTiming = null;
      activeTiming = null;
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
#${PANEL_ID}{position:fixed;left:12px;bottom:12px;z-index:2147483646;width:350px;padding:10px;border:1px solid #555;border-radius:8px;background:rgba(18,18,20,.95);color:#eee;font:12px/1.35 Arial,sans-serif;box-shadow:0 5px 18px rgba(0,0,0,.45)}
#${PANEL_ID} .hfc-title{font-size:13px;font-weight:700;margin-bottom:6px}
#${PANEL_ID} .hfc-cap{opacity:.78;margin-bottom:7px}
#${PANEL_ID} .hfc-row{display:grid;grid-template-columns:86px 1fr;gap:6px;align-items:center;margin-bottom:6px}
#${PANEL_ID} select{width:100%;border:1px solid #666;border-radius:5px;padding:6px;background:#29292d;color:#fff}
#${PANEL_ID} .hfc-status{min-height:30px;margin-top:7px;overflow-wrap:anywhere}
#${PANEL_ID} .hfc-status[data-error="1"]{color:#ff8a8a}
#${PANEL_ID} .hfc-progress{height:8px;margin-top:4px;overflow:hidden;border:1px solid #555;border-radius:999px;background:rgba(255,255,255,.09)}
#${PANEL_ID} .hfc-progress-fill{height:100%;width:0%;border-radius:999px;background:#d8d8dd;transition:width .16s linear}
#${PANEL_ID} .hfc-timing{min-height:16px;margin-top:5px;opacity:.82;font-size:11px}
#${PANEL_ID} .hfc-actions{display:flex;gap:6px;margin-top:7px}
#${PANEL_ID} button{flex:1;border:1px solid #666;border-radius:5px;padding:7px 8px;background:#29292d;color:#fff;cursor:pointer}
#${PANEL_ID} button:hover:not(:disabled){background:#36363b}
#${PANEL_ID} button:disabled,#${PANEL_ID} select:disabled{opacity:.42;cursor:not-allowed}
#${PANEL_ID} .hfc-meta{opacity:.72;margin-top:7px;font-size:11px;white-space:pre-line}
`;
    document.head.appendChild(style);
  }

  function optionMarkup(collection) {
    return Object.values(collection).map((item) => `<option value="${item.id}">${item.label}</option>`).join('');
  }

  function ensurePanel() {
    if (panel && panel.isConnected) return panel;
    ensureStyle();
    panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="hfc-title">Spinny Mini WebP Profiles TEST</div>
      <div class="hfc-cap"></div>
      <div class="hfc-row"><label>Resolution</label><select class="hfc-resolution">${optionMarkup(RESOLUTIONS)}</select></div>
      <div class="hfc-row"><label>Rotation</label><select class="hfc-speed">${optionMarkup(SPEEDS)}</select></div>
      <div class="hfc-actions">
        <button type="button" class="hfc-capture">Capture WebP</button>
        <button type="button" class="hfc-cancel">Cancel</button>
      </div>
      <div class="hfc-status" data-error="0">Waiting for Photo Booth…</div>
      <div class="hfc-progress" role="progressbar" aria-label="Spinny capture progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="hfc-progress-fill"></div></div>
      <div class="hfc-timing">ETA learns from measured frame time on this device during each capture.</div>
      <div class="hfc-meta"></div>
    `;
    document.body.appendChild(panel);
    capabilityEl = panel.querySelector('.hfc-cap');
    statusEl = panel.querySelector('.hfc-status');
    progressTrackEl = panel.querySelector('.hfc-progress');
    progressFillEl = panel.querySelector('.hfc-progress-fill');
    timingEl = panel.querySelector('.hfc-timing');
    metaEl = panel.querySelector('.hfc-meta');
    button = panel.querySelector('.hfc-capture');
    cancelButton = panel.querySelector('.hfc-cancel');
    resolutionSelect = panel.querySelector('.hfc-resolution');
    speedSelect = panel.querySelector('.hfc-speed');
    resolutionSelect.value = '1024';
    speedSelect.value = 'standard';
    button.addEventListener('click', () => { captureSelectedProfile(); });
    cancelButton.addEventListener('click', cancelCapture);
    resolutionSelect.addEventListener('change', refresh);
    speedSelect.addEventListener('change', refresh);
    return panel;
  }

  function refresh() {
    ensurePanel();
    const capability = readCapabilities();
    const profile = getSelectedProfile();
    diagnostics.selectedProfile = { ...profile };
    if (capabilityEl) capabilityEl.textContent = capability.ok ? 'Photo Booth capture capability ready' : capability.reason;
    if (button) button.disabled = busy || !capability.ok;
    if (cancelButton) cancelButton.disabled = !busy;
    if (resolutionSelect) resolutionSelect.disabled = busy;
    if (speedSelect) speedSelect.disabled = busy;
    if (metaEl) {
      let validationLabel = 'Experimental profile';
      if (profile.size === 1024 && profile.speedId === 'standard') validationLabel = 'Validated Lob-parity baseline';
      else if (profile.size === 2048 && profile.speedId === 'standard') validationLabel = 'Validated 2048 Standard';
      else if (profile.size === 1024 && profile.speedId === 'verySlow') validationLabel = 'Validated 1024 Very Slow';
      metaEl.textContent = `${validationLabel}\n${profile.size}px · ${profile.frames} frames · ${profile.fps.toFixed(0)} FPS · ${(profile.durationMs / 1000).toFixed(1)} s · workload ${profile.workloadMultiplier.toFixed(1)}× baseline`;
    }
    renderTimingDisplay();
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
    resolutions: RESOLUTIONS,
    speeds: SPEEDS,
    diagnostics,
    timingHistory,
    capture: captureSelectedProfile,
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
