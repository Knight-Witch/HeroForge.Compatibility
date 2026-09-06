# INV-0004 — Spinny Mini animated WebP reconstruction

Date opened: 2026-09-05
Status: active — first 1024/250 parity milestone validated; 2048/speed-profile stage next
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

No ordinary `HTMLCanvasElement.toBlob()` calls were observed during the native animation export. Native HeroForge therefore uses a specialized encoding path, but that path is not required for the maintained reconstruction.

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

## First parity target — validated

Target:

- animated WebP;
- 1024x1024;
- 250 frames;
- 10.0-second revolution;
- 25 FPS / 40 ms frame timing;
- continuous loop.

Full standalone v0.1.0 result:

- user reported: “the webp worked”;
- active build confirmed: `0.1.0-runtime-rotation-webp-mux`;
- download path mechanically requires 1024x1024, exactly 250 frames, and exactly 10,000 ms total duration before it will save the file;
- mux writes every ANMF duration at 40 ms;
- mux writes loop count 0 / infinite;
- retained post-capture status recovered through HF-Chat-Bridge: `Downloaded 1024px WebP: 250 frames / 10.0 s / 12.9 MiB`;
- Photo Booth capture capability remained ready afterward.

Result: **PASS. First Lob-parity milestone closed.**

The 12.9 MiB size is the UI's rounded display value. Exact output bytes from the original run were not recoverable because the current public diagnostic getter is blocked by the bridge safe reader.

## Discovery findings

### Named runtime scan

No obvious high-level named Spinny/WebP animation function was exposed on `BT`, `HF`, or `HFUI`.

`CK.encoder` exists but observed helpers were unrelated base64/UTF utilities.

### Webpack scan

A runtime webpack factory scan found loose WebP/GIF-related factory matches but no already-loaded callable export that cleanly represented the native animated-WebP encoder.

Follow-up issue #467 later found the temporary `HFSpinWebpack` diagnostic object no longer present. This private-module track is now **no longer relevant** to the accepted implementation because the independent mux path has been proven and fully exercised at 1024 parity.

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

Accepted maintained path:

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

Validated parity profile:

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
Full 1024/250 live capture: PASS.

## Supported inference

2048 Standard will contain four times the pixels per frame as validated 1024 Standard and is therefore expected to be materially heavier. Slow profiles that preserve 25 FPS will also increase output size roughly with frame count, although WebP inter-frame compression behavior and scene content will affect the actual ratio.

## Still unproven

- exact full-run orientation-restored diagnostic on the validated 250-frame run;
- repeated full capture in one session;
- practical 2048 completion time, output size, browser/GPU pressure, and memory behavior;
- final practical limits for combined 2048 + long-duration profiles;
- whether quality 0.95 should remain fixed for all resolutions.

## Next profile architecture

Resolution and speed remain independent.

Initial resolution options:

- 1024 — validated;
- 2048 — experimental next.

Initial speed presets, preserving 25 FPS temporal density:

- Standard: 10 s / 250 frames;
- Slow: 15 s / 375 frames;
- Slower: 20 s / 500 frames;
- Very Slow: 30 s / 750 frames.

This intentionally increases angular sample count as rotation slows rather than replaying 250 sparse samples for a longer duration.

Validation order:

1. 1024 Standard regression must still match v0.1.0.
2. 2048 Standard.
3. 1024 Slow.
4. 1024 Slower.
5. 1024 Very Slow.
6. Expensive 2048 + slow combinations only after the preceding resource behavior is known.

## Safety / compatibility constraints

- Do not hard-code current minified module-local names as APIs.
- Do not reintroduce the legacy exact compiled-string patch unless higher-priority runtime access becomes insufficient.
- Do not retain all uncompressed high-resolution frames simultaneously.
- Block concurrent animated captures.
- Restore character rotation after success, failure, or cancel where technically possible.
- `media.screenshot-resolution` provider only intercepts 4096/8192 square still requests, so 1024/2048 Spinny frame requests should pass through untouched.
- Preserve the exact validated 1024 Standard capture behavior while parameterizing profiles.
- Public Witch Dock and Stable remain untouched during this investigation.

## Next gate

Generalize the standalone capture package without rewriting its validated core:

1. add 1024/2048 resolution selection;
2. add Standard/Slow/Slower/Very Slow speed selection;
3. expose bridge-readable plain diagnostic state including exact output bytes and rotation-restored status;
4. validate 1024 Standard regression first;
5. validate 2048 Standard next;
6. validate slower 1024 profiles and resource behavior;
7. define practical guardrails before testing the most expensive 2048 + slow combinations.

Only after that expanded standalone suite passes should Witch Dock Dev integration begin.
