# Testing

Standalone-first testing before Witch Dock integration.

## Photo Booth True High-Resolution Still Capture

Feature: `media.screenshot-resolution`
Build validated: `heroforge07.1.9.98` / 2026-09-05.

### 4K validation

- Existing Lob/native nominal 4096 visibly soft at 100%: confirmed.
- Visible model/color native topology: 1024 tile / 4x4 / 16 phases in tested normal scene: confirmed.
- Named staged true 4096 Effects source: passed live.
- True source measured about 27.4% more edge information than untouched native 4096 in tested central region.
- Phase-feed through untouched native compositor: passed mechanically.
- Repaired final vs true source in tested central region: MAE 0 / RMSE 0 / identical edge metric.
- Adaptive topology derivation and camera-offset phase derivation: passed live.
- Packaged v0.4 whole-image visual acceptance: passed.
- Repeat capture: passed.
- Effects restoration: passed.
- Native 1024 capture afterward: passed.
- `dispose()` cleanup: passed.
- Combined v0.6 4K regression after 8K integration: **passed visually**.

### 8K investigation

Initial one-shot design:

- native topology: 1024 tile / 8x8 / 64 phases: confirmed in live bridge proof;
- direct one-shot true 8192 staged Effects source: succeeded once in bridge proof and produced a visually correct 8192 result;
- packaged one-shot versions repeatedly hit the familiar HeroForge white renderer-reset / blank-output failure at the tail end;
- `@grant unsafeWindow` vs page-context execution: no change;
- minimal 8K-only package: no change;
- custom streaming PNG export avoiding `canvas.toBlob()`: no change;
- conclusion: export/sandbox/general packaging hypotheses rejected; one-shot 8192 Effects allocation is unsuitable as the maintained path on the tested machine.

Accepted grouped design:

- grouped v0.5.4 uses four shifted 4096 Effects sources;
- each source supplies 16 phase classes; total 64/64 native 8K phases;
- no 8192 WebGL Effects target;
- synthetic grouped reconstruction math: exact pass;
- grouped packaged 8192 output: passed;
- user visual acceptance: passed perfectly;
- user reported GPU load was dramatically easier than the one-shot 8192 path;
- combined v0.6 packaged 8192 regression: **passed perfectly**.

### v0.6 maintained acceptance

- JavaScript syntax: passed.
- Generic square-divisor topology validation: passed in synthetic tests.
- 4K path: one 4096 source / visual pass.
- 8K path: four shifted 4096 sources / visual pass.
- No `booth.js` / `boothui.js` interception.
- No `CK.Settings.screenshotSize` mutation.
- No `CK.Capture.renderToImage` replacement.
- Temporary named `CK.Effects.renderToCanvas` wrapper only during explicit capture.
- Concurrent captures prevented.
- Source canvases and group pixel buffers released after use.
- Native full-resolution Effects path passes through unchanged if detected.

## Other Current Milestones

### Character local JSON

- Core local Save: passed live.
- Core local Load: passed live.
- Repeated-use / reload / disposal acceptance: pending.

### Corrected bound decal gizmo

- Witch Dock Stable.
- Move/Rotate/Scale undo-redo: passed.
- Project ON/OFF state preservation: passed.
- Project-OFF artwork replacement preservation: passed.
- Fresh-slot known-bad initializer normalization: passed.

## Test Order

1. Audit legacy behavior.
2. Define feature boundaries/spec.
3. Reconstruct isolated standalone module.
4. Verify behavior parity and failure modes.
5. Test enable/disable/dispose and repeated use.
6. Test module/provider interactions.
7. Integrate into Witch Dock Dev only after standalone validation.
8. Promote to Witch Dock Stable only after separate review.
