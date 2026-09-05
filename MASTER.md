# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Keep it current when the active phase, architecture, feature status, blockers, ownership, or migration state changes.

## Current Phase

**Legacy feature decomposition plus current-runtime decal capability reconstruction.**

The private `Knight-Witch/HF-Chat-Bridge` diagnostic/workbench transport is live-validated and has been used to complete the bound-decal gizmo investigation on current HeroForge. The corrected bound gizmo has now progressed through standalone validation, Witch Dock Dev testing, and explicit Witch Dock Stable promotion/repair. Character JSON and projected-decal standalone tests remain separate reconstruction work in this repository. The next bounded Advanced Decal Posing target is the remaining posing/provider architecture and renderer/slot dependency audit rather than further patching of the monolithic ADP userscript.

## Current Repository Role

- Repository: `Knight-Witch/HeroForge.Compatibility`
- Production Witch Dock repository: `Knight-Witch/KnightWitch.Heroforge`
- External diagnostic transport repository: `Knight-Witch/HF-Chat-Bridge` (private; workbench transport live-validated)
- Public runtime dependency from Witch Dock Stable on this repository: **none**
- Current committed standalone code:
  - `entries/tampermonkey-standalone/character-local-json.user.js`
  - `entries/tampermonkey-standalone/projected-decal-toggle.user.js`
- Corrected bound decal gizmo: promoted into Witch Dock Stable as `decals.gizmo.bound-correction`; current stable repair derives from user-validated WITCH_DEV v0.4.2 behavior
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

The exact file is not yet archived under `/legacy/`; archive/provenance import is required before maintained reconstruction of the remaining ADP subsystem begins.

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

The corrected bound decal gizmo is now a **Witch Dock Stable feature**, not an external experiment.

Validated behavior carried into Stable includes:

- stable projector-volume center anchor;
- correct native-style Move/Rotate/Scale orientation and behavior;
- native floor/origin Transformer visualization suppression with native locator/state preserved;
- Move/Rotate/Scale Ctrl+Z and Ctrl+Shift+Z behavior;
- corrected Move history reduced to one final undo transaction per completed drag rather than microscopic pointer-move history entries;
- sane Project ON/OFF state preservation after a real bound transform has been established;
- transform preservation when changing decal artwork while Project OFF;
- first-ever Project-OFF normalization of HeroForge's confirmed bad fresh-slot initializer (`v≈1.50394`, `s≈1.76859`, `sy≈1.76859`) to zero only when no genuine prior bound state exists;
- disable/re-enable and cleanup behavior retained from the validated base.

The stable Witch Dock repair commit is `1712b0ba24c8303d8d446d88cdf66199978045e7` in `Knight-Witch/KnightWitch.Heroforge`.

Unequal Project-OFF visual scale, exact visible-artwork-center alignment, and corrected projector wireframe remain deferred and are not release blockers.

## Active Work

- Archive current canonical legacy/reference sources with provenance.
- Audit the exact current Full Res v0.80 projection renderer support.
- Audit HF Core Tweaks decal slot/schema behavior if extra slots are in the first Advanced Decal Posing production scope.
- Write a consolidated `decals.advanced-posing` feature specification for the remaining posing family.
- Extract repeated validated decal capability access into maintained shared bridge boundaries when the broader posing service is reconstructed.
- Design safe coexistence/provider arbitration with Lob v0.99.30 before overlapping Project/Full List ownership moves into Witch Dock.
- Keep the now-stable bound gizmo behavior regression-tested as a separate feature rather than reopening it during unrelated posing reconstruction.

## Next Planned Development Stage

1. Archive exact v0.99.30 ADP source under immutable `/legacy/`.
2. Complete the Full Res v0.80 projected-renderer dependency audit.
3. Complete the HF Core Tweaks decal-slot audit if slots remain first-pass scope.
4. Define the production Advanced Decal Posing feature/capability contract for the remaining posing family.
5. Build a production-style standalone implementation from maintained modules.
6. Test with Lob absent.
7. Test coexistence with exact Lob v0.99.30 present.
8. Integrate only validated overlapping posing modules into Witch Dock Dev.

## Current Blockers / Open Gates

- The exact current v0.99.30 source is not yet archived under `/legacy/`.
- Exact current Full Res v0.80 projected/unequal renderer source has not yet been normalized/audited in this repository.
- True extra decal slot/schema behavior still needs current HF Core Tweaks source audit if included in first-pass scope.
- Maintained shared compatibility bridge and patch engine are not yet implemented.
- Feature ownership/provider policy with Lob has not yet been formally assigned for overlapping Project/Full List behavior.
- Unequal bound scaling renderer enhancement is intentionally deferred.

## Migration Queue

| Area | Current State | Next Gate |
|---|---|---|
| ADP v0.99.30 decal posing | Current source audited; not yet archived | Archive exact source + dependent renderer/slot audits |
| Character local JSON | Standalone reconstruction committed; core Save/Load passed live | Finish lifecycle/repeated-use acceptance before promotion |
| Projected decal state/control | Standalone test committed; newer live compatibility path confirmed | Fold into consolidated posing service after renderer audit |
| Corrected bound decal gizmo | Witch Dock Stable; user-validated repair based on WITCH_DEV v0.4.2 | Keep regression coverage current; broader Foundation/bridge consolidation is future architecture work, not a release gate |
| Unequal bound scaling | Deferred | Separate renderer enhancement later |
| HF-Chat-Bridge diagnostic transport | Workbench transport validated | Remains development-only external infrastructure |
| Maintained compatibility bridge | Planned | Define shared capabilities from validated decal work during broader service reconstruction |
| Witch Dock Dev integration | Bound gizmo complete; broader Advanced Decal Posing not started | Maintained standalone validation for remaining posing features |
| Witch Dock Stable | Bound gizmo promoted; no runtime dependency on this repository | Separate future promotion review for each additional feature |

## Status Terms

- **Legacy reference** — immutable original/reference source used to understand behavior.
- **Provisional inventory** — extracted from audit but not yet confirmed through normalized repo source/runtime testing.
- **Standalone candidate** — coherent feature suitable for independent reconstruction/testing.
- **Standalone validated** — reconstructed module/experiment has passed its defined standalone acceptance tests.
- **Witch Dock Dev candidate** — standalone validated and approved for integration testing.
- **Stable candidate** — passed Witch Dock Dev testing and awaits explicit public promotion review.
- **Witch Dock Stable** — explicitly promoted to the public Witch Dock delivery path after Dev validation/review.
- **Experimental only** — intentionally not eligible for stable integration yet.
- **Blocked** — a concrete dependency or unresolved failure prevents progress.
- **Deprecated** — should not be used as a current implementation.
- **Rejected** — intentionally not being adopted.
