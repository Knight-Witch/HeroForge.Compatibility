# Feature Spec — Spinny Mini animated WebP

Feature ID: `media.spinny-mini-webp`

## Purpose

Provide higher-quality animated Spinny Mini export using animated WebP, initially replacing the broken legacy Higher Quality Spinny Mini GIF behavior with a parity target and later adding higher-resolution and slower-rotation presets.

## Legacy relationship

- Legacy behavior source: Lob / Advanced Decal Posing Higher Quality Spinny Mini GIF feature.
- Current Lob generator is broken after the HeroForge update and is not the maintained implementation target.
- Provisional inventory ID `media.spin-gif-quality` is superseded by this feature ID because the maintained format is animated WebP.

## First acceptance target — validated

Observable parity with a historical Lob HQ output:

- format: animated WebP;
- resolution: 1024x1024;
- frame count: 250;
- frame delay: 40 ms;
- total revolution duration: 10.0 s;
- effective frame rate: 25 FPS;
- loop: continuous/infinite.

Standalone v0.1.0 produced a working live WebP. The script only downloads after mechanically verifying 1024x1024 dimensions, exactly 250 frames, and exactly 10,000 ms total duration. Its deterministic mux writes 40 ms for every frame and loop count 0/infinite. Retained live UI reported 12.9 MiB output size (rounded display value).

The first Lob-parity milestone is closed.

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

The maintained implementation deliberately does **not** depend on HeroForge's closure-local animated-WebP encoder.

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

A live four-frame proof decoded successfully in the browser and restored model rotation before packaging. The subsequent full 1024/250 user run also worked.

## Memory behavior

- Never retain all frame RGBA buffers.
- Each HeroForge frame is encoded immediately to compressed static WebP.
- Only compressed image payload chunks are retained until final mux.
- The source canvas backing store is reduced after frame extraction to encourage prompt release.
- Final output is read once for structural verification in the current prototype; this should be measured carefully at 2048 and very slow profiles because output sizes may grow substantially.

## Resolution and speed model

Resolution and rotation speed are independent settings.

Validated resolution:

- 1024 Standard parity.

Next resolution:

- 2048.

Higher sizes remain deferred until 2048 render/memory behavior is measured.

Validated Standard cadence:

- 250 angular samples;
- 40 ms/frame;
- 10.0-second revolution;
- 25 FPS.

Planned standalone speed profiles preserve approximately the same temporal sampling density rather than stretching sparse frames:

- Standard: 10 s / 250 frames / 25 FPS;
- Slow: 15 s / 375 frames / 25 FPS;
- Slower: 20 s / 500 frames / 25 FPS;
- Very Slow: 30 s / 750 frames / 25 FPS.

This keeps angular step size proportional to rotation speed. Resolution does not alter frame count by itself.

Practical validation order:

1. 1024 Standard regression.
2. 2048 Standard.
3. 1024 Slow.
4. 1024 Slower.
5. 1024 Very Slow.
6. Only then test expensive 2048 + slow combinations, adding guardrails if measurement shows they are impractical.

## Lifecycle

Standalone v0.1.0 supports:

- capability polling/refresh;
- capture;
- cancel after current frame;
- concurrency blocking;
- original rotation restoration in `finally`;
- `dispose()` when idle, removing timer/UI/style/global;
- `lastCapture` diagnostics.

No persistent HeroForge runtime method override is installed by the standalone implementation.

The next test version should preserve these lifecycle guarantees while exposing bridge-readable plain diagnostic state in addition to the console getter so exact output bytes and restoration status can be recovered without unsafe getter access.

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
- 2048 multiplies pixels per frame by four;
- slow profiles multiply frame count and file size;
- 2048 + Very Slow may be materially expensive and must be measured before being considered a normal supported combination.

## Ownership

- Primary maintainer: TBD.
- Reviewer: Amanda.
- Backup maintainer: TBD.
- Current disposition: standalone validated for 1024 Standard parity; higher profiles remain experimental.

## Promotion gate

Do not integrate into Witch Dock Dev until the expanded standalone profile version has:

- preserved the validated 1024 Standard behavior;
- passed 2048 Standard capture/playback/resource acceptance;
- passed at least the 1024 slow-profile suite;
- verified post-capture orientation restoration on full runs;
- passed repeat-use acceptance;
- established practical limits or warnings for expensive resolution/speed combinations;
- maintained graceful cancel/failure behavior.
