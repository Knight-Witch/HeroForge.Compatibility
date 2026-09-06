# INV-0004 — Spinny Mini animated WebP reconstruction

Date opened: 2026-09-05
Status: active — lower-resolution profiles validated; native 3072 fidelity failure diagnosed; TRUE-3K frame-source repair validated by Short Test; full repaired 3072 confirmation pending
HeroForge build: `heroforge07.1.9.98`
Feature: `media.spinny-mini-webp`

## Question

How can HeroForge's new Spinny Mini WebP capability be reconstructed into a higher-resolution, configurable-speed feature without brittle compiled-string injection or PNG-series ZIP output?

## Confirmed baselines

Native HeroForge WebP:

- 512x512
- 386 frames
- 17 ms/frame
- 6562 ms total
- 58.82 FPS
- infinite loop

Historical Lob HQ GIF:

- 1024x1024
- 250 frames
- 40 ms/frame / 25 FPS
- 10.0 s

## Validated serialization architecture

```text
HeroForge runtime character rotation
→ established display/occlusion refresh sequence
→ frame capture surface
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

- output 13,565,278 bytes
- 1024x1024 / 250 frames / 10,000 ms / 40 ms x250 / loop 0
- actual 177.101 s
- final ETA 175.614 s
- error 0.84%
- rotation restored true
- runtime error null

## Native 3072 full-run result — structural PASS / fidelity FAIL

v0.2.2 exposed `3072px — 3K experimental` while deliberately leaving 4096/8192 absent.

First full native 3072 Standard / 250-frame result:

- wall-clock approximately 25 minutes
- final animated WebP structurally 3072x3072
- 250 frames
- individual encoded frame payloads genuinely 3072-sized
- output plays correctly
- native/full-size visual detail blurry and consistent with lower-resolution content enlarged to 3072

A follow-up 1024 control remained visually correct.

Conclusion: native 3072 file dimensions are correct, but source/render fidelity is not.

## Short Test diagnostic — LIVE PASS

`entries/tampermonkey-standalone/spinny-mini-webp-short-test.user.js`

Build: `0.1.0-short-test-16f-partial-arc`.

Design:

- 16 contiguous frames
- selected resolution/speed
- normal angular spacing rather than sparse full-circle samples
- Standard spacing: 1.44 degrees/sample, 21.6 degrees first-to-last
- 40 ms/frame
- same capture/encode/mux/parser path
- own cancel-after-current-frame behavior
- rotation restoration in `finally`

Live result:

- helper completed/downloaded correctly
- baseline 3072 remained blurry
- helper therefore accepted as rapid fidelity diagnostic

## Runtime render-source investigation — root cause confirmed

### Clean-state recovery

An initial long mutation-capable Power trace exceeded the relay lease. It was not retried blindly. After user reload, read-only verification confirmed:

- HFChatBridgePower build 0.1.0 present
- Power status idle
- `CK.Effects.renderToCanvas` restored to native HeroForge function

### Async 1024/2048/3072 trace

The corrected asynchronous trace completed in approximately 7.1 seconds.

Confirmed observations:

- 1024 screenshot: `CK.Effects.renderToCanvas(1024,1024,camera1024)`
- 2048 screenshot: repeated `CK.Effects.renderToCanvas(1024,1024,camera2048)` phases
- 3072 screenshot: capture camera remains 3072x3072 while HeroForge calls `CK.Effects.renderToCanvas(768,768,camera3072)`

Source inspection confirms `CK.Effects.renderToCanvas` calls its own `setSize(width,height,aa)` and creates render targets from the resulting pixel dimensions.

Therefore:

**HeroForge's native 3072 screenshot path composites a 3072 result from lower-resolution 768px Effects/model phases.**

This directly explains the apparent upscale and closes the primary fidelity fault boundary.

Current topology on `heroforge07.1.9.98`:

- target: 3072
- tile: 768
- grid: 4 per axis
- phases: 16 per frame

These values are runtime observations, not stable API constants. Repair code must derive and validate them.

## Relationship to TRUE-resolution still repair

The already-validated `media.screenshot-resolution` feature repairs the same class of defect at 4K/8K by letting the native Booth compositor retain its phase requests while feeding those phases from real higher-resolution Effects source render(s).

For 3072 Spinny, one true 3072x3072 Effects source is sufficient per animation frame on the tested GPU.

## TRUE-3K repair companion

`entries/tampermonkey-standalone/spinny-mini-webp-3k-repair-companion.user.js`

Version: 0.1.0
Build: `0.1.0-3072-effects-source-phase-feed`

Architecture:

```text
TRUE 3K Test
→ temporary CK.Effects.renderToCanvas adapter
→ existing Short Test animation pipeline
→ per animation frame:
     BT.maker.takeScreenshot(3072,3072)
     → native Booth asks for tiled Effects phases
     → render one true 3072 Effects source
     → derive native 768 phase canvases from that source
     → native Booth compositor completes 3072 frame
