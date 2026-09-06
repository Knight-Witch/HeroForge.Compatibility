# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Historical detail remains available in Git history; this file tracks the current active state.

## Current Phase

**`media.spinny-mini-webp` has validated 1024/2048 profiles and now has a live-validated TRUE-3K frame-source repair. Native HeroForge 3072 capture remains rejected because it builds a 3072 result from 768px Effects phases. The repaired 16-frame 3072 Short Test passed both mechanical diagnostics and native-size visual fidelity. Next gate: integrate the repair into the maintained Spinny profile path and run one full repaired 3072 Standard revolution. Public Witch Dock remains untouched.**

`media.screenshot-resolution` and `decals.gizmo.bound-correction` remain Witch Dock Stable.

## Repository Roles

- Compatibility / reconstruction: `Knight-Witch/HeroForge.Compatibility`
- Public Witch Dock consumer: `Knight-Witch/KnightWitch.Heroforge`
- Development-only live transport: private `Knight-Witch/HF-Chat-Bridge`
- Public Witch Dock runtime dependency on Compatibility `main`: **none**

## Spinny Mini WebP — Validated Lower-Resolution Behavior

HeroForge build: `heroforge07.1.9.98`.

- 1024 Standard / 250 frames: PASS
- 2048 Standard / 250 frames: PASS
- 1024 Very Slow / 750 frames: PASS
- 2048 Slower / 500 frames: PASS
- repeated same-session capture: PASS
- progress/ETA: PASS
- parser and rotation restoration: PASS
- general cancel/starting-rotation restore: PASS by user report

## Native 3072 — Rejected

The original v0.2.2 3072 Standard / 250-frame run completed in approximately 25 minutes and produced a structurally correct 3072x3072 / 250-frame animated WebP, but native-size inspection was visibly blurry.

Live runtime tracing closed the cause:

- 1024 screenshot → `CK.Effects.renderToCanvas(1024,1024,camera1024)`
- 2048 screenshot → repeated `renderToCanvas(1024,1024,camera2048)` phases
- 3072 screenshot → repeated **`renderToCanvas(768,768,camera3072)`** phases

`CK.Effects.renderToCanvas` sizes its actual Effects render target from those supplied dimensions. Therefore HeroForge's native 3072 output is structurally 3072 but does not use a full-resolution 3072 Effects/model source.

## Short Test Diagnostic — Validated

`entries/tampermonkey-standalone/spinny-mini-webp-short-test.user.js`

Build: `0.1.0-short-test-16f-partial-arc`.

The 16-frame partial-spin helper is live-validated as diagnostic infrastructure. It preserves the selected profile's normal angular spacing/timing and reproduced the native 3072 blur in a short run instead of requiring another ~25-minute full revolution.

## TRUE-3K Frame-Source Repair — VALIDATED

`entries/tampermonkey-standalone/spinny-mini-webp-3k-repair-companion.user.js`

Build: `0.1.0-3072-effects-source-phase-feed`.

The repaired 3072 Short Test passed both mechanical and visual acceptance on `heroforge07.1.9.98`.

Confirmed runtime result:

- status: `passed`
- total repair runtime: ~30.448 s
- 16 animation frames
- native tile size: 768
- native phase grid: 4x4
- 16 expected / 16 supplied / 16 unique phases per frame
- one genuine 3072x3072 Effects source render per animation frame
- 256 total supplied phases
- output bytes: 4,589,972
- parsed output: 3072x3072 / 16 frames / 640 ms / 40 ms x16 / loop 0
- figure rotation restored: true
- `CK.Effects.renderToCanvas` restored: true
- repair error: null
- Short Test error: null
- user native-size visual inspection: **PASS — appears genuinely 3K rather than blurred/upscaled**

Conclusion: the 768px native Effects phase source was the fidelity defect, and feeding the native compositor from one real 3072 Effects source per animation frame repairs it.

## Architecture Decision

Maintained 3072 frame capture should reuse the proven phase-feed repair inside the Spinny capture service rather than require stacked diagnostic companions.

The repair must continue to:

- leave `BT.maker.takeScreenshot` ownership untouched;
- temporarily adapt only `CK.Effects.renderToCanvas` for explicit repaired 3072 frame capture;
- derive/validate tile/grid/phase topology at runtime;
- release raw 3072 source pixels after each animation frame;
- restore the exact Effects method after success/failure/cancel.

## Interaction Guard Requirement

The first full native 3072 run contained two visible jumps caused by accidental mouse-wheel camera interaction during capture. Active-capture protection is therefore a demonstrated requirement before Witch Dock integration.

## 4K Spinny

Deferred. Current Witch Dock TRUE-resolution still capture owns square 4096/8192 `BT.maker.takeScreenshot` requests. Do not route production 4K Spinny through that surface without a separate explicit frame-capture capability/bypass.

## Current Gates

- `media.screenshot-resolution` Witch Dock Stable: PASS
- corrected bound decal gizmo Witch Dock Stable: PASS
- Spinny 1024/2048 tested profiles: PASS
- native 3072 structural output: PASS
- native 3072 visual/source fidelity: FAIL / rejected
- Short Test diagnostic: PASS
- TRUE-3K repaired Short Test: **PASS mechanically + visually**
- full repaired 3072 Standard revolution: pending
- Pause/input guards: pending next isolated stage after full repaired 3K confirmation
- Witch Dock Spinny integration: not started
- public Witch Dock Spinny: untouched

## Next Gate

1. Integrate the validated TRUE-3K frame-source repair into the maintained standalone Spinny profile/capture path.
2. Preserve all validated 1024/2048 behavior and existing progress/ETA/cancel semantics.
3. Run Short Test against the integrated implementation first.
4. Run one full repaired 3072 Standard / 250-frame confirmation.
5. Implement/test Pause and interaction guards separately.
6. Only then begin Witch Dock Dev Spinny integration.

## Public Integration Rule

Standalone validation remains the laboratory. Public Witch Dock must not consume this WIP branch directly.
