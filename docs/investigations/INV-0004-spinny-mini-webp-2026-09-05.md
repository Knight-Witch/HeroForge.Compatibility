# INV-0004 — Spinny Mini animated WebP reconstruction

Date opened: 2026-09-05
Status: active — lower-resolution behavior validated; native 3072 defect diagnosed; TRUE-3K repair validated; v0.3.0 integrated candidate pending live
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

v0.2.2 exposed `3072px — 3K experimental` while leaving 4096/8192 absent.

First full result:

- 3072 Standard / 250 frames;
- wall-clock ~25 minutes;
- final animation structurally 3072x3072;
- individual frame payloads also 3072-sized;
- output plays correctly;
- native-size detail visibly blurry/upscaled.

A 1024 control afterward visually passed.

Conclusion: the WebP mux/encoder was not the source of the blur; source-detail loss occurred upstream.

## Short Test diagnostic — validated

A separate diagnostic companion was added to avoid repeated ~25-minute full spins.

Contract:

- 16 contiguous frames;
- same selected resolution/speed;
- full profile's real angular spacing;
- same 40 ms/frame;
- same refresh/screenshot/WebP/mux path;
- rotation restore;
- parser/output diagnostics.

The baseline 3072 Short Test worked correctly and reproduced the blur quickly, validating Short Test as a useful diagnostic.

## Runtime render-source investigation — root cause confirmed

After a clean page reload, HF-Chat-Bridge Power tracing confirmed:

- 1024 screenshot: `CK.Effects.renderToCanvas(1024,1024,camera1024)`;
- 2048 screenshot: repeated `CK.Effects.renderToCanvas(1024,1024,camera2048)` phase/tile renders;
- 3072 screenshot: capture camera remains 3072x3072 while HeroForge calls `CK.Effects.renderToCanvas(768,768,camera3072)`.

Source inspection confirmed the native `CK.Effects.renderToCanvas` sizes its render target from supplied width/height.

Therefore:

**HeroForge's native 3072 screenshot path composites a 3072 result from lower-resolution 768px Effects/model phase renders.**

This directly explains the visual upscale.

Current topology:

- target 3072;
- native tile 768;
- grid 4 per axis;
- 16 phases/frame.

This topology must be derived/validated live, not hard-coded as a permanent HeroForge contract.

## Relationship to TRUE-resolution still repair

Existing `media.screenshot-resolution` repair established the same general technique for 4K/8K still capture:

- allow HeroForge's native Booth compositor to request its normal phases;
- feed those phases from real higher-resolution Effects source render(s);
- validate topology and restore temporary hooks.

For 3072, one true 3072 Effects source fits the current GPU capability range and can supply all native phases for one animation frame.

## TRUE-3K repair companion — validated

Standalone repair companion:

`entries/tampermonkey-standalone/spinny-mini-webp-3k-repair-companion.user.js`

Build: `0.1.0-3072-effects-source-phase-feed`.

Validated run:

- started `2026-09-06T09:04:26.293Z`;
- completed `2026-09-06T09:04:56.741Z`;
- elapsed ~30.448 s;
- target 3072;
- max texture/renderbuffer size 16384;
- 16 animation frames;
- every frame: 768 tile / grid 4 / 16 expected / 16 supplied / 16 unique phases / one 3072 source render;
- 256 total phases;
- output 4,589,972 bytes;
- parser 3072x3072 / 16 frames / 640 ms / 40 ms x16 / loop 0;
- figure rotation restored true;
- Effects restored true;
- repair error null;
- Short Test error null;
- native-size visual fidelity PASS by user report.

Conclusion: TRUE-3K **frame-source repair principle is validated**.

## v0.3.0 integration

Current maintained candidate:

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

Version: `0.3.0`
Build: `0.3.0-integrated-true3k-short-test`

### Integration goals

Replace permanent stacked test usage with one maintained capture engine:

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

### 3072 per-frame repair

For each explicit 3072 animation frame:

