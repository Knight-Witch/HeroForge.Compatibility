// ==UserScript==
// @name         HF Compatibility — Projected Decal Transform (Experimental)
// @namespace    https://github.com/Knight-Witch/HeroForge.Compatibility
// @version      0.1.0
// @description  Experimental standalone compatibility module for forceProjectedScript and enableUnequalScaling on HeroForge build heroforge08.1.9.74.
// @author       Knight Witch
// @match        https://www.heroforge.com/*
// @match        http://www.heroforge.com/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

(() => {
    'use strict';

    const FEATURE_ID = 'decals.transform.projected';
    const VERSION = '0.1.0';
    const VERIFIED_BUILD = 'heroforge08.1.9.74';
    const TARGET_PATH = '/static/js/creationkit.js';
    const BYPASS_ATTRIBUTE = 'data-hf-compat-projected-bypass';
    const pageWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    const state = {
        enabled: GM_getValue('hfCompatProjectedEnabled', true),
        intercepted: false,
        bundleStatus: 'waiting',
        build: null,
        patchResults: [],
        errors: [],
        host: null,
        shadow: null,
        pollTimer: null,
        disposed: false,
        reloadRequired: false,
    };

    const PATCHES = [
        {
            id: 'decals.renderer.force-projected',
            expectedCount: 1,
            search: 'be=!!(me&&me.length>0),we=pe||be,ke=!pe||y<2,Ce=!!w.forceUVSet1',
            replacement: 'be=!!(me&&me.length>0),we=pe||be,ke=void 0===ve.forceProjectedScript?!pe||y<2:!ve.forceProjectedScript,Ce=!!w.forceUVSet1',
            postcondition: 'ke=void 0===ve.forceProjectedScript?!pe||y<2:!ve.forceProjectedScript',
        },
        {
            id: 'decals.renderer.unequal-scale',
            expectedCount: 1,
            search: 'pe&&!ke&&(Fe=Math.pow(2,null!==(Me=ve.s)&&void 0!==Me?Me:Re)*Ee',
            replacement: 'pe&&(!ke||ve.enableUnequalScaling)&&(Fe=Math.pow(2,null!==(Me=ve.s)&&void 0!==Me?Me:Re)*Ee',
            postcondition: 'pe&&(!ke||ve.enableUnequalScaling)&&(Fe=Math.pow(2',
        },
    ];

    function recordError(stage, error, extra = {}) {
        const entry = {
            at: new Date().toISOString(),
            stage,
            message: String(error?.message || error),
            ...extra,
        };
        state.errors.push(entry);
        console.error(`[${FEATURE_ID}] ${stage}`, error, extra);
        refreshUi();
    }

    function countExact(source, needle) {
        let count = 0;
        let index = 0;
        while (index <= source.length) {
            const found = source.indexOf(needle, index);
            if (found === -1) break;
            count += 1;
            index = found + Math.max(1, needle.length);
        }
        return count;
    }

    function extractBuild(url) {
        try {
            return new URL(url, location.href).searchParams.get('version');
        } catch {
            return null;
        }
    }

    function applyPatches(source) {
        let transformed = source;
        const results = [];

        for (const patch of PATCHES) {
            const count = countExact(transformed, patch.search);
            const result = {
                patchId: patch.id,
                expectedCount: patch.expectedCount,
                actualCount: count,
                status: count === patch.expectedCount ? 'matched' : 'failed',
            };
            results.push(result);

            if (count !== patch.expectedCount) {
                const error = new Error(
                    `${patch.id} expected ${patch.expectedCount} match; found ${count}.`
                );
                error.patchResults = results;
                throw error;
            }

            transformed = transformed.replace(patch.search, patch.replacement);

            const postCount = countExact(transformed, patch.postcondition);
            result.postconditionCount = postCount;
            if (postCount !== 1) {
                result.status = 'postcondition-failed';
                const error = new Error(
                    `${patch.id} postcondition expected once; found ${postCount}.`
                );
                error.patchResults = results;
                throw error;
            }

            result.status = 'applied';
        }

        // Parse without executing. This is a syntax gate, not runtime validation.
        new Function(transformed);

        return { transformed, results };
    }

    function cloneExternalScript(original) {
        const fallback = document.createElement('script');
        for (const attribute of original.attributes || []) {
            if (attribute.name === 'src') continue;
            fallback.setAttribute(attribute.name, attribute.value);
        }
        fallback.setAttribute(BYPASS_ATTRIBUTE, 'true');
        fallback.async = false;
        fallback.src = original.src;
        return fallback;
    }

    function injectOriginalFallback(original, reason) {
        state.bundleStatus = 'fallback-original';
        state.patchResults = reason?.patchResults || state.patchResults;
        const fallback = cloneExternalScript(original);
        (document.head || document.documentElement).appendChild(fallback);
        console.warn(
            `[${FEATURE_ID}] Compatibility patch disabled; loading untouched HeroForge creationkit.js.`,
            reason
        );
        refreshUi();
    }

    function injectModifiedSource(source) {
        const script = document.createElement('script');
        script.setAttribute(BYPASS_ATTRIBUTE, 'true');
        script.textContent =
            `${source}\n;window.__HF_COMPAT_PROJECTED_BUNDLE_EXECUTED__={` +
            `featureId:${JSON.stringify(FEATURE_ID)},version:${JSON.stringify(VERSION)},` +
            `build:${JSON.stringify(state.build)},at:new Date().toISOString()};`;
        (document.head || document.documentElement).appendChild(script);
        state.bundleStatus = 'modified-injected';
        refreshUi();
    }

    async function intercept(original) {
        if (state.intercepted || !state.enabled || state.disposed) return;
        state.intercepted = true;
        state.bundleStatus = 'fetching';
        state.build = extractBuild(original.src);
        refreshUi();

        original.remove();

        try {
            const response = await fetch(original.src, {
                credentials: 'same-origin',
                cache: 'no-store',
            });
            if (!response.ok) {
                throw new Error(`creationkit.js fetch failed with HTTP ${response.status}.`);
            }

            const untouched = await response.text();
            const { transformed, results } = applyPatches(untouched);
            state.patchResults = results;

            injectModifiedSource(transformed);

            setTimeout(() => {
                if (pageWindow.__HF_COMPAT_PROJECTED_BUNDLE_EXECUTED__) {
                    state.bundleStatus = 'active-unverified';
                } else {
                    state.bundleStatus = 'injection-not-confirmed';
                    recordError(
                        'execution-check',
                        new Error('Modified bundle execution sentinel was not observed.')
                    );
                }
                refreshUi();
            }, 1500);
        } catch (error) {
            state.patchResults = error.patchResults || state.patchResults;
            recordError('patch-or-fetch', error, { build: state.build });
            injectOriginalFallback(original, error);
        }
    }

    function observeCreationKit() {
        const inspect = (node) => {
            if (
                !(node instanceof Element) ||
                node.tagName !== 'SCRIPT' ||
                !node.src ||
                node.hasAttribute(BYPASS_ATTRIBUTE)
            ) {
                return;
            }

            let path;
            try {
                path = new URL(node.src, location.href).pathname;
            } catch {
                return;
            }

            if (path.endsWith(TARGET_PATH)) {
                void intercept(node);
            }
        };

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    inspect(node);
                    node.querySelectorAll?.('script[src]').forEach(inspect);
                }
            }
        });

        const start = () => {
            observer.observe(document.documentElement || document, {
                childList: true,
                subtree: true,
            });
            document.querySelectorAll('script[src]').forEach(inspect);
        };

        if (document.documentElement) start();
        else setTimeout(start, 0);

        return observer;
    }

    function decalRecords() {
        const decals = pageWindow.CK?.activeData?.decals;
        if (!decals || typeof decals !== 'object') return [];

        const records = [];
        for (const [slot, layers] of Object.entries(decals)) {
            if (!layers || typeof layers !== 'object') continue;
            for (const [layer, record] of Object.entries(layers)) {
                if (!record || typeof record !== 'object') continue;
                records.push({
                    slot,
                    layer,
                    record,
                    id: record.id ?? 'none',
                    label: `${slot} / layer ${layer} / decal ${record.id ?? 'none'}`,
                });
            }
        }
        return records;
    }

    function selectedRecord() {
        const select = state.shadow?.querySelector('.decal');
        const key = select?.value;
        return decalRecords().find((entry) => `${entry.slot}\u0000${entry.layer}` === key) || null;
    }

    function writeRecord(entry, patch) {
        const CK = pageWindow.CK;
        if (typeof CK?.activeTweak !== 'function') {
            throw new Error('CK.activeTweak is unavailable.');
        }

        const currentSlot = CK.activeData?.decals?.[entry.slot] || {};
        const currentRecord = currentSlot?.[entry.layer] || {};
        CK.activeTweak({
            decals: {
                ...CK.activeData.decals,
                [entry.slot]: {
                    ...currentSlot,
                    [entry.layer]: {
                        ...currentRecord,
                        ...patch,
                    },
                },
            },
        });
    }

    function toggleField(field, checked) {
        try {
            const entry = selectedRecord();
            if (!entry) throw new Error('Select a decal layer first.');
            writeRecord(entry, { [field]: Boolean(checked) });
            setPanelStatus(
                `${field} set to ${Boolean(checked)} for ${entry.slot} / ${entry.layer}.`,
                'success'
            );
            setTimeout(refreshDecalUi, 100);
        } catch (error) {
            recordError('write-decal-state', error);
            setPanelStatus(error.message, 'error');
        }
    }

    function setPanelStatus(message, kind = 'normal') {
        const node = state.shadow?.querySelector('.panel-status');
        if (!node) return;
        node.textContent = message;
        node.dataset.kind = kind;
    }

    function refreshDecalUi() {
        if (!state.shadow || state.disposed) return;
        const select = state.shadow.querySelector('.decal');
        const prior = select.value;
        const records = decalRecords();

        select.innerHTML = '';
        for (const entry of records) {
            const option = document.createElement('option');
            option.value = `${entry.slot}\u0000${entry.layer}`;
            option.textContent = entry.label;
            select.appendChild(option);
        }

        if (records.some((entry) => `${entry.slot}\u0000${entry.layer}` === prior)) {
            select.value = prior;
        }

        const entry = selectedRecord();
        const project = state.shadow.querySelector('.project');
        const unequal = state.shadow.querySelector('.unequal');
        const available = Boolean(entry);

        project.disabled = !available;
        unequal.disabled = !available;

        if (entry) {
            const layerNumber = Number.parseInt(entry.layer, 10);
            project.checked =
                entry.record.forceProjectedScript ??
                (Number.isFinite(layerNumber) ? layerNumber >= 2 : false);
            unequal.checked = Boolean(entry.record.enableUnequalScaling);
        } else {
            project.checked = false;
            unequal.checked = false;
        }

        refreshUi();
    }

    function renderUi() {
        if (state.host || !document.documentElement || state.disposed) return;

        const host = document.createElement('div');
        host.id = 'hf-compat-projected-decal-host';
        host.style.position = 'fixed';
        host.style.right = '12px';
        host.style.bottom = '12px';
        host.style.zIndex = '2147483646';
        document.documentElement.appendChild(host);

        const shadow = host.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <style>
                :host { all: initial; }
                .panel {
                    width: 300px;
                    box-sizing: border-box;
                    padding: 10px;
                    border: 1px solid rgba(255,255,255,.22);
                    border-radius: 9px;
                    background: rgba(18,18,22,.96);
                    color: #f3f3f3;
                    font: 12px/1.35 system-ui, sans-serif;
                    box-shadow: 0 8px 24px rgba(0,0,0,.45);
                }
                .title { font-weight: 700; }
                .warning { color: #ffd39a; margin: 4px 0 8px; }
                select {
                    width: 100%;
                    box-sizing: border-box;
                    margin-bottom: 7px;
                    padding: 5px;
                    color: #f3f3f3;
                    background: #2c2c33;
                    border: 1px solid rgba(255,255,255,.22);
                    border-radius: 5px;
                }
                label {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    margin: 6px 0;
                }
                .bundle, .panel-status {
                    margin-top: 7px;
                    overflow-wrap: anywhere;
                }
                .panel-status { min-height: 2.7em; color: #c9c9d2; }
                .panel-status[data-kind="success"] { color: #b7efc5; }
                .panel-status[data-kind="error"] { color: #ffb4b4; }
                button {
                    width: 100%;
                    margin-top: 5px;
                    border: 1px solid rgba(255,255,255,.24);
                    border-radius: 6px;
                    padding: 6px;
                    background: rgba(255,255,255,.10);
                    color: inherit;
                    cursor: pointer;
                    font: inherit;
                }
                .footer { margin-top: 5px; color: #8f8f9c; font-size: 10px; }
            </style>
            <div class="panel">
                <div class="title">Projected Decal Compatibility</div>
                <div class="warning">Experimental. Disable other creationkit.js rewriters.</div>
                <select class="decal"></select>
                <label><input class="project" type="checkbox"> Project</label>
                <label><input class="unequal" type="checkbox"> Unequal Scaling</label>
                <button class="refresh" type="button">Refresh decal list</button>
                <div class="bundle"></div>
                <div class="panel-status">Select a decal layer.</div>
                <div class="footer">${FEATURE_ID} · v${VERSION}</div>
            </div>
        `;

        shadow.querySelector('.project').addEventListener('change', (event) => {
            toggleField('forceProjectedScript', event.target.checked);
        });
        shadow.querySelector('.unequal').addEventListener('change', (event) => {
            toggleField('enableUnequalScaling', event.target.checked);
        });
        shadow.querySelector('.decal').addEventListener('change', refreshDecalUi);
        shadow.querySelector('.refresh').addEventListener('click', refreshDecalUi);

        state.host = host;
        state.shadow = shadow;
        refreshDecalUi();
    }

    function refreshUi() {
        if (!state.shadow) return;
        const bundle = state.shadow.querySelector('.bundle');
        const buildText = state.build || 'unknown build';
        bundle.textContent =
            `Bundle: ${state.bundleStatus} · ${buildText}` +
            (state.build && state.build !== VERIFIED_BUILD ? ' · NOT VERIFIED' : '');
    }

    function initializeUiWhenReady() {
        renderUi();
        state.pollTimer = setInterval(refreshDecalUi, 1000);
    }

    function setEnabled(enabled) {
        const next = Boolean(enabled);
        GM_setValue('hfCompatProjectedEnabled', next);
        if (next !== state.enabled) {
            state.enabled = next;
            state.reloadRequired = true;
            alert(
                `Projected Decal Compatibility is now ${next ? 'enabled' : 'disabled'}. ` +
                'Reload HeroForge for the change to take effect.'
            );
        }
    }

    function dispose() {
        if (state.disposed) return;
        state.disposed = true;
        if (state.pollTimer) clearInterval(state.pollTimer);
        state.pollTimer = null;
        state.host?.remove();
        state.host = null;
        state.shadow = null;
        state.reloadRequired = true;
        console.warn(
            `[${FEATURE_ID}] UI disposed. The boot-time renderer patch remains active until page reload.`
        );
    }

    GM_registerMenuCommand(
        `Projected Decal Compatibility: ${state.enabled ? 'ON' : 'OFF'} (reload required)`,
        () => setEnabled(!state.enabled)
    );
    GM_registerMenuCommand('Projected Decal Compatibility — Show/refresh panel', () => {
        renderUi();
        refreshDecalUi();
    });
    GM_registerMenuCommand('Projected Decal Compatibility — Dispose UI', dispose);

    Object.defineProperty(pageWindow, '__HF_COMPAT_PROJECTED_DECALS__', {
        configurable: true,
        enumerable: false,
        value: {
            featureId: FEATURE_ID,
            version: VERSION,
            verifiedBuild: VERIFIED_BUILD,
            state,
            patches: PATCHES.map((patch) => ({
                id: patch.id,
                expectedCount: patch.expectedCount,
            })),
            applyPatches,
            decalRecords,
            setEnabled,
            dispose,
        },
    });

    if (state.enabled) {
        observeCreationKit();
    } else {
        state.bundleStatus = 'disabled';
    }

    if (document.documentElement) initializeUiWhenReady();
    else setTimeout(initializeUiWhenReady, 0);
})();
