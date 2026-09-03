// ==UserScript==
// @name         HF Compatibility - Character Local JSON TEST
// @namespace    https://github.com/Knight-Witch/HeroForge.Compatibility
// @version      0.1.0
// @description  Standalone test reconstruction of local Hero Forge character JSON save/load.
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
  const FEATURE_IDS = ['character.local-export', 'character.local-import'];
  const BUILD = '0.1.0-test';
  const PANEL_ID = 'hfc-character-local-json-test';
  const STYLE_ID = `${PANEL_ID}-style`;

  let readinessTimer = null;
  let panel = null;
  let statusEl = null;
  let saveButton = null;
  let loadButton = null;

  function setStatus(message, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = String(message || '');
    statusEl.dataset.error = isError ? '1' : '0';
  }

  function getCK() {
    const CK = UW.CK;
    if (!CK) throw new Error('CK runtime is not available yet.');
    return CK;
  }

  function getCapabilities() {
    const CK = UW.CK;
    const undo = CK && CK.UndoQueue;
    return {
      exportReady: !!(
        undo &&
        Array.isArray(undo.queue) &&
        Number.isInteger(Number(undo.currentIndex)) &&
        undo.queue[Number(undo.currentIndex)]
      ),
      importReady: !!(CK && typeof CK.tryLoadCharacter === 'function')
    };
  }

  function updateReadiness() {
    const caps = getCapabilities();
    if (saveButton) saveButton.disabled = !caps.exportReady;
    if (loadButton) loadButton.disabled = !caps.importReady;

    if (caps.exportReady && caps.importReady) {
      setStatus('Ready');
      if (readinessTimer) {
        clearInterval(readinessTimer);
        readinessTimer = null;
      }
    } else {
      const missing = [];
      if (!caps.exportReady) missing.push('current JSON snapshot');
      if (!caps.importReady) missing.push('load API');
      setStatus(`Waiting for ${missing.join(' + ')}…`);
    }
  }

  function currentSnapshot() {
    const CK = getCK();
    const undo = CK.UndoQueue;
    if (!undo || !Array.isArray(undo.queue)) {
      throw new Error('CK.UndoQueue.queue is unavailable.');
    }

    const index = Number(undo.currentIndex);
    if (!Number.isInteger(index) || index < 0 || index >= undo.queue.length) {
      throw new Error(`Invalid CK.UndoQueue.currentIndex: ${String(undo.currentIndex)}`);
    }

    const snapshot = undo.queue[index];
    if (!snapshot || typeof snapshot !== 'object') {
      throw new Error('Current undo snapshot is unavailable.');
    }

    // Legacy Advanced Decal Posing v0.99.23 exported this exact current undo snapshot.
    // Clone through JSON so the downloaded object is detached from live runtime state.
    return JSON.parse(JSON.stringify(snapshot));
  }

  function safeFilenamePart(value) {
    const cleaned = String(value || '')
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
      .trim();
    return cleaned || 'HeroForge_Character';
  }

  function saveLocalJson() {
    try {
      const snapshot = currentSnapshot();
      const json = JSON.stringify(snapshot, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const rawName = snapshot && snapshot.meta && snapshot.meta.character_name
        ? snapshot.meta.character_name
        : snapshot && snapshot.name
          ? snapshot.name
          : 'HeroForge_Character';
      const stamp = new Date().toISOString().replace(/[:.-]/g, '');
      const filename = `${safeFilenamePart(rawName)}_${stamp}.heroforge.json`;

      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus(`Saved ${filename}`);
    } catch (error) {
      console.error('[HFC character.local-export]', error);
      setStatus(`Save failed: ${error && error.message ? error.message : String(error)}`, true);
    }
  }

  function chooseAndLoadLocalJson() {
    let input = null;
    try {
      const CK = getCK();
      if (typeof CK.tryLoadCharacter !== 'function') {
        throw new Error('CK.tryLoadCharacter is unavailable.');
      }

      input = document.createElement('input');
      input.type = 'file';
      input.accept = '.heroforge.json,application/json';
      input.style.display = 'none';

      input.addEventListener('change', () => {
        const file = input.files && input.files[0];
        if (!file) {
          input.remove();
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(String(reader.result || ''));
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
              throw new Error('Selected file does not contain a Hero Forge JSON object.');
            }

            let callbackFired = false;
            const onLoaded = () => {
              callbackFired = true;
              setStatus(`Loaded ${file.name}`);
            };

            const result = CK.tryLoadCharacter(
              parsed,
              'Attempting to load from JSON',
              onLoaded
            );

            if (result && typeof result.then === 'function') {
              result.then(() => {
                if (!callbackFired) setStatus(`Loaded ${file.name}`);
              }).catch((error) => {
                console.error('[HFC character.local-import]', error);
                setStatus(`Load failed: ${error && error.message ? error.message : String(error)}`, true);
              });
            } else {
              setStatus(`Load requested: ${file.name}`);
            }
          } catch (error) {
            console.error('[HFC character.local-import]', error);
            setStatus(`Load failed: ${error && error.message ? error.message : String(error)}`, true);
          } finally {
            input.remove();
          }
        };
        reader.onerror = () => {
          setStatus(`Could not read ${file.name}`, true);
          input.remove();
        };
        reader.readAsText(file);
      }, { once: true });

      document.body.appendChild(input);
      input.click();
    } catch (error) {
      if (input) input.remove();
      console.error('[HFC character.local-import]', error);
      setStatus(`Load failed: ${error && error.message ? error.message : String(error)}`, true);
    }
  }

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${PANEL_ID} {
        position: fixed;
        right: 14px;
        bottom: 14px;
        z-index: 2147483646;
        display: grid;
        grid-template-columns: auto auto;
        gap: 6px;
        align-items: center;
        padding: 8px;
        border: 1px solid rgba(255,255,255,.18);
        border-radius: 8px;
        background: rgba(18,18,22,.94);
        box-shadow: 0 4px 18px rgba(0,0,0,.35);
        color: #fff;
        font: 12px/1.25 Arial, sans-serif;
      }
      #${PANEL_ID} .hfc-json-title {
        grid-column: 1 / -1;
        font-weight: 700;
        opacity: .9;
      }
      #${PANEL_ID} button {
        min-width: 92px;
        padding: 6px 9px;
        border: 1px solid rgba(255,255,255,.2);
        border-radius: 5px;
        background: #32323a;
        color: #fff;
        cursor: pointer;
      }
      #${PANEL_ID} button:hover:not(:disabled) { background: #44444e; }
      #${PANEL_ID} button:disabled { opacity: .45; cursor: default; }
      #${PANEL_ID} .hfc-json-status {
        grid-column: 1 / -1;
        max-width: 230px;
        opacity: .72;
        overflow-wrap: anywhere;
      }
      #${PANEL_ID} .hfc-json-status[data-error="1"] { opacity: 1; }
    `;
    document.head.appendChild(style);
  }

  function mount() {
    if (panel && panel.isConnected) return;
    if (!document.body) {
      setTimeout(mount, 50);
      return;
    }

    addStyles();

    panel = document.createElement('div');
    panel.id = PANEL_ID;

    const title = document.createElement('div');
    title.className = 'hfc-json-title';
    title.textContent = 'HF Local JSON TEST';

    saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.textContent = 'Save JSON';
    saveButton.addEventListener('click', saveLocalJson);

    loadButton = document.createElement('button');
    loadButton.type = 'button';
    loadButton.textContent = 'Load JSON';
    loadButton.addEventListener('click', chooseAndLoadLocalJson);

    statusEl = document.createElement('div');
    statusEl.className = 'hfc-json-status';

    panel.append(title, saveButton, loadButton, statusEl);
    document.body.appendChild(panel);

    updateReadiness();
    if (!readinessTimer) readinessTimer = setInterval(updateReadiness, 250);
  }

  function dispose() {
    if (readinessTimer) {
      clearInterval(readinessTimer);
      readinessTimer = null;
    }
    if (panel) panel.remove();
    panel = null;
    saveButton = null;
    loadButton = null;
    statusEl = null;
    const style = document.getElementById(STYLE_ID);
    if (style) style.remove();
  }

  try {
    const prior = UW.HFCharacterLocalJsonTest;
    if (prior && typeof prior.dispose === 'function') prior.dispose();
  } catch (_) {}

  UW.HFCharacterLocalJsonTest = Object.freeze({
    featureIds: FEATURE_IDS.slice(),
    build: BUILD,
    save: saveLocalJson,
    load: chooseAndLoadLocalJson,
    mount,
    dispose,
    capabilities: getCapabilities
  });

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('HF Local JSON TEST: Save JSON', saveLocalJson);
    GM_registerMenuCommand('HF Local JSON TEST: Load JSON', chooseAndLoadLocalJson);
  }

  mount();
})();
