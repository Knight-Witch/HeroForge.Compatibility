# Testing

Standalone-first validation precedes Witch Dock integration.

## `media.screenshot-resolution`

HeroForge build: `heroforge07.1.9.98`.

Standalone, Witch Dock Dev and public Witch Dock Stable still-capture gates remain validated. Current Spinny work does not reopen them.

## `media.spinny-mini-webp`

HeroForge build: `heroforge07.1.9.98`.

### Validated lower-resolution behavior

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

- 1024 Standard / 250 frames: PASS
- 2048 Standard / 250 frames: PASS
- 1024 Very Slow / 750 frames: PASS
- 2048 Slower / 500 frames: PASS
- multiple same-session captures: PASS
- progress bar/readout/ETA: PASS
- parser validation: PASS
- rotation restoration: PASS
- general Cancel path: PASS by user report

Bridge-confirmed repeated 1024 Standard reference:

- output: 13,565,278 bytes
- 1024x1024 / 250 frames / 10,000 ms / 40 ms x250 / loop 0
- actual: 177.101 s
- final estimate: 175.614 s
- ETA total-time error: 0.84%
- rotation restored: true
- error: null

### Native 3072 full-run baseline — structural PASS / fidelity FAIL

Requested:

- 3072x3072
- Standard
- 250 frames
- 40 ms/frame
- 10.0 s animation duration

Observed:

- wall-clock approximately 25 minutes
- capture completed/downloaded
- animated container 3072x3072 / 250 frames
- individual encoded frame payloads also 3072-sized
- user native-size inspection: blurry / visually consistent with lower-resolution source enlarged to 3072

Control:

- follow-up 1024 Standard capture: visual resolution PASS by user report

Result:

- structural 3072 output: PASS
- native true-3072 source/render fidelity: **FAIL / rejected**

### Interaction evidence

Two accidental mouse-wheel interactions over the Booth canvas during the full native 3072 run changed the camera and produced visible jumps in the output. Active-capture interaction protection is therefore a demonstrated requirement.

### Short Test diagnostic companion — LIVE PASS

File:

`entries/tampermonkey-standalone/spinny-mini-webp-short-test.user.js`

Build: `0.1.0-short-test-16f-partial-arc`.

Live result:

- 16-frame partial animation completed/downloaded correctly
- normal Standard angular spacing retained: 1.44 degrees/sample, 21.6 degrees first-to-last
- 40 ms/frame retained
- starting rotation restored
- baseline 3072 blur reproduced quickly

Result: PASS as diagnostic infrastructure.

### Native render-path trace — PASS

After a clean reload, HF-Chat-Bridge Power tracing confirmed:

- Power runtime build 0.1.0 idle
- `CK.Effects.renderToCanvas` restored to native before trace
- 1024 screenshot → `renderToCanvas(1024,1024,camera1024)`
- 2048 screenshot → repeated `renderToCanvas(1024,1024,camera2048)` phase renders
- 3072 screenshot → repeated `renderToCanvas(768,768,camera3072)` phase renders

Native `CK.Effects.renderToCanvas` source confirms it sizes its render target from supplied dimensions.

Conclusion: baseline 3072 fidelity loss is explained by lower-resolution 768px Effects/model phases inside a 3072 compositor path.

### TRUE-3K repair companion — LIVE PASS

File:

`entries/tampermonkey-standalone/spinny-mini-webp-3k-repair-companion.user.js`

Version: `0.1.0`
Build: `0.1.0-3072-effects-source-phase-feed`

Static validation:

- local `node --check`: PASS

Live repaired Short Test:

- status: `passed`
- started: `2026-09-06T09:04:26.293Z`
- completed: `2026-09-06T09:04:56.741Z`
- elapsed: ~30.448 s
- target: 3072
- max texture size: 16384
- max renderbuffer size: 16384
- 16 animation frames
- each frame: tile 768 / grid 4 / 16 expected / 16 supplied / 16 unique phases
- each frame: one real 3072x3072 Effects source render
- total phases: 256
- native true-resolution passthrough calls: 0
- output bytes: 4,589,972
- parser: 3072x3072 / 16 frames / 640 ms total / 40 ms x16 / loop 0
- frames rendered: 16
- frames encoded: 16
- rotation restored: true
- Effects method restored: true
- repair error: null
- Short Test error: null
- user native-size visual inspection: **PASS — output now appears genuinely 3K rather than blurry/upscaled**

Acceptance result:

- TRUE-3K frame-source repair mechanics: PASS
- TRUE-3K repaired Short Test visual fidelity: PASS

### Remaining full-3K gate

Do not yet mark the complete 3072 production profile validated. Required next:

1. integrate the validated phase-feed repair into the maintained standalone Spinny capture/profile path;
2. re-run integrated Short Test;
3. run one full repaired 3072 Standard / 250-frame revolution;
4. confirm parser/output, rotation restoration, resource behavior and native-size fidelity.

### 4K Spinny

Deferred. Current Witch Dock TRUE-resolution still provider owns square 4096/8192 `BT.maker.takeScreenshot` requests.

### Pause/input guards

Approved next isolated stage after full repaired 3072 confirmation. Guards must cover Booth exit, camera interaction and Booth-state changes that can invalidate animation continuity.

### Witch Dock integration

Not started. Standalone gate remains active.
