# Projected Decal Toggle — Standalone Reconstruction Spec

**Feature ID:** `decals.transform.projected`  
**Status:** Standalone test v0.1.0; live behavior validation pending  
**Risk:** Medium  
**Primary maintainer:** TBD  
**Reviewer:** Amanda  
**Disposition:** Standalone reconstruction; Witch Dock Dev candidacy only after standalone validation

## Purpose

Restore Lob's missing `Project` control for splatter decals without restoring Advanced Decal Posing v0.99.23's brittle compiled `heroforgeui.js` React injection.

## Canonical legacy behavior

References:

- Amanda's 2026-09-02 Tampermonkey export, `Advanced Decal Posing.user.js` v0.99.23.
- Current Full Res Decals/Textures renderer support in the supplied 9/2 batch.

The Advanced Decal Posing control writes `forceProjectedScript` on the selected `decals.splatter[...]` record. The Full Res renderer patch interprets the field as:

- `undefined` — preserve native HeroForge projected/unprojected behavior;
- `true` — force projected;
- `false` — force unprojected.

The original control was inserted beside HeroForge's native Mirror control by exact compiled-string replacement. That UI anchor is the broken layer; existing saved `forceProjectedScript` data and renderer behavior still survive.

## Confirmed current evidence

Live/read-only evidence collected 2026-09-03:

- `CK.character.data.decals` exists and, on the test figure, exposes `bodyLower`, `bodyUpper`, `face`, and `splatter`.
- The uploaded local JSON round-trip contains 35 `splatter` records.
- 34 of those records explicitly contain `forceProjectedScript: false`; one record leaves the field undefined.
- No record in the supplied test JSON currently contains `forceProjectedScript: true`.
- The Slot F test candidate is numeric splatter key `6`, whose current record has decal ID `20990` and `forceProjectedScript: false`.
- Current HeroForge's native Mirror handler still mutates decal state through `CK.activeTweak({ decals: ... })`, preserving the selected bucket and record while changing one field.

The F -> 6 mapping follows the current alphabetic slot numbering used by the test harness. The exact human-readable decal label -> ID mapping is not treated as proven until the live toggle test confirms the expected Slot F decal is affected.

## Required capabilities

- `CK.activeTweak`
- `CK.activeData.decals.splatter` or fallback `CK.character.data.decals.splatter`
- the Full Res renderer support that consumes `forceProjectedScript`

## UI / host

Independent temporary test panel. The panel does not use HeroForge React components and does not patch `heroforgeui.js`.

Because automatic native selected-slot discovery is not yet confirmed, v0.1.0 uses an explicit slot selector. This is a test-harness limitation, not the intended final UX.

## Behavior

- Slot selector supports 49 alphabetically labeled splatter slots.
- `ON` writes `forceProjectedScript: true`.
- `OFF` writes `forceProjectedScript: false`.
- `Native` writes `forceProjectedScript: undefined`, returning renderer behavior to HeroForge's native decision path.
- Updates use the same `CK.activeTweak` decal-state shape demonstrated by HeroForge's native Mirror control.
- No HeroForge function is overridden.

## Initialization

- Runs at `document-idle`.
- Waits for `CK.activeTweak` and decal state.
- Mounts one independent panel.
- A previous copy of the same test is disposed before replacement.

## Disable / unload

`HFProjectedDecalToggleTest.dispose()` removes owned UI, styles, and timers. It does not revert decal data already changed by explicit user action; use `OFF`, `Native`, HeroForge undo, or reload prior saved state as appropriate.

## Failure behavior

- Empty/missing selected slot is reported and no mutation is attempted.
- Missing `CK.activeTweak` blocks the feature.
- No fallback bundle patch is attempted.
- Failure of this test does not alter unrelated features.

## Acceptance tests

1. Install as a separate Tampermonkey script with Advanced Decal Posing and Full Res left enabled.
2. Load the supplied test figure and select Slot F in HeroForge.
3. Test panel defaults to F and should report decal ID `20990` with Project state `OFF`.
4. Click `ON`; confirm only Slot F changes and the expected decal becomes/stays projected through a visible re-pose.
5. Save local JSON and confirm Slot F's record contains `forceProjectedScript: true`.
6. Click `OFF`; confirm the expected inverse behavior and persisted `false` state.
7. Click `Native`; confirm the field returns to undefined/native renderer behavior.
8. Exercise HeroForge undo/redo around one toggle if supported by `CK.activeTweak` as expected.
9. Reload HeroForge and verify persisted state from the character data behaves correctly.
10. Call `HFProjectedDecalToggleTest.dispose()` and verify only the test UI/timers are removed.

## Out of scope for v0.1.0

- Automatic synchronization with HeroForge's currently selected decal slot.
- Native HeroForge React UI injection.
- Unequal Scaling reconstruction.
- Photo Booth capture resolution / spin media repair.
- Witch Dock integration.
