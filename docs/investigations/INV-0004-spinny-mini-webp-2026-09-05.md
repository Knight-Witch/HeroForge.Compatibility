# INV-0004 — Spinny Mini animated WebP reconstruction

Date opened: 2026-09-05
Status: active — 1024/250 parity validated; configurable v0.2.0 candidate implemented, live regression pending
HeroForge build: `heroforge07.1.9.98`
Feature: `media.spinny-mini-webp`

## Question

How can HeroForge's new Spinny Mini WebP capability be reconstructed into a higher-resolution, configurable-speed feature without depending on brittle compiled-string injection or a huge PNG-series ZIP workflow?

## User goal

Replace the broken legacy Higher Quality Spinny Mini GIF behavior with animated WebP. First milestone was parity with the historical Lob HQ output; after parity, add higher-resolution options and independent slower-rotation presets.

## Confirmed native WebP output

A real native HeroForge `Spinny Mini WebP` generation was traced and parsed directly as RIFF/WebP:

- MIME: `image/webp`;
- size: 11,331,110 bytes;
- canvas: 512x512;
- loop count: 0 / infinite;
- frame count: 386 `ANMF` chunks;
- every frame: 17 ms;
- total duration: 6562 ms;
- effective FPS: 58.823529...;
- 386 x `BT.maker.takeScreenshot(512,512,...)`;
- 386 x `CK.Effects.renderToCanvas(512,512,...)`;
- one `CK.Capture.renderToImage(512,512,...)`.

Native HeroForge uses a specialized encoder path, but the maintained reconstruction no longer requires it.

## Confirmed Lob HQ historical output

Measured from the user-supplied original GIF:

- GIF89a;
- 1024x1024;
- 250 frames;
- 10.000 s;
- 25 FPS;
- approximately 40 ms/frame;
- 145,375,926 bytes.

Legacy source audit confirms the old Higher Quality control invoked the Spinny function with resolution 1024 and frame-count argument 250.

## First parity target — validated

Standalone v0.1.0 target:

- animated WebP;
- 1024x1024;
- 250 frames;
- 40 ms/frame;
- 10.0-second revolution;
- 25 FPS;
- infinite loop.

Result:

- user reported “the webp worked”;
- runtime build confirmed `0.1.0-runtime-rotation-webp-mux`;
- download path mechanically requires 1024x1024, exactly 250 frames, and exactly 10,000 ms before saving;
- mux writes every ANMF at 40 ms and ANIM loop count 0;
- retained post-capture UI: `Downloaded 1024px WebP: 250 frames / 10.0 s / 12.9 MiB`;
- Photo Booth capture capability remained ready afterward.

**PASS. First Lob-parity milestone closed.**

Exact output bytes from that first run were not recoverable because v0.1.0 exposed `lastCapture` through a getter blocked by the bridge safe reader.

## Discovery findings

- No stable high-level named Spinny/WebP animation encoder was exposed on `BT`, `HF`, or `HFUI`.
- `CK.encoder` visible helpers were unrelated base64/UTF utilities.
- Webpack discovery found loose WebP/GIF factories but no clean stable callable encoder export.
- Follow-up bridge issue #467 found the temporary `HFSpinWebpack` diagnostic object gone.
- Private encoder discovery is now **no longer relevant** to the accepted path because the independent mux architecture passed both microproof and full 1024 parity.

## Decisive independent mux proof

Live browser-side proof without HeroForge's private animation encoder:

1. Save `CK.character.display.rotation.y`.
2. Rotate through four angles.
3. Refresh display/occlusion/shadow/matrix state.
4. Capture via `BT.maker.takeScreenshot(128,128)`.
5. Encode each canvas with browser static WebP.
6. Retain compressed `ALPH` / `VP8 ` / `VP8L` chunks.
7. Assemble RIFF + VP8X + ANIM + ANMF.
8. Decode via browser `Image.decode()`.
9. Restore rotation.

Result: 128x128 / four frames / 400 ms / 9,590 bytes / browser decode PASS / rotation restoration PASS.

