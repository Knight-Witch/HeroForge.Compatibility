# INV-0004 — Spinny Mini animated WebP reconstruction

Date opened: 2026-09-05
Status: active — lower-resolution behavior validated; native 3072 defect diagnosed; TRUE-3K repair validated; v0.3.0 integrated Short Test PASS; full repaired 3072 pending
HeroForge build: `heroforge07.1.9.98`
Feature: `media.spinny-mini-webp`

## Question

How can HeroForge's Spinny Mini WebP capability be reconstructed into a higher-resolution, configurable-speed feature without brittle compiled-string injection or PNG-series ZIP output?

## Confirmed baselines

Native HeroForge WebP:

- 512x512;
- 386 frames;
- 17 ms/frame;
- 6562 ms total;
- 58.82 FPS;
- infinite loop.

Historical Lob HQ GIF:

- 1024x1024;
- 250 frames;
- 40 ms/frame / 25 FPS;
- 10.0 s.

## Accepted serialization architecture

```text
HeroForge runtime character rotation
→ established display/occlusion refresh sequence
→ frame-source adapter
→ browser-native static WebP encoding per frame
→ project-owned animated-WebP RIFF mux
```

The private HeroForge animation encoder and Lob's compiled-string GIF patch are not required.

## Validated lower-resolution results

- 1024 Standard / 250f: PASS
- 2048 Standard / 250f: PASS
- 1024 Very Slow / 750f: PASS
- 2048 Slower / 500f: PASS
- repeat use: PASS
- progress/ETA: PASS
- parser/rotation restore: PASS
- general cancel + starting-rotation restore: PASS by user report

Bridge-confirmed repeated 1024 Standard reference:

- output 13,565,278 bytes;
- 1024x1024 / 250 frames / 10,000 ms / 40 ms x250 / loop 0;
- actual 177.101 s;
- final ETA 175.614 s;
- error 0.84%;
- rotation restored true;
- runtime error null.

## Native 3072 full-run result — structural PASS / fidelity FAIL

First native 3072 Standard / 250-frame result:

- wall-clock ~25 minutes;
- final animation structurally 3072x3072;
- individual frame payloads also 3072-sized;
- output plays correctly;
- native-size detail visibly blurry/upscaled.

A 1024 control afterward visually passed.

Conclusion: the WebP mux/encoder was not the source of the blur; source-detail loss occurred upstream.

## Runtime render-source investigation — root cause confirmed

After a clean page reload, HF-Chat-Bridge Power tracing confirmed:

- 1024 screenshot: `CK.Effects.renderToCanvas(1024,1024,camera1024)`;
- 2048 screenshot: repeated `CK.Effects.renderToCanvas(1024,1024,camera2048)` phase/tile renders;
- 3072 screenshot: capture camera remains 3072x3072 while HeroForge calls `CK.Effects.renderToCanvas(768,768,camera3072)`.

Source inspection confirmed the native `CK.Effects.renderToCanvas` sizes its render target from supplied width/height.

Therefore:

**HeroForge's native 3072 screenshot path composites a 3072 result from lower-resolution 768px Effects/model phase renders.**

Current topology:

- target 3072;
- native tile 768;
- grid 4 per axis;
- 16 phases/frame.

This topology must be derived/validated live, not hard-coded as a permanent HeroForge contract.

## TRUE-3K repair principle — validated

Existing `media.screenshot-resolution` repair established the same general phase-feed technique for 4K/8K still capture.

For 3072 Spinny, one true 3072 Effects source fits the current GPU capability range and can supply all native phases for one animation frame.

Standalone repair companion validation:

- elapsed ~30.448 s;
- 16 animation frames;
- every frame: 768 tile / grid 4 / 16 expected / 16 supplied / 16 unique phases / one 3072 source render;
- 256 total phases;
- output 4,589,972 bytes;
- parser 3072x3072 / 16 frames / 640 ms / 40 ms x16 / loop 0;
- figure rotation restored true;
- Effects restored true;
- errors null;
- native-size visual fidelity PASS by user report.

Conclusion: TRUE-3K **frame-source repair principle is validated**.

## v0.3.0 integration

Current maintained candidate:

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

