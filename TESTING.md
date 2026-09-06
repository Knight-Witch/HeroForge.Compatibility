# Testing

Standalone-first validation precedes Witch Dock integration.

## `media.screenshot-resolution`

HeroForge build: `heroforge07.1.9.98`.

Standalone, Witch Dock Dev and public Witch Dock Stable still-capture gates remain validated. Current Spinny work does not reopen them.

## `media.spinny-mini-webp`

HeroForge build: `heroforge07.1.9.98`.

### Validated lower-resolution behavior

Historical maintained profile behavior before v0.3.0 consolidation:

- 1024 Standard / 250 frames: PASS
- 2048 Standard / 250 frames: PASS
- 1024 Very Slow / 750 frames: PASS
- 2048 Slower / 500 frames: PASS
- multiple same-session captures: PASS
- progress/readout/ETA: PASS
- parser validation: PASS
- rotation restoration: PASS
- general Cancel path: PASS by user report

Bridge-confirmed repeated 1024 Standard reference:

- 13,565,278-byte output;
- 1024x1024 / 250 frames / 10,000 ms / 40 ms x250 / loop 0;
- actual 177.101 s;
- final estimate 175.614 s;
- 0.84% total-time error;
- rotation restored true;
- error null.

### Native 3072 full-run failure

Requested:

- 3072x3072;
- Standard;
- 250 frames;
- 40 ms/frame;
- 10.0 s animation duration.

Observed:

- wall-clock approximately 25 minutes;
- structural 3072x3072 / 250 frames: PASS;
- individual encoded frame payload dimensions 3072: PASS;
- user native-size source fidelity: **FAIL / blurry-upscaled appearance**.

A follow-up 1024 control capture visually passed.

### Render-path diagnosis

HF-Chat-Bridge Power trace confirmed:

- 1024 request → `CK.Effects.renderToCanvas(1024,1024,camera1024)`;
- 2048 request → repeated `renderToCanvas(1024,1024,camera2048)` phase/tile calls;
- 3072 request → repeated `renderToCanvas(768,768,camera3072)` calls.

Current native `renderToCanvas` sizes its render target from supplied width/height, explaining the structurally-correct-but-blurry 3072 output.

### Baseline Short Test diagnostic

The separate 16-frame Short Test companion was live-validated as diagnostic infrastructure:

- completed/downloaded correctly;
- preserved normal profile angular spacing;
- restored figure rotation;
- reproduced the native 3072 blur quickly.

### TRUE-3K repair companion — PASS

Standalone repaired Short Test result:

- status: PASS
- elapsed: ~30.448 s
- frames: 16
- native tile: 768
- grid: 4x4
- expected/supplied/unique phases: 16/16/16 per frame
- true source renders: one 3072x3072 source per animation frame
- total phases: 256
- output: 4,589,972 bytes
- parser: 3072x3072 / 16 frames / 640 ms / 40 ms x16 / loop 0
- rotation restored: true
- Effects method restored: true
- repair error: null
- Short Test error: null
- native-size visual fidelity: PASS by user report

Conclusion: TRUE-3K **frame-source repair** is validated.

## v0.3.0 integrated standalone candidate

File:

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

Version: `0.3.0`
Build: `0.3.0-integrated-true3k-short-test`

### Static tests

- `node --check`: PASS
- 1024/2048/3072 selections present: PASS
- Standard/Slow/Slower/Very Slow retain 40 ms/frame: PASS
- full capture API present: PASS
- integrated 16-frame Short Test API present: PASS
- cancel path present: PASS
- figure rotation restore path present: PASS
- per-frame Effects restore path present: PASS
- no `BT.maker.takeScreenshot` reassignment/replacement: PASS
- TRUE-3K timing history isolated by frame-source path: PASS

### Integrated Short Test live gate

Before testing:

- disable the older standalone `spinny-mini-webp-short-test.user.js` companion;
- disable the older `spinny-mini-webp-3k-repair-companion.user.js` companion;
- install only v0.3.0 for current maintained profile testing.

Test:

1. Open Photo Booth.
2. Select **3072px — TRUE 3K candidate**.
3. Select **Standard**.
4. Click **Short Test**.
5. Do not manipulate the camera or Booth controls while capture is active.

Required PASS conditions:

- valid partial WebP downloads;
- visible native-size detail matches the repaired TRUE-3K reference, not the blurry native 3K baseline;
- `lastCapture.mode === 'short-test'`;
- `lastCapture.frameSource === 'true3k-phase-feed'`;
- exactly 16 frames rendered and encoded;
- parser 3072x3072 / 16 frames / 640 ms / `{40:16}` / loop 0;
- each repaired frame reports complete phase delivery and one 3072 source render;
- every repaired frame reports `effectsRestored: true`;
- figure rotation restored;
- error null.

### Full repaired 3072 gate

Only after integrated Short Test PASS:

- select 3072 + Standard;
- click Capture WebP;
- require 250 frames / 10,000 ms / `{40:250}` / loop 0;
- require per-frame TRUE-3K repair diagnostics complete;
- require figure and Effects restoration;
- inspect native-size visual fidelity;
- record file size / elapsed time / ETA accuracy / browser resource behavior.

This final full run is required before complete 3072 production-profile validation.

### Consolidation regression gate

Because v0.3.0 consolidates previously stacked diagnostic behavior into the maintained script, re-run at least one validated lower-resolution profile before Witch Dock promotion. Preferred quick regression: 1024 Standard.

### Short Test Witch Dock policy

Standalone v0.3.0 exposes Short Test because it is a dev harness.

Future Witch Dock:

- Spinny service retains `captureShortTest()`;
- normal UI hides Short Test;
- Developer Mode exposes it through the Spinny host using `KWDeveloperMode.enabled` / `onChange()`;
- Developer Mode must not duplicate media capture logic.

### Interaction guard requirement

Two accidental mouse-wheel camera changes during the original long 3072 run produced visible output jumps. Active-capture guards are therefore required before Witch Dock integration.

### 4K Spinny

Deferred. Current Witch Dock TRUE-resolution still provider owns square 4096/8192 screenshot requests.
