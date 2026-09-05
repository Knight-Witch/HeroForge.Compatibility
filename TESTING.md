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
- Visible model/color path: named `CK.Effects.renderToCanvas` through a private high-resolution tiled helper.
- Current private high-resolution model helper `maxTile`: **1024 confirmed from current authenticated `booth.js` source**, with a 512 Painterly special case.
- Current normal 4096 model reconstruction: **4x4 / 16 visible-color Effects phases confirmed**.
- Current normal 8192 model reconstruction: **8x8 / 64 visible-color Effects phases confirmed**.
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

8K investigation and accepted grouped repair:

- One-shot true `CK.Effects.renderToCanvas(8192,8192,...)` bridge proof: **mechanically passed once**; returned correct 8192 output, supplied 64/64 unique phases, restored Effects, and Amanda reported the result looked great.
- Packaged one-shot 8192 attempts: **repeatedly failed** with the familiar HeroForge white renderer-reset / blank-output behavior at the tail end.
- Tampermonkey sandbox vs raw/page-context execution: **rejected as root cause**; same failure reproduced.
- Generalized package overhead: **rejected as root cause**; minimal 8K-only package reproduced the same failure.
- `canvas.toBlob()` / PNG export tail-spike hypothesis: **rejected**; custom streaming PNG path reproduced the same white/blank failure.
- Maintained one-shot 8192 Effects source: **rejected for stability on the tested machine**.
- Grouped v0.5.4 design: **passed live**. Four shifted 4096 Effects sources cover all 64 native 8K phase classes without creating an 8192 WebGL Effects target.
- Grouped 8K synthetic reconstruction math: **exact pass**.
- Grouped packaged 8192 visual acceptance: **passed perfectly**.
- Amanda reported grouped 8K was **very easy on the GPU** compared with the one-shot 8192 path.

Combined standalone v0.6 maintained regression:

- JavaScript syntax check: **passed**.
- TRUE 4K: one 4096 source; **packaged visual regression passed**.
- TRUE 8K: four shifted 4096 sources; **packaged visual regression passed perfectly**.
- Current 8K path creates **no 8192 WebGL Effects target**.
- Native topology remains dynamically validated rather than freezing private helper names or offsets.
- Temporary named Effects wrapper is restored after explicit capture.
- Source canvases and group pixel buffers are released after use.
- A future already-native full-resolution Effects path is passed through unchanged.

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

For `media.screenshot-resolution` v0.6:

1. Open Photo Booth and keep the current Lob script enabled as reference provider where useful.
2. TRUE 4096 must use one 4096 staged Effects source through the native compositor and return/download a 4096x4096 result.
3. TRUE 8192 must use the grouped four-shifted-4096 source strategy through the native compositor and return/download an 8192x8192 result without allocating an 8192 Effects target.
4. Require all expected native phases to be supplied exactly once; current normal topology is 16 x 1024 for 4K and 64 x 1024 for 8K.
5. Require source groups to be released after their final assigned phase.
6. Compare at 100% view against current soft Lob/native outputs; fine model detail must be materially improved without phase/checkerboard/seam artifacts.
7. Verify camera framing, lighting, background, masks/frame, overlays/effects, transparency behavior where relevant, and color output.
8. Verify `CK.Effects.renderToCanvas` restoration after capture.
9. Verify normal native/Lob capture remains functional afterward when doing lifecycle regression.
10. Dispose the standalone test and confirm its panel/timer/global are removed when doing lifecycle regression.
11. Re-run after any HeroForge build change or any shared capture-engine refactor.

Current packaged v0.6 TRUE 4096 and TRUE 8192 visual acceptance has passed on `heroforge07.1.9.98`.

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

1. Keep packaged standalone v0.6 as the validated 4K+8K regression baseline.
2. Decide separately whether `media.screenshot-resolution` remains standalone or becomes a Witch Dock Dev candidate; do not use Stable as the next experiment.
3. Archive current ADP v0.99.30 reference.
4. Audit Full Res v0.80 projected renderer support.
5. Audit HF Core Tweaks decal slot/schema behavior if included in first posing release.
6. Keep the now-stable corrected bound gizmo isolated from unrelated posing refactors and use it as a regression target.
7. Build consolidated Advanced Decal Posing standalone entrypoint for the remaining features.
8. Run Lob-absent and Lob-present coexistence suites.
9. Integrate only after those gates into Witch Dock Dev.
