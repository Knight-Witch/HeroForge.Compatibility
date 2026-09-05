# Photo Booth Screenshot Resolution

**Feature ID:** `media.screenshot-resolution`  
**Title:** True high-resolution Photo Booth still capture  
**Status:** 4K standalone validated on `heroforge07.1.9.98`; adaptive phase-feed passed topology/download/visual/repeat/native-after/restoration/dispose; 8K pending separate design  
**Risk:** Medium  
**Intended disposition:** validated standalone 4K; optional Witch Dock Dev candidacy after 8K decision/separate review  
**Primary maintainer:** TBD (Lob-derived feature; ownership not assigned)  
**Reviewer:** Amanda  
**Backup maintainer:** none assigned  
**Last investigated HeroForge build:** `heroforge07.1.9.98` / 2026-09-05

## Purpose

Restore genuine 4096px and later 8192px Photo Booth still-image detail after the August 2026 HeroForge Photo Booth changes left Lob's existing 4K/8K menu extension producing large output files whose visible color/model rendering is constrained by the current native tiled capture path.

The feature requirement is **real rendered detail at the selected output resolution**, not merely a PNG whose canvas dimensions are 4096x4096 or 8192x8192.

## Canonical legacy/reference behavior

Current canonical Lob/Knight Witch reference:

- `Advanced_Decal_Posing_KW_9-3-26_TEST_PATCH.js`
- version `0.99.30`
- SHA-256 `659a84d1a4b01db4143d713618a216dd46dcc5dbed7bd6e668fe61290276170d`

Relevant legacy behavior:

1. `CK.Settings.screenshotSize` is set to `2048`.
2. The Photo Booth UI bundle patch changes the resolution loop from `<=2*CK.Settings.screenshotSize` to `<=4*CK.Settings.screenshotSize`, exposing 4096px and 8192px menu choices.
3. The menu extension still works after the August update: users can select 4096px and 8192px and receive files with those literal pixel dimensions.
4. Current live evidence shows those larger files do not contain corresponding visible rendered detail.

The exact v0.99.30 source is still not archived under repository `/legacy/`; immutable archive/provenance import remains required before this feature can be treated as fully normalized maintained parity work.

## Confirmed current-runtime findings

On HeroForge `heroforge07.1.9.98`:

- `BT.maker.takeScreenshot(width, height)` receives the requested output dimensions and enters the private Photo Booth capture/compositing path.
- The native helper creates a temporary screenshot camera with the Booth token view offset and owns model/background staging, masks, frame handling, visibility, and final compositing.
- The visible model/color path for output larger than 1024 uses a private tiled helper whose current `maxTile` is 1024 normally, or 512 in the identified Painterly special case.
- The tile helper defaults to named `CK.Effects.renderToCanvas` for visible model/color phases and CPU-interleaves phase pixels into the full output image.
- A normal 4096 capture therefore uses a 4x4 grid of sixteen 1024x1024 visible-color phase renders.
- The later frame/auxiliary stage separately uses tiled `CK.Capture.renderToImage`; the previously observed 2048x2048 `CK.Capture.renderTarget` belongs to that path and is not the main visible-color source in the tested scene.
- `CK.Settings.screenshotSize = 4096` does not repair the color path and was restored to 2048 after the bounded test.
- `CK.Effects.renderToCanvas(width, height, camera, aaFactor)` is runtime-accessible by name, contains no 1024 hard clamp, and restores its own temporary Effects state in `finally` cleanup.
- The tested renderer reports `maxTextureSize = 16384`.
- Browser-side comparison found untouched native 4096 only about 7.2% higher in measured edge information than an upscaled native 2048 reference in the tested central region.
- A genuine `CK.Effects.renderToCanvas(4096,4096,nativeTempCamera,1)` render made while native Booth staging was active contained approximately 27.4% more measured edge information than untouched native 4096.
- A runtime phase-feed proof supplied that true-4096 source through the native 16-phase compositor and reproduced the source pixel-for-pixel in the tested central region: MAE 0, RMSE 0, identical measured edge information.

Private current-bundle helper names/offsets are diagnostic evidence only and are not maintained API contracts.

## Target behavior

