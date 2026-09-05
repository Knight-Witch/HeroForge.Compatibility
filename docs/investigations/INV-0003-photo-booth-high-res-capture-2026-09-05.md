# INV-0003 — Photo Booth 4K Color Capture Is Capped by 1024 Phase Tiles

**Date:** 2026-09-05  
**Feature:** `media.screenshot-resolution`  
**HeroForge build:** `heroforge07.1.9.98`  
**Status:** visible-color choke point confirmed; adaptive true-4K standalone v0.4 validated on `heroforge07.1.9.98`; 8K follow-up pending

## Problem statement

After HeroForge's August 2026 Photo Booth changes, Lob's existing Advanced Decal Posing resolution extension still exposes 4096px and 8192px still-image choices and still downloads files with those literal dimensions. The images do not contain corresponding rendered detail: 4K is visibly soft at 100%, and 8K is softer still.

The initial investigation correctly established that `CK.Settings.screenshotSize` and final Blob conversion were not the controlling cause, but it incorrectly treated the observed 2048x2048 `CK.Capture.renderTarget` as the main visible scene render. Deeper tracing of the current private Booth pipeline has now separated the visible model/color path from the frame/auxiliary capture path.

## Canonical reference

`Advanced_Decal_Posing_KW_9-3-26_TEST_PATCH.js` v0.99.30, SHA-256 `659a84d1a4b01db4143d713618a216dd46dcc5dbed7bd6e668fe61290276170d`.

Relevant current patch behavior:

- sets `CK.Settings.screenshotSize = 2048`;
- transforms the Photo Booth resolution-loop ceiling from `<=2*CK.Settings.screenshotSize` to `<=4*CK.Settings.screenshotSize`.

The exact source is available as the current user-supplied reference but is not yet mirrored into repository `/legacy/`.

## Confirmed live findings

### Current Photo Booth entry path

With Photo Booth open on `heroforge07.1.9.98`:

- `BT.maker.takeScreenshot(width, height)` receives the requested output dimensions and enters the current private Booth capture helper;
- the helper clones the current orbit camera into a temporary screenshot camera and applies the Booth token view offset before rendering;
- the private pipeline owns model/background staging, mask handling, frame handling, visibility changes, and final compositing;
- current renderer capability reports `maxTextureSize = 16384` on the tested machine/browser.

### The 2048 `CK.Capture.renderTarget` is not the main visible-color source

Earlier live inspection found `CK.Capture.renderTarget` at 2048x2048 after nominal 4096 capture. That observation remains correct, but its interpretation is now corrected.

A bounded readback trace separated two sets of capture work:

- 16 readbacks outside `CK.Capture.renderToImage`, each from a 1024x1024 target;
- 16 readbacks inside `CK.Capture.renderToImage`, each from a 2048x2048 target in the tested capture.

Raw pixel inspection showed:

- the outside 1024 readbacks contain the visible Booth scene: mean RGB approximately 31, alpha 255, and roughly 80% of sampled pixels containing nonzero RGB;
- the inside 2048 `renderToImage` readbacks were RGB/alpha zero in the tested scene.

Therefore the 2048 target belongs to the frame/auxiliary path for this capture, not the main rendered character/color source.

### Private tiled color helper recovered for diagnosis

Authenticated current-page source retrieval of `gated/booth.js?version=heroforge07.1.9.98` succeeded and the call stack identified the relevant private helper chain.

The current private tiled helper, locally named `Lt` in this build, accepts:

- output context;
- temporary capture camera;
- full output width/height;
- a `maxTile` value whose default is 1024;
- an optional tile renderer whose default is `CK.Effects.renderToCanvas`;
- an optional per-tile callback.

It chooses a power-of-two grid large enough that each rendered phase is no larger than `maxTile`, shifts the camera view for each phase, renders the phase, and CPU-interleaves the phase pixels into one full-resolution `ImageData` buffer.

For a normal 4096x4096 capture with `maxTile = 1024`, the result is:

- grid: 4x4;
- phase size: 1024x1024;
- visible model/color renders: 16.

The private screenshot helper, locally named `en` in this build, explicitly calls that tiled helper for the model stage when either dimension exceeds 1024. It supplies:

- `maxTile = 1024` normally;
- `maxTile = 512` for the current Painterly special case when Painterly is enabled and `CK.Settings.screenshotSize < 1024`;
- default phase rendering through named `CK.Effects.renderToCanvas`.

