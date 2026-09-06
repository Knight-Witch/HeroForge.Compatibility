# INV-0004 — Spinny Mini animated WebP reconstruction

Date opened: 2026-09-05
Status: active — lower-resolution profiles validated; native 3072 fidelity failed and root cause is diagnosed; Short Test diagnostic live-validated; TRUE-3K repair candidate pending live validation
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

## Accepted serialization architecture — confirmed

```text
HeroForge runtime character rotation
→ established display/occlusion refresh sequence
→ frame capture surface
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

**Current native 3072 true-resolution fidelity FAILS.** The mux/container is not the source of the blur because both animation metadata and individual encoded frame payload dimensions are genuinely 3072.

A follow-up 1024 Standard control capture after page refresh was visually correct.

## Why v0.2.2 structural validation was insufficient

v0.2.2 checks:

- requested size;
- returned canvas width/height;
- final WebP width/height;
- frame count;
- duration/timing/loop metadata.

Those checks prove file/canvas dimensions but do not prove that HeroForge rasterized the scene/Effects layer at the same resolution before populating the returned canvas.

Future high-resolution acceptance must include source/render fidelity evidence, not dimensions alone.

## Short Test diagnostic companion — LIVE PASS

To avoid repeating ~25-minute full spins while iterating on render fidelity, a separate diagnostic helper was added:

`entries/tampermonkey-standalone/spinny-mini-webp-short-test.user.js`

Build: `0.1.0-short-test-16f-partial-arc`.

Design:

- installed alongside v0.2.2;
- adds `Short Test` to the existing profile panel;
- captures 16 contiguous frames using the selected resolution and speed;
- preserves the selected full profile's angular step rather than redistributing 16 samples around 360 degrees;
- preserves 40 ms/frame for current profiles;
- Standard / 250-frame selection: angular step 1.44 degrees; first-to-last span 21.6 degrees;
- same display/occlusion/shadow/matrix refresh sequence;
- same `BT.maker.takeScreenshot(size,size)` frame surface;
- same browser static-WebP encode and RIFF mux mechanics;
- output parser validates requested dimensions, 16 frames, expected timing and loop count;
- bridge-readable diagnostics record selected profile, returned canvas-size histogram, output/parser result, elapsed time and rotation restoration;
- own cancel-after-current-frame behavior;
- original rotation restores in `finally`;
- 4096/8192+ are refused.

Live user result:

- Short Test worked correctly;
- output downloaded and played as intended;
- 3072 baseline remained blurry, reproducing the full-run defect;
- Short Test is therefore accepted as rapid diagnostic infrastructure.

The partial animation loops discontinuously from its last frame back to its first by design. Loop smoothness is irrelevant to this diagnostic.

## Runtime render-source investigation — root cause confirmed

### Bridge recovery and clean-state verification

An initial long Power trace exceeded the bridge mutation lease. It was not retried blindly. The user refreshed HeroForge, and a read-only post-reload check confirmed:

- HFChatBridgePower build 0.1.0 present;
- Power status idle;
- `CK.Effects.renderToCanvas` restored to its native HeroForge function.

A second trace was then launched asynchronously so the bridge request returned immediately and the page could complete the screenshot matrix outside the relay lease.

### Live 1024/2048/3072 trace

The async trace completed in approximately 7.1 seconds and hooked the named rendering/capture methods only for the bounded run.

Confirmed observations:

- **1024 screenshot:** `CK.Effects.renderToCanvas(1024,1024,camera1024)`;
- **2048 screenshot:** repeated `CK.Effects.renderToCanvas(1024,1024,camera2048)` phase/tile renders;
- **3072 screenshot:** capture camera remains 3072x3072 while HeroForge calls `CK.Effects.renderToCanvas(768,768,camera3072)` for the native phase/tile path.

Source inspection of the current native `CK.Effects.renderToCanvas` function confirms it invokes `this.setSize(e,t,aa)` and creates its render target from the resulting pixel dimensions.

Therefore:

**HeroForge's native 3072 screenshot path does not render the Effects/model source at 3072. It composites a 3072 result from lower-resolution 768px phase/tile renders.**

This directly explains the apparent upscale and closes the primary fault boundary.

### Topology relationship

Under the already-validated TRUE-resolution topology classifier:

- target 3072 / native tile 768 = grid 4 per axis;
- expected phase topology is therefore 4x4 if the existing native pattern remains consistent.

This 16-phase value is a supported inference from the validated topology model and live tile size, not a value to hard-code. The repair candidate derives and validates tile/grid/phase relationships at runtime and fails if HeroForge changes them.

## Relationship to validated TRUE-resolution still repair

The existing `media.screenshot-resolution` repair solved the same class of defect for 4K/8K still capture:

- HeroForge's final requested output dimensions are not sufficient evidence of full-resolution model/Effects rendering;
- the maintained repair allows the native Booth compositor to keep its normal phase requests;
- a temporary `CK.Effects.renderToCanvas` wrapper supplies those phases from real higher-resolution Effects source render(s).

TRUE 4K uses one real 4096 source. TRUE 8K uses four shifted 4096 sources.

For 3072 Spinny, the simpler candidate can use one real 3072 Effects source per animation frame because the target itself fits within the validated GPU capability range.

## TRUE-3K repair companion

New standalone diagnostic candidate:

`entries/tampermonkey-standalone/spinny-mini-webp-3k-repair-companion.user.js`

Version: 0.1.0.
Build: `0.1.0-3072-effects-source-phase-feed`.

### Design

The candidate intentionally does not duplicate the Short Test animation pipeline.

```text
TRUE 3K Test button
→ temporary CK.Effects.renderToCanvas adapter
→ existing HFSpinnyMiniWebPShortTest.capture()
→ per animation frame:
     native BT.maker.takeScreenshot(3072,3072)
     → native Booth requests tiled Effects phases
     → render one true 3072 Effects source
     → derive requested phase canvases by pixel interleaving
     → native Booth compositor completes 3072 frame
