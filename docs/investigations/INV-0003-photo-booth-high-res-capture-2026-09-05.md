# INV-0003 — Photo Booth 4K/8K Output Is Upscaled From a 2048 Render

**Date:** 2026-09-05  
**Feature:** `media.screenshot-resolution`  
**HeroForge build:** `heroforge07.1.9.98`  
**Status:** diagnosis confirmed; direct 4K runtime-render proof prepared

## Problem statement

After HeroForge's August 2026 Photo Booth changes, Lob's existing Advanced Decal Posing resolution extension still exposes 4096px and 8192px still-image choices and still downloads files with those literal dimensions. The images no longer contain corresponding rendered detail: 4K is visibly soft at 100%, and 8K is softer still.

## Canonical reference

`Advanced_Decal_Posing_KW_9-3-26_TEST_PATCH.js` v0.99.30, SHA-256 `659a84d1a4b01db4143d713618a216dd46dcc5dbed7bd6e668fe61290276170d`.

Relevant current patch behavior:

- sets `CK.Settings.screenshotSize = 2048`;
- transforms the Photo Booth resolution-loop ceiling from `<=2*CK.Settings.screenshotSize` to `<=4*CK.Settings.screenshotSize`.

The exact source is available as the current user-supplied reference but is not yet mirrored into repository `/legacy/`.

## Confirmed live findings

### Current Photo Booth path

With Photo Booth open, current runtime inspection found:

- `BT.currentMode = 'portrait'` in the tested scene;
- `BT.maker.enabled = true`;
- `BT.maker.takeScreenshot(width, height)` emits the current screenshot lifecycle and forwards the requested dimensions into a private helper;
- the active Photo Booth camera and `CK.renderManager.camera` resolved to the same camera object in the tested scene.

### Named capture renderer remains capable of larger targets

Current `CK.Capture.renderToImage`:

- accepts requested width/height;
- defaults to a 2x antialias factor;
- computes render-target size from requested dimensions times AA factor;
- resizes `CK.Capture.renderTarget` accordingly;
- renders `CK.scene` through the supplied camera;
- downsamples only when AA factor is greater than 1;
- contains a warning above 2048 but no hard 2048 clamp.

`CK.Capture.getDownloadableURL` only converts the supplied canvas to a Blob URL; it does not resize the image.

### 4096 menu capture does not render at 4096

After a normal Lob 4096px Photo Booth capture:

- downloaded file dimensions were reported by Amanda as 4096px;
- `CK.Capture.renderTarget.width = 2048`;
- `CK.Capture.renderTarget.height = 2048`;
- render-target viewport/scissor also remained 2048x2048.

This confirms the literal 4096 output file is not evidence of a 4096 scene render.

### `CK.Settings.screenshotSize` is not the new controlling clamp

A bounded runtime test changed `CK.Settings.screenshotSize` from 2048 to 4096, then Amanda repeated the existing 4096px action.

Result:

- setting remained 4096 during the test;
- real capture render target still ended at 2048x2048.

The setting was restored to 2048 immediately afterward.

### Hardware/browser capability

Current WebGL renderer capability reported:

- `maxTextureSize = 16384`.

Therefore a direct 4096 or 8192 render target is within the reported texture-size limit on the tested machine/browser. This does not guarantee memory/performance safety for every user.

### Visual evidence

Amanda supplied 100%-view snippets of current 4K and 8K outputs. The 4K image is visibly soft for its nominal size; the 8K output is even more visibly blurred. This is consistent with a roughly 2048 scene render being enlarged to progressively larger output canvases.

## Diagnosis

### Confirmed

- Lob's resolution-menu patch still exposes 4K/8K.
- File/output canvas dimensions can be 4K/8K.
- The underlying 4096 capture scene render is still 2048x2048.
- Raising `CK.Settings.screenshotSize` does not repair it.
- `CK.Capture.renderToImage` itself can request larger targets and has no hard 2048 clamp.
- Final Blob conversion is not shrinking the canvas.

### Supported inference

HeroForge's newer private Photo Booth capture/compositing helper now limits the scene render to about 2048 and then creates the requested larger output. That private helper, rather than Lob's menu loop or `CK.Settings.screenshotSize`, is the current compatibility break.

### Unproven

The exact internal expression/branch responsible for the 2048 constraint has not been recovered. No bundle patch should be written on the assumption that a particular minified helper or local variable is stable.

## Selected repair experiment

Use the currently named runtime renderer directly for an isolated proof:

`Photo Booth current camera -> CK.Capture.renderToImage(4096, 4096, camera, 1, true) -> PNG`

Why 1x AA initially:

- a 2x AA request at 4096 would allocate an 8192x8192 render target;
- a future 2x AA request at 8192 would require a 16384x16384 render target, at the reported texture-size ceiling and with substantially higher memory cost;
- the immediate question is whether a genuine 4096 scene render restores the missing detail.

## Safety boundaries

The proof script must:

- not patch `boothui.js`;
- not replace `BT.maker.takeScreenshot`;
- not change `CK.Settings.screenshotSize`;
- not modify native resolution choices;
- require Photo Booth readiness;
- restore pre-existing `CK.Capture.renderTarget` dimensions after the proof render;
- expose diagnostic metadata so the actual render-target/canvas size can be verified even after restoration;
- leave 8K disabled until 4K parity is confirmed.

## Next test

Install `entries/tampermonkey-standalone/photo-booth-true-resolution.user.js`, open Photo Booth, and run the 4096px proof against the same scene used for the blurry Lob output.