### 4K validation target

When the standalone test requests 4096px:

- `BT.maker.takeScreenshot(4096,4096)` remains the owning native Booth capture path;
- HeroForge remains responsible for temporary screenshot camera setup, model/background staging, masks, frame behavior, and final compositing;
- during only that explicit capture, the feature temporarily wraps named `CK.Effects.renderToCanvas`;
- the first recognized low-resolution native model phase causes one genuine 4096x4096 Effects render through the original named method;
- the feature derives and validates a coherent square-divisor native phase size/grid from live calls;
- phase coordinates are derived from the temporary capture camera's live view offsets, so fixed call order is not required;
- true-4096 pixels are split into the phase canvases expected by the native tiled helper;
- if HeroForge instead exposes an already-native 4096 model Effects call, the repair leaves that path untouched;
- the native helper recombines those phases and continues normal downstream compositing;
- the final returned/downloaded canvas must be 4096x4096;
- visible detail must be materially sharper than current native/Lob 4096 output;
- native HeroForge capture controls remain unchanged.

### 8K target

8192px is intentionally gated as a separate follow-up even though packaged 4K has passed visual/lifecycle acceptance. The 8K implementation must be designed separately with explicit memory/performance safeguards; a reported `maxTextureSize` of 16384 does not by itself prove an 8192 full-frame Effects render is safe on every system.

## Required capabilities

- initialized Photo Booth / `BT.maker.enabled`;
- `BT.maker.takeScreenshot`;
- named `CK.Effects.renderToCanvas`;
- native temporary screenshot camera reaching the expected phase calls during capture;
- browser canvas 2D pixel APIs (`getImageData`, `createImageData`, `putImageData`);
- browser canvas PNG encoding (`HTMLCanvasElement.toBlob`);
- active renderer with reported texture capacity at or above requested source size when capability is available.

`CK.Capture.renderToImage` remains part of HeroForge's untouched native frame/auxiliary pipeline, but the maintained v0.4 repair does not wrap or replace it.

## Dependencies

- HeroForge Photo Booth must be open/initialized for the test capture.
- No Full Res decal renderer dependency.
- No corrected decal gizmo dependency.
- No Witch Dock dependency.
- No HF-Chat-Bridge production/runtime dependency.
- No direct dependency on private `booth.js` helper names.

## Settings and defaults

- No persistent setting.
- No automatic capture.
- 4096px is the only enabled proof resolution.
- The true Effects source uses AA factor 1 for the 4K proof.
- 8192px remains disabled pending separate resource-safe design and validation.

## Initialization behavior

The standalone userscript mounts its own small diagnostic panel and polls only for capability/readiness state. Initialization does not patch `booth.js`/`boothui.js`, replace HeroForge functions, change `CK.Settings.screenshotSize`, or alter native capture controls.

## Enable behavior

Explicit user action on `Capture TRUE 4096px via Native Booth` performs one capture. During that capture only:

1. `CK.Effects.renderToCanvas` is temporarily wrapped.
2. The wrapper waits for the expected native model-phase call shape.
3. One true 4096 Effects canvas is generated through the original named method.
4. The source pixels are phase-split and supplied back through the native capture's expected model-phase sequence.
5. The wrapper validates expected phase count/order and final output dimensions.
6. The original named method is restored in `finally` cleanup.

The test prevents concurrent capture actions.

## Disable / dispose behavior

Capture cleanup restores the original `CK.Effects.renderToCanvas` method even on failure and releases the large temporary source canvas/pixel-buffer references.

Normal `dispose()` removes:

- the standalone panel;
- injected style;
- readiness/refresh interval;
- event handlers;
- the test global.

There is no persistent runtime override to remove while the test is idle.

## Reload requirements

None for normal enable/disable/dispose. Page reload remains a clean rollback path.

## Persistence behavior

None. The feature does not mutate character data or persistent Photo Booth settings.

## Accepted failure behavior

The feature must refuse or abort the test capture and report a concrete reason when:

