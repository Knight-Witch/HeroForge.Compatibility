# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Historical detail remains available in Git history; this file tracks current active status.

## Current Phase

**`media.spinny-mini-webp` remains standalone/Dev validated and is now carried by public Witch Dock v1.2.0. The v1.2.0 host/UI release is promoted; one clean public v1.2.0 smoke remains before the current Stable gate is closed.**

Current HeroForge validation target: `heroforge07.1.9.98`.

- Maintained standalone implementation: v0.5.0 / build `0.5.0-integrated-pause-interaction-guards`.
- Final Witch Dock Dev consumer: service v0.5.1 / UI v0.1.1.
- Final Dev hardening commit: `fa75a9c1790009b4b4ae1a1162d419982e20545e`.
- Original public Spinny v1.1.0 promotion commit: `8d96dd803f452c3c7b623c6963b4fdb3ef762f59`.
- Current public Witch Dock v1.2.0 commit: `b5e366e3f6c06d661e8bc1d59f8cb190ad7401f6`.
- Public v1.2.0 adds validated tab cleanup, compact High Res service/UI ownership, and About-only Developer Mode; public Spinny service/UI source is unchanged from v1.1.0.
- Public Stable status: **v1.2.0 promoted; clean public smoke pending**.
- 4096 animated-WebP expansion is **not an active roadmap item** and requires no further work unless explicitly reopened.

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

Public Witch Dock `Witch_Scripts` now carries the accepted Spinny delta inside v1.2.0.

Original Spinny promotion commit:

`8d96dd803f452c3c7b623c6963b4fdb3ef762f59`

Current public host/UI release commit:

`b5e366e3f6c06d661e8bc1d59f8cb190ad7401f6`

The promotion was intentionally narrow. It added:

- public Spinny service v0.5.1;
- public Spinny UI v0.1.1;
- public manifest entries for those two modules;
- the tested `GM_download` host in `Witch_Dock.user.js`;
- Stable tracking documentation.

Neither Stable promotion merged the diverged `WITCH_DEV_UI` branch wholesale. Public v1.2.0 narrowly adds the separately validated tab presentation, compact High Res service/UI split, canonical module registry, and Developer Mode v0.3.0. The Dev loader remains excluded.

Developer Mode is public, optional/default-OFF, and toggled only from About. When enabled it reveals the existing Spinny Short Test and module/build diagnostics; normal mode still hides Short Test.

## Next Gate

Perform one clean public Witch Dock v1.2.0 smoke with the Dev loader and temporary standalone Spinny scripts disabled.

Recommended minimum:

1. Update/install public Witch Dock v1.2.0 and reload HeroForge.
2. Confirm visible order `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)` and Utilities tooltip.
3. Confirm compact `High Res Image Capture` appears once above Spinny.
4. In About, enable Developer Mode and confirm Stable module versions are shown, including core v1.2.0, Developer Mode v0.3.0, High Res service v0.8.0/UI v0.3.0, and Spinny v0.5.1/UI v0.1.1.
5. Use the now-public Developer Mode `Short Test` at 1024px Standard to confirm Spinny/download/guard sanity without repeating a 250-frame production run.
6. Turn Developer Mode OFF and confirm Short Test/diagnostics disappear while ordinary tools remain functional.

If this smoke passes, close the current public Stable gate with documentation-only checkpoints. Do not repeat expensive TRUE-3K production validation absent a regression.

## 4096 Spinny boundary

The technical ownership constraint remains: public `media.screenshot-resolution` owns square 4096/8192 still requests, so 4096 Spinny must not be added through that surface. **No 4096 animated-WebP expansion is currently planned.** Revisit only if the user explicitly reopens it and a clean frame-capture seam exists.