→ existing browser WebP encoding/mux/parser/download
→ restore original CK.Effects.renderToCanvas
```

### Ownership/collision decision

The candidate deliberately does **not** replace `BT.maker.takeScreenshot`.

Public Witch Dock TRUE-resolution repair already owns that method for 4096/8192 routing. Replacing it would trigger the provider's ownership-loss/degraded behavior.

3072 already passes through that provider to the upstream native capture path, so the repair can safely operate one level lower at the temporary Effects seam.

### Validation and safety checks

For matching 3072 capture-camera calls, the candidate:

- classifies native tile size and grid live;
- validates integral source stride/grid relationship;
- records base camera view offsets and expected phase step;
- validates each X/Y phase coordinate against native camera offsets;
- rejects duplicate phases;
- renders one 3072x3072 Effects source for the animation frame;
- validates returned source dimensions;
- generates native-sized phase canvases by interleaving source pixels using the same principle as the validated still repair;
- requires a complete phase feed before releasing source pixels;
- records per-frame tile/grid/phase/source data;
- passes non-matching Effects calls through unchanged;
- restores the exact original `CK.Effects.renderToCanvas` in `finally`.

If HeroForge begins providing a native true 3072 Effects render directly, the adapter passes it through and records that condition instead of forcing the tiled repair.

### Memory behavior

One 3072 RGBA Effects source is approximately 36 MiB before extraction. The candidate retains only the current animation frame's source pixels and releases them as soon as that frame's native phase feed completes.

It does not accumulate raw repaired sources across the Short Test or future full animation.

### Static test

- local `node --check`: PASS.

### Live gate

Pending:

1. install companion alongside existing profile + Short Test scripts;
2. select 3072 + Standard;
3. run `TRUE 3K Test`;
4. visually compare native-size detail against the known-blurry baseline Short Test;
5. after completion inspect `HFSpinnyMiniWebP3KRepair.diagnostics.lastRun`;
6. require complete phase feeds, one true source/frame under tiled mode, Effects restoration and no error;
7. only if visual fidelity clearly improves, integrate the proven repair into the maintained Spinny capture service/profile path;
8. only then run one full 3072 Standard confirmation.

Do not claim TRUE 3K support from code/topology diagnostics alone; human native-size fidelity remains an explicit acceptance requirement.

## Interaction-guard evidence

During the completed 3072 full run, the user accidentally moved the mouse wheel twice while hovering over the HeroForge canvas. Camera interaction remained active and both changes produced visible jumps in the final WebP.

This directly validates the planned interaction-protection requirement:

- prevent/warn on camera/canvas movement during active/paused capture;
- prevent/warn on leaving Booth;
- prevent/warn on Booth view/backdrop/overlay/light/effect state changes;
- use semantic/runtime/DOM evidence rather than fixed coordinates across HeroForge's layouts.

Pause/input-guard implementation remains a separate stage after resolution behavior is settled.

## 4K collision — confirmed and deferred

Witch Dock Stable `media.screenshot-resolution` owns square 4096/8192 `BT.maker.takeScreenshot` requests and routes them through the true-resolution still repair engine. A naive 4096 Spinny frame call would therefore invoke the still repair on every animation frame.

Decision: **4K Spinny remains deferred.**

## Safety / compatibility constraints

- no private/minified animation-encoder dependency;
- no legacy exact compiled-string patching;
- no raw-RGBA accumulation across all frames;
- restore figure rotation after success/failure/cancel;
- restore temporary Effects adapter after success/failure/cancel;
- preserve public Witch Dock screenshot-provider ownership;
- do not route 4096 Spinny through the current still-capture provider as a production animation solution;
- fail on ambiguous/mutated phase topology;
- public Witch Dock remains untouched until standalone gate closes.

## Next gate

1. Install/run **3072 Standard → TRUE 3K Test**.
2. Compare native-size detail with the known-blurry baseline Short Test.
3. Inspect repair diagnostics after completion.
4. If the repaired Short Test passes visually and mechanically, extract/integrate the proven 3K frame-source repair into the maintained standalone Spinny implementation.
5. Run one full repaired 3072 Standard confirmation.
6. Then implement/test Pause and interaction guards separately.
7. Witch Dock Dev integration remains later and separate.
