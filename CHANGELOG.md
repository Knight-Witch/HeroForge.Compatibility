# Changelog

All committed repository updates must be recorded here.

## HFC-2026-09-05-013 — Add adaptive true-4K native Effects repair

**Date:** 2026-09-05

### Summary

Replaced the failed v0.2 Photo Booth high-resolution experiment with adaptive standalone v0.4.0. Deeper live tracing corrected the diagnosis: the visible model/color path is reconstructed from low-resolution `CK.Effects.renderToCanvas` phases, while the previously observed 2048 `CK.Capture.renderTarget` belongs to a separate frame/auxiliary path in the tested capture.

The selected repair keeps `BT.maker.takeScreenshot(4096,4096)` as the owning native Photo Booth path, temporarily wraps only named `CK.Effects.renderToCanvas`, renders one genuine 4096x4096 Effects frame after HeroForge has staged its temporary capture camera/state, phase-splits that source into the native compositor's observed topology, and restores the named method in `finally`.

### Confirmed diagnosis and proof

- Current HeroForge build: `heroforge07.1.9.98`.
- Current normal 4096 visible-color path: **16 x 1024x1024 Effects phases** in a 4x4 subpixel grid.
- The private current-build helper uses a 1024 normal phase cap and an identified 512 Painterly special case; private helper names/offsets are diagnostic evidence only.
- Untouched native 4096 measured only about **7.2%** more edge information than an upscaled native 2048 reference in the tested central region.
- A staged named `CK.Effects.renderToCanvas(4096,4096,tempCamera,1)` produced a genuine 4096 color frame with about **27.4%** more measured edge detail than untouched native 4096.
- The original fixed 16-phase runtime proof reproduced that true source through HeroForge's native compositor exactly in the tested central region: **MAE 0 / RMSE 0 / identical edge metric**.
- The later adaptive runtime proof detected the current topology as tile **1024**, grid **4x4**, expected **16**, supplied **16 unique phases**, and returned a 4096x4096 PNG of **9,823,790 bytes**.
- Amanda opened the adaptive proof download and reported the result **looked great**, providing whole-image human visual acceptance of the adaptive repair algorithm on the tested scene.

### Adaptive compatibility behavior

Standalone v0.4.0 / build `0.4.0-adaptive-native-effects-phase-feed-4k`:

- derives the native square-divisor model tile/grid from live named Effects calls instead of hard-coding 1024/512;
- derives phase X/Y from the temporary capture camera's live view offsets rather than requiring fixed row-major call order;
- rejects mixed tile/grid paths, duplicate phases, incomplete phase sets, invalid geometry, or unexpected output dimensions;
- recognizes an already-native `CK.Effects.renderToCanvas(4096,4096,tempCamera)` model path and leaves it untouched instead of forcing the compatibility repair;
- prevents concurrent test captures;
- restores `CK.Effects.renderToCanvas` after the explicit capture even on failure;
- releases the large temporary source canvas/pixel buffer after capture;
- does not patch `booth.js`/`boothui.js`, mutate `CK.Settings.screenshotSize`, replace `CK.Capture.renderToImage`, or modify native capture controls.

### Test status

- JavaScript syntax check with Node: **passed**.
- Synthetic phase extraction/reconstruction: **exact pass** for 2x2, 4x4, 8x8, and 16x16 grids.
- Static no-bundle-patch / no-`CK.Settings.screenshotSize` mutation / no-`CK.Capture.renderToImage` override: **passed**.
- Adaptive bridge-run topology validation: **passed live**.
- Adaptive bridge-run 4096 download: **passed live**.
- Whole-image human visual acceptance of adaptive algorithm: **passed live**.
- Packaged v0.4 repeat capture: **passed live**; second 4096 download completed with 1024 / 4x4 / 16-of-16 topology.
- `CK.Effects.renderToCanvas` restoration after packaged capture: **passed live**.
- Native Photo Booth capture immediately afterward: **passed live**; returned normal 1024x1024 canvas.
- `dispose()` cleanup: **passed live**; test global, panel, and style all absent afterward.
- Packaged standalone v0.4 install/repeated-use/native-after/dispose lifecycle: **passed live**.
- 8K: **disabled / gated** pending separate resource-safe design and live validation.

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

No Witch Dock Dev/Stable code, Lob/ADP source, `/legacy/`, or HeroForge bundle is modified. The standalone repair only changes runtime behavior during its explicit capture action, then restores the named Effects method.

### Next gate

4K standalone acceptance is complete on `heroforge07.1.9.98`. Next, design a separate 8192 proof with explicit memory/GPU safeguards, then decide whether the validated 4K repair remains standalone or is proposed for Witch Dock Dev. Do not modify Witch Dock Stable during the 8K experiment.

---

## Historical records

Changelog entries through `HFC-2026-09-05-012` remain preserved in Git history at and before commit `428f8bc64c52bd2c9485a5dd38c359eed661c02d`. This log was compacted at the validated 4K checkpoint to keep the active repository log focused; no runtime behavior was removed by the documentation compaction.
