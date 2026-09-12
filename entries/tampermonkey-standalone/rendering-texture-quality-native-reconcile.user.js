// ==UserScript==
// @name         HF Compatibility - Native Texture Reconcile TEST
// @namespace    https://github.com/Knight-Witch/HeroForge.Compatibility
// @version      0.2.0-alpha.3
// @description  Experimental high-resolution source policy with native HeroForge atlas/resource reconciliation.
// @author       Knight Witch
// @match        https://www.heroforge.com/*
// @match        https://heroforge.com/*
// @grant        none
// @sandbox      raw
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

  const BUILD = '0.2.0-alpha.3-native-reconcile';
  const API = 'HFNativeTextureReconcileTest';
  const TARGETS = ['bodyLower', 'bodyUpper', 'face'];
  const BODIES = ['bodyLower', 'bodyUpper'];
  const SCALE = 4;
  const BAKE = 2048;
  const USED = 1024; // minimum protected source size; body masks remain exactly 1024px
  const OWNER = 82042049;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  let session = null;
  let busy = false;
  let enabled = false;
  let button = null;
  let status = null;
  let lastError = null;
  let lastVerification = null;

  const own = (o, k) => ({ o, k, had: Object.prototype.hasOwnProperty.call(o, k), d: Object.getOwnPropertyDescriptor(o, k), v: o[k] });
  function restore(x) {
    if (!x || !x.o) return;
    try { if (x.had && x.d) Object.defineProperty(x.o, x.k, x.d); else delete x.o[x.k]; }
    catch (_) { try { x.o[x.k] = x.v; } catch (_) {} }
  }
  const partId = (p) => p ? [p.id ?? '', p.baseName ?? '', p.name ?? ''].join('|') : null;
  const texSize = (t) => t && t.image ? [Number(t.image.width) || 0, Number(t.image.height) || 0] : [0, 0];
  const atlasSize = (a) => a ? [Number(a.width), Number(a.height)] : null;
  function allocation(a, slot) {
    if (!a || typeof a.getUV !== 'function') return null;
    try { const u = a.getUV(slot); return u ? [Math.round(u.z * a.width), Math.round(u.w * a.height)] : null; }
    catch (_) { return null; }
  }

  function capabilities() {
    const CK = window.CK, c = CK && CK.character, d = c && c.data, display = c && c.display;
    const m = display && display.modded, parts = m && m.parts, meshes = display && display.meshes, R = CK && CK.Resources;
    if (!CK || !c || !d || !display || !m || !parts || !meshes) return { ok: false, reason: 'HeroForge renderer is not ready.' };
    if (!d.atlasScale || typeof d.change !== 'function' || typeof c.refresh !== 'function' || typeof m.buildAtlas !== 'function') return { ok: false, reason: 'Required native lifecycle API is unavailable.' };
    if (!R || typeof R.getResource !== 'function' || typeof R.getNow !== 'function') return { ok: false, reason: 'Texture resource loader is unavailable.' };
    for (const k of TARGETS) if (!parts[k]) return { ok: false, reason: `${k} part is unavailable.` };
    for (const k of BODIES) if (!meshes[k] || typeof parts[k].getMaskPath !== 'function') return { ok: false, reason: `${k} mask capability is unavailable.` };
    return { ok: true, CK, c, d, display, m, parts, meshes, R };
  }

  function sameCharacter(s) {
    const CK = window.CK, c = CK && CK.character;
    return !!s && c === s.c && c.data === s.d;
  }

  function adoptCurrent(s) {
    if (!sameCharacter(s)) return false;
    const display = s.c.display, m = display && display.modded;
    if (!display || !m || !m.parts || !display.meshes) return false;
    if (!TARGETS.every((k) => partId(m.parts[k]) === s.ids[k])) return false;
    if (display !== s.display || m !== s.m) {
      s.display = display;
      s.m = m;
      s.adoptions += 1;
    }
    return true;
  }

  function rememberScale(s) {
    const o = s.d.atlasScale;
    if (!s.scales.some((x) => x.o === o)) s.scales.push({ o, rows: TARGETS.map((k) => own(o, k)) });
  }
  function rememberPart(s, p) {
    if (!s.partsSeen.some((x) => x.o === p)) s.partsSeen.push({ o: p, bakeSize: p.bakeSize, used: p._usedTextureSize });
  }
  function rememberMesh(s, mesh) {
    if (!s.meshesSeen.some((x) => x.o === mesh)) s.meshesSeen.push({ o: mesh, mask: own(mesh, 'masksMapOverride') });
  }

  async function loadMasks(cap) {
    const hi = !!(cap.m.settings && cap.m.settings.hiRez);
    const paths = BODIES.map((k) => cap.parts[k].getMaskPath(hi, USED));
    if (!paths[0] || !paths[1]) throw new Error('Could not resolve supported 1024px body masks.');
    await Promise.all(paths.map((p) => Promise.resolve(cap.R.getResource(p, 'webp', OWNER))));
    const end = Date.now() + 5000;
    while (Date.now() < end && (!cap.R.getNow(paths[0]) || !cap.R.getNow(paths[1]))) await sleep(100);
    const textures = paths.map((p) => cap.R.getNow(p));
    if (textures.some((t) => texSize(t)[0] !== USED || texSize(t)[1] !== USED)) throw new Error('Valid 1024px body masks did not load.');
    return { bodyLower: textures[0], bodyUpper: textures[1], paths };
  }

  function current(s) {
    if (!adoptCurrent(s)) throw new Error('HeroForge character/data/target parts changed; refusing stale mutation.');
    return { parts: s.m.parts, meshes: s.display.meshes };
  }

  function applyPolicy(s) {
    const x = current(s);
    rememberScale(s);
    for (const k of TARGETS) s.d.atlasScale[k] = SCALE;
    for (const k of TARGETS) {
      rememberPart(s, x.parts[k]);
      x.parts[k].bakeSize = BAKE;
      x.parts[k]._usedTextureSize = USED;
    }
    for (const k of BODIES) {
      rememberMesh(s, x.meshes[k]);
      x.meshes[k].masksMapOverride = s.masks[k];
    }
  }

  function restorePolicy(s) {
    for (const x of s.scales) for (const row of x.rows) restore(row);
    for (const x of s.partsSeen) {
      try { x.o.bakeSize = x.bakeSize; x.o._usedTextureSize = x.used; } catch (_) {}
    }
    for (const x of s.meshesSeen) restore(x.mask);
  }

  function nativeReconcile(s) {
    if (!adoptCurrent(s)) throw new Error('HeroForge character/data changed before reconcile.');
    s.d.change({}, s.c.settings);
    applyPolicy(s);
    s.m.buildAtlas();
    s.c.refresh();
  }

  function nativeRestore(s) {
    if (!adoptCurrent(s)) throw new Error('HeroForge character/data changed before restore.');
    s.d.change({}, s.c.settings);
    s.c.refresh();
  }

  async function settle(s) {
    const end = Date.now() + 12000;
    let last = '', stable = 0;
    while (Date.now() < end) {
      if (!sameCharacter(s)) throw new Error('HeroForge character/data changed during reconcile.');
      const display = s.c.display, m = display && display.modded;
      if (!display || !m || !m.parts || !display.meshes) { await sleep(150); continue; }
      if (!TARGETS.every((k) => partId(m.parts[k]) === s.ids[k])) throw new Error('HeroForge target parts changed during reconcile.');
      if (display !== s.display || m !== s.m) {
        s.display = display;
        s.m = m;
        s.adoptions += 1;
      }
      const a = display.atlas, r = m.resourceAtlas;
      const sig = JSON.stringify([!s.c._needsUpdating, !s.c._inUpdate, display.resourcesReady, display.finished, a === r, atlasSize(a), TARGETS.map((k) => allocation(a, k))]);
      if (!s.c._needsUpdating && !s.c._inUpdate && display.resourcesReady !== false && display.finished !== false && a && a === r) {
        stable = sig === last ? stable + 1 : 1;
        if (stable >= 3) return;
      } else stable = 0;
      last = sig;
      await sleep(150);
    }
    throw new Error('Timed out waiting for native reconciliation to settle.');
  }

  function verify(s) {
    if (!adoptCurrent(s)) return { ok: false, reason: 'HeroForge character/data/target parts changed.' };
    const x = current(s), a = s.display.atlas, r = s.m.resourceAtlas;
    const out = { ok: true, build: BUILD, atlas: atlasSize(a), sameAtlas: a === r, adoptedGenerations: s.adoptions, allocations: {}, scale: {}, bakeSize: {}, usedTextureSize: {}, nativePromoted: {}, masks: {} };
    if (!out.sameAtlas) return { ...out, ok: false, reason: 'Display/resource atlas objects differ.' };
    for (const k of TARGETS) {
      out.allocations[k] = allocation(a, k);
      out.scale[k] = s.d.atlasScale[k];
      out.bakeSize[k] = x.parts[k].bakeSize;
      out.usedTextureSize[k] = x.parts[k]._usedTextureSize;
      const used = Number(out.usedTextureSize[k]);
      out.nativePromoted[k] = used > USED;
      if (Number(out.scale[k]) !== SCALE || Number(out.bakeSize[k]) !== BAKE || !Number.isFinite(used) || used < USED || used > BAKE || !out.allocations[k] || out.allocations[k][0] < USED || out.allocations[k][1] < USED || out.allocations[k][0] > BAKE || out.allocations[k][1] > BAKE) return { ...out, ok: false, reason: `${k} high-resolution source/allocation verification failed.` };
    }
    for (const k of BODIES) {
      const mat = x.meshes[k].bakeMaterials && x.meshes[k].bakeMaterials.color;
      const actual = mat && typeof mat.getUniform === 'function' ? mat.getUniform('masksMap') : null;
      out.masks[k] = { expected: texSize(s.masks[k]), actual: texSize(actual), overrideSame: x.meshes[k].masksMapOverride === s.masks[k] };
      if (out.masks[k].expected[0] !== USED || out.masks[k].expected[1] !== USED || out.masks[k].actual[0] !== USED || out.masks[k].actual[1] !== USED || !out.masks[k].overrideSame) return { ...out, ok: false, reason: `${k} color-bake mask is not the pinned 1024px texture.` };
    }
    return out;
  }

  async function enable() {
    if (busy || enabled) return;
    busy = true;
    lastError = null;
    paint('Preparing native reconcile…');
    sync();
    let s = null;
    try {
      const cap = capabilities();
      if (!cap.ok) throw new Error(cap.reason);
      s = {
        c: cap.c,
        d: cap.d,
        display: cap.display,
        m: cap.m,
        ids: Object.fromEntries(TARGETS.map((k) => [k, partId(cap.parts[k])])),
        scales: [],
        partsSeen: [],
        meshesSeen: [],
        adoptions: 0,
        baseline: {
          atlas: atlasSize(cap.display.atlas),
          allocations: Object.fromEntries(TARGETS.map((k) => [k, allocation(cap.display.atlas, k)]))
        },
        masks: null
      };
      s.masks = await loadMasks(cap);
      if (!adoptCurrent(s)) throw new Error('HeroForge changed while masks loaded.');
      applyPolicy(s);
      session = s;
      nativeReconcile(s);
      await settle(s);
      lastVerification = verify(s);
      if (!lastVerification.ok) throw new Error(lastVerification.reason);
      enabled = true;
      paint(`ON — ${lastVerification.atlas.join('×')}`);
    } catch (e) {
      lastError = String(e && e.message || e);
      enabled = false;
      if (s && adoptCurrent(s)) {
        try {
          restorePolicy(s);
          nativeRestore(s);
          await settle(s);
        } catch (r) {
          lastError += ` | restore: ${String(r && r.message || r)}`;
        }
      }
      if (session === s) session = null;
      paint(`FAILED — ${lastError}`, true);
      console.error('[HFC native texture reconcile]', e);
    } finally {
      busy = false;
      sync();
    }
  }

  async function disable() {
    if (busy || !session) return;
    busy = true;
    paint('Restoring source policy…');
    sync();
    const s = session;
    try {
      if (!adoptCurrent(s)) throw new Error('HeroForge character/data/target parts changed; stale snapshots not restored.');
      restorePolicy(s);
      nativeRestore(s);
      await settle(s);
      enabled = false;
      session = null;
      lastVerification = null;
      paint('OFF — source values restored; native atlas retained.');
    } catch (e) {
      lastError = String(e && e.message || e);
      enabled = false;
      session = null;
      paint(`OFF / restore warning — ${lastError}`, true);
      console.error('[HFC native texture reconcile]', e);
    } finally {
      busy = false;
      sync();
    }
  }

  async function reconcile() {
    if (busy || !enabled || !session) return false;
    busy = true;
    paint('Reconciling natively…');
    sync();
    try {
      applyPolicy(session);
      nativeReconcile(session);
      await settle(session);
      lastVerification = verify(session);
      if (!lastVerification.ok) throw new Error(lastVerification.reason);
      paint(`ON — ${lastVerification.atlas.join('×')}`);
      return true;
    } catch (e) {
      lastError = String(e && e.message || e);
      paint(`Reconcile failed — ${lastError}`, true);
      return false;
    } finally {
      busy = false;
      sync();
    }
  }

  function paint(text, error = false) {
    if (status) { status.textContent = text; status.style.color = error ? '#ff9c9c' : '#ddd'; }
  }
  function sync() {
    if (button) { button.disabled = busy; button.textContent = busy ? 'WORKING…' : enabled ? 'DISABLE' : 'ENABLE'; }
    if (window[API]) Object.assign(window[API], { build: BUILD, enabled, busy, lastError, lastVerification, baseline: session && session.baseline });
  }

  function install() {
    if (document.getElementById('hfc-native-reconcile-alpha')) return;
    const el = document.createElement('div');
    el.id = 'hfc-native-reconcile-alpha';
    el.style.cssText = 'position:fixed;right:14px;bottom:14px;z-index:2147483645;width:250px;background:#0b0b0ddd;color:#eee;border:1px solid #555;border-radius:7px;padding:10px;font:12px Arial;box-shadow:0 4px 18px #0008';
    el.innerHTML = '<b>Native Texture Reconcile α</b><button style="display:block;width:100%;margin-top:8px;padding:7px;background:#222;color:#fff;border:1px solid #777;border-radius:5px">ENABLE</button><div class="s" style="margin-top:8px">OFF</div><div style="margin-top:6px;color:#999;font-size:11px">Experimental native-generation texture test.</div>';
    button = el.querySelector('button');
    status = el.querySelector('.s');
    button.onclick = () => enabled ? void disable() : void enable();
    document.body.appendChild(el);
    sync();
  }

  window[API] = {
    build: BUILD,
    enabled,
    busy,
    lastError,
    lastVerification,
    baseline: null,
    enable,
    disable,
    reconcile,
    verify: () => session ? verify(session) : { ok: false, reason: 'No active session.' },
    capabilities: () => {
      const c = capabilities();
      return c.ok ? { ok: true, atlas: atlasSize(c.display.atlas), sameAtlas: c.display.atlas === c.m.resourceAtlas } : c;
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true }); else install();
})();
