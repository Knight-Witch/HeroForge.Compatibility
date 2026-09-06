# Testing

Standalone-first validation precedes Witch Dock integration.

## `media.screenshot-resolution`

HeroForge build: `heroforge07.1.9.98`.

Standalone, Witch Dock Dev and public Witch Dock Stable still-capture gates remain validated. Current Spinny work does not reopen them.

## `media.spinny-mini-webp`

HeroForge build: `heroforge07.1.9.98`.

Maintained implementation:

- file: `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`
- version: `0.3.0`
- build: `0.3.0-integrated-true3k-short-test`

## Validated profile matrix

- 1024 Standard / 250 frames: PASS
- 2048 Standard / 250 frames: PASS
- 1024 Very Slow / 750 frames: PASS
- 2048 Slower / 500 frames: PASS
- 3072 Standard / 250 frames via TRUE-3K: PASS by full-run user validation
- 3072 Slower / 500 frames via TRUE-3K: PASS by full-run user validation + successful runtime timing-history record
- 3072 Standard integrated Short Test / 16 frames: PASS

Other validated behavior:

- repeat use: PASS
- parser validation: PASS
- rotation restoration: PASS
- progress/readout: PASS
- ETA usefulness: PASS on tested long TRUE-3K run by user report
- general cancel / starting-rotation restoration: PASS by user report

## Native 3072 failure reference

Native un-repaired 3072 is rejected.

Observed baseline:

- structural 3072 output: PASS;
- source fidelity: FAIL / blurry-upscaled appearance.

Root cause confirmed through runtime trace:

- 3072 capture camera;
- repeated `CK.Effects.renderToCanvas(768,768,camera3072)` phase requests.

TRUE-3K repairs this by feeding the native compositor from one genuine 3072 Effects source per animation frame.

## Integrated TRUE-3K Short Test — PASS

The maintained v0.3.0 3072 Standard Short Test completed successfully.

Confirmed:

- visual native-size fidelity: PASS;
- timing key `3072:true3k-phase-feed`;
- mode `short-test`;
- frames 16;
- average frame time ~2123.48 ms;
- successful timing-history write proves mux/parser/download success because history is written only after those gates.

Earlier repair-companion diagnostics also established the expected current topology:

- 768 native tile;
- 4x4 grid;
- 16 expected/supplied/unique phases per frame;
- one genuine 3072 source render per frame;
- Effects restoration true.

## Full TRUE-3K validation — PASS

### 3072 Standard / 250 frames

User reported:

- full capture completed;
- correct/native-looking 3K resolution;
- clear movement;
- ETA quite accurate.

Status: PASS.

### 3072 Slower / 500 frames

User reported:

- full capture completed;
- output looked fantastic;
- resolution correct;
- movement clear.

HF-Chat-Bridge issue #491 retained the v0.3.0 timing-history entry:

- key `3072:true3k-phase-feed`;
- mode `full`;
- frames 500;
- frame source `true3k-phase-feed`;
- average frame time ~3032.4224 ms;
- tail ~373.7 ms;
- successful update timestamp `2026-09-06T12:06:28.050Z`.

Because v0.3.0 writes timing history only after mux/parser validation and download succeed, this is runtime evidence that the 500-frame full run completed the maintained success path.

Status: PASS.

## Post-consolidation lower-resolution regression — PASS

Latest 1024 Standard / 250-frame run from HF-Chat-Bridge issue #491:

- status `downloaded`;
- 250 rendered / 250 encoded;
- encoded frame bytes 12,152,482;
- output bytes 12,035,026;
- parser 1024x1024;
- frame count 250;
- total duration 10,000 ms;
- durations `{40:250}`;
- loop 0;
- elapsed 272,058.2 ms;
- rotation restored true;
- error null.

Status: PASS.

## Current standalone conclusion

Spinny v0.3.0 is validated for the tested production profiles on `heroforge07.1.9.98`.

This closes the resolution/consolidation validation stage.

## Next test stage — Pause + interaction guards

Required standalone tests after implementation:

1. Pause during native 1024 capture; current frame completes, capture stops before next sample.
2. Pause during TRUE-3K 3072 capture; no partial phase wrapper remains active.
3. Resume continues at the next angular sample and preserves already-encoded frames.
4. Multiple pause/resume cycles complete a valid output.
5. ETA excludes/freeze-adjusts paused duration.
6. Camera wheel/pointer drag attempt during capture triggers warning before camera mutation.
7. Booth exit attempt triggers warning before exit.
8. Booth backdrop/view/overlay/light/effect mutation attempt triggers warning before mutation.
9. Choosing stay blocks the invalidating action without cancelling capture.
10. Choosing cancel cancels after the current safe frame, restores state and does not blindly replay the triggering pointer event.
11. Spinny Pause/Resume/Cancel remain usable while guards are installed.
12. Validate left/right/mobile HeroForge layouts without coordinate assumptions.
13. Diagnostics report paused state, pause count, total paused duration and cancellation/guard cause.

## Short Test Witch Dock policy

Standalone v0.3.0 exposes Short Test because it is a development harness.

Future Witch Dock:

- Spinny service retains `captureShortTest()`;
- normal UI hides Short Test;
- Developer Mode exposes it through the Spinny host using `KWDeveloperMode.enabled` / `onChange()`;
- Developer Mode must not duplicate media capture logic.

## 4K Spinny

Deferred. Current Witch Dock TRUE-resolution still provider owns square 4096/8192 screenshot requests.
