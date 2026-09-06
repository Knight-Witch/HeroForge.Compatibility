# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Historical detail remains available in Git history; this file tracks the current active state.

## Current Phase

**`media.spinny-mini-webp` standalone v0.3.0 is validated for the tested production paths. Pause + interaction guards are the active next development stage.**

- Native HeroForge 3072 remains rejected because it produces structurally 3072 output from 768px Effects phase renders and looks blurred/upscaled.
- The TRUE-3K phase-feed frame-source repair is validated and integrated in v0.3.0.
- Integrated 3072 Short Test: PASS.
- Full integrated TRUE-3K captures: PASS at 250-frame Standard and 500-frame Slower by user visual/behavior report; the later 500-frame run also left a successful post-validation runtime timing record.
- Post-consolidation 1024 Standard / 250-frame regression: PASS with parser/rotation diagnostics.
- Public Witch Dock remains untouched by Spinny runtime work.

`media.screenshot-resolution` and `decals.gizmo.bound-correction` remain Witch Dock Stable.

## Repository Roles

- Compatibility / reconstruction: `Knight-Witch/HeroForge.Compatibility`
- Public Witch Dock consumer: `Knight-Witch/KnightWitch.Heroforge`
- Development-only live transport: private `Knight-Witch/HF-Chat-Bridge`
- Public Witch Dock runtime dependency on Compatibility `main`: **none**

## Spinny Mini WebP

Feature ID: `media.spinny-mini-webp`.

Current maintained standalone implementation:

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

Version: `0.3.0`
Build: `0.3.0-integrated-true3k-short-test`

Validated behavior on `heroforge07.1.9.98`:

- 1024 Standard / 250 frames: PASS, including post-v0.3.0 consolidation regression
- 2048 Standard / 250 frames: PASS
- 1024 Very Slow / 750 frames: PASS
- 2048 Slower / 500 frames: PASS
- 3072 Standard / 250 frames using TRUE-3K frame source: PASS by full-run user validation
- 3072 Slower / 500 frames using TRUE-3K frame source: PASS by full-run user validation + successful runtime timing-history record
- integrated 3072 Short Test / 16 frames: PASS
- repeated captures / parser / progress / ETA / rotation restoration: PASS on tested runs
- general cancel / starting-rotation restore: PASS by user report

## Final v0.3.0 Runtime Evidence

HF-Chat-Bridge issue #491 captured the post-consolidation 1024 Standard run:

- status `downloaded`;
- 250 rendered / 250 encoded;
- output 12,035,026 bytes;
- parser 1024x1024 / 250 frames / 10,000 ms / 40 ms x250 / loop 0;
- elapsed 272,058.2 ms;
- rotation restored true;
- error null.

The same runtime retained the successful latest TRUE-3K timing-history entry:

- key `3072:true3k-phase-feed`;
- mode `full`;
- frames 500;
- average measured frame time ~3032.42 ms;
- tail ~373.7 ms;
- updated only after successful mux/parser/download.

Combined with the user's report that the 3072/500 output looked fantastic and retained correct resolution/motion, this closes the high-cost standalone 3K gate.

## TRUE-3K Frame Source

Confirmed native defect:

- 3072 capture camera;
- native `CK.Effects.renderToCanvas` phase requests at 768x768;
- structurally 3072 output but degraded source fidelity.

Validated repair architecture:

```text
BT.maker.takeScreenshot(3072,3072)
→ native Booth requests 768px Effects phases
→ temporary CK.Effects.renderToCanvas adapter
→ one genuine 3072x3072 Effects source for the frame
→ derive and feed native phase set
→ native Booth compositor finishes the frame
→ restore exact Effects method
```

The adapter derives/validates topology live and fails rather than guessing if HeroForge changes the phase model.

## Short Test Product Policy

Short Test is a maintained diagnostic operation of the Spinny service.

- Standalone Tampermonkey development harness: visible directly.
- Future Witch Dock normal mode: hidden.
- Future Witch Dock Developer Mode: visible through the Spinny host using `KWDeveloperMode.enabled` / `onChange()`.
- Developer Mode controls presentation only and does not duplicate capture logic.

## Active Next Stage — Pause + Interaction Guards

The original long 3072 test captured two visible jumps caused by accidental mouse-wheel camera interaction. Interaction protection is therefore a required production-safety feature, not optional polish.

Required behavior:

- Pause only between fully completed frames.
- Resume at the next angular sample without discarding compressed frames already captured.
- Freeze/exclude indefinite paused time from active ETA calculations.
- While capture is active or paused, guard attempts to:
  - manipulate the camera/canvas (wheel, drag/pointer interaction, relevant keyboard camera input);
  - leave Photo Booth;
  - change Booth view/backdrop/background/overlay/frame/lighting/effects or other state that would invalidate continuity.
- Warn before the invalidating action occurs.
- If the user stays, block the action.
- If the user chooses to cancel, cancel the capture first; do not blindly replay pointer sequences.
- Guards must be semantic/runtime/DOM based, not coordinate based, and must survive HeroForge's left/right/mobile layouts.
- Spinny's own Pause/Resume/Cancel controls must remain usable.
- Diagnostics should expose paused state, pause count, total paused duration and cancellation/guard cause.

## Later Witch Dock Dev Stage

After standalone Pause/guard validation:

- host Spinny below High Res Image Capture by default;
- expose Short Test only through Developer Mode;
- support the approved detachable/draggable popout with shared state and close/collapse behavior;
- smoke-test with the existing High Res provider and Developer Mode modules;
- promote to public Witch Dock only after separate review.

## 4K Spinny

4K Spinny remains **deferred**. Square 4096/8192 screenshot requests are owned by Witch Dock TRUE-resolution still capture. Do not route animation frames through that public still-provider surface without a separately validated explicit frame capability.

## Public Integration Rule

Standalone validation remains the laboratory. Public Witch Dock must not consume the unstable Compatibility development head directly.