→ existing WebP encoding/mux/parser/download
→ restore exact CK.Effects.renderToCanvas
```

Ownership decision:

- never replace `BT.maker.takeScreenshot`
- public Witch Dock TRUE-resolution still provider retains 4096/8192 wrapper ownership
- 3072 repair works one level lower at the temporary Effects seam

Safety checks:

- live tile/grid classification
- integral source-stride validation
- camera phase-coordinate validation
- duplicate-phase rejection
- complete phase-feed validation
- source-dimension validation
- raw source release after frame phases complete
- non-matching Effects calls pass through
- exact Effects method restoration in `finally`

Memory behavior:

- one 3072 RGBA source is ~36 MiB
- only current animation frame source retained
- raw sources never accumulate across animation frames

## TRUE-3K repaired Short Test — LIVE PASS

User ran **3072 + Standard + TRUE 3K Test**.

HF-Chat-Bridge issue #489 confirmed:

- build: `0.1.0-3072-effects-source-phase-feed`
- status: `passed`
- start: `2026-09-06T09:04:26.293Z`
- completion: `2026-09-06T09:04:56.741Z`
- elapsed: ~30.448 s
- max texture size: 16384
- max renderbuffer size: 16384
- 16 animation frames
- each frame: tile 768 / grid 4 / 16 expected / 16 supplied / 16 unique phases
- each frame: one source render at 3072x3072
- 256 total supplied phases
- native true-resolution passthrough calls: 0
- Short Test output: 4,589,972 bytes
- parser: 3072x3072 / 16 frames / 640 ms / 40 ms x16 / loop 0
- frames rendered: 16
- frames encoded: 16
- figure rotation restored: true
- `CK.Effects.renderToCanvas` restored: true
- repair error: null
- Short Test error: null

Visual result:

- user native-size inspection: **PASS — repaired output now looks genuinely 3K**

Conclusion:

**The TRUE-3K frame-source repair is validated.** The original 768px native Effects phase source was the fidelity defect, and supplying those phases from one real 3072 Effects source per animation frame fixes it.

## What is not yet closed

The diagnostic companion is not the intended maintained production architecture.

Before 3072 production support is considered complete:

1. integrate the validated repair into the maintained standalone Spinny service/profile implementation;
2. re-run the integrated Short Test;
3. run one full repaired 3072 Standard / 250-frame revolution;
4. confirm mechanical diagnostics, memory/resource behavior, rotation restoration and native-size fidelity.

## Interaction-guard evidence

During the first full native 3072 run, two accidental mouse-wheel interactions over the HeroForge canvas changed the camera and produced visible jumps in the WebP.

Required later protection:

- camera/canvas movement
- leaving Photo Booth
- Booth view/backdrop/overlay/light/effect changes
- semantic/layout-independent guards across HeroForge layouts

Pause/input guards remain a separate stage after full repaired 3072 confirmation.

## 4K collision — deferred

Witch Dock Stable `media.screenshot-resolution` owns square 4096/8192 `BT.maker.takeScreenshot` requests. A naive 4096 Spinny frame call would invoke the still-repair provider per animation frame.

Decision: 4K Spinny remains deferred pending an explicit safe frame-capture capability/bypass.

## Safety / compatibility constraints

- no private/minified animation encoder
- no legacy compiled-string patching
- no raw-RGBA accumulation across all animation frames
- restore figure rotation after success/failure/cancel
- restore temporary Effects adapter after success/failure/cancel
- preserve public Witch Dock screenshot-provider ownership
- derive/validate phase topology rather than hard-code minified/runtime assumptions
- public Witch Dock remains untouched until standalone gate closes

## Next gate

1. Integrate TRUE-3K repair into the maintained standalone Spinny capture/profile path.
2. Re-run integrated 3072 Standard Short Test.
3. Run one full repaired 3072 Standard confirmation.
4. Implement/test Pause and interaction guards separately.
5. Begin Witch Dock Dev integration only after standalone validation closes.
