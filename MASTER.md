# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Keep it current when the active phase, architecture, feature status, blockers, ownership, or migration state changes.

## Current Phase

**Legacy feature decomposition plus current-runtime decal capability reconstruction.**

The private `Knight-Witch/HF-Chat-Bridge` diagnostic/workbench transport is live-validated and has been used to complete a substantial bound-decal gizmo investigation on current HeroForge. Character JSON and projected-decal standalone tests already exist in this repository. The next bounded development target is a clean Advanced Decal Posing subsystem reconstruction rather than further patching of the monolithic ADP userscript.

## Current Repository Role

- Repository: `Knight-Witch/HeroForge.Compatibility`
- Production Witch Dock repository: `Knight-Witch/KnightWitch.Heroforge`
- External diagnostic transport repository: `Knight-Witch/HF-Chat-Bridge` (private; workbench transport live-validated)
- Public runtime dependency from Witch Dock Stable: **none**
- Current committed standalone code:
  - `entries/tampermonkey-standalone/character-local-json.user.js`
  - `entries/tampermonkey-standalone/projected-decal-toggle.user.js`
- Current external validated experiment: corrected bound decal gizmo v0.4.1, not yet extracted into maintained repository source
- Maintained shared compatibility bridge / patch engine: **not yet implemented**

## Confirmed Project Direction

1. Preserve legacy originals unchanged under `/legacy/`.
2. Audit legacy behavior and dependencies before reconstruction.
3. Organize by coherent feature/domain boundaries rather than legacy filenames.
4. Reconstruct isolated Tampermonkey modules first.
5. Extract repeated HeroForge access into a shared compatibility bridge.
6. Centralize unavoidable bundle patching in one validated patch system.
7. Test disable/unload behavior and feature interactions.
8. Integrate only validated modules into Witch Dock Dev.
9. Promote to Witch Dock Stable only through a separate review.

## Diagnostic Transport Boundary

`HF-Chat-Bridge` is a separate development diagnostic/control-plane service, not the shared feature compatibility bridge defined by this repository.

The transport has been used for bounded read/write runtime validation during the current decal investigation. Public Witch Dock and reconstructed modules must never depend on the GitHub mailbox/local relay at runtime.

## Current Canonical ADP Reference

Amanda supplied `Advanced_Decal_Posing_KW_9-3-26_TEST_PATCH.js` v0.99.30 and confirmed that Lob is running this patched version.

For the current reconstruction, v0.99.30 supersedes v0.99.23 as the ADP-side reference for decal posing behavior.

The source has been audited for the **decal posing subsystem only** in:

`docs/script-audits/advanced-decal-posing-v0.99.30-decal-posing-subsystem.md`

The exact file is not yet archived under `/legacy/`; archive/provenance import is required before maintained reconstruction begins.

## Current Decal Posing Findings

### Confirmed

- Current selected splatter decal resolution can use `UIState.editorMenu_color_decals_decals` plus `CK.character.display.modded.orderedDecals.splatter` and the entry mapping.
- Project state can be written through `CK.activeTweak({ decals: ... })` without relying on minified React closure state.
- `forceProjectedScript` remains the ADP/Full Res projection override field.
- ADP v0.99.30 still depends on Full Res v0.80 for actual projected-decal renderer semantics.
- ADP v0.99.30 still contains brittle `heroforgeui.js` source replacement for Project, Unequal Scaling, transform ranges, and Full List catalog behavior.
- v0.99.30 contains both a newer runtime/DOM Project compatibility service and the older compiled Project injection, creating duplicate ownership risk.
- The exact v0.99.30 file does not contain the corrected bound gizmo.
- True decal slot-schema expansion is not confirmed in v0.99.30 and requires a targeted HF Core Tweaks audit.

### Bound gizmo milestone

The external corrected bound decal gizmo v0.4.1 passed live current-build testing:

- stable projector-volume center anchor;
- per-frame camera tracking;
- screen-space Move in both axes with renderer movement matching requested pixels to approximately 0.01 px in the tested setup;
- Rotate propagation/restoration;
- Scale propagation/restoration;
- disable/re-enable cleanup;
- final human Move/Rotate usability pass.

Unequal Project-OFF visual scale remains deferred and is not a release blocker.

## Active Work

- Normalize the v0.99.30 ADP-side decal posing audit.
- Archive current canonical legacy/reference sources with provenance.
- Audit the exact current Full Res v0.80 projection renderer support.
- Audit HF Core Tweaks decal slot/schema behavior if extra slots are in the first Advanced Decal Posing production scope.
- Write a consolidated `decals.advanced-posing` feature specification.
- Extract the validated bound gizmo into maintained feature/service/bridge boundaries.
- Design safe coexistence with Lob v0.99.30 before Witch Dock integration.

## Next Planned Development Stage

1. Archive exact v0.99.30 ADP source under immutable `/legacy/`.
2. Complete the Full Res v0.80 projected-renderer dependency audit.
3. Complete the HF Core Tweaks decal-slot audit if slots remain first-pass scope.
4. Define the production Advanced Decal Posing feature/capability contract.
5. Build a production-style standalone implementation from maintained modules.
6. Test with Lob absent.
7. Test coexistence with exact Lob v0.99.30 present.
8. Integrate only the validated module into Witch Dock Dev.

## Current Blockers / Open Gates

- The exact current v0.99.30 source is not yet archived under `/legacy/`.
- Exact current Full Res v0.80 projected/unequal renderer source has not yet been normalized/audited in this repository.
- True extra decal slot/schema behavior still needs current HF Core Tweaks source audit if included in first-pass scope.
- Maintained shared compatibility bridge and patch engine are not yet implemented.
- Feature ownership with Lob has not yet been formally assigned.
- Unequal bound scaling renderer enhancement is intentionally deferred.

## Migration Queue

| Area | Current State | Next Gate |
|---|---|---|
| ADP v0.99.30 decal posing | Current source audited; not yet archived | Archive exact source + dependent renderer/slot audits |
| Character local JSON | Standalone reconstruction committed; core Save/Load passed live | Finish lifecycle/repeated-use acceptance before promotion |
| Projected decal state/control | Standalone test committed; newer live compatibility path confirmed | Fold into consolidated posing service after renderer audit |
| Corrected bound decal gizmo | External standalone v0.4.1 behavior validated | Extract into maintained module + coexistence test |
| Unequal bound scaling | Deferred | Separate renderer enhancement later |
| HF-Chat-Bridge diagnostic transport | Workbench transport validated | Remains development-only external infrastructure |
| Maintained compatibility bridge | Planned | Define capabilities from validated decal work |
| Witch Dock Dev integration | Not started | Maintained standalone Advanced Decal Posing validation |
| Witch Dock Stable | No dependency | Separate future promotion review |

## Status Terms

- **Legacy reference** — immutable original/reference source used to understand behavior.
- **Provisional inventory** — extracted from audit but not yet confirmed through normalized repo source/runtime testing.
- **Standalone candidate** — coherent feature suitable for independent reconstruction/testing.
- **Standalone validated** — reconstructed module/experiment has passed its defined standalone acceptance tests.
- **Witch Dock Dev candidate** — standalone validated and approved for integration testing.
- **Stable candidate** — passed Witch Dock Dev testing and awaits explicit public promotion review.
- **Experimental only** — intentionally not eligible for stable integration yet.
- **Blocked** — a concrete dependency or unresolved failure prevents progress.
- **Deprecated** — should not be used as a current implementation.
- **Rejected** — intentionally not being adopted.
