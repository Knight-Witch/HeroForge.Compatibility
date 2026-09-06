# INV-0004 — Spinny Mini animated WebP reconstruction

Date opened: 2026-09-05
Status: active
HeroForge build: `heroforge07.1.9.98`
Feature: `media.spinny-mini-webp`

## Question

How does the new HeroForge Spinny Mini WebP pipeline generate frames and encode the final animated WebP, and what is the least brittle runtime seam for producing a higher-resolution / configurable-speed version?

## User goal

Replace the broken legacy Higher Quality Spinny Mini GIF behavior with animated WebP. First milestone is parity with the historical Lob HQ output. After parity, add higher-resolution options and independent slower-rotation presets without falling back to GIF or a huge zipped PNG sequence.

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

No ordinary `HTMLCanvasElement.toBlob()` calls were observed during the animation export. The final WebP therefore uses a more specialized encoding path.

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

This confirms that the previously audited Lob argument `250` corresponds at least to the delivered 250-frame result. The broken current caller is not required to define output parity.

## First parity target

- animated WebP;
- 1024x1024;
- 250 frames;
- 10.0-second revolution;
- 25 FPS / ~40 ms frame timing;
- continuous loop.

## Runtime discovery so far

### Named-runtime object scan

Top-level runtime scan found no obvious named `spin` / `webp` function on `BT`, `HF`, or `HFUI`.

`CK.encoder` exists, but observed members such as base64/UTF-8 helpers are unrelated to animated WebP encoding.

Conclusion: the current animation encoder is not yet identified as a named high-level runtime API.

### Current UI DOM handler probe

A direct DOM search for visible `Spinny Mini WebP` controls returned no matches at probe time, so no React handler was available to inspect. This does not prove the handler is inaccessible; it only means the relevant Photo Booth control was not mounted in the DOM at that moment.

### Webpack discovery

Active next probe: inspect current webpack module factories / loaded exports for WebP, GIF, spin, and animation encoder signatures. Module discovery is permitted here because a named runtime seam has not yet been found.

## Supported inferences

- The native WebP path renders one screenshot per animation frame.
- Frame count/angular sampling and encoded frame timing are likely separate controls because the native output uses 386 frames at 17 ms while the historical Lob GIF uses 250 frames at ~40 ms.
- Reusing HeroForge's current animated-WebP encoder is preferable to introducing an external encoder if the module can be discovered and called with stable shape-based validation.

## Unproven hypotheses

- The native WebP encoder may be a closure-local module export rather than attached to `CK`/`BT`.
- The spin-loop function may accept resolution, sample count, and format flags similar to the previous Spinny Mini implementation, but current parameter semantics are not yet proven.
- Native export may encode frames incrementally rather than retaining hundreds of full RGBA frames, which would be desirable for a maintained 1024/2048 implementation.

## Safety / compatibility constraints

- Do not hard-code current minified module-local names as APIs.
- Do not reintroduce the legacy exact compiled-string patch unless runtime/module access proves insufficient.
- Do not allocate or retain all uncompressed high-resolution frame buffers simultaneously.
- Block concurrent animated captures.
- Ensure compatibility with the already-Stable `media.screenshot-resolution` provider: ordinary 1024/2048 spin frames must not be mistaken for square 4096/8192 still-capture repair requests.
- Public Witch Dock and Stable remain untouched during this investigation.

## Next probes

1. Complete webpack factory/export scan for the current encoder/spin implementation.
2. If necessary, mount/open the Photo Booth control and inspect its actual event handler / call stack.
3. Identify the native frame-loop callable seam and the animated-WebP encoder callable seam.
4. Reproduce one native 512 WebP from a direct test caller without using the UI.
5. Change only one variable at a time: resolution -> 1024, then frame count/timing -> 250 / 40 ms.
6. Package the first standalone parity userscript only after the runtime proof is stable enough to reuse.
