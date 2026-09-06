# Feature Spec — Spinny Mini animated WebP

Feature ID: `media.spinny-mini-webp`

## Purpose

Provide higher-quality animated Spinny Mini export using animated WebP, initially replacing the broken legacy Higher Quality Spinny Mini GIF behavior with a parity target and later adding higher-resolution and slower-rotation presets.

## Legacy relationship

- Legacy behavior source: Lob / Advanced Decal Posing Higher Quality Spinny Mini GIF feature.
- Current Lob generator is broken after the HeroForge update and is not the maintained implementation target.
- Provisional inventory ID `media.spin-gif-quality` is superseded by this feature ID because the maintained format is animated WebP.

## First acceptance target

Observable parity with a historical Lob HQ output:

- format: animated WebP;
- resolution: 1024x1024;
- frame count: 250;
- frame delay: 40 ms;
- total revolution duration: 10.0 s;
- effective frame rate: 25 FPS;
- loop: continuous/infinite.

## Native current baseline

Measured on HeroForge `heroforge07.1.9.98` from a real native Spinny Mini WebP:

- 512x512 canvas;
- 386 ANMF frames;
- every frame 17 ms;
- 6562 ms total;
- 58.82 FPS effective;
- loop count 0 (infinite);
- `image/webp` blob size 11,331,110 bytes;
- 386 `BT.maker.takeScreenshot(512,512,...)` calls;
- 386 `CK.Effects.renderToCanvas(512,512,...)` calls;
- one `CK.Capture.renderToImage(512,512,...)` call.

## Required capabilities

Current standalone implementation requires:

- Photo Booth open with `BT.maker.enabled === true`;
- callable `BT.maker.takeScreenshot(width,height)`;
- writable finite `CK.character.display.rotation.y`;
- current HeroForge display refresh behavior (`requestAnimationRefresh`, `animation`, occlusion refresh/render where present, matrix/shadow refresh);
- browser `HTMLCanvasElement.toBlob(..., 'image/webp', quality)` support;
- standard Blob/typed-array APIs.

The feature must not begin capture if required capabilities are unavailable.

## Accepted implementation architecture

The first maintained implementation deliberately does **not** depend on HeroForge's closure-local animated-WebP encoder.

```text
Standalone test UI
    ↓
media.spinny-mini-webp capture service
    ↓
HeroForge runtime frame adapter
    ├── set character display Y rotation
    ├── preserve established refresh/occlusion sequencing
    └── BT.maker.takeScreenshot
    ↓
browser-native static WebP encode per frame
    ↓
project-owned RIFF animated-WebP mux
    ↓
download
```

The mux writes:

- RIFF/WEBP container;
- VP8X animation canvas flags/dimensions;
- ANIM background/loop metadata;
- one full-frame ANMF chunk per compressed still-WebP payload.

A live four-frame proof decoded successfully in the browser and restored model rotation, establishing this architecture before the full package was written.

## Memory behavior

- Never retain all frame RGBA buffers.
- Each HeroForge frame is encoded immediately to compressed static WebP.
- Only compressed image payload chunks are retained until final mux.
- The source canvas backing store is reduced after frame extraction to encourage prompt release.
- Final 1024 parity currently reads the completed compressed output once for structural verification; this should be revisited before materially larger 2048+ profiles if output sizes become excessive.

## Resolution and speed model

Resolution and rotation speed are independent settings.

Initial resolution:

- 1024 parity.

Planned later resolutions after validation:

- 2048;
- higher sizes only after render/memory behavior is measured.

Initial parity cadence:

- 250 angular samples;
- 40 ms/frame;
- 10.0-second revolution.

Planned slower behavior:

- slower presets should generally increase total angular samples/frame count and total duration while preserving reasonably smooth playback;
- do not implement slower rotation merely by holding a sparse frame set for much longer;
- exact names/multipliers remain a post-parity UI decision.

## Lifecycle

Standalone v0.1.0 supports:

- capability polling/refresh;
- `capture()`;
- `cancel()` after current frame;
- concurrency blocking;
- original rotation restoration in `finally`;
- `dispose()` when idle, removing timer/UI/style/global;
- `lastCapture` diagnostics.

No persistent HeroForge runtime method override is installed by the standalone implementation.

## Failure behavior

- Any frame/render/encode/mux failure stops the capture.
- Original character rotation is restored in `finally` where technically possible.
- The feature does not intentionally alter unrelated HeroForge behavior.
- Public Witch Dock is not touched during standalone validation.

## Risk

High.

Reasons:

- hundreds of high-resolution frame renders per export;
- large compressed output and sustained capture time;
- current runtime rotation/refresh sequence remains sensitive to HeroForge renderer behavior;
- higher resolutions and very slow presets can multiply render count/file size substantially.

## Ownership

- Primary maintainer: TBD.
- Reviewer: Amanda.
- Backup maintainer: TBD.
- Current disposition: standalone experimental until parity validation.

## Promotion gate

Do not integrate into Witch Dock Dev until standalone 1024 parity has:

- mechanically verified output dimensions;
- mechanically verified frame count/timing;
- downloaded WebP playback acceptance;
- visual one-revolution/cadence acceptance;
- post-capture model orientation restoration acceptance;
- repeat-use acceptance;
- acceptable resource behavior.
