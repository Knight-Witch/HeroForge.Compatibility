# Changelog

All committed repository updates must be recorded here.

## HFC-2026-09-05-014 — Validate grouped true-8K and combined 4K/8K Photo Booth v0.6

**Date:** 2026-09-05

### Summary

Promotes `media.screenshot-resolution` from 4K-only standalone validation to combined 4K+8K standalone validation. The maintained 8K path no longer uses one giant 8192 Effects render. Instead, it renders four shifted 4096 Effects sources, each covering one parity group of HeroForge's native 8x8 phase lattice, and phase-feeds all 64 classes through the untouched native 8192 Booth compositor.

### Maintained v0.6 behavior

- TRUE 4K: one 4096x4096 Effects source.
- TRUE 8K: four shifted 4096x4096 Effects sources.
- Native `BT.maker.takeScreenshot` remains the owning Booth capture/compositor.
- Native square-divisor tile/grid topology is detected from live named Effects calls.
- Phase coordinates derive from temporary capture-camera view offsets.
- A future already-native full-resolution Effects path is passed through unchanged.
- No `booth.js` / `boothui.js` patch, no `CK.Settings.screenshotSize` mutation, no `CK.Capture.renderToImage` replacement.
- Temporary `CK.Effects.renderToCanvas` wrapper is restored after capture; source canvases/pixel groups are released after use.

### 8K investigation outcome

Rejected maintained approaches:

- one-shot 8192 Effects source: correct when it survives, but repeatedly triggers white renderer-reset / blank output behavior in packaged use on the tested machine;
- Tampermonkey sandbox/page-context theory: rejected by reproduction in both execution modes;
- generalized packaging overhead theory: rejected by minimal 8K-only reproduction;
- PNG `toBlob()` tail-spike theory: rejected by custom streaming PNG reproduction of the same failure.

Accepted approach:

- grouped 4x4096 source design;
- 64 native 8K phase classes covered without any 8192 WebGL Effects target;
- grouped v0.5.4 completed successfully and Amanda reported it was very easy on the GPU and visually perfect;
- final combined v0.6 package passed both TRUE 4K and TRUE 8K visual acceptance.

### Test status

- JavaScript syntax: passed.
- Synthetic grouped reconstruction math: exact pass.
- 4K one-source topology: passed.
- 8K four-source topology: passed.
- Alternate smaller native-tile topology synthetic coverage: passed.
- Combined packaged TRUE 4096 visual regression: passed.
- Combined packaged TRUE 8192 visual regression: passed.

### Touched files

- `entries/tampermonkey-standalone/photo-booth-true-resolution.user.js`
- `docs/feature-specs/photo-booth-screenshot-resolution.md`
- `docs/investigations/INV-0003-photo-booth-high-res-capture-2026-09-05.md`
- `MASTER.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `TESTING.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Runtime impact

Standalone-only update. No Witch Dock Dev/Stable code, Lob/ADP source, `/legacy/`, or HeroForge bundle is modified.

### Next gate

Decide separately whether validated `media.screenshot-resolution` should remain standalone or enter Witch Dock Dev. Any Witch Dock integration must reuse the validated v0.6 capture service behavior and undergo separate integration testing before Stable promotion.

---

Historical changelog entries remain preserved in Git history through the preceding validated 4K checkpoint.
