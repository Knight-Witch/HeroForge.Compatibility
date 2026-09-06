# Testing

Standalone-first validation precedes Witch Dock integration.

## `media.screenshot-resolution`

HeroForge build: `heroforge07.1.9.98`.

Standalone, Witch Dock Dev and public Witch Dock Stable still-capture gates remain validated. Current Spinny investigation does not reopen them.

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

### v0.2.2 3072 full-run result

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
- 3072 must remain unsupported pending upstream screenshot/render-path diagnosis and repair.

Control:

- follow-up 1024 Standard capture after page refresh: **visual resolution PASS by user report**.

Interaction evidence:

- two accidental mouse-wheel interactions over the Booth canvas during the 3072 run changed the camera and produced visible jumps in the output;
- capture interaction guards are therefore a demonstrated requirement, not merely precautionary design.

### Short Test diagnostic companion

File:

`entries/tampermonkey-standalone/spinny-mini-webp-short-test.user.js`

Build:

`0.1.0-short-test-16f-partial-arc`

Purpose:

- exercise the same selected-resolution per-frame capture path without waiting for a full revolution;
- produce a partial animated WebP sufficient for visual fidelity comparison and bridge diagnostics.

Behavior:

- must be installed alongside the existing profile test;
- uses selected resolution and speed;
- 16 contiguous frames;
- preserves normal full-profile angular step (`360 / full-profile frame count`);
- preserves current frame duration (40 ms for current profiles);
- Standard / 250-frame selection spans 21.6 degrees first-to-last;
- same refresh/occlusion/shadow/matrix sequence;
- same `BT.maker.takeScreenshot` frame source;
- same static WebP encoder and deterministic animated-WebP mux;
- records returned canvas-size histogram, parser metrics, output bytes, elapsed time and rotation restoration;
- own cancel-after-current-frame behavior;
- base Full Capture/selectors disabled during diagnostic;
- refuses 4096/8192+.

Pre-commit static test:

- `node --check`: **PASS**.

First live test:

1. keep v0.2.2 profile test installed;
2. install Short Test companion;
3. open Photo Booth;
4. select **3072px + Standard**;
5. click **Short Test**;
6. do not touch the Booth/camera while it runs;
7. verify a labeled `SHORT_TEST` WebP downloads;
8. inspect native-size detail versus the known-correct 1024 control and prior 2048 result;
9. inspect `HFSpinnyMiniWebPShortTest.diagnostics` after completion when bridge transport is available.

Expected time from proportional scaling of the 25-minute full 3072 run: roughly **1.6 minutes** for 16/250 frames. Treat as an estimate until measured.

### Runtime render-path probe

HF-Chat-Bridge issue #478 was queued read-only to inspect `BT.maker.takeScreenshot`, `CK.Effects.renderToCanvas`, maker state and the true-resolution provider. At this checkpoint the request had not been picked up; no result is recorded.

### 4K Spinny

Deferred. Current Witch Dock TRUE-resolution repair intercepts square 4096/8192 screenshot requests.

### Pause/input guards

Approved next isolated stage after resolution-path diagnosis. Guards must cover Booth exit, camera interaction and Booth-state changes that can invalidate animation continuity.

Witch Dock Spinny integration: **not started**.