1. Save current `CK.Effects.renderToCanvas`.
2. Install a bounded temporary wrapper.
3. Call normal `BT.maker.takeScreenshot(3072,3072)`.
4. Classify matching native Effects calls.
5. If native Booth is tiled, render one real 3072 Effects source and derive requested phases.
6. Validate tile/grid/phase completeness and source count.
7. Finish the native screenshot.
8. Restore exact `CK.Effects.renderToCanvas` immediately before the frame leaves the synchronous capture boundary.
9. Encode the resulting canvas to static WebP.

This is deliberately narrower than wrapping Effects for the whole animation.

### Provider ownership

v0.3.0 does not replace `BT.maker.takeScreenshot`.

This preserves the Witch Dock TRUE-resolution still provider's ownership of square 4096/8192 routing.

### Short Test retained as maintained capability

User decision: Short Test should remain available for field diagnostics rather than be discarded after development.

Implementation rule:

- capture engine/service owns `captureShortTest()`;
- standalone test harness exposes Short Test directly;
- future Witch Dock normal UI hides Short Test;
- future Witch Dock Developer Mode reveals the control and diagnostic metadata using `KWDeveloperMode.enabled` / `onChange()`;
- Developer Mode must not duplicate or own media-capture logic.

### Timing policy

Old native/blurry 3072 timing must not seed TRUE-3K ETA.

v0.3.0 keys session timing history by resolution + frame-source ID.

Short Test may provide useful per-frame timing for a later full capture using the same frame source. Its small mux-tail timing is not promoted as the full-capture tail estimate.

## Static v0.3.0 checks

- `node --check`: PASS
- version/build: PASS
- 1024/2048/3072 selections: PASS
- four 40 ms/frame speed profiles: PASS
- full capture / Short Test / cancel APIs: PASS
- figure rotation restoration path: PASS
- per-frame Effects restoration path: PASS
- no `BT.maker.takeScreenshot` assignment/replacement: PASS
- TRUE-3K timing-path separation: PASS
- Short Test fixed at 16 frames: PASS

## Current live gate

1. Disable older standalone Short Test and TRUE-3K companion scripts.
2. Install only maintained v0.3.0.
3. Open Photo Booth.
4. Select 3072 + Standard.
5. Run integrated Short Test.
6. Require true-3K native-size detail, complete 16-frame parser output, complete per-frame phase diagnostics, Effects restore, figure restore and no errors.
7. If PASS, run one full repaired 3072 Standard / 250-frame revolution.
8. Record file size, elapsed time, ETA accuracy, resource behavior and native-size fidelity.
9. Re-run at least one validated lower-resolution profile before Witch Dock promotion.

## Interaction-guard evidence

During the original full native 3072 run, two accidental mouse-wheel interactions over the HeroForge canvas changed the camera and produced visible jumps.

This directly validates the future interaction-protection requirement:

- prevent/warn on camera/canvas movement during active/paused capture;
- prevent/warn on leaving Booth;
- prevent/warn on Booth view/backdrop/overlay/light/effect changes;
- use semantic/runtime/DOM evidence rather than fixed coordinates across HeroForge layouts.

Pause/input guards remain a separate stage after v0.3.0 resolution validation closes.

## 4K collision — confirmed and deferred

Witch Dock Stable `media.screenshot-resolution` owns square 4096/8192 `BT.maker.takeScreenshot` requests. A naive 4096 Spinny frame would collide with that still-provider path.

Decision: **4K Spinny remains deferred.**

## Safety constraints

- no private/minified animation-encoder dependency;
- no exact compiled-string patching;
- no raw-RGBA accumulation across animation frames;
- restore figure rotation after success/failure/cancel;
- restore temporary Effects adapter after each repaired frame;
- preserve public Witch Dock screenshot-provider ownership;
- fail on ambiguous/changed phase topology;
- public Witch Dock remains untouched until standalone and Dev gates close.

## Next gate

Integrated v0.3.0 Short Test, then full repaired 3072 Standard confirmation, then lower-resolution regression smoke, then Pause/input guards, then Witch Dock Dev host/integration.
