# Photo Booth Screenshot Resolution

**Feature ID:** `media.screenshot-resolution`  
**Title:** True high-resolution Photo Booth still capture  
**Status:** standalone validated at 4096 and 8192 on `heroforge07.1.9.98`  
**Risk:** Medium  
**Intended disposition:** validated standalone; optional Witch Dock Dev candidacy after separate approval/review  
**Primary maintainer:** TBD (Lob-derived feature; ownership not assigned)  
**Reviewer:** Amanda  
**Last investigated HeroForge build:** `heroforge07.1.9.98` / 2026-09-05

## Purpose

Restore genuine 4096px and 8192px Photo Booth still-image detail after HeroForge's current high-resolution tiled model path left Lob's nominal 4K/8K menu outputs with much softer effective detail than their literal file dimensions imply.

## Canonical reference

Current user-supplied ADP reference: `Advanced_Decal_Posing_KW_9-3-26_TEST_PATCH.js` v0.99.30, SHA-256 `659a84d1a4b01db4143d713618a216dd46dcc5dbed7bd6e668fe61290276170d`.

Relevant legacy behavior exposes larger menu choices but does not repair current visible-color rasterization. Exact v0.99.30 archive/provenance import under `/legacy/` remains pending.

## Confirmed Current Runtime

- `BT.maker.takeScreenshot(width,height)` owns native Booth staging, temporary screenshot camera, masks/frame/background/effects state, and final compositing.
- Visible high-resolution model color is requested through named `CK.Effects.renderToCanvas` inside a private tiled helper.
- Current normal private phase cap is 1024 in the tested scene, producing 16 phases at 4096 and 64 phases at 8192.
- The separate 2048 `CK.Capture.renderTarget` previously observed belongs to a frame/auxiliary path in the tested scene.
- `CK.Effects.renderToCanvas` itself can render a genuine staged 4096x4096 color source and has no 1024 clamp.
- Private helper names/offsets are diagnostic evidence only and are not maintained API contracts.

## Maintained v0.6 Design

### TRUE 4K

1. Call native `BT.maker.takeScreenshot(4096,4096)`.
2. Temporarily wrap named `CK.Effects.renderToCanvas` only for that explicit capture.
3. Detect the native square-divisor model tile/grid from live calls and temporary capture-camera geometry.
4. Render one true 4096x4096 Effects source through the original named method while native Booth staging is active.
5. Split that source into the phase classes requested by HeroForge's native tiled helper.
6. Let HeroForge perform its untouched final compositor.
7. Restore the original named method and release source buffers.

### TRUE 8K

One-shot 8192 Effects rendering is rejected as the maintained path on the tested machine because repeated packaged tests triggered a white renderer-reset / blank-output cliff.

Accepted grouped design:

1. Call native `BT.maker.takeScreenshot(8192,8192)`.
2. Detect the native 8K model topology; current tested topology is 1024 / 8x8 / 64 phases.
3. Render **four shifted 4096x4096 Effects sources** rather than one 8192 source.
4. Each 4096 source covers one parity group of the final 8K sampling lattice and supplies 16 native phase classes.
5. Combined coverage is 4 sources x 16 classes = all 64 native phases.
6. Release each source canvas immediately after pixel readback and release each group's pixel buffer after its final phase.
7. Let HeroForge's untouched native 8192 compositor build the final Booth image.

No 8192 WebGL Effects target is allocated by the maintained 8K path.

## Required Capabilities

- Photo Booth initialized / `BT.maker.enabled`;
- `BT.maker.takeScreenshot`;
- named `CK.Effects.renderToCanvas`;
- temporary screenshot camera with coherent view-offset phase geometry;
- browser 2D canvas pixel APIs;
- PNG encoding via canvas `toBlob()`;
- renderer texture/renderbuffer capacity at least 4096 for the maintained source size.

## Failure Behavior

Abort and restore the named Effects method when:

- Photo Booth or named capabilities are unavailable;
- GPU texture/renderbuffer limit is below 4096;
- live model topology is mixed, duplicate, incomplete, non-integral, or incompatible with the grouped source geometry;
- true source dimensions are incorrect;
- final native result dimensions are incorrect;
- PNG encoding fails.

A future already-native full-resolution Effects model path should pass through unchanged.

## Lifecycle

- No persistent character or Booth setting mutation.
- No bundle patch.
- Concurrent captures blocked.
- Temporary Effects wrapper exists only during explicit capture.
- `dispose()` removes standalone UI/timer/global while idle.
- Page reload is a clean rollback path.

## Validation

### 4K

- true staged 4096 source: passed live;
- detail improvement over untouched native/Lob 4096: measured and visually confirmed;
- adaptive phase feed: passed mechanically;
- packaged v0.4 lifecycle and visual acceptance: passed;
- combined v0.6 4K visual regression: passed.

### 8K

- one-shot 8192 bridge proof: correct when it survived, but maintained packaged one-shot path rejected for renderer-reset instability;
- page-context/sandbox/minimal/export variants: rejected as non-solutions;
- grouped four-shifted-4096 v0.5.4: passed visually and reported dramatically easier on GPU;
- combined v0.6 8K visual regression: passed perfectly.

## Next Gate

Standalone validation is complete on the tested build. Decide separately whether this feature should remain standalone or be integrated into Witch Dock Dev. Do not modify Witch Dock Stable without separate Dev integration testing and promotion review.
