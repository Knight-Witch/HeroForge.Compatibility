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
- frame delay: approximately 40 ms;
- total revolution duration: 10.0 s;
- effective frame rate: 25 FPS;
- loop: continuous/infinite unless live parity testing proves a different requirement.

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

Initial required capabilities are intentionally provisional until the encoder seam is confirmed:

- native Booth/spin frame capture through runtime-accessible HeroForge functions;
- a stable animated-WebP encoding/export capability, preferably HeroForge's current encoder;
- camera/orbit stepping or access to the current spin loop;
- reversible temporary runtime hooks for diagnostics/testing only.

A maintained feature must not initialize if the required encoder/capture capability is unavailable.

## Architecture

Target layering:

```text
Standalone test UI
    ↓
media.spinny-mini-webp service
    ↓
spin capture adapter + animated-WebP encoder adapter
    ↓
HeroForge named runtime / discovered module capability
```

Do not couple the maintained feature to closure-local minified names.

## Resolution and speed model

Resolution and rotation speed are independent settings.

Initial resolution:

- 1024 parity.

Planned later resolutions after validation:

- 2048;
- higher sizes only after render/memory behavior is measured.

Planned speed behavior:

- parity/standard speed first;
- slower presets should increase angular samples/frame count with total duration rather than simply stretching a sparse frame sequence;
- exact preset names and multipliers remain a UI decision after the parity engine works.

## Lifecycle

Maintained standalone implementation should support where practical:

- `initialize()`;
- `capture(options)`;
- `enable()` / `disable()` if a provider hook is installed;
- `dispose()` / `restore()` for listeners, UI, temporary wrappers, and globals.

Concurrent animated captures must be blocked.

## Risk

High.

Reasons:

- hundreds of high-resolution frame renders per export;
- large encoded output and potential memory pressure;
- current WebP encoder seam is not yet confirmed as a named runtime API;
- native spin/export implementation may be closure-local;
- current Lob caller is broken and cannot provide live parity behavior.

## Ownership

- Primary maintainer: TBD.
- Reviewer: Amanda.
- Backup maintainer: TBD.
- Current disposition: standalone reconstruction / experimental until parity validation.

## Promotion gate

Do not integrate into Witch Dock Dev until standalone 1024 parity has:

- mechanically verified output dimensions;
- mechanically verified frame count/timing;
- visual acceptance;
- repeat-use acceptance;
- clean post-capture HeroForge state;
- disable/dispose behavior where applicable.
