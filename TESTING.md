# Testing

This project uses standalone-first testing before Witch Dock integration.

## Current Diagnostic Test Status

The private `Knight-Witch/HF-Chat-Bridge` diagnostic/workbench transport has passed the live request path used for the current decal and Photo Booth investigations. It remains development-only external infrastructure.

Diagnostic transport success does not itself validate a maintained compatibility capability or reconstructed feature.

## Current Standalone / Live Feature Milestones

### Character local JSON

- Core local Save: **passed live**.
- Core local Load: **passed live**.
- Full repeated-use / reload / disposal acceptance: **pending**.

### Projected decal state/control

- Named/runtime state resolution and `CK.activeTweak` update path: **confirmed current runtime**.
- Current Lob v0.99.30 native-style Project compatibility control: **working reference**.
- Exact current Full Res v0.80 renderer dependency: **audit pending**.

### Corrected bound decal gizmo — Witch Dock Stable

The original standalone current-runtime investigation established the projector-center and transform semantics. The production feature has since passed Witch Dock Dev and Stable promotion testing.

Validated behavior now includes:

- stable projector-volume center anchor;
- projector spread consistency in the tested decal;
- per-frame camera tracking;
- corrected native-style Move, Rotate, and Scale behavior;
- native floor/origin Transformer visualization suppression while preserving the native locator/state path;
- Move H/V/D state propagation including depth;
- Rotate propagation through HeroForge state;
- logarithmic Scale propagation;
- disable/re-enable lifecycle behavior;
- human Move/Rotate/Scale usability;
- Move Ctrl+Z / Ctrl+Shift+Z: **passed**;
- Rotate Ctrl+Z / Ctrl+Shift+Z: **passed**;
- Scale Ctrl+Z / Ctrl+Shift+Z: **passed**;
- normal Project ON/OFF after a real bound transform: sane remembered state preserved;
- changing decal artwork while Project OFF: prior bound transform preserved;
- brand-new decal slot first Project-OFF conversion: confirmed bad `v≈1.50394`, `s≈1.76859`, `sy≈1.76859` initializer normalized to zero when no prior genuine bound state exists.

Undo diagnosis/repair validated in WITCH_DEV v0.4.0-v0.4.2:

- corrected Move previously called `CK.activeTweak()` on pointer movement, producing repeated intermediate history snapshots on the current runtime;
- the accepted repair performs live character data change/refresh without adding a history point per pointer movement;
- the existing `CK.passiveChangeFinish()` remains the single final Move commit;
- cancel/interrupted Move restoration does not create a fake undo entry.

Transform-state preservation validated in v0.4.2:

- only genuine Project-OFF state is treated as authoritative cached bound transform state;
- projected `s`/`sy` are not accepted as a fresh bound baseline;
- `characterEnterChange` listener lifecycle is installed/removed with the feature;
- artwork replacement while bound preserves finite transform fields;
- sane existing Project memory is left untouched;
- first-ever known-bad bind normalizes only `v`, `s`, and `sy`.

Current production source is delivered from `Knight-Witch/KnightWitch.Heroforge`; Witch Dock Stable does not depend on this repository at runtime.

Known deferred behavior:

- Project-OFF uneven visible scale renderer enhancement;
- exact visible-artwork-center polish;
- corrected projector wireframe/bounding-box visualization.

### Photo Booth true high-resolution still capture

Current diagnosis on `heroforge07.1.9.98`:

- Existing Lob 4096px output file dimensions: **4096px confirmed by Amanda**.
- Existing Lob 4096px underlying `CK.Capture.renderTarget`: **2048x2048 confirmed live**.
- Existing Lob 8K visual detail: **visibly softer than 4K at 100%**, consistent with lower-resolution source enlargement.
- `CK.Settings.screenshotSize = 4096` hypothesis: **rejected live**; underlying 4096 action target remained 2048x2048.
- `CK.Settings.screenshotSize` restored to 2048 after the bounded test: **confirmed**.
- `CK.Capture.renderToImage` named runtime capability: **confirmed**; no 2048 hard clamp in current function source.
- `CK.Capture.getDownloadableURL` post-render resize: **not present in current function source**.
- Active Photo Booth camera/runtime camera equivalence in tested portrait scene: **confirmed**.
- Current renderer `maxTextureSize`: **16384 confirmed on tested machine/browser**.

Standalone v0.1.0 true-4096 proof:

- JavaScript syntax check with Node: **passed**.
- No `boothui.js` interception: **static pass**.
- No HeroForge function replacement: **static pass**.
- No `CK.Settings.screenshotSize` mutation: **static pass**.
- Explicit direct request `CK.Capture.renderToImage(4096, 4096, camera, 1, true)`: **implemented**.
- Real 4096x4096 render-target assertion: **implemented; live result pending**.
- Returned 4096x4096 canvas assertion: **implemented; live result pending**.
- PNG download: **pending live test**.
- Camera/lighting/background/effect parity: **pending live test**.
- Native/Lob capture remains functional afterward: **pending live test**.
- Dispose/cleanup: **pending live test**.
- 8192 capture: **not enabled; gated on 4096 acceptance**.

## Test Order

1. Audit legacy behavior.
2. Define feature boundaries.
3. Write or update the feature specification.
4. Reconstruct an isolated Tampermonkey test module from maintained source.
5. Verify behavior parity against the canonical reference.
6. Extract repeated HeroForge access into the shared bridge.
7. Test enable/disable/unload behavior.
8. Test interactions with other reconstructed modules and external providers.
9. Add compatibility/fixture tests where applicable.
10. Integrate into Witch Dock Dev only after standalone validation.
11. Promote to Witch Dock Stable only after separate review.

## Photo Booth High-Resolution Acceptance

For `media.screenshot-resolution`:

1. Open Photo Booth and keep the current Lob script enabled as the reference provider.
2. Capture the same scene with the existing Lob 4096px action for comparison.
3. Run the standalone `Capture TRUE 4096px PNG` action.
4. Require `HFPhotoBoothTrueResolutionTest.lastCapture.renderTarget` to report 4096x4096.
5. Require returned canvas/download to be 4096x4096.
6. Compare at 100% view: fine model edges/details must show materially more real detail than the current soft Lob 4096 output.
7. Verify camera framing, lighting, background, overlays/effects, transparency behavior where relevant, and color output.
8. Verify a normal native/Lob capture still works after the direct render.
9. Dispose the standalone test and confirm its panel/timer/global are removed.
10. Only if the full 4096 suite passes may an 8192 action be added; first 8K test should use 1x render sampling and explicit GPU-capability/memory safeguards.

## Advanced Decal Posing Acceptance Additions

The forthcoming remaining `decals.advanced-posing` reconstruction must additionally test:

- selected decal changes while controls/gizmo are active;
- Project ON/OFF/Native transitions;
- native gizmo enabled/disabled transitions;
- stable corrected bound gizmo coexistence must not regress;
- Full List and Project controls do not double-mount;
- no feature partially initializes when required renderer capability is missing;
- Lob v0.99.30 absent;
- exact Lob v0.99.30 present;
- provider arbitration prevents duplicate Project/Full List/transform ownership;
- Undo/Redo around newly reconstructed Project/transform controls;
- save/reload persistence;
- quiet build change / missing capability behavior.

## Standalone Feature Acceptance

Where relevant, test:

- initialization on a clean page;
- repeated use;
- undo/redo;
- save and reload persistence;
- import/export persistence;
- page reload;
- enable;
- disable;
- dispose/restore;
- required-refresh behavior;
- missing capability behavior;
- interaction with other enabled reconstructed modules.

## Patch Testing

For unavoidable bundle patches, verify:

- expected match count;
- zero-match failure reporting;
- ambiguous multi-match rejection;
- required captures;
- transformed syntax validity where practical;
- postconditions;
- no duplicate insertion;
- idempotency where expected;
- untouched-original fallback behavior;
- compatibility across retained fixtures.

Fixture success does not replace live runtime testing.

## Planned Near-Term Sequence

1. Live-test the true-4096 Photo Booth standalone proof.
2. If 4K passes, add/test 8192 with explicit resource safeguards; otherwise diagnose the exact parity failure before changing architecture.
3. Keep the Photo Booth repair standalone until its lifecycle/effect parity is validated; do not use Witch Dock Stable as the experiment.
4. Archive current ADP v0.99.30 reference.
5. Audit Full Res v0.80 projected renderer support.
6. Audit HF Core Tweaks decal slot/schema behavior if included in first posing release.
7. Keep the now-stable corrected bound gizmo isolated from unrelated posing refactors and use it as a regression target.
8. Build consolidated Advanced Decal Posing standalone entrypoint for the remaining features.
9. Run Lob-absent and Lob-present coexistence suites.
10. Integrate only after those gates into Witch Dock Dev.
