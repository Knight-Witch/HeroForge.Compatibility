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

- Named/runtime state resolution and `CK.activeTweak` update path: **confirmed current build**.
- Current Lob v0.99.30 native-style Project compatibility control: **working reference**.
- Exact current Full Res v0.80 renderer dependency: **audit pending**.

### Corrected bound decal gizmo v0.4.1

Validated externally on current HeroForge build `heroforge07.1.9.93` before maintained extraction.

Passed:

- stable projector-volume center anchor;
- projector spread consistency in the tested decal;
- per-frame camera tracking;
- synthetic free Move +20 px horizontal: rendered projector center matched requested screen movement to approximately 0.01 px and restored exact H/V/D baseline;
- synthetic free Move +20 px vertical: rendered projector center matched requested screen movement to approximately 0.01 px and restored exact H/V/D baseline;
- Rotate propagation through HeroForge state plus exact restoration;
- Scale propagation through HeroForge logarithmic scale state plus exact restoration;
- disable removes corrected Transformer while preserving native Transformer/state;
- re-enable creates one corrected Transformer again;
- human Move usability: passed;
- human Rotate usability: passed;
- Scale input mapping: passed; Project-OFF uneven visible rendering remains a known renderer limitation/deferred enhancement.

After the human test, the Bling test decal was restored to the recorded baseline:

- Move `-0.08 / -0.11 / 0`;
- Rotate `0 / 0 / 0`;
- Scale `-2 / 0 / 2`;
- native locator position `(-0.08, -0.11, 0)`;
- identity native rotation;
- native scale `(0.25, 1, 4)`.

This v0.4.1 result is **not yet a maintained repository module**. The acceptance tests must be rerun after extraction into production source boundaries.

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

The forthcoming `decals.advanced-posing` reconstruction must additionally test:

- selected decal changes while controls/gizmo are active;
- Project ON/OFF/Native transitions;
- native gizmo enabled/disabled transitions;
- corrected gizmo suppresses the incorrect native floor visualization without destroying the native locator/state service;
- disable/dispose restores vanilla gizmo visibility/state;
- Full List and Project controls do not double-mount;
- no feature partially initializes when required renderer capability is missing;
- Lob v0.99.30 absent;
- exact Lob v0.99.30 present;
- provider arbitration prevents duplicate Project/Full List/transform ownership;
- Undo/Redo around Move/Rotate/Scale/Project;
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
4. Extract and retest corrected bound gizmo as maintained module.
5. Build consolidated Advanced Decal Posing standalone entrypoint.
6. Run Lob-absent and Lob-present coexistence suites.
7. Integrate only after those gates into Witch Dock Dev.
