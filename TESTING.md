# Testing

Standalone-first validation precedes Witch Dock integration.

## `media.screenshot-resolution`

HeroForge build: `heroforge07.1.9.98`.

Standalone, Witch Dock Dev and public Witch Dock Stable still-capture gates remain validated. Current Spinny work does not reopen them.

## `media.spinny-mini-webp`

HeroForge build: `heroforge07.1.9.98`.

### Validated lower-resolution behavior

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

- 1024 Standard / 250 frames: PASS;
- 2048 Standard / 250 frames: PASS;
- 1024 Very Slow / 750 frames: PASS;
- 2048 Slower / 500 frames: PASS;
- multiple same-session captures: PASS;
- progress bar/readout/ETA: PASS;
- parser validation: PASS;
- rotation restoration: PASS;
- general Cancel path: PASS by user report.

Bridge-confirmed repeated 1024 Standard reference:

- 13,565,278-byte output;
- 1024x1024 / 250 frames / 10,000 ms / 40 ms x250 / loop 0;
- actual 177.101 s;
- final estimate 175.614 s;
- 0.84% total-time error;
- rotation restored true;
- error null.

### v0.2.2 native 3072 full-run result

Requested:

- 3072x3072;
- Standard;
- 250 frames;
- 40 ms/frame;
- 10.0 s animation duration.

Observed:

- wall-clock approximately 25 minutes;
- capture completed and downloaded;
- animated container structurally 3072x3072 / 250 frames;
- individual encoded frame payloads also 3072-sized;
- user native-size inspection: **blurry / visually consistent with lower-resolution source enlarged to 3072**.

Result:

- structural 3072 output: PASS;
- **true 3072 source/render fidelity: FAIL**;
- native 3072 remains unsupported.

Control:

- follow-up 1024 Standard capture after page refresh: visual resolution PASS by user report.

Interaction evidence:

- two accidental mouse-wheel interactions over the Booth canvas during the 3072 run changed the camera and produced visible jumps in the output;
- capture interaction guards are therefore a demonstrated requirement.

### Short Test diagnostic companion — LIVE PASS

File:

`entries/tampermonkey-standalone/spinny-mini-webp-short-test.user.js`

Build:

`0.1.0-short-test-16f-partial-arc`

Live user result:

- Short Test completed and downloaded correctly;
- partial animation behaved as intended;
- baseline 3072 remained blurry, reproducing the full-run fidelity failure;
- helper therefore passes as a rapid fidelity diagnostic.

Contract:

- 16 contiguous frames;
- selected profile's normal angular step and frame duration;
- Standard / 250-frame selection spans 21.6 degrees first-to-last;
- same refresh/occlusion/shadow/matrix sequence;
- same `BT.maker.takeScreenshot` frame surface;
- same static WebP encoder and deterministic animated-WebP mux;
- parser/output/rotation diagnostics retained;
- own cancel-after-current-frame behavior;
- 4096/8192+ refused.

### Native 1K/2K/3K render-path trace — PASS

HF-Chat-Bridge Power runtime was first checked after a clean page reload:

- Power build 0.1.0: idle;
- `CK.Effects.renderToCanvas`: confirmed restored to HeroForge native function.

An asynchronous three-size screenshot trace then completed in approximately 7.1 seconds.

Confirmed calls:

- 1024 request: `CK.Effects.renderToCanvas(1024,1024,camera1024)`;
- 2048 request: repeated `renderToCanvas(1024,1024,camera2048)` phase/tile calls;
- 3072 request: `renderToCanvas(768,768,camera3072)` phase/tile calls.

The native `CK.Effects.renderToCanvas` source also confirms it calls `setSize(width,height,aa)` and creates its render target from the resulting pixel dimensions.

Conclusion:

**The baseline 3072 fidelity failure is explained by lower-resolution Effects/model phase renders inside a 3072 capture/compositor path.** Final canvas dimensions are not a sufficient high-resolution postcondition.

3072 / 768 gives a 4-per-axis topology under the validated TRUE-resolution tiled-phase model. The repair prototype derives this relationship live and validates it; no fixed 16-phase assumption is required.

### TRUE-3K repair companion — pending live visual gate

File:

`entries/tampermonkey-standalone/spinny-mini-webp-3k-repair-companion.user.js`

Version: 0.1.0

Build: `0.1.0-3072-effects-source-phase-feed`

Static test:

- `node --check`: PASS.

Candidate behavior:

- install alongside v0.2.2 profile test + Short Test companion;
- select 3072px + Standard;
- click `TRUE 3K Test`;
- existing Short Test handles rotation, refresh sequencing, WebP encoding/mux, parser, download, cancellation and starting-rotation restore;
- repair companion temporarily wraps only `CK.Effects.renderToCanvas`;
- each native 3072 animation frame receives phases generated from one real 3072x3072 Effects source;
- per-frame topology diagnostics validate tile size, grid, phase counts and source-render count;
- Effects method restores in `finally`;
- `BT.maker.takeScreenshot` is never replaced, preserving Witch Dock provider ownership.

First live acceptance gate:

1. Keep profile v0.2.2 and Short Test v0.1.0 installed.
2. Install TRUE-3K repair companion v0.1.0.
3. Refresh and open Photo Booth.
4. Select **3072px + Standard**.
5. Click **TRUE 3K Test**.
6. Do not manipulate camera or Booth controls while the test runs.
7. Confirm a partial WebP downloads.
8. Inspect it at native size against the known-blurry baseline Short Test.
9. After completion, inspect `HFSpinnyMiniWebP3KRepair.diagnostics.lastRun`.

Expected diagnostic postconditions if current 3072 topology remains unchanged:

- status `passed`;
- 16 repaired animation frames;
- tile size 768;
- grid 4;
- complete phase feed per frame;
- one real 3072 Effects source per repaired frame;
- Short Test parser still reports 3072x3072 / 16 frames;
- Effects restoration true;
- no error.

The exact live tile/grid values are diagnostic expectations, not hard-coded acceptance assumptions; topology changes must fail safely.

Do not run another full 3072 spin until the repaired Short Test visually demonstrates genuine additional native-size detail.

### 4K Spinny

Deferred. Current Witch Dock TRUE-resolution repair owns square 4096/8192 `BT.maker.takeScreenshot` requests.

### Pause/input guards

Approved next isolated stage after resolution behavior is settled. Guards must cover Booth exit, camera interaction and Booth-state changes that can invalidate animation continuity.

Witch Dock Spinny integration: not started.
