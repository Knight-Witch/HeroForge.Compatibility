# INV-0004 — Spinny Mini animated WebP reconstruction

Date opened: 2026-09-05
Status: active — v0.2.1 lower-resolution profiles validated; current 3072 fidelity failed; Short Test diagnostic added; render-source probe pending
HeroForge build: `heroforge07.1.9.98`
Feature: `media.spinny-mini-webp`

## Question

How can HeroForge's new Spinny Mini WebP capability be reconstructed into a higher-resolution, configurable-speed feature without brittle compiled-string injection or PNG-series ZIP output?

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

## Accepted architecture — confirmed

```text
HeroForge runtime character rotation
→ established display/occlusion refresh sequence
→ BT.maker.takeScreenshot(frameSize, frameSize)
→ browser-native static WebP encoding per frame
→ project-owned animated-WebP RIFF mux
```

The private HeroForge animation encoder and Lob's compiled-string GIF patch are not required.

## Validated lower-resolution results

- 1024 Standard / 250f: PASS;
- 2048 Standard / 250f: PASS;
- 1024 Very Slow / 750f: PASS;
- 2048 Slower / 500f: PASS;
- repeat use: PASS;
- progress/ETA: PASS;
- parser/rotation restore: PASS;
- general cancel + starting-rotation restore: PASS by user report.

Bridge-confirmed repeated 1024 Standard reference:

- output 13,565,278 bytes;
- 1024x1024 / 250 frames / 10,000 ms / 40 ms x250 / loop 0;
- actual 177.101 s;
- final ETA 175.614 s;
- error 0.84%;
- rotation restored true;
- runtime error null.

## 3072 full-run result — structural PASS, fidelity FAIL

v0.2.2 exposed `3072px — 3K experimental` while deliberately leaving 4096/8192 absent.

User completed the first required 3072 Standard / 250-frame capture on 2026-09-06.

Observed:

- wall-clock approximately 25 minutes;
- capture completed and downloaded;
- final animated WebP is structurally 3072x3072;
- frame count is 250;
- individual encoded frame payloads are also 3072-sized;
- uploaded output plays as animation.

Critical visual result:

- when viewed at native/full size, the 3072 output is visibly blurry;
- user assessment is that it resembles the 2048 result enlarged rather than newly rendered true-3K detail.

Conclusion:

**Current 3072 true-resolution fidelity FAILS.** The mux/container is not the likely source of the blur because both animation metadata and individual encoded frame payload dimensions are 3072. Current evidence points upstream toward HeroForge's screenshot/render source path.

A follow-up 1024 Standard control capture after page refresh was visually correct, confirming the general WebP serialization path still produces expected detail at the validated baseline.

## Why current v0.2.2 validation was insufficient

v0.2.2 checks:

- requested size;
- returned canvas width/height;
- final WebP width/height;
- frame count;
- duration/timing/loop metadata.

Those checks prove file/canvas dimensions but do **not** prove that HeroForge rasterized the 3D scene at the same source resolution before populating the returned canvas. A lower-resolution source can still be scaled into a 3072 canvas and pass every existing structural gate.

Future high-resolution acceptance must therefore include source-detail/fidelity evidence, not dimensions alone.

## Short Test diagnostic companion

To avoid repeating ~25-minute full spins while iterating on render fidelity, a separate diagnostic helper was added:

`entries/tampermonkey-standalone/spinny-mini-webp-short-test.user.js`

Build:

`0.1.0-short-test-16f-partial-arc`

Design:

- installed alongside v0.2.2;
- adds `Short Test` to the existing profile panel;
- captures 16 contiguous frames using the currently selected resolution and speed;
- preserves the selected full profile's angular step rather than redistributing 16 samples around 360 degrees;
- preserves 40 ms/frame for current profiles;
- Standard / 250-frame selection: angular step 1.44 degrees; first-to-last span 21.6 degrees;
- same display/occlusion/shadow/matrix refresh sequence;
- same `BT.maker.takeScreenshot(size,size)` frame source;
- same browser static-WebP encode and RIFF mux mechanics;
- same requested canvas-size validation;
- output parser validates requested dimensions, 16 frames, expected duration/frame timing and loop count;
- bridge-readable `HFSpinnyMiniWebPShortTest.diagnostics` records selected profile, returned canvas-size histogram, output bytes/parser result, elapsed time and rotation restoration;
- Short Test button acts as `Cancel Test` while active;
- base Full Capture/selectors are disabled during the diagnostic;
- original rotation restores in `finally`;
- 4096/8192+ are refused.

Estimated 3072 Standard processing time from proportional scaling of the 25-minute full run is ~1.6 minutes for 16/250 frames. This is an estimate until live-tested.

The partial animation loops discontinuously from its last frame back to its first by design. Loop smoothness is irrelevant to the diagnostic.

## Interaction-guard evidence

During the completed 3072 full run, the user accidentally moved the mouse wheel twice while hovering over the HeroForge canvas. Camera interaction remained active and both changes produced visible jumps in the final WebP.

This directly validates the planned interaction-protection requirement:

- prevent/warn on camera/canvas movement during active/paused capture;
- prevent/warn on leaving Booth;
- prevent/warn on Booth view/backdrop/overlay/light/effect state changes;
- use semantic/runtime/DOM evidence rather than fixed coordinates across HeroForge's multiple layouts.

Pause/input-guard implementation remains a separate stage and is not bundled into the Short Test helper.

## Runtime render-source investigation

HF-Chat-Bridge issue #478 was created as a read-only probe to inspect:

- `BT.maker.takeScreenshot` source/shape;
- `CK.Effects.renderToCanvas` source/shape;
- `BT.maker` state;
- Witch Dock true-resolution provider state.

At this checkpoint the browser/relay had not picked up #478, so **no runtime finding is claimed** from that request.

Next useful probe once transport is responsive:

1. inspect current screenshot/effects functions and provider state;
2. trace one 3072 still screenshot call, not a full spin;
3. record actual internal render target/source dimensions passed through the render path;
4. compare against 1024/2048 controls;
5. use Short Test for any candidate fix before repeating a full 3072 spin.

## 4K collision — confirmed and deferred

Witch Dock Stable `media.screenshot-resolution` owns square 4096/8192 `BT.maker.takeScreenshot` requests and routes them through the true-resolution still repair engine. A naive 4096 Spinny frame call would therefore invoke the still repair on every animation frame.

Decision: **4K Spinny remains deferred.**

## Safety / compatibility constraints

- no private/minified animation-encoder dependency;
- no legacy exact compiled-string patching;
- no raw-RGBA accumulation across all frames;
- block concurrent full/short captures through their respective UIs;
- restore figure rotation after success/failure/cancel;
- do not route 4096 Spinny through the still-capture provider;
- public Witch Dock remains untouched until standalone gate closes.

## Next gate

1. Install/run 3072 Standard **Short Test** and validate companion behavior/time/output.
2. Resume render-source tracing when HF-Chat-Bridge responds.
3. Diagnose whether 3072 `BT.maker.takeScreenshot` internally renders below requested source resolution.
4. If a candidate repair is developed, validate visually via Short Test first.
5. Only after Short Test proves additional native detail, run one full 3072 Standard confirmation.
6. Then implement/test Pause and interaction guards separately.
7. Witch Dock Dev integration remains later and separate.