Version: `0.3.0`
Build: `0.3.0-integrated-true3k-short-test`

Consolidated architecture:

```text
full capture OR Short Test
→ selected profile
→ same rotation/refresh lifecycle
→ frame-source adapter
   ├── 1024/2048 native
   └── 3072 TRUE-3K phase feed
→ same WebP encode/mux/parser
→ same cancel/restore lifecycle
```

For each explicit 3072 animation frame, v0.3.0 temporarily wraps `CK.Effects.renderToCanvas`, lets normal `BT.maker.takeScreenshot(3072,3072)` drive the native compositor, feeds the native tiled phases from one genuine 3072 Effects source, validates completeness, and restores the exact Effects method immediately.

v0.3.0 does not replace `BT.maker.takeScreenshot`, preserving Witch Dock TRUE-resolution still-provider ownership.

## Integrated v0.3.0 Short Test — PASS

The maintained v0.3.0 3072 Standard Short Test completed and the downloaded output passed user native-size visual inspection.

HF-Chat-Bridge issue #490 confirmed:

- active version: `0.3.0`;
- build: `0.3.0-integrated-true3k-short-test`;
- successful timing-history entry: `3072:true3k-phase-feed`;
- mode: `short-test`;
- frames: 16;
- frame source: `true3k-phase-feed`;
- average frame time: approximately 2123.48 ms.

The successful Short Test `lastCapture` record was subsequently overwritten by a later full 3072 capture that was cancelled after two frames. This prevents recovery of that Short Test's exact retained parser snapshot from the current runtime.

However, v0.3.0 writes timing history only after WebP mux, parser validation and download succeed, so the surviving 16-frame timing entry confirms the integrated Short Test reached the successful post-validation path. The user also directly confirmed the downloaded file looked genuinely 3K.

The later cancelled full run independently reported for both completed frames:

- tile 768;
- grid 4x4;
- 16/16 expected/supplied/unique phases;
- one 3072 source render;
- Effects restoration true;
- final starting-rotation restoration true.

Conclusion: **integrated v0.3.0 TRUE-3K Short Test PASS.**

## Short Test retained as maintained capability

Short Test remains available for field diagnostics.

Implementation rule:

- capture engine/service owns `captureShortTest()`;
- standalone test harness exposes Short Test directly;
- future Witch Dock normal UI hides Short Test;
- future Witch Dock Developer Mode reveals the control and diagnostic metadata using `KWDeveloperMode.enabled` / `onChange()`;
- Developer Mode must not duplicate or own media-capture logic.

## Timing policy

Old native/blurry 3072 timing must not seed TRUE-3K ETA.

v0.3.0 keys session timing history by resolution + frame-source ID.

The integrated Short Test measured approximately 2123.48 ms/frame for `3072:true3k-phase-feed`. A simple 250-frame projection is therefore about 531 seconds (~8m51s) before final mux/tail overhead. This is only a planning estimate until the full run is completed.

## Current live gate

1. Run one full repaired 3072 Standard / 250-frame revolution using v0.3.0.
2. Require 3072x3072 / 250 frames / 10,000 ms / 40 ms x250 / loop 0.
3. Require complete per-frame TRUE-3K topology/restoration diagnostics.
4. Record output size, elapsed time, ETA accuracy, resource behavior and native-size fidelity.
5. If PASS, mark complete 3072 Standard profile validated.
6. Re-run at least one validated lower-resolution profile before Witch Dock promotion.
7. Then proceed to Pause and interaction guards.

## Interaction-guard evidence

During the original full native 3072 run, two accidental mouse-wheel interactions over the HeroForge canvas changed the camera and produced visible jumps.

This directly validates the future interaction-protection requirement:

- prevent/warn on camera/canvas movement during active/paused capture;
- prevent/warn on leaving Booth;
- prevent/warn on Booth view/backdrop/overlay/light/effect changes;
- use semantic/runtime/DOM evidence rather than fixed coordinates across HeroForge layouts.

## 4K collision

4K Spinny remains deferred. Witch Dock Stable `media.screenshot-resolution` owns square 4096/8192 `BT.maker.takeScreenshot` requests. A future 4K Spinny path requires a separately designed explicit frame capability rather than routing each animation frame through the current still-capture provider.
