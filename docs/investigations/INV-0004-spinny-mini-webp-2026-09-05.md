# INV-0004 — Spinny Mini animated WebP reconstruction

Date opened: 2026-09-05
Status: active — standalone parity implementation ready for full test
HeroForge build: `heroforge07.1.9.98`
Feature: `media.spinny-mini-webp`

## Question

How can HeroForge's new Spinny Mini WebP capability be reconstructed into a higher-resolution, configurable-speed feature without depending on brittle compiled-string injection or a huge PNG-series ZIP workflow?

## User goal

Replace the broken legacy Higher Quality Spinny Mini GIF behavior with animated WebP. First milestone is parity with the historical Lob HQ output. After parity, add higher-resolution options and independent slower-rotation presets.

## Confirmed native WebP output

A real native HeroForge `Spinny Mini WebP` generation was traced and the retained output blob was parsed directly as RIFF/WebP.

Output:

- MIME: `image/webp`;
- size: 11,331,110 bytes;
- VP8X canvas: 512x512;
- animation flag present;
- loop count: 0 / infinite;
- frame count: 386 `ANMF` chunks;
- frame duration histogram: 386 frames at 17 ms;
- total duration: 6562 ms;
- effective FPS: 58.823529...;
- native capture calls: 386 x `BT.maker.takeScreenshot(512,512,...)`;
- visible Effects calls: 386 x `CK.Effects.renderToCanvas(512,512,...)`;
- auxiliary call: one `CK.Capture.renderToImage(512,512,...)`.

No ordinary `HTMLCanvasElement.toBlob()` calls were observed during the native animation export. Native HeroForge therefore uses a specialized encoding path, but that path is no longer required for the first reconstruction.

## Confirmed Lob HQ historical output

The user supplied an original Lob Higher Quality Spinny Mini GIF inside a ZIP so the real animated bytes were preserved.

Measured output:

- GIF89a;
- 1024x1024;
- 250 frames;
- 10.000 s duration;
- 25 FPS;
- approximately 40 ms/frame;
- 145,375,926-byte GIF.

Legacy source/bundle audit also confirms the Higher Quality control called the old Spinny function with resolution 1024 and frame-count argument 250. The historical native GIF path added frames with approximately 41 ms delay.

## First parity target

- animated WebP;
- 1024x1024;
- 250 frames;
- 10.0-second revolution;
- 25 FPS / 40 ms frame timing;
- continuous loop.

## Discovery findings

### Named runtime scan

No obvious high-level named Spinny/WebP animation function was exposed on `BT`, `HF`, or `HFUI`.

`CK.encoder` exists but observed helpers were unrelated base64/UTF utilities.

### Webpack scan

A runtime webpack factory scan found loose WebP/GIF-related factory matches but no already-loaded callable export that cleanly represented the native animated-WebP encoder.

Because a lower-priority module dependency was not necessary after the independent mux proof, deeper private-module binding was stopped rather than turning a closure-local implementation into a maintained API dependency.

### Current runtime capabilities

While Photo Booth was open, the following current capabilities were confirmed callable/available:

- `BT.maker.takeScreenshot`;
- `CK.character.display.requestAnimationRefresh`;
- `CK.character.display.animation`;
- `CK.renderManager.requestShadowUpdate`;
- `CK.scene.updateMatrixWorld`.

The legacy HeroForge Spinny implementation independently confirms direct `CK.character.display.rotation.y` stepping plus this display-refresh family as the established rotation mechanism.

## Decisive independent animated-WebP mux proof

A live browser-side proof was run without HeroForge's private animation encoder:

1. Save current `CK.character.display.rotation.y`.
2. Rotate through four test angles.
3. Refresh HeroForge display/occlusion/shadow/matrix state.
4. Capture each frame via `BT.maker.takeScreenshot(128,128)`.
5. Encode each canvas immediately with browser `toBlob('image/webp', 0.9)`.
6. Parse each still WebP and retain compressed `ALPH` / `VP8 ` / `VP8L` image chunks.
7. Assemble a new animated WebP with RIFF + VP8X + ANIM + full-frame ANMF chunks.
8. Decode the result through browser `Image.decode()`.
9. Restore original character rotation.

Result:

- status: PASS;
- 128x128;
- 4 frames;
- 400 ms total;
- blob size 9,590 bytes;
- browser decode PASS;
- original rotation restoration PASS.

A separate local synthetic three-frame mux was also recognized as animated WebP by independent image tooling.

## Architecture decision

Accepted first maintained path:

```text
HeroForge runtime character rotation
→ established display/occlusion refresh sequence
→ BT.maker.takeScreenshot(frameSize, frameSize)
→ browser-native static WebP encoding per frame
→ project-owned animated-WebP RIFF mux
```

This is preferred over private webpack encoder discovery because it:

- stays at a higher integration-priority layer;
- does not freeze minified/closure-local identifiers;
- reuses HeroForge's rendered frame output;
- avoids GIF color/codec limitations;
- avoids PNG-series ZIP growth;
- allows frame timing and frame count to be controlled independently;
- allows compressed frame payloads to be retained instead of raw RGBA buffers.

## Standalone v0.1.0 implementation

Entry: `entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js`.

Fixed parity profile:

- size: 1024;
- frames: 250;
- frame duration: 40 ms;
- WebP static-frame quality: 0.95;
- loop count: 0 / infinite.

Behavior:

- requires Photo Booth open;
- blocks concurrent captures;
- rotates one full revolution evenly across 250 samples;
- preserves established refresh/occlusion timing before capture;
- immediately static-WebP encodes each captured frame;
- retains compressed payload chunks only;
- reduces each source canvas backing store after extraction;
- assembles a deterministic animated WebP;
- parses/validates output dimensions, frame count, and total duration before download;
- supports cancel-after-current-frame;
- restores original rotation in `finally`;
- exposes `HFSpinnyMiniWebPHQTest.lastCapture` diagnostics;
- installs no permanent HeroForge method override.

Static JavaScript syntax check: PASS.

## Supported inference

The first 1024/250 run will be materially heavier than native 512 WebP because each frame contains four times the pixels, but it should remain far more memory-efficient than retaining 250 raw 1024 RGBA frames because each frame is compressed immediately.

## Still unproven

- full 1024/250 live completion time and browser/GPU pressure;
- exact visual rotation direction/alignment relative to the historical Lob GIF;
- whether quality 0.95 is the ideal maintained static-WebP quality setting;
- repeated-use behavior after a full 250-frame capture;
- practical 2048 limits;
- final speed preset multipliers/frame-count policy.

## Safety / compatibility constraints

- Do not hard-code current minified module-local names as APIs.
- Do not reintroduce the legacy exact compiled-string patch unless higher-priority runtime access becomes insufficient.
- Do not retain all uncompressed high-resolution frames simultaneously.
- Block concurrent animated captures.
- Restore character rotation after success, failure, or cancel where technically possible.
- `media.screenshot-resolution` provider only intercepts 4096/8192 square still requests, so 1024/2048 Spinny frame requests should pass through untouched.
- Public Witch Dock and Stable remain untouched during this investigation.

## Next gate

Run the standalone v0.1.0 1024/250 parity capture and verify:

1. capture finishes and downloads a `.webp`;
2. output opens/animates correctly;
3. output is mechanically 1024x1024 / 250 frames / 10,000 ms;
4. visual spin completes one clean revolution at the intended cadence;
5. model returns to its original orientation;
6. HeroForge remains healthy after capture;
7. repeat capture works.

Only after that gate passes should 2048 and configurable slower-speed profiles begin.
