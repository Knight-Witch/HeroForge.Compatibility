# Pre-Flight Check Log

## PFC-2026-09-05-014 — Spinny Mini animated WebP reconstruction kickoff

Date: 2026-09-05

### Target files

- `entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js` (planned)
- `docs/feature-specs/spinny-mini-webp.md`
- `docs/investigations/INV-0004-spinny-mini-webp-2026-09-05.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md` / `TESTING.md` when live proof exists
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Reviewed

- binding `PROJECT_CONTRACT.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `ARCHITECTURE.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- `TESTING.md`
- current Photo Booth capture findings and named runtime seams
- current Lob/ADP high-quality Spinny Mini behavior as previously audited
- user-supplied archived output `The Viper.gif` recovered from ZIP for output-level parity measurement
- live native HeroForge Spinny Mini WebP trace on `heroforge07.1.9.98`

### Confirmed baseline

- New feature ID: `media.spinny-mini-webp`.
- This supersedes the provisional inventory label `media.spin-gif-quality`; the maintained target is animated WebP, not GIF.
- Native HeroForge Spinny Mini WebP output measured from a real capture:
  - 512x512;
  - 386 frames;
  - 17 ms/frame;
  - 6562 ms total revolution;
  - 58.82 FPS effective;
  - infinite loop;
  - 11,331,110-byte `image/webp` blob;
  - 386 calls to `BT.maker.takeScreenshot(512,512,...)` and 386 matching `CK.Effects.renderToCanvas(512,512,...)` calls.
- User-supplied historical Lob Higher Quality Spinny Mini GIF measured from original bytes:
  - 1024x1024;
  - 250 frames;
  - 10.0 s total duration;
  - 25 FPS effective;
  - approximately 40 ms/frame;
  - 145,375,926 bytes.
- First parity target is therefore animated WebP at 1024x1024, 250 frames, 10.0 s / 25 FPS.
- Future speed presets are a separate dimension from resolution; slower presets should preserve smooth motion by increasing angular samples/frame count rather than merely holding a sparse frame set longer.

### Integration priority

1. Reuse current named runtime capture/render capabilities and the native animated-WebP encoder if a stable callable seam can be found.
2. Runtime capability/object-shape discovery.
3. Webpack/module discovery if the encoder is closure-local.
4. Do not resurrect Lob's exact compiled-string patch architecture unless runtime access is proven insufficient.

### Material conflict risks

- Native WebP encoder may be closure-local rather than exposed through a named runtime API.
- Resolution, angular sample count, and playback timing may be controlled by separate private values.
- A 1024x250 capture increases render cost substantially over native 512; memory must be released frame-by-frame or in bounded batches.
- Existing `media.screenshot-resolution` provider wraps high-resolution still capture requests; Spinny implementation must coexist without recursively routing each animation frame into the still-image 4K/8K repair path.
- Lob's current Higher Quality Spinny Mini generator is broken after the HeroForge update and cannot be used as a live caller; parity is defined from historical output plus audited legacy arguments.

### Recommended action

Continue live runtime/module discovery until the current WebP encoder and spin-loop control surface are identified. Build a standalone Tampermonkey parity entry before any Witch Dock integration.

**Runtime behavior changed:** no. This is pre-flight/documentation only.

---

Historical pre-flight entries through PFC-2026-09-05-013 remain preserved in Git history at/before `732dae09e83d712a26ac383f7b64ce9e27e07a59`.
