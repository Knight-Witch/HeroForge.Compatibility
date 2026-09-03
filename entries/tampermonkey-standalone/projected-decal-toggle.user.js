// ==UserScript==
// @name         HF Compatibility - Projected Decal Toggle TEST
// @namespace    https://github.com/Knight-Witch/HeroForge.Compatibility
// @version      0.1.0
// @description  Standalone test reconstruction of Lob's Project toggle for splatter decals.
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
  const GLOBAL_NAME = 'HFProjectedDecalToggleTest';
  const PANEL_ID = 'hfc-projected-decal-toggle-test';
  const STYLE_ID = `${PANEL_ID}-style`;
  const SLOT_COUNT = 49;
  const BUILD = '0.1.0-test';

  let panel = null;
  let slotSelect = null;
  let statusEl = null;
  let idEl = null;
  let stateEl = null;
  let refreshTimer = null;
  let readinessTimer = null;

  function getCK() {
    return UW && UW.CK ? UW.CK : null;
  }

  function slotNumberToLabel(n) {
    let value = Number(n);
    if (!Number.isInteger(value) || value < 1) return '?';
    let label = '';
    while (value > 0) {
      value -= 1;
      label = String.fromCharCode(65 + (value % 26)) + label;
      value = Math.floor(value / 26);
    }
    return label;
  }

  function slotLabelToNumber(label) {
    const text = String(label || '').trim().toUpperCase();
    if (!/^[A-Z]{1,2}$/.test(text)) return null;
    let value = 0;
    for (const char of text) value = value * 26 + (char.charCodeAt(0) - 64);
    return value >= 1 && value <= SLOT_COUNT ? value : null;
  }

  function getActiveDecals(CK) {
    if (CK && CK.activeData && CK.activeData.decals && typeof CK.activeData.decals === 'object') {
      return CK.activeData.decals;
    }
    if (CK && CK.character && CK.character.data && CK.character.data.decals && typeof CK.character.data.decals === 'object') {
      return CK.character.data.decals;
    }
    return null;
  }

  function getSlotRecord(slotNumber) {
    const CK = getCK();
    if (!CK) return { ok: false, reason: 'CK unavailable' };
    const decals = getActiveDecals(CK);
    if (!decals) return { ok: false, reason: 'decal state unavailable' };
    const splatter = decals.splatter;
    if (!splatter || typeof splatter !== 'object') return { ok: false, reason: 'splatter decal state unavailable' };
    const key = String(slotNumber);
    const record = splatter[key];
    if (!record || typeof record !== 'object') {
      return { ok: false, reason: `Slot ${slotNumberToLabel(slotNumber)} (${key}) is empty`, CK, decals, splatter, key };
    }
    return { ok: true, CK, decals, splatter, key, record };
  }

  function readState(record) {
    if (!Object.prototype.hasOwnProperty.call(record, 'forceProjectedScript') ||
        record.forceProjectedScript === undefined) {
      return 'native';
    }
    return record.forceProjectedScript ? 'on' : 'off';
  }

  function setStatus(text, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.dataset.error = isError ? '1' : '0';
  }

  function refresh() {
    if (!slotSelect) return;
    const slotNumber = slotLabelToNumber(slotSelect.value);
    if (!slotNumber) {
      setStatus('Choose a valid slot.', true);
      return;
    }

    const info = getSlotRecord(slotNumber);
    if (!info.ok) {
      if (idEl) idEl.textContent = 'Decal ID: —';
      if (stateEl) stateEl.textContent = 'Project state: unavailable';
      setStatus(info.reason, true);
      return;
    }

    const state = readState(info.record);
    if (idEl) idEl.textContent = `Decal ID: ${info.record.id ?? 'unknown'}`;
    if (stateEl) stateEl.textContent = `Project state: ${state.toUpperCase()}`;
    setStatus(`Slot ${slotNumberToLabel(slotNumber)} ready.`);
  }

  function applyState(nextState) {
    const slotNumber = slotLabelToNumber(slotSelect && slotSelect.value);
    if (!slotNumber) {
      setStatus('Choose a valid slot.', true);
      return;
    }

    const info = getSlotRecord(slotNumber);
    if (!info.ok) {
      setStatus(info.reason, true);
      return;
    }
    if (typeof info.CK.activeTweak !== 'function') {
      setStatus('CK.activeTweak unavailable.', true);
      return;
    }

    const nextRecord = { ...info.record, forceProjectedScript: nextState };
    const nextSplatter = { ...info.splatter, [info.key]: nextRecord };
    const nextDecals = { ...info.decals, splatter: nextSplatter };

    try {
      info.CK.activeTweak({ decals: nextDecals });
      const label = nextState === undefined ? 'NATIVE' : (nextState ? 'ON' : 'OFF');
      setStatus(`Applied Project ${label} to Slot ${slotNumberToLabel(slotNumber)}.`);
      window.setTimeout(refresh, 150);
    } catch (error) {
      console.error('[HF Projected Decal TEST] apply failed', error);
      setStatus(`Apply failed: ${error && error.message ? error.message : error}`, true);
    }
  }

  function makeButton(text, handler) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.addEventListener('click', handler);
    return button;
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
        width: 250px;
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
      #${PANEL_ID} .hfc-row { display: flex; align-items: center; gap: 6px; margin: 6px 0; }
      #${PANEL_ID} label { min-width: 36px; }
      #${PANEL_ID} select,
      #${PANEL_ID} button {
        background: #2d2d34;
        color: #fff;
        border: 1px solid #555;
        border-radius: 4px;
        padding: 5px 7px;
      }
      #${PANEL_ID} button { cursor: pointer; flex: 1; }
      #${PANEL_ID} button:hover { background: #3b3b44; }
      #${PANEL_ID} .hfc-meta { opacity: .82; margin-top: 4px; }
      #${PANEL_ID} .hfc-status { margin-top: 7px; min-height: 16px; }
      #${PANEL_ID} .hfc-status[data-error="1"] { color: #ff9d9d; }
      #${PANEL_ID} .hfc-note { opacity: .66; margin-top: 7px; font-size: 11px; }
    `;
    document.documentElement.appendChild(style);

    panel = document.createElement('div');
    panel.id = PANEL_ID;

    const title = document.createElement('div');
    title.className = 'hfc-title';
    title.textContent = 'HF Projected Decal TEST';

    const row = document.createElement('div');
    row.className = 'hfc-row';
    const label = document.createElement('label');
    label.textContent = 'Slot';
    slotSelect = document.createElement('select');
    for (let i = 1; i <= SLOT_COUNT; i += 1) {
      const option = document.createElement('option');
      option.value = slotNumberToLabel(i);
      option.textContent = `${slotNumberToLabel(i)} (${i})`;
      if (i === 6) option.selected = true;
      slotSelect.appendChild(option);
    }
    slotSelect.addEventListener('change', refresh);
    row.append(label, slotSelect);

    idEl = document.createElement('div');
    idEl.className = 'hfc-meta';
    idEl.textContent = 'Decal ID: —';

    stateEl = document.createElement('div');
    stateEl.className = 'hfc-meta';
    stateEl.textContent = 'Project state: —';

    const buttons = document.createElement('div');
    buttons.className = 'hfc-row';
    buttons.append(
      makeButton('ON', () => applyState(true)),
      makeButton('OFF', () => applyState(false)),
      makeButton('Native', () => applyState(undefined))
    );

    statusEl = document.createElement('div');
    statusEl.className = 'hfc-status';
    statusEl.textContent = 'Waiting for HeroForge…';

    const note = document.createElement('div');
    note.className = 'hfc-note';
    note.textContent = 'Standalone test only. Uses CK.activeTweak; does not patch HeroForge UI bundles.';

    panel.append(title, row, idEl, stateEl, buttons, statusEl, note);
    document.body.appendChild(panel);

    refresh();
    refreshTimer = window.setInterval(refresh, 750);
  }

  function initialize() {
    const CK = getCK();
    if (CK && typeof CK.activeTweak === 'function' && getActiveDecals(CK)) {
      if (readinessTimer !== null) {
        window.clearInterval(readinessTimer);
        readinessTimer = null;
      }
      mount();
      return true;
    }
    return false;
  }

  function dispose() {
    if (readinessTimer !== null) {
      window.clearInterval(readinessTimer);
      readinessTimer = null;
    }
    if (refreshTimer !== null) {
      window.clearInterval(refreshTimer);
      refreshTimer = null;
    }
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

  UW[GLOBAL_NAME] = {
    build: BUILD,
    refresh,
    setSlot(label) {
      if (!slotSelect) return false;
      const number = slotLabelToNumber(label);
      if (!number) return false;
      slotSelect.value = slotNumberToLabel(number);
      refresh();
      return true;
    },
    projectOn() { applyState(true); },
    projectOff() { applyState(false); },
    projectNative() { applyState(undefined); },
    dispose
  };

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('HF Projected Decal TEST: Show/refresh', () => {
      if (!panel) mount();
      refresh();
    });
    GM_registerMenuCommand('HF Projected Decal TEST: Dispose', dispose);
  }

  if (!initialize()) {
    readinessTimer = window.setInterval(initialize, 500);
  }
})();
