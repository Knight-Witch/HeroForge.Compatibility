# Validation — Spinny Mini WebP Witch Dock Stable Promotion

Date: 2026-09-06  
Feature ID: `media.spinny-mini-webp`  
HeroForge target: `heroforge07.1.9.98`

## Result

**Public Witch Dock Stable promotion completed. Clean public Stable smoke remains pending.**

Public Witch Dock release:

- userscript version: `1.1.0`;
- promotion commit: `8d96dd803f452c3c7b623c6963b4fdb3ef762f59`;
- public branch: `Witch_Scripts`.

## Evidence entering promotion

Maintained standalone v0.5.0 had already passed:

- native 1024/2048 capture paths;
- repaired TRUE-3K 3072 Short Test;
- repaired TRUE-3K 3072 Standard 250-frame full capture;
- repaired TRUE-3K 3072 Slower 500-frame full capture;
- parser/mux validation;
- progress/ETA;
- rotation restoration;
- repeated use;
- general cancel;
- frame-boundary Pause/Resume;
- cancel while paused;
- paused-time ETA accounting;
- camera and Booth interaction guards.

Final Witch Dock Dev consumer:

- service v0.5.1 / build `0.5.1-witch-dock-dev-download-scroll-guard`;
- UI v0.1.1 / build `0.1.1-dev-download-ux`;
- hardening commit `fa75a9c1790009b4b4ae1a1162d419982e20545e`.

Final integrated Dev re-smoke reported by the user:

- silent wheel/scroll block: PASS;
- privileged WebP download: PASS;
- integrated feature overall: works perfectly;
- explicit approval to roll out public Witch Dock update.

The optional transient in-panel download-complete indicator was not observed. The user explicitly stated this was not a concern because the browser download UI visibly confirms the save. It is non-gating.

## Promotion scope

The Stable release deliberately promoted only the accepted Spinny delta:

- public Spinny service;
- public Spinny UI;
- two public manifest entries;
- public userscript `GM_download` permission/host;
- Stable tracking documentation.

The promotion did not merge `WITCH_DEV_UI` wholesale.

Excluded:

- Developer Mode;
- compact High Res UI;
- Dev module-version registry;
- Dev loader;
- unrelated tab-order/UI work.

## Static Stable gate

The Stable candidate passed pre-promotion static checks covering:

- public loader JavaScript syntax;
- Spinny service/UI JavaScript syntax;
- manifest JSON parsing;
- public version and download-host wiring;
- Spinny version/build identities;
- public resolution labels;
- silent wheel guard;
- awaited download host;
- dark dropdown option styling;
- popout tooltip/icon;
- public manifest branch URLs;
- exclusion of Developer Mode / compact High Res Dev UI;
- no Spinny ownership assignment to `BT.maker.takeScreenshot`;
- diff whitespace gate.

## Compatibility boundary

Existing public `media.screenshot-resolution` still owns square 4096/8192 screenshot repair. Spinny does not replace that provider. 1024/2048/3072 pass through its non-owned size boundary, and repaired 3072 operates temporarily at `CK.Effects.renderToCanvas`.

4096 animated WebP remains deferred.

## Remaining gate

Run one clean public v1.1.0 smoke with Dev/temporary Spinny scripts disabled:

1. confirm Spinny renders in Photo Booth;
2. complete 1024px Standard / 250 frames;
3. confirm WebP download;
4. confirm silent wheel suppression;
5. confirm one non-wheel guard warning.

If those pass, public Stable can be marked fully validated without repeating the expensive TRUE-3K production matrix.
