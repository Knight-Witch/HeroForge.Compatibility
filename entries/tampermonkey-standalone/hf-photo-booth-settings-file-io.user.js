// ==UserScript==
// @name         HF Compatibility — Photo Booth Settings File I/O
// @namespace    https://github.com/Knight-Witch/HeroForge.Compatibility
// @version      0.1.0
// @description  Standalone Photo Booth settings export/import using the current BT.maker.effectState runtime.
// @author       Knight Witch
// @match        https://www.heroforge.com/*
// @match        http://www.heroforge.com/*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

(() => {
    'use strict';

    const FEATURE_ID = 'photo-booth.settings-file-io';
    const VERSION = '0.1.0';
    const pageWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const state = {
        disposed: false,
        pollTimer: null,
        host: null,
        shadow: null,
        status: 'Open Photo Booth to initialize its settings runtime.',
        adapter: null,
    };

    function log(level, message, extra) {
        const fn = console[level] || console.log;
        fn.call(console, `[${FEATURE_ID}] ${message}`, extra || '');
    }

    function timestamp() {
        return new Date().toISOString().replace(/[:.-]/g, '');
    }

    function sanitizeFilename(value) {
        const cleaned = String(value || 'Hero')
            .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_')
            .replace(/\s+/g, ' ')
            .trim();
        return cleaned || 'Hero';
    }

    function characterName() {
        return sanitizeFilename(
            pageWindow.CK?.data?.meta?.character_name ||
            pageWindow.CK?.character?.data?.meta?.character_name ||
            'Hero'
        );
    }

    function resolveAdapter() {
        const current = pageWindow.BT?.maker?.effectState;
        if (
            current &&
            typeof current.save === 'function' &&
            typeof current.load === 'function'
        ) {
            return {
                id: 'BT.maker.effectState.save/load',
                target: current,
                async save() {
                    return current.save.call(current);
                },
                async load(data) {
                    return current.load.call(current, data);
                },
            };
        }

        const legacy = pageWindow.TN?.tokenizer?.effectState;
        if (
            legacy &&
            typeof legacy.toJson === 'function' &&
            typeof legacy.fromJson === 'function'
        ) {
            return {
                id: 'TN.tokenizer.effectState.toJson/fromJson',
                target: legacy,
                async save() {
                    return legacy.toJson.call(legacy);
                },
                async load(data) {
                    return legacy.fromJson.call(legacy, data);
                },
            };
        }

        return null;
    }

    function normalizeSavedState(value) {
        if (value && typeof value.then === 'function') {
            return value.then(normalizeSavedState);
        }

        if (typeof value === 'string') {
            const parsed = JSON.parse(value);
            if (!parsed || typeof parsed !== 'object') {
                throw new Error('Booth save returned JSON that is not an object.');
            }
            return parsed;
        }

        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            throw new Error('Booth save did not return a settings object.');
        }

        return value;
    }

    function downloadJson(data) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${characterName()}_${timestamp()}.photo_booth.json`;
        document.documentElement.appendChild(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function chooseJsonFile() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.photo_booth.json,application/json,.json';
            input.style.display = 'none';

            input.addEventListener('change', async () => {
                try {
                    const file = input.files?.[0];
                    if (!file) {
                        resolve(null);
                        return;
                    }
                    const parsed = JSON.parse(await file.text());
                    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
                        throw new Error('Selected file does not contain a Booth settings object.');
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

    async function exportSettings() {
        try {
            const adapter = resolveAdapter();
            if (!adapter) {
                throw new Error('Booth settings runtime is unavailable. Open Photo Booth first.');
            }
            setStatus(`Reading settings through ${adapter.id}…`);
            const saved = await normalizeSavedState(await adapter.save());
            downloadJson(saved);
            setStatus('Photo Booth settings downloaded.', 'success');
        } catch (error) {
            log('error', 'Export failed.', error);
            setStatus(`Export failed: ${error.message}`, 'error');
        }
    }

    async function importSettings() {
        try {
            const adapter = resolveAdapter();
            if (!adapter) {
                throw new Error('Booth settings runtime is unavailable. Open Photo Booth first.');
            }

            const data = await chooseJsonFile();
            if (!data) {
                setStatus('Import cancelled.');
                return;
            }

            setStatus(`Applying settings through ${adapter.id}…`);
            const result = adapter.load(data);
            if (result && typeof result.then === 'function') {
                await result;
            }

            if (typeof pageWindow.BT?.maker?.update === 'function') {
                pageWindow.BT.maker.update();
            }
            if (typeof pageWindow.CK?.GameLoop?.requestRenderRefresh === 'function') {
                pageWindow.CK.GameLoop.requestRenderRefresh();
            }

            setStatus('Photo Booth settings applied.', 'success');
        } catch (error) {
            log('error', 'Import failed.', error);
            setStatus(`Import failed: ${error.message}`, 'error');
        }
    }

    function render() {
        if (state.host || !document.documentElement || state.disposed) return;

        const host = document.createElement('div');
        host.id = 'hf-compat-booth-settings-io-host';
        host.style.position = 'fixed';
        host.style.left = '12px';
        host.style.bottom = '118px';
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
                <div class="title">Photo Booth Settings I/O</div>
                <div class="buttons">
                    <button class="save" type="button">Save Settings</button>
                    <button class="load" type="button">Load Settings</button>
                </div>
                <div class="status"></div>
                <div class="footer">${FEATURE_ID} · v${VERSION}</div>
            </div>
        `;

        shadow.querySelector('.save').addEventListener('click', exportSettings);
        shadow.querySelector('.load').addEventListener('click', importSettings);

        state.host = host;
        state.shadow = shadow;
        refreshCapability();
    }

    function refreshCapability() {
        if (state.disposed) return;
        const adapter = resolveAdapter();
        state.adapter = adapter;

        if (state.shadow) {
            state.shadow.querySelector('.save').disabled = !adapter;
            state.shadow.querySelector('.load').disabled = !adapter;
        }

        if (adapter && state.status.startsWith('Open Photo Booth')) {
            setStatus(`Ready: ${adapter.id}`, 'success');
        } else if (!adapter && !state.status.startsWith('Export failed') && !state.status.startsWith('Import failed')) {
            setStatus('Open Photo Booth to initialize its settings runtime.');
        }
    }

    function initialize() {
        render();
        refreshCapability();
        state.pollTimer = setInterval(refreshCapability, 500);
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
            delete pageWindow.__HF_COMPAT_BOOTH_SETTINGS_IO__;
        } catch {
            // Non-fatal.
        }
    }

    GM_registerMenuCommand('HF Booth Settings — Save', exportSettings);
    GM_registerMenuCommand('HF Booth Settings — Load', importSettings);
    GM_registerMenuCommand('HF Booth Settings — Dispose UI', dispose);

    Object.defineProperty(pageWindow, '__HF_COMPAT_BOOTH_SETTINGS_IO__', {
        configurable: true,
        enumerable: false,
        value: {
            featureId: FEATURE_ID,
            version: VERSION,
            resolveAdapter,
            exportSettings,
            importSettings,
            dispose,
        },
    });

    if (document.documentElement) initialize();
    else setTimeout(initialize, 0);
})();
