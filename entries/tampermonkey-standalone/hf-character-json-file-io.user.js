// ==UserScript==
// @name         HF Compatibility — Character JSON File I/O
// @namespace    https://github.com/Knight-Witch/HeroForge.Compatibility
// @version      0.1.0
// @description  Standalone local HeroForge character JSON export/import using named runtime APIs.
// @author       Knight Witch
// @match        https://www.heroforge.com/*
// @match        http://www.heroforge.com/*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

(() => {
    'use strict';

    const FEATURE_ID = 'character.local-file-io';
    const VERSION = '0.1.0';
    const pageWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const state = {
        enabled: true,
        disposed: false,
        pollTimer: null,
        host: null,
        shadow: null,
        status: 'Waiting for HeroForge character runtime…',
        capability: 'untested',
    };

    function log(level, message, extra) {
        const fn = console[level] || console.log;
        fn.call(console, `[${FEATURE_ID}] ${message}`, extra || '');
    }

    function sanitizeFilename(value) {
        const cleaned = String(value || 'Hero')
            .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_')
            .replace(/\s+/g, ' ')
            .trim();
        return cleaned || 'Hero';
    }

    function timestamp() {
        return new Date().toISOString().replace(/[:.-]/g, '');
    }

    function clone(value) {
        const CK = pageWindow.CK;
        if (typeof CK?.Helpers?.deepCopy === 'function') {
            return CK.Helpers.deepCopy(value);
        }
        return JSON.parse(JSON.stringify(value));
    }

    function isCharacterLike(value) {
        return Boolean(
            value &&
            typeof value === 'object' &&
            !Array.isArray(value) &&
            (
                value.meta ||
                value.parts ||
                value.monsterGroup ||
                value.children ||
                value.decals
            )
        );
    }

    function capability() {
        const CK = pageWindow.CK;
        const exportAvailable =
            typeof CK?.character?.data?.getJson === 'function' ||
            (
                Array.isArray(CK?.UndoQueue?.queue) &&
                Number.isInteger(CK?.UndoQueue?.currentIndex)
            );
        const importAvailable = typeof CK?.tryLoadCharacter === 'function';

        return {
            exportAvailable,
            importAvailable,
            available: exportAvailable && importAvailable,
        };
    }

    function currentCharacterJson() {
        const CK = pageWindow.CK;
        const queue = CK?.UndoQueue?.queue;
        const index = CK?.UndoQueue?.currentIndex;

        if (
            Array.isArray(queue) &&
            Number.isInteger(index) &&
            index >= 0 &&
            index < queue.length &&
            isCharacterLike(queue[index])
        ) {
            return clone(queue[index]);
        }

        if (typeof CK?.character?.data?.getJson === 'function') {
            const data = CK.character.data.getJson();
            if (!isCharacterLike(data)) {
                throw new Error('CK.character.data.getJson() did not return character-like JSON.');
            }
            return clone(data);
        }

        throw new Error('Character export capability is unavailable.');
    }

    function characterName(data) {
        return sanitizeFilename(
            data?.meta?.character_name ||
            pageWindow.CK?.data?.meta?.character_name ||
            pageWindow.CK?.character?.data?.meta?.character_name ||
            'Hero'
        );
    }

    function downloadJson(data) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${characterName(data)}_${timestamp()}.heroforge.json`;
        document.documentElement.appendChild(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function chooseJsonFile() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.heroforge.json,application/json,.json';
            input.style.display = 'none';

            input.addEventListener('change', async () => {
                try {
                    const file = input.files?.[0];
                    if (!file) {
                        resolve(null);
                        return;
                    }
                    const text = await file.text();
                    const parsed = JSON.parse(text);
                    if (!isCharacterLike(parsed)) {
                        throw new Error('Selected JSON does not look like HeroForge character data.');
                    }
                    resolve(parsed);
                } catch (error) {
                    reject(error);
                } finally {
                    input.remove();
                }
            }, { once: true });

            document.documentElement.appendChild(input);
            input.click();
        });
    }

    function setStatus(message, kind = 'normal') {
        state.status = message;
        if (!state.shadow) return;
        const node = state.shadow.querySelector('.status');
        if (node) {
            node.textContent = message;
            node.dataset.kind = kind;
        }
    }

    async function exportCharacter() {
        try {
            setStatus('Preparing character JSON…');
            const data = currentCharacterJson();
            downloadJson(data);
            setStatus('Character JSON downloaded.', 'success');
        } catch (error) {
            log('error', 'Export failed.', error);
            setStatus(`Export failed: ${error.message}`, 'error');
        }
    }

    async function importCharacter() {
        try {
            const CK = pageWindow.CK;
            if (typeof CK?.tryLoadCharacter !== 'function') {
                throw new Error('CK.tryLoadCharacter is unavailable.');
            }

            const data = await chooseJsonFile();
            if (!data) {
                setStatus('Import cancelled.');
                return;
            }

            setStatus('Sending character JSON to HeroForge…');

            let callbackCalled = false;
            const result = CK.tryLoadCharacter(
                data,
                'Attempting to load character JSON',
                () => {
                    callbackCalled = true;
                    setStatus('Character JSON applied.', 'success');
                }
            );

            if (result && typeof result.then === 'function') {
                await result;
                if (!callbackCalled) {
                    setStatus('HeroForge completed the load request.', 'success');
                }
            } else if (!callbackCalled) {
                setStatus('Character load requested. HeroForge is processing it.');
            }
        } catch (error) {
            log('error', 'Import failed.', error);
            setStatus(`Import failed: ${error.message}`, 'error');
        }
    }

    function render() {
        if (state.host || !document.documentElement || state.disposed) return;

        const host = document.createElement('div');
        host.id = 'hf-compat-character-io-host';
        host.style.position = 'fixed';
        host.style.left = '12px';
        host.style.bottom = '12px';
        host.style.zIndex = '2147483646';
        document.documentElement.appendChild(host);

        const shadow = host.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <style>
                :host { all: initial; }
                .panel {
                    width: 245px;
                    box-sizing: border-box;
                    padding: 10px;
                    border: 1px solid rgba(255,255,255,.22);
                    border-radius: 9px;
                    background: rgba(18,18,22,.96);
                    color: #f3f3f3;
                    font: 12px/1.35 system-ui, sans-serif;
                    box-shadow: 0 8px 24px rgba(0,0,0,.45);
                }
                .title { font-weight: 700; margin-bottom: 7px; }
                .buttons { display: flex; gap: 6px; }
                button {
                    flex: 1;
                    border: 1px solid rgba(255,255,255,.24);
                    border-radius: 6px;
                    padding: 7px;
                    background: rgba(255,255,255,.10);
                    color: inherit;
                    cursor: pointer;
                    font: inherit;
                }
                button:hover:not(:disabled) { background: rgba(255,255,255,.18); }
                button:disabled { opacity: .45; cursor: not-allowed; }
                .status {
                    margin-top: 7px;
                    min-height: 2.7em;
                    color: #c9c9d2;
                    overflow-wrap: anywhere;
                }
                .status[data-kind="success"] { color: #b7efc5; }
                .status[data-kind="error"] { color: #ffb4b4; }
                .footer {
                    margin-top: 5px;
                    color: #8f8f9c;
                    font-size: 10px;
                }
            </style>
            <div class="panel">
                <div class="title">Character JSON File I/O</div>
                <div class="buttons">
                    <button class="save" type="button">Save JSON</button>
                    <button class="load" type="button">Load JSON</button>
                </div>
                <div class="status"></div>
                <div class="footer">${FEATURE_ID} · v${VERSION}</div>
            </div>
        `;

        shadow.querySelector('.save').addEventListener('click', exportCharacter);
        shadow.querySelector('.load').addEventListener('click', importCharacter);

        state.host = host;
        state.shadow = shadow;
        refreshCapability();
    }

    function refreshCapability() {
        if (state.disposed) return;
        const cap = capability();
        state.capability = cap.available ? 'available' : 'unavailable';

        if (state.shadow) {
            state.shadow.querySelector('.save').disabled = !cap.exportAvailable;
            state.shadow.querySelector('.load').disabled = !cap.importAvailable;
        }

        if (cap.available && state.status.startsWith('Waiting')) {
            setStatus('Ready.', 'success');
        } else if (!cap.available) {
            setStatus('Waiting for HeroForge character runtime…');
        }
    }

    function initialize() {
        render();
        refreshCapability();
        state.pollTimer = setInterval(refreshCapability, 500);
        setTimeout(() => {
            if (state.capability !== 'available') {
                setStatus('Character runtime is still unavailable. Reload HeroForge and check for script conflicts.', 'error');
            }
        }, 30000);
    }

    function dispose() {
        if (state.disposed) return;
        state.disposed = true;
        if (state.pollTimer) clearInterval(state.pollTimer);
        state.pollTimer = null;
        state.host?.remove();
        state.host = null;
        state.shadow = null;
        try {
            delete pageWindow.__HF_COMPAT_CHARACTER_IO__;
        } catch {
            // Non-fatal.
        }
    }

    GM_registerMenuCommand('HF Character JSON — Save', exportCharacter);
    GM_registerMenuCommand('HF Character JSON — Load', importCharacter);
    GM_registerMenuCommand('HF Character JSON — Dispose UI', dispose);

    Object.defineProperty(pageWindow, '__HF_COMPAT_CHARACTER_IO__', {
        configurable: true,
        enumerable: false,
        value: {
            featureId: FEATURE_ID,
            version: VERSION,
            capability,
            exportCharacter,
            importCharacter,
            dispose,
        },
    });

    if (document.documentElement) initialize();
    else setTimeout(initialize, 0);
})();
