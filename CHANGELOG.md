# Changelog

## HFC-2026-09-05-019 — Validate first 1024 HQ Spinny WebP parity capture

Date: 2026-09-05

### Summary

Documentation-only validation checkpoint for `media.spinny-mini-webp` after the first full standalone 1024/250 capture succeeded live.

### Confirmed live result

- User reported: “the webp worked”.
- Successful script/build: `entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js` v0.1.0 / `0.1.0-runtime-rotation-webp-mux`.
- The script only downloads after mechanically validating 1024x1024 dimensions, exactly 250 frames, and exactly 10,000 ms total duration.
- All frames are written at 40 ms, yielding the intended 25 FPS effective cadence.
- Loop count is 0 / infinite by the deterministic ANIM mux.
- Retained live UI status reported: `Downloaded 1024px WebP: 250 frames / 10.0 s / 12.9 MiB`.
- Photo Booth capture capability remained ready after the completed capture.
- Exact output bytes were not recoverable from the bridge safe reader because `lastCapture` is exposed through a getter; the 12.9 MiB value is the rounded UI display.

### Status

- First Lob-parity milestone: **validated**.
- 2048 experiment: next standalone stage.
- Independent speed presets: next standalone stage.
- Repeat-use/resource-limit testing: remains required during the next standalone stage.
- Witch Dock Dev/Stable: unchanged and not yet in scope.

### Touched files

- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- `TESTING.md`
- `docs/feature-specs/spinny-mini-webp.md`
- `docs/investigations/INV-0004-spinny-mini-webp-2026-09-05.md`

**Runtime behavior changed:** no. No JavaScript changed and public Witch Dock behavior is unchanged.

---

## HFC-2026-09-05-018 — Add standalone 1024 HQ Spinny WebP parity test

Date: 2026-09-05

### Summary

Added the first standalone runtime implementation for `media.spinny-mini-webp`.

The implementation does not depend on HeroForge's closure-local animated-WebP encoder. A live proof established that a standards-compliant animated WebP can be built from current named/runtime-accessible HeroForge capture behavior plus browser-native still-WebP encoding.

### Runtime implementation

- Added `entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js` v0.1.0.
- First target is fixed to Lob HQ parity: 1024x1024, 250 frames, 40 ms/frame, 10.0-second revolution, infinite loop.
- Rotates `CK.character.display.rotation.y` through a full revolution and uses the historically established HeroForge display refresh sequence before each frame.
- Captures each frame through `BT.maker.takeScreenshot(1024,1024)`.
- Encodes each frame immediately with browser `canvas.toBlob('image/webp', 0.95)` and retains compressed WebP image payload chunks rather than raw RGBA frame buffers.
- Assembles RIFF/VP8X/ANIM/ANMF animated WebP deterministically in-browser.
- Mechanically verifies final dimensions, frame count, and total duration before download.
- Blocks concurrent captures, supports cancel-after-current-frame, restores the original character rotation in `finally`, and exposes `HFSpinnyMiniWebPHQTest.lastCapture` diagnostics.

### Proof before packaging

Live microproof on HeroForge `heroforge07.1.9.98`:

- four rotated 128x128 HeroForge frames captured;
- each frame browser-encoded as static WebP;
- custom RIFF animation mux produced a 4-frame / 400 ms animated WebP;
- browser `Image.decode()` accepted the result at 128x128;
- base character rotation restored successfully.

Local synthetic proof also produced a valid 3-frame animated WebP recognized by independent image tooling.

Static validation:

- `node --check entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js`: PASS locally before repository commit.

### Architecture decision

For this feature, the accepted first maintained path is:

```text
named HeroForge rotation/capture state
→ browser-native static WebP encode per frame
→ project-owned deterministic animated-WebP mux
```

This avoids a dependency on closure-local minified encoder/module identifiers and avoids resurrecting Lob's compiled-string GIF patch.

### Test status

- low-resolution live mux proof: PASS;
- standalone 1024/250 package syntax: PASS;
- full 1024/250 human capture/visual/repeat-use acceptance: pending.

### Touched files

- `entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js`
- `MASTER.md`
- `ARCHITECTURE.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- `TESTING.md`
- `docs/feature-specs/spinny-mini-webp.md`
- `docs/investigations/INV-0004-spinny-mini-webp-2026-09-05.md`
- `CHANGELOG.md`

**Runtime behavior changed:** yes, on the standalone WIP branch only. Public Witch Dock is unchanged.

---

## HFC-2026-09-05-017 — Start Spinny Mini animated WebP reconstruction

Date: 2026-09-05

### Summary

Documentation-only kickoff for `media.spinny-mini-webp`, a standalone-first reconstruction of higher-quality Spinny Mini export using HeroForge's new animated WebP path.

### Confirmed baselines

- Native HeroForge Spinny Mini WebP on `heroforge07.1.9.98`: 512x512, 386 frames, 17 ms/frame, 6562 ms total, 58.82 FPS effective, infinite loop, 11,331,110-byte `image/webp` blob.
- Historical Lob Higher Quality Spinny Mini GIF measured from original output: 1024x1024, 250 frames, 10.0 s total, 25 FPS effective, ~40 ms/frame, 145,375,926 bytes.
- First WebP parity target: 1024x1024, 250 frames, 10.0-second revolution / 25 FPS.
- Future rotation-speed presets will be modeled independently from resolution.

### Architecture direction

- Prefer named runtime capture/render capabilities and reuse of HeroForge's native animated-WebP encoder when a stable seam exists.
- Use runtime/module discovery before bundle transformation.
- Do not restore the legacy exact compiled-string Spinny patch unless runtime access is proven insufficient.
- Standalone Tampermonkey validation precedes Witch Dock integration.

### Runtime impact

**No runtime behavior changed.** This commit records pre-flight, feature scope, parity evidence, and the active investigation only.

### Touched files

- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `FEATURE_INVENTORY.md`
- `docs/feature-specs/spinny-mini-webp.md`
- `docs/investigations/INV-0004-spinny-mini-webp-2026-09-05.md`

---

Historical changelog entries through HFC-2026-09-05-016 remain preserved in Git history at/before `732dae09e83d712a26ac383f7b64ce9e27e07a59`.