- Photo Booth is not open;
- `BT.maker.takeScreenshot` is unavailable;
- `CK.Effects.renderToCanvas` is unavailable;
- reported GPU texture limit is below the requested true source size;
- the native model phase does not form a coherent supported square-divisor topology for the requested output;
- requested output is not evenly divisible by the observed phase size;
- native phase offsets/order differ from the validated grid contract;
- expected phase count is not fully consumed;
- the true Effects source or final native result is not 4096x4096;
- PNG encoding fails.

Failure must restore the named Effects method and leave normal HeroForge capture behavior unchanged after the test operation exits.

## Acceptance tests

### Static

- JavaScript syntax check passes.
- No `booth.js` or `boothui.js` interception.
- No `CK.Settings.screenshotSize` mutation.
- No `CK.Capture.renderToImage` replacement.
- Only the named `CK.Effects.renderToCanvas` method is temporarily wrapped during explicit capture.
- 8K remains disabled.

### Live diagnostic proof already passed

On the tested scene/build:

- direct staged `CK.Effects.renderToCanvas(4096,4096,nativeTempCamera,1)` returned 4096x4096;
- true source measured approximately 27.4% more edge information than untouched native 4096 in the tested central region;
- runtime phase feed supplied all 16 expected 1024 phases;
- phase-fed final native result was 4096x4096;
- phase-fed final vs true source central-region comparison: MAE 0, RMSE 0, identical edge metric;
- temporary runtime wrapper restored after the bounded proof.

### Adaptive runtime proof and human acceptance already passed

A later bridge-driven adaptive version removed the fixed current-build tile whitelist and fixed phase-call-order assumption. On the same current build it:

- detected `tile = 1024`, `grid = 4`, `expectedPhases = 16` from live named Effects/camera geometry;
- derived each phase X/Y from the temporary camera offsets;
- supplied all 16 phases uniquely;
- returned a 4096x4096 final canvas;
- encoded/downloaded a 9,823,790-byte PNG;
- was opened by Amanda, who reported the output looked great.

This passes whole-image human visual acceptance for the adaptive algorithm itself. Packaged standalone lifecycle acceptance subsequently passed as recorded below.

### Packaged standalone 4K acceptance

1. Open Photo Booth.
2. Capture the same scene with normal/Lob 4096px for reference.
3. Run `Capture TRUE 4096px via Native Booth` from packaged standalone v0.4.
4. Require `lastCapture.trueEffectsRender` to report 4096x4096.
5. Require `lastCapture.suppliedPhaseCount === lastCapture.expectedPhases`.
6. Require returned/downloaded canvas to be 4096x4096.
7. Compare at 100% against current native/Lob 4096; fine model edges/details must show materially more real detail.
8. Confirm camera framing, lighting, background, masks/frame, overlays/effects, transparency behavior where relevant, and color output.
9. Confirm a normal native/Lob capture still works afterward.
10. Dispose the standalone test and confirm its panel/timer/global are removed.

### Packaged standalone v0.4 acceptance passed

On the tested build/scene:

- Amanda installed v0.4 and reported the packaged 4096 download worked beautifully.
- A second bridge-driven packaged capture returned `true`, reported `tileSize=1024`, `grid=4`, `expectedPhases=16`, `suppliedPhaseCount=16`, and downloaded a 4096x4096 canvas.
- The second packaged PNG encoded successfully at 9,646,708 bytes.
- `CK.Effects.renderToCanvas` was confirmed restored to the pre-capture function after the packaged action.
- A normal `BT.maker.takeScreenshot(1024,1024)` immediately afterward returned an `HTMLCanvasElement` at 1024x1024.
- `dispose()` removed the test global, panel, and style.

The 4K standalone acceptance suite is complete on `heroforge07.1.9.98`.

### 8K gate

The packaged 4096 suite has passed. Keep 8K disabled until a separate resource-safe 8192 design is implemented and validated.

## Known open questions

- Whether every Booth effect/profile behaves identically when the model source is rendered once at full 4096 rather than through native 1024/512 phase renders.
- Whether the current Painterly 512 phase special case requires additional visual validation beyond the generic dynamic-grid support.
- Whether true 8192 capture is stable across supported GPUs/browsers despite the current test machine reporting a 16384 texture maximum.
- Whether the production repair should remain standalone or later provide independent Witch Dock Dev controls.
