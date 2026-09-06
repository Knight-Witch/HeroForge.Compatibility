# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Historical detail remains available in Git history; this file tracks current active status.

## Current Phase

**`media.spinny-mini-webp` is standalone validated, Witch Dock Dev validated, and now promoted to public Witch Dock Stable v1.1.0. One clean public Stable smoke remains before the Stable validation gate is closed.**

Current HeroForge validation target: `heroforge07.1.9.98`.

- Maintained standalone implementation: v0.5.0 / build `0.5.0-integrated-pause-interaction-guards`.
- Final Witch Dock Dev consumer: service v0.5.1 / UI v0.1.1.
- Final Dev hardening commit: `fa75a9c1790009b4b4ae1a1162d419982e20545e`.
- Public Witch Dock v1.1.0 promotion commit: `8d96dd803f452c3c7b623c6963b4fdb3ef762f59`.
- Public Stable status: **promoted; clean public smoke pending**.
- 4K animated WebP remains deferred.

`media.screenshot-resolution` and `decals.gizmo.bound-correction` remain Witch Dock Stable validated and were not reopened by the Spinny promotion.

## Repository Roles

- Compatibility / reconstruction: `Knight-Witch/HeroForge.Compatibility`
- Public Witch Dock consumer: `Knight-Witch/KnightWitch.Heroforge`
- Development-only live transport: private `Knight-Witch/HF-Chat-Bridge`
- Public Witch Dock runtime dependency on Compatibility unstable head: **none**
- Public Witch Dock runtime dependency on HF-Chat-Bridge: **none**

## Spinny Mini WebP

Feature ID: `media.spinny-mini-webp`.

Maintained standalone file:

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

Version: `0.5.0`  
Build: `0.5.0-integrated-pause-interaction-guards`

Validated standalone behavior:

- 1024 Standard / 250 frames: PASS
- 2048 Standard / 250 frames: PASS
- 1024 Very Slow / 750 frames: PASS
- 2048 Slower / 500 frames: PASS
- repaired TRUE-3K 3072 Standard / 250 frames: PASS
- repaired TRUE-3K 3072 Slower / 500 frames: PASS
- integrated 3072 Short Test / 16 frames: PASS
- repeated capture, parser/mux, progress, ETA and rotation restoration: PASS on tested runs
- cancel and starting-rotation restoration: PASS
- frame-boundary Pause/Resume at 1024 and repaired 3072: PASS
- cancel while paused: PASS
- paused-time ETA accounting: PASS
- camera/Booth interaction guards: PASS

Native unrepaired 3072 remains rejected because current HeroForge renders repeated 768px Effects phases under a structurally 3072 output path, producing visibly degraded detail.

## Witch Dock Dev Integration

Dev integration preserved the validated capture service and added the Witch Dock host/UI boundary.

Final Dev service:

- version `0.5.1`
- build `0.5.1-witch-dock-dev-download-scroll-guard`

Final Dev UI:

- version `0.1.1`
- build `0.1.1-dev-download-ux`

Validated integrated behavior includes:

- placement below High Res Image Capture;
- docked controls and shared-state draggable popout;
- Pause/Resume/Cancel;
- ETA/progress;
- interaction guards;
- silent wheel/scroll suppression with no modal;
- other continuity-invalidating actions retaining Keep Capture / Cancel Capture warning;
- dark dropdown options and plain `1024px / 2048px / 3072px` labels;
- privileged userscript download boundary using `GM_download`.

Final Dev re-smoke on 2026-09-06:

- silent scroll block: PASS;
- WebP download: PASS;
- user reported the integrated feature works perfectly and explicitly approved public rollout.

The optional transient in-panel download-complete flash was not observed and is non-gating because the browser download UI and privileged callback confirm the save.

## Public Witch Dock Stable Promotion

Public Witch Dock `Witch_Scripts` now contains the accepted Spinny delta as v1.1.0.

Promotion commit:

`8d96dd803f452c3c7b623c6963b4fdb3ef762f59`

The promotion was intentionally narrow. It added:

- public Spinny service v0.5.1;
- public Spinny UI v0.1.1;
- public manifest entries for those two modules;
- the tested `GM_download` host in `Witch_Dock.user.js`;
- Stable tracking documentation.

It did **not** merge the diverged `WITCH_DEV_UI` branch wholesale. Developer Mode, compact High Res UI, Dev module registry, Dev loader, and unrelated UI/order work remain separate.

Short Test remains part of the Spinny service but is hidden in ordinary public Stable because Developer Mode was not promoted.

## Next Gate

Perform one clean public Witch Dock v1.1.0 smoke with Dev/temporary Spinny scripts disabled.

Recommended minimum:

1. Update/install public Witch Dock v1.1.0 and approve the new download permission if prompted.
2. Reload HeroForge with Dev/standalone Spinny test scripts disabled.
3. Open Photo Booth and confirm Spinny appears normally under the existing High Resolution Capture section.
4. Run the cheapest public full profile: 1024px Standard / 250 frames.
5. Confirm download succeeds.
6. Confirm mouse wheel over the HeroForge canvas is silently blocked during capture.
7. Confirm one non-wheel guarded Booth/canvas action still shows the warning modal.

If that smoke passes, close the Stable gate with documentation-only checkpoints in both repositories. Do not repeat expensive 3072 production validation absent a regression.

## 4K Spinny

4096 animated WebP remains deferred because public `media.screenshot-resolution` owns square 4096/8192 still requests. A future 4K animation path requires a separately validated explicit frame-capture capability that does not displace that provider.