The later frame stage separately uses tiled `CK.Capture.renderToImage` calls.

These private names and byte offsets are build-specific diagnostic evidence only. They are not stable project APIs and the maintained repair must not call `Lt` or `en` directly.

### Native 4096 is not a trivial resize, but effective detail remains close to 2048

Browser-side same-scene comparisons established:

- native 4096 contains more information than a simple 4x upscale of native 1024;
- native 4096 is nevertheless extremely close to a 2x upscale of native 2048 in the tested central character region;
- native 2048 vs native 4096 measured mean RGB difference approximately `0.725 / 255`;
- approximately 91.9% of sampled RGB channels differed by no more than 2, and 97.6% by no more than 5;
- native 4096 contained only approximately 7.2% more measured edge information than the upscaled native 2048 reference.

This matches Amanda's visual assessment that the nominal 4K result does not look meaningfully like a true 4K render.

### Named `CK.Effects.renderToCanvas` can produce a genuine 4096 color render

`CK.Effects.renderToCanvas(width, height, camera, aaFactor)` is runtime-accessible by name. Current function inspection shows that it:

- accepts arbitrary requested width/height;
- temporarily sizes the Effects pipeline to the requested dimensions;
- renders the scene and enabled effects passes;
- reads the temporary render target back to a canvas;
- restores prior Effects dimensions, render boundaries, ProgressiveAA state, custom camera state, and event state in `finally` cleanup.

It contains no 1024 hard clamp.

A bounded side render was executed during the first native 1024 model phase, after HeroForge had already staged the correct Booth state and temporary screenshot camera:

`CK.Effects.renderToCanvas(4096, 4096, nativeTempCamera, 1)`

Result:

- returned canvas: 4096x4096;
- native final comparison canvas: 4096x4096;
- central-region mean RGB difference: approximately `3.106 / 255`;
- direct true-4K edge metric: approximately `3.116`;
- untouched native 4096 edge metric: approximately `2.446`;
- direct true-4K render contained approximately 27.4% more measured edge information;
- both tested central regions remained fully opaque.

This proves the named Effects renderer can provide the missing high-resolution visible-color source while HeroForge's own Booth staging is active.

### Runtime phase-feed repair passed mechanically

A no-bundle-patch runtime proof temporarily wrapped only `CK.Effects.renderToCanvas` during one explicit `BT.maker.takeScreenshot(4096,4096)` call.

The proof:

1. allowed HeroForge to enter its normal native Booth capture and stage the temporary screenshot camera/background/effects state;
2. intercepted the first native 1024 visible-color phase request;
3. rendered one genuine 4096x4096 Effects frame through the original named `CK.Effects.renderToCanvas`;
4. read that full canvas once;
5. split its pixels into the same sixteen 4x4 residue classes expected by the private tiled helper;
6. returned the appropriate 1024x1024 phase canvas for each of the sixteen native phase calls;
7. allowed the untouched native helper to interleave those phases and continue its normal mask/frame/final compositing;
8. restored the original named Effects method in `finally` cleanup.

Mechanical result:

- expected/supplied phase calls: 16/16;
- source Effects frame: 4096x4096;
- final native-composited result: 4096x4096;
- repaired final vs true source in the tested central 2048 region: MAE `0`, RMSE `0`;
- measured edge metric was identical between repaired final and true source;
- repaired final retained the approximately 27.4% edge-detail advantage over the untouched native 4096 baseline.

### Adaptive topology proof passed live and looked correct

A later bridge-driven proof hardened the phase-feed algorithm so it no longer requires a fixed 1024/512 tile whitelist or fixed row-major call sequence. Instead it derives a coherent square-divisor tile/grid from live `CK.Effects.renderToCanvas` calls on the temporary 4096 capture camera and derives phase X/Y from the live camera view offsets.

Current-build result:

- detected mode: adaptive tiled repair;
- detected tile: 1024;
- detected grid: 4x4;
- expected phases: 16;
- supplied phases: 16;
- unique phase coordinates: 16;
- final result: 4096x4096;
- PNG size: 9,823,790 bytes;
- Amanda opened the downloaded image and reported that it looked great.

The adaptive algorithm therefore has whole-image human visual acceptance on the tested scene in addition to the earlier pixel/edge-metric proof.

Packaged v0.4 lifecycle validation then passed:

- second packaged capture returned success;
- detected topology remained 1024 / 4x4 / 16 expected and 16 supplied phases;
- second packaged output was 4096x4096 and encoded to a 9,646,708-byte PNG;
- `CK.Effects.renderToCanvas` was restored after capture;
- normal native `BT.maker.takeScreenshot(1024,1024)` immediately afterward returned a correct 1024x1024 canvas;
- `dispose()` removed the global, panel, and style;
- Amanda separately reported the installed v0.4 capture worked beautifully.

This is the strongest current repair path because it preserves HeroForge's native Booth staging/compositor while replacing only the capped visible-color phase source through a named runtime capability.

## Rejected experiments

### Direct `CK.Capture.renderToImage` output as the final screenshot

A direct 4096 render proved large target allocation works, but visual composition parity failed: the figure was squashed and the Booth viewport/frame artifact was visible. This bypasses too much native Booth staging/compositing and is rejected as the final repair architecture.

### Upgrading the private helper's `CK.Capture.renderToImage` phase

The v0.2 experiment targeted the first capped `CK.Capture.renderToImage` call while preserving `BT.maker.takeScreenshot`. Deeper tracing proved that path is not the main visible-color render for the tested scene. It is superseded by the Effects phase-feed repair.

### Resizing the native 1024 render targets to 2048 in-place

A bounded supersample-target experiment found and resized all 16 candidate color targets, but the private renderer lifecycle replaced/cycled targets before the intended controlled readback/downsample. The resulting output had approximately 25% less measured edge information than the untouched native baseline. This strategy is rejected.

## Current diagnosis

### Confirmed

- Lob's resolution-menu patch still exposes 4K/8K output choices.
- Large output canvas dimensions do not guarantee corresponding rendered detail.
- `CK.Settings.screenshotSize` is not the controlling high-resolution repair knob.
- `CK.Capture.renderToImage` is not the main visible-color source for the current high-resolution Booth path in the tested scene.
- The current private model path intentionally caps phase renders to 1024 pixels per side, or 512 in the identified Painterly special case.
- For 4096 output, the normal path reconstructs the visible model image from sixteen shifted 1024 Effects renders.
- The named `CK.Effects.renderToCanvas` path can produce a genuine 4096x4096 visible-color render using the already-staged native Booth screenshot camera.
- A temporary phase-feed wrapper can inject those true-4096 pixels through the untouched native compositor exactly in the tested central region.

### Supported inference

The 1024 model-phase cap is the principal quality ceiling responsible for the current soft 4K/8K behavior. The native interleave reconstructs some additional spatial information, but each visible-color sample remains rasterized at only 1024x1024, limiting effective detail.

### Unproven / still required

- Painterly/other effect-profile regression coverage beyond the validated reference scene.
- 8192 stability, memory cost, and appropriate phase strategy.
- Cross-build stability after HeroForge updates.

## Selected repair experiment

Package the adaptive runtime phase-feed proof as standalone v0.4:

`BT.maker.takeScreenshot(4096,4096)`

while temporarily wrapping named:

`CK.Effects.renderToCanvas`

only during that explicit capture.

The wrapper should detect the current native 1024/512 model-phase pattern through call shape and camera dimensions, render one true 4096 Effects frame, validate the expected phase grid/order, supply reconstructed phase canvases to the native helper, and restore the named method in `finally` cleanup.

The maintained standalone code must not call the private `Lt`/`en` helpers or depend on their minified names.

## Safety boundaries

The v0.4 repair must:

- not patch `booth.js` or `boothui.js`;
- not replace `BT.maker.takeScreenshot`;
- not change `CK.Settings.screenshotSize`;
- not alter native resolution choices;
- require Photo Booth readiness;
- require `CK.Effects.renderToCanvas`;
- validate the native phase size/grid before supplying replacement pixels;
- refuse unexpected phase order/count instead of silently producing a corrupt image;
- wrap `CK.Effects.renderToCanvas` only during the explicit capture and restore it even on failure;
- prevent concurrent test captures;
- release the large temporary source pixel buffer after capture;
- leave 8K disabled pending its own resource-safe design and validation.

## Next test

The 4K standalone acceptance suite is complete on the current build. Next:

1. design an 8192 proof with explicit memory/GPU safeguards rather than simply scaling the 4K allocation strategy;
2. validate 8K detail/composition/lifecycle separately;
3. re-run the complete v0.4 4K regression suite after any shared changes;
4. only after that decide standalone vs Witch Dock Dev disposition for the broader high-resolution still feature.
