# Feature Spec — Spinny Mini animated WebP

Feature ID: `media.spinny-mini-webp`

## Purpose

Provide higher-quality animated Spinny Mini export using animated WebP, replacing the broken legacy Higher Quality Spinny Mini GIF behavior and adding higher-resolution plus slower-rotation profiles without returning to brittle compiled-string patching.

## Legacy relationship

- Legacy behavior source: Lob / Advanced Decal Posing Higher Quality Spinny Mini GIF feature.
- Current Lob generator is broken after the HeroForge update and is not the maintained implementation target.
- Provisional inventory ID `media.spin-gif-quality` is superseded by this feature ID because the maintained format is animated WebP.

## First acceptance target — validated

Historical Lob HQ parity:

- animated WebP output;
- 1024x1024;
- 250 frames;
- 40 ms/frame;
- 10.0-second revolution;
- 25 FPS;
- infinite loop.

Standalone v0.1.0 produced a working live WebP. It only downloads after mechanically verifying 1024x1024 dimensions, exactly 250 frames, and exactly 10,000 ms total duration. Its deterministic mux writes 40 ms for every frame and loop count 0/infinite. Retained live UI reported 12.9 MiB.

The first Lob-parity milestone is closed. v0.1.0 remains the validated reference until the configurable candidate passes regression.

## Native current baseline

Measured on HeroForge `heroforge07.1.9.98`:

- 512x512;
- 386 ANMF frames;
- 17 ms/frame;
- 6562 ms total;
- 58.82 FPS effective;
- loop count 0/infinite;
- 11,331,110-byte `image/webp`;
- 386 `BT.maker.takeScreenshot(512,512,...)` calls;
- 386 `CK.Effects.renderToCanvas(512,512,...)` calls;
- one `CK.Capture.renderToImage(512,512,...)` call.

## Required capabilities

- Photo Booth open with `BT.maker.enabled === true`;
- callable `BT.maker.takeScreenshot(width,height)`;
- writable finite `CK.character.display.rotation.y`;
- current HeroForge display refresh behavior (`requestAnimationRefresh`, `animation`, occlusion refresh/render where present, matrix/shadow refresh);
- browser `HTMLCanvasElement.toBlob(..., 'image/webp', quality)` support;
- standard Blob/typed-array APIs.

The feature must not begin capture if required capabilities are unavailable.

## Accepted implementation architecture

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

The maintained implementation deliberately does not depend on HeroForge's closure-local animated-WebP encoder.

## Memory behavior

- Never retain all frame RGBA buffers.
- Encode each HeroForge frame immediately to compressed static WebP.
- Retain only compressed image payload chunks until final mux.
- Reduce the source canvas backing store after extraction.
- The current verifier materializes the completed compressed output once as bytes; measure this carefully for 2048 and long-duration profiles before treating expensive combinations as supported.

## Resolution and speed model

Resolution and rotation speed are independent.

Validated profile:

- 1024 Standard: 10 s / 250 frames / 40 ms / 25 FPS.

v0.2.0 experimental resolution choices:

- 1024;
- 2048.

v0.2.0 speed profiles keep 40 ms/frame so slower motion gets denser angular sampling:

- Standard: 10 s / 250 frames / 25 FPS;
- Slow: 15 s / 375 frames / 25 FPS;
- Slower: 20 s / 500 frames / 25 FPS;
- Very Slow: 30 s / 750 frames / 25 FPS.

Resolution does not alter frame count by itself.

Validation order:

1. 1024 Standard regression.
2. 2048 Standard.
3. 1024 Slow.
4. 1024 Slower.
5. 1024 Very Slow.
6. Expensive 2048 + slow combinations only after resource behavior is known.

## Standalone implementations

### v0.1.0 — validated reference

`entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js`

- fixed 1024 Standard profile;
- capability polling;
- concurrency block;
- cancel after current frame;
- rotation restoration in `finally`;
- deterministic animated WebP mux;
- pre-download dimension/frame-count/total-duration verification;
- `dispose()` while idle;
- no permanent HeroForge method override.

### v0.2.0 — configurable candidate

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

Preserves the v0.1.0 capture/mux core and adds:

- 1024/2048 resolution selection;
- Standard/Slow/Slower/Very Slow selection;
- exact ANIM loop-count verification;
- exact ANMF frame-duration histogram verification;
- plain `HFSpinnyMiniWebPProfilesTest.diagnostics` state readable by HF-Chat-Bridge, including exact output bytes, parsed metrics, requested profile, and rotation-restored status;
- selected-profile workload display relative to validated 1024 Standard.

v0.2.0 is experimental until 1024 Standard regression passes.

## Failure behavior

- Any frame/render/encode/mux/validation failure stops capture.
- Original character rotation is restored in `finally` where technically possible.
- Concurrent animated captures are blocked.
- Cancel occurs after the current frame.
- The feature does not intentionally alter unrelated HeroForge behavior.
- Public Witch Dock is not touched during standalone validation.

## Risk

High.

- 2048 multiplies pixels per frame by four.
- Slow profiles multiply frame count.
- 2048 Very Slow reaches 12x the validated baseline pixel-sample workload.
- Current HeroForge rotation/refresh sequencing remains renderer-sensitive.
- Large completed compressed outputs may expose browser memory limits during final verification/mux.

## Ownership

- Primary maintainer: TBD.
- Reviewer: Amanda.
- Backup maintainer: TBD.
- Current disposition: standalone validated for v0.1.0 1024 Standard; v0.2.0 profiles experimental.

## Promotion gate

Do not integrate into Witch Dock Dev until v0.2.0 has:

- preserved validated 1024 Standard behavior;
- passed 2048 Standard capture/playback/resource acceptance;
- passed at least the 1024 slow-profile suite;
- verified full-run orientation restoration;
- passed repeat-use acceptance;
- established practical limits/warnings for expensive resolution/speed combinations;
- maintained graceful cancel/failure behavior.
