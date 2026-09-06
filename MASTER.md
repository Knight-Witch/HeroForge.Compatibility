# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Historical detail remains available in Git history; this file tracks the current active state.

## Current Phase

**`media.spinny-mini-webp` v0.3.0 remains the committed maintained standalone runtime. A local v0.4.0 Pause/Resume candidate has passed all requested live tests; interaction-guard discovery is now active.**

- Native HeroForge 3072 remains rejected because it produces structurally 3072 output from 768px Effects phase renders and looks blurred/upscaled.
- TRUE-3K phase-feed repair is validated at Short Test, 250-frame full and 500-frame full levels.
- Post-consolidation 1024 Standard regression: PASS.
- Local v0.4.0 build `0.4.0-frame-boundary-pause-resume`: Pause/Resume live validation PASS by user report.
- Public Witch Dock remains untouched by Spinny runtime work.

`media.screenshot-resolution` and `decals.gizmo.bound-correction` remain Witch Dock Stable.

## Repository Roles

- Compatibility / reconstruction: `Knight-Witch/HeroForge.Compatibility`
- Public Witch Dock consumer: `Knight-Witch/KnightWitch.Heroforge`
- Development-only live transport: private `Knight-Witch/HF-Chat-Bridge`
- Public Witch Dock runtime dependency on Compatibility `main`: **none**

## Spinny Mini WebP

Feature ID: `media.spinny-mini-webp`.

Committed maintained implementation:

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

Version: `0.3.0`
Build: `0.3.0-integrated-true3k-short-test`

Validated production behavior on `heroforge07.1.9.98`:

- 1024 Standard / 250 frames: PASS
- 2048 Standard / 250 frames: PASS
- 1024 Very Slow / 750 frames: PASS
- 2048 Slower / 500 frames: PASS
- 3072 Standard / 250 frames TRUE-3K: PASS
- 3072 Slower / 500 frames TRUE-3K: PASS
- integrated 3072 Short Test / 16 frames: PASS
- repeat use / parser / progress / ETA / rotation restoration: PASS on tested runs
- general cancel / starting-rotation restore: PASS

## Local v0.4.0 Pause/Resume Validation

Candidate build: `0.4.0-frame-boundary-pause-resume`.

User reported all requested tests successful:

- 1024 Short Test pause/resume;
- 3072 TRUE-3K Short Test pause/resume;
- pause occurs after current frame completion;
- resume continues normally;
- cancel while paused works;
- restoration works;
- pause time does not corrupt ETA behavior.

The v0.4.0 source is not yet promoted into the maintained branch entrypoint. Do not treat the committed runtime as v0.4.0 until that atomic source/docs promotion occurs.

## Active Next Stage — Interaction Guards

Required behavior:

- warn/block camera/canvas wheel and drag before mutation;
- warn/block Photo Booth exit before exit;
- warn/block Booth view/backdrop/background/overlay/frame/lighting/effect changes that would invalidate continuity;
- same protection while paused;
- Spinny Pause/Resume/Cancel remain usable;
- if the user chooses cancel, cancel capture first and require the intended action to be repeated;
- no blind pointer-event replay;
- semantic/runtime/DOM classification only; no coordinate assumptions across HeroForge layouts.

Broad read-only DOM probe #492 completed but exceeded the bridge result-size limit. Guard discovery continues with narrower probes.

## Later Witch Dock Dev Stage

After standalone interaction-guard validation:

- host Spinny below High Res Image Capture;
- expose Short Test only through Developer Mode;
- support approved detachable/draggable popout with shared state;
- smoke-test with High Res provider and Developer Mode modules;
- promote to Stable only after separate review.

## 4K Spinny

4K Spinny remains deferred because square 4096/8192 screenshot requests are owned by Witch Dock TRUE-resolution still capture.

## Spinny v0.5.0 validated standalone checkpoint

`media.spinny-mini-webp` maintained runtime is now v0.5.0 / `0.5.0-integrated-pause-interaction-guards`. Pause/Resume and capture-invalidating interaction guards passed live testing. Disposition: Witch Dock Dev candidate; public Stable remains untouched until integrated Dev smoke and approval.
