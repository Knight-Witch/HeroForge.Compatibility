# Photo Booth Screenshot Resolution

**Feature ID:** `media.screenshot-resolution`  
**Title:** True high-resolution Photo Booth still capture  
**Status:** standalone experimental repair; 4K proof pending live validation  
**Risk:** Medium  
**Intended disposition:** standalone validation -> Witch Dock Dev candidate only after parity testing  
**Primary maintainer:** TBD (Lob-derived feature; ownership not assigned)  
**Reviewer:** Amanda  
**Backup maintainer:** none assigned  
**Last investigated HeroForge build:** `heroforge07.1.9.98` / 2026-09-05

## Purpose

Restore genuine 4096px and later 8192px Photo Booth still-image capture after the August 2026 HeroForge Photo Booth changes left Lob's existing 4K/8K menu extension producing large output files whose underlying 3D render remains approximately 2048px.

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
4. Current live evidence shows the underlying HeroForge capture render target remains 2048x2048 for the 4096px action, so legacy menu extension no longer provides true high-resolution rendering.

The exact v0.99.30 source is still not archived under repository `/legacy/`; immutable archive/provenance import remains required before this feature can be treated as fully normalized maintained parity work.

## Confirmed current-runtime findings

On HeroForge `heroforge07.1.9.98`:

- `BT.maker.takeScreenshot(width, height)` receives the requested menu dimensions and forwards into a private Photo Booth helper.
- `CK.Capture.renderToImage(width, height, camera, aaFactor, refresh)` is runtime-accessible by name.
- `CK.Capture.renderToImage` does not contain a 2048 hard clamp. It resizes its WebGL render target to `width * aaFactor` by `height * aaFactor`, renders the scene, optionally downsamples, and returns a canvas.
- The current default antialias factor is `2`.
- A normal Lob 4096px capture leaves `CK.Capture.renderTarget` at 2048x2048.
- Temporarily changing `CK.Settings.screenshotSize` from 2048 to 4096 does not change that result; the 4096px menu action still leaves the real render target at 2048x2048.
- The tested renderer reports `maxTextureSize = 16384`, so 4096 and 8192 are within the reported texture-size capability on the current machine/browser.
- User visual comparison shows 4K output is visibly soft at 100%, and 8K is softer still, consistent with a lower-resolution scene render being enlarged into larger output canvases.

## Supported inference

The new private Photo Booth capture/compositing helper between `BT.maker.takeScreenshot()` and `CK.Capture.renderToImage()` is constraining the scene render to about 2048px and then producing the selected larger output canvas/file.

The exact private helper implementation has not yet been recovered as a stable callable capability. This inference must not be treated as a maintained API contract.

## Target behavior

### 4K validation target

When the standalone test requests 4096px:

- active Photo Booth camera is used;
- the underlying `CK.Capture.renderTarget` must actually reach 4096x4096;
- the returned canvas must be 4096x4096;
- PNG output must be 4096x4096;
- visible Photo Booth scene/camera/lighting/effects should match the native/Lob capture closely enough for normal use;
- native HeroForge capture controls must remain unchanged.

### 8K target

8192px is intentionally gated until 4K passes. The initial 8K implementation must use a 1x render factor unless separate testing proves a larger supersample allocation safe and useful.

## Required capabilities

- `CK.Capture.renderToImage`
- active Photo Booth camera through `BT.maker.cameras.currentCamera`, with `CK.renderManager.camera` fallback only when equivalent
- initialized Photo Booth / `BT.maker.enabled`
- active capture renderer
- WebGL texture-size capability at or above requested render size
- browser canvas PNG encoding (`HTMLCanvasElement.toBlob`)

## Optional capabilities

- `CK.Events.emit('boothScreenshotStarted')`
- `CK.Events.emit('boothScreenshotFinished')`

The standalone proof uses these named events when available to preserve the current native Photo Booth screenshot lifecycle without depending on private React/UI code.

## Dependencies

- HeroForge Photo Booth must be open/initialized for the test capture.
- No Full Res decal renderer dependency.
- No corrected decal gizmo dependency.
- No Witch Dock dependency.
- No HF-Chat-Bridge production/runtime dependency.

## Settings and defaults

- No persistent setting in v0.1.0.
- No automatic capture.
- 4096px is the only enabled proof resolution.
- Antialias factor is explicitly `1` for the first proof to require a true 4096x4096 render target without allocating an 8192x8192 supersample target.
- 8192px remains disabled until 4K parity is verified.

## Initialization behavior

The standalone userscript mounts its own small diagnostic panel and polls only for capability/readiness state. It does not patch `boothui.js`, replace HeroForge functions, change `CK.Settings.screenshotSize`, or alter native capture controls.

## Enable behavior

Explicit user action on `Capture TRUE 4096px PNG` performs one capture using the named runtime renderer and current Photo Booth camera.

## Disable / dispose behavior

Dispose removes:

- the standalone panel;
- injected style;
- readiness/refresh interval;
- event handlers;
- the test global.

The capture operation restores the pre-existing `CK.Capture.renderTarget` dimensions after the render so the proof does not intentionally leave HeroForge holding a larger render target allocation.

## Reload requirements

None for normal enable/disable/dispose. Page reload remains a clean rollback path.

## Persistence behavior

None. The feature does not mutate character data or persistent Photo Booth settings.

## Accepted failure behavior

The feature must refuse capture and report a concrete reason when:

- Photo Booth is not open;
- `CK.Capture.renderToImage` is unavailable;
- no active camera is available;
- reported GPU texture limit is below the requested size;
- returned render target or canvas dimensions are not the requested size;
- PNG encoding fails.

Failure must leave native HeroForge capture behavior unchanged.

## Acceptance tests

### Static

- JavaScript syntax check passes.
- No `boothui.js` interception.
- No HeroForge function replacement.
- No `CK.Settings.screenshotSize` mutation.

### Live 4K proof

1. Open Photo Booth.
2. Capture the same scene with normal/Lob 4096px for reference.
3. Run `Capture TRUE 4096px PNG`.
4. Confirm standalone diagnostic metadata records a 4096x4096 render target and canvas.
5. Confirm downloaded file is 4096x4096.
6. Compare at 100% against the current Lob 4096px output; fine model edges/details should show materially more real detail rather than enlarged 2048px softness.
7. Confirm camera framing, lighting, background, overlays/effects, transparency behavior where relevant, and color output are acceptable.
8. Confirm a normal native/Lob capture still works afterward.
9. Dispose the standalone test and confirm no UI/timer remains.

### 8K gate

Do not enable 8K until 4K passes the above acceptance. Then repeat with 8192x8192 and record memory/performance behavior separately.

## Known open questions

- Whether direct `CK.Capture.renderToImage` reproduces every Photo Booth-specific compositing/effect step currently performed by the private helper.
- Whether some Booth overlays require additional runtime state preparation before direct render.
- Whether true 8192px capture is stable across supported GPUs/browsers despite the current test machine reporting a 16384 texture maximum.
- Whether the production repair should replace only Lob's 4K/8K actions or provide independent Witch Dock controls later.
