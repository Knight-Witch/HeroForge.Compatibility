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
- Existing Lob 8K visual detail: **visibly softer than 4K at 100%**.
- Previously observed `CK.Capture.renderTarget = 2048x2048`: **confirmed but reclassified** as the current frame/auxiliary path, not the main visible-color render.
- Visible model/color readbacks outside `CK.Capture.renderToImage`: **16 x 1024x1024 confirmed live**, carrying normal RGB and alpha 255.
- Current private high-resolution model helper `maxTile`: **1024 confirmed from current authenticated `booth.js` source**, with a 512 Painterly special case.
- Current normal 4096 model reconstruction: **4x4 / 16 visible-color Effects phases confirmed**.
- `CK.Settings.screenshotSize = 4096` hypothesis: **rejected live**; setting restored to 2048.
- `CK.Effects.renderToCanvas` named runtime capability: **confirmed**; current function contains no 1024 hard clamp and restores temporary Effects state in `finally` cleanup.
- Current renderer `maxTextureSize`: **16384 confirmed on tested machine/browser**.
- Native 2048 vs native 4096 central-region comparison: **4096 only ~7.2% higher measured edge information** than upscaled 2048.
- Direct staged true-4096 Effects render: **passed live**; 4096x4096 and ~27.4% higher edge metric than untouched native 4096.
- Runtime true-4096 phase feed: **passed mechanically**; 16/16 expected 1024 phases supplied through untouched native compositor.
- Phase-fed final vs true source central 2048 region: **MAE 0 / RMSE 0 / identical edge metric**.
- In-place 1024->2048 render-target supersample experiment: **rejected**; resulting edge metric was ~0.752 of untouched baseline.

Standalone v0.4 adaptive true-4096 phase-feed repair:

- JavaScript syntax check with Node: **passed**.
- Synthetic phase extraction/reconstruction test: **passed exact**.
- No `booth.js` / `boothui.js` interception: **static pass**.
- No `CK.Settings.screenshotSize` mutation: **static pass**.
- No `CK.Capture.renderToImage` replacement: **static pass**.
- Temporary named `CK.Effects.renderToCanvas` wrapper only during explicit capture: **implemented / static pass**.
- Dynamic square-divisor native phase-grid derivation: **implemented**; current live build resolves to 1024 / 4x4 / 16 phases.
- True 4096x4096 Effects source assertion: **implemented**.
- Native phase-coordinate validation from live temporary-camera offsets plus duplicate/incomplete topology rejection: **implemented**.
- Final 4096x4096 canvas assertion and PNG download: **implemented**.
- Adaptive bridge-run topology/download: **passed live**; 1024 tile, 4x4 grid, 16/16 unique phases, 4096x4096 result, 9,823,790-byte PNG.
- Adaptive bridge-run whole-image human visual acceptance: **passed live**; Amanda opened the downloaded image and reported it looked great.
- Packaged standalone whole-image/repeated-use regression: **passed live**.
- Packaged second capture topology/result: **passed live** — 1024 tile, 4x4 grid, 16/16 phases, 4096x4096 canvas.
- `CK.Effects.renderToCanvas` restored after packaged capture: **passed live**.
- Native Photo Booth capture remains functional afterward: **passed live** — normal 1024x1024 canvas returned.
- Dispose/cleanup: **passed live** — global, panel, and style removed.
- 8192 capture: **not enabled; separate resource-safe design/validation pending**.

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

For `media.screenshot-resolution` v0.4:

1. Open Photo Booth and keep the current Lob script enabled as the reference provider.
2. Capture the same scene with the existing Lob/native 4096px action for comparison.
3. Run packaged standalone `Capture TRUE 4096px via Native Booth`; the same adaptive algorithm already passed a bridge-driven live 4096 visual proof.
4. Require `HFPhotoBoothTrueResolutionTest.lastCapture.trueEffectsRender.width/height` to report 4096x4096.
5. Require `lastCapture.suppliedPhaseCount === lastCapture.expectedPhases`; normal tested state should report 16 x 1024 phases.
6. Require returned/downloaded canvas to be 4096x4096.
7. Compare at 100% view: fine model edges/details must show materially more real detail than the current soft Lob/native 4096 output.
8. Verify camera framing, lighting, background, masks/frame, overlays/effects, transparency behavior where relevant, and color output.
9. Verify a normal native/Lob capture still works after the phase-feed capture.
10. Dispose the standalone test and confirm its panel/timer/global are removed.
11. Packaged 4096 acceptance has passed. Any 8192 action must be designed/tested separately with explicit GPU/memory safeguards rather than assuming `maxTextureSize = 16384` guarantees safe allocation.

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

1. Keep packaged standalone v0.4 as the validated 4K regression baseline.
2. Design/test 8192 with explicit resource safeguards and re-run the full 4K regression suite afterward.
3. Keep 8K experimental/standalone until its own lifecycle/effect parity is validated; do not use Witch Dock Stable as the experiment.
4. Archive current ADP v0.99.30 reference.
5. Audit Full Res v0.80 projected renderer support.
6. Audit HF Core Tweaks decal slot/schema behavior if included in first posing release.
7. Keep the now-stable corrected bound gizmo isolated from unrelated posing refactors and use it as a regression target.
8. Build consolidated Advanced Decal Posing standalone entrypoint for the remaining features.
9. Run Lob-absent and Lob-present coexistence suites.
10. Integrate only after those gates into Witch Dock Dev.