## Architecture decision

Accepted maintained path:

```text
HeroForge runtime character rotation
→ established display/occlusion refresh sequence
→ BT.maker.takeScreenshot(frameSize, frameSize)
→ browser-native static WebP encoding per frame
→ project-owned animated-WebP RIFF mux
```

This avoids private/minified encoder dependencies, GIF limitations, PNG-series ZIP growth, and raw-RGBA accumulation.

## v0.1.0 — validated reference

Entry: `entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js`.

- 1024 / 250 frames / 40 ms / quality 0.95 / infinite loop;
- full-revolution display Y stepping;
- established refresh/occlusion timing;
- immediate static-WebP compression;
- compressed-payload-only retention;
- canvas backing-store reduction;
- deterministic animated mux;
- pre-download dimensions/frame-count/total-duration verification;
- concurrent capture block;
- cancel after current frame;
- rotation restore in `finally`;
- no permanent HeroForge runtime override.

Static syntax: PASS.
Full live 1024/250 capture: PASS.

## v0.2.0 — configurable profile candidate

Entry: `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`.
Build: `0.2.0-profiled-runtime-rotation-webp-mux`.

v0.1.0 remains unchanged and canonical until v0.2.0 passes regression.

Resolution choices:

- 1024 — baseline;
- 2048 — experimental.

Speed profiles at constant 40 ms / 25 FPS:

- Standard: 10 s / 250 frames;
- Slow: 15 s / 375 frames;
- Slower: 20 s / 500 frames;
- Very Slow: 30 s / 750 frames.

The candidate preserves the validated frame-production/mux sequence. Added behavior is limited to profile selection and validation/diagnostics:

- resolution and speed are independent;
- parser verifies dimensions, frame count, total duration, loop count, and exact single-value ANMF duration histogram;
- `HFSpinnyMiniWebPProfilesTest.diagnostics` is a plain bridge-readable object containing selected profile and mutable `lastCapture` state, including exact output bytes, parser metrics, and post-finally `rotationRestored`;
- UI reports pixel-sample workload versus 1024 Standard.

Workload ratios by pixel samples:

- 1024 Standard: 1.0x;
- 2048 Standard: 4.0x;
- 1024 Slow: 1.5x;
- 1024 Slower: 2.0x;
- 1024 Very Slow: 3.0x;
- 2048 Very Slow: 12.0x.

## Supported inference

2048 Standard is expected to be materially heavier because it has four times the pixels per frame. Slow profiles should increase compressed output and capture work roughly with frame count, but actual output growth depends on scene content and WebP compression.

## Still unproven

- v0.2.0 1024 Standard regression;
- independently executed `node --check` against the committed v0.2.0 file;
- exact full-run orientation-restored diagnostic on a full profile capture;
- repeated full capture in one session;
- practical 2048 completion time/output/browser/GPU/memory behavior;
- practical limits for combined 2048 + long-duration profiles;
- whether quality 0.95 should remain fixed for all resolutions.

## Safety / compatibility constraints

- Do not hard-code current minified module-local names as APIs.
- Do not reintroduce legacy exact compiled-string patching unless higher-priority runtime access becomes insufficient.
- Do not retain all uncompressed high-resolution frames simultaneously.
- Block concurrent animated captures.
- Restore character rotation after success/failure/cancel where technically possible.
- `media.screenshot-resolution` only intercepts 4096/8192 square still requests, so 1024/2048 Spinny frames pass through untouched.
- Preserve v0.1.0 unchanged until v0.2.0 regression passes.
- Public Witch Dock remains untouched.

## Next gate

1. Install/run v0.2.0 standalone.
2. Validate 1024 Standard regression against v0.1.0.
3. Read plain diagnostics for exact output bytes and rotation-restored status.
4. Validate 2048 Standard.
5. Validate 1024 Slow/Slower/Very Slow.
6. Define practical guardrails before expensive 2048 + slow combinations.
7. Only after the expanded standalone suite passes should Witch Dock Dev integration begin.
