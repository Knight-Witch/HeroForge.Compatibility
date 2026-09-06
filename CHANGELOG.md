# Changelog

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

- Prefer named runtime capture/render capabilities and reuse of HeroForge's native animated-WebP encoder.
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
