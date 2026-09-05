# Testing

This project uses standalone-first testing before Witch Dock integration.

## Current Diagnostic Test Status

The private `Knight-Witch/HF-Chat-Bridge` diagnostic/workbench transport has passed the live request path used for the current decal investigation. It remains development-only external infrastructure.

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

1. Archive current ADP v0.99.30 reference.
2. Audit Full Res v0.80 projected renderer support.
3. Audit HF Core Tweaks decal slot/schema behavior if included in first posing release.
4. Keep the now-stable corrected bound gizmo isolated from unrelated posing refactors and use it as a regression target.
5. Build consolidated Advanced Decal Posing standalone entrypoint for the remaining features.
6. Run Lob-absent and Lob-present coexistence suites.
7. Integrate only after those gates into Witch Dock Dev.
