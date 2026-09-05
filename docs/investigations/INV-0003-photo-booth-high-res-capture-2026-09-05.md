# INV-0003 — Photo Booth High-Resolution Still Capture

**Date:** 2026-09-05  
**Feature:** `media.screenshot-resolution`  
**HeroForge build:** `heroforge07.1.9.98`  
**Status:** diagnosis complete; standalone true 4K + grouped true 8K v0.6 validated

## Problem

Lob/ADP still exposes nominal 4096px and 8192px Photo Booth choices, but after HeroForge's August 2026 Booth changes the visible character/color detail is much softer than those literal output dimensions imply.

## Corrected Diagnosis

Early inspection observed `CK.Capture.renderTarget` at 2048 and initially suspected that path. Deeper tracing separated the pipelines:

- visible model/color readbacks occur through a private tiled path using named `CK.Effects.renderToCanvas`;
- the current normal phase cap is 1024;
- the later 2048 `CK.Capture.renderToImage` work belongs to a separate frame/auxiliary path in the tested scene.

Therefore:

- 4096 normal model color = 4x4 / 16 shifted 1024 Effects phases;
- 8192 normal model color = 8x8 / 64 shifted 1024 Effects phases.

Private helper names/offsets remain build-specific diagnostic evidence only.

## True 4K Proof

A staged named `CK.Effects.renderToCanvas(4096,4096,tempCamera,1)` succeeded while HeroForge's native Booth state was active.

In the tested central region:

- untouched native 4096 was only about 7.2% higher in measured edge information than an upscaled native 2048 reference;
- the direct staged true-4096 source measured about 27.4% more edge information than untouched native 4096;
- phase-feeding that true source through the native compositor reproduced the source exactly in the measured region (MAE 0 / RMSE 0 / identical edge metric).

Adaptive v0.4 then derived the live 1024 / 4x4 / 16 topology and phase coordinates from camera offsets, passed packaged download/lifecycle checks, and received whole-image user visual acceptance.

## 8K One-Shot Investigation

A bridge-launched one-shot true 8192 Effects source proved the algorithm can mechanically produce correct 8192 output:

- live topology: 1024 / 8x8 / 64 phases;
- one-shot source: 8192x8192;
- final native result: 8192x8192;
- 64/64 unique phases supplied;
- wrapper restoration and native-after test passed;
- Amanda reported the downloaded image looked great.

However, packaged repetitions exposed a reliability problem: HeroForge repeatedly hit the familiar white renderer-reset / blank-output failure at the tail of the one-shot 8192 path.

### Rejected explanations / mitigations

The same failure remained after:

- moving from Tampermonkey `unsafeWindow` sandbox execution to page-context/raw execution;
- stripping the package down to an 8K-only minimal implementation;
- replacing normal asynchronous `canvas.toBlob()` export with custom streaming PNG capture/compression.

Therefore sandboxing, generalized package overhead, and PNG export were rejected as the principal cause. The evidence supports the one-shot 8192 Effects allocation as the unstable pressure point on the tested machine.

## Accepted Grouped 8K Design

The successful replacement avoids an 8192 Effects target entirely.

For an 8192 final image with current 1024 native phases:

- final native phase grid = 8x8;
- one 4096 source can cover every second final-output sample on each axis, i.e. 4x4 = 16 phase classes;
- four appropriately shifted 4096 sources cover the four parity groups;
- 4 sources x 16 phase classes = all 64 native 8K phases.

Implementation:

1. Native `BT.maker.takeScreenshot(8192,8192)` stages the Booth scene/camera and owns final compositing.
2. Temporary wrapper observes live tile/grid/camera geometry.
3. Four shifted 4096 Effects sources are rendered through the original named method.
4. Each source is read once; its canvas is immediately released.
5. Each source pixel group supplies only its assigned native phase classes and is released after its final phase.
6. HeroForge's untouched native helper recombines all 64 phases and performs normal frame/mask/background/effects compositing.

Result:

- grouped v0.5.4 completed without the prior white renderer-reset cliff;
- Amanda reported it was **very easy on the GPU** and that the output worked perfectly;
- final combined v0.6 package passed both TRUE 4K and TRUE 8K visual acceptance.

## Selected Maintained Repair

Standalone v0.6:

- TRUE 4K = 1 x 4096 source;
- TRUE 8K = 4 x shifted 4096 sources;
- named `CK.Effects.renderToCanvas` only;
- adaptive square-divisor topology detection;
- camera-offset-derived phase coordinates;
- untouched native `BT.maker.takeScreenshot` compositor;
- no private helper-name dependency;
- no bundle patch;
- no `CK.Settings.screenshotSize` mutation;
- no `CK.Capture.renderToImage` replacement.

## Remaining Questions

- Cross-build stability after future HeroForge updates.
- Painterly/other special effect profile regression beyond the validated scenes.
- Whether this validated standalone should become a Witch Dock Dev candidate.

## Disposition

`media.screenshot-resolution` is now **standalone validated** at both 4096 and 8192 on `heroforge07.1.9.98`. The one-shot 8192 source path is rejected for maintained use on the tested machine; grouped 4x4096 is the accepted 8K architecture.
