# Compatibility

Human-readable HeroForge compatibility status.

## Current State

The repository contains early standalone reconstructions and current-runtime decal capability evidence. The corrected bound decal gizmo has completed standalone validation, Witch Dock Dev testing, and Witch Dock Stable promotion; it is no longer an external experiment awaiting extraction.

Current live decal investigation evidence spans the September 2026 HeroForge builds used during the v0.4.1 investigation and subsequent Witch Dock v0.4.2 repair validation. Exact cross-build stability still requires normal revalidation after HeroForge updates.

The private `Knight-Witch/HF-Chat-Bridge` workbench transport is development infrastructure only. It is not a production dependency or the maintained compatibility bridge.

| Component | Current status | Last verified HeroForge build / date | Notes |
|---|---|---|---|
| HF-Chat-Bridge diagnostic/workbench transport | Live validated for current bounded read/write workflow | September 2026 current-runtime investigation | Development-only external transport; not a Witch Dock dependency. |
| Shared maintained compatibility bridge | Not implemented | — | Current decal findings define candidate capabilities but are not yet normalized into bridge modules. |
| Shared patch engine | Not implemented | — | Required before adopting unavoidable Full Res/creationkit renderer patches. |
| Character local JSON standalone | Core Save/Load passed live | Current live page 2026-09-03 | Repeated-use/lifecycle acceptance still pending. |
| Projected decal state/control | Runtime path confirmed; maintained consolidation pending | September 2026 | `CK.activeTweak` state path works; exact Full Res v0.80 renderer dependency still requires audit. |
| `decals.gizmo.bound-correction` | Witch Dock Stable; runtime-validated | 2026-09-05 | WITCH_DEV v0.4.2 repair passed Move/Rotate/Scale undo-redo, sane Project state preservation, bound artwork-swap transform preservation, and fresh-slot bad-default normalization. |
| Witch Dock Dev integration | Bound gizmo completed; broader Advanced Decal Posing not started | 2026-09-05 | Remaining overlapping posing features still require maintained standalone/provider-coexistence work. |
| Witch Dock Stable | Bound gizmo promoted; no dependency on Compatibility repo head | 2026-09-05 | Stable delivery remains insulated from this repository's unstable development head. |

## Confirmed Current Decal Evidence

On the tested current runtime:

- selected splatter decal metadata is available through `CK.character.display.modded.orderedDecals.splatter`;
- current ADP compatibility can resolve selection using `UIState.editorMenu_color_decals_decals` plus ordered mapping metadata;
- decal records are writable through `CK.activeTweak({ decals: ... })`;
- `forceProjectedScript` remains the projection override field used by the current Lob patch ecosystem;
- ADP v0.99.30 explicitly relies on Full Res v0.80 for renderer consumption of that field;
- native HeroForge's bound decal Transformer follows `decalLocator`, whose raw position is not the rendered projector center;
- the validated corrected gizmo uses the projector-volume center in the shared character frame and a separate corrected transform service rather than mutating the native locator's transform basis;
- Move requires direct H/V/D state adaptation because the native transform listener did not preserve the required arbitrary camera-plane depth component in testing;
- native rotation and logarithmic scale semantics can be reused through the validated adapter path;
- corrected Move must avoid `CK.activeTweak()` on every pointer movement because that current path records repeated intermediate history snapshots; the validated stable repair performs live data/refresh updates and uses the final passive-change commit once per completed drag;
- `CK.Events.on/off('characterEnterChange', ...)` can be lifecycle-managed to preserve genuine Project-OFF transform state across relevant pending decal changes;
- HeroForge's observed fresh Project-OFF bad initializer is approximately `v=1.503942117`, `s=1.768586891`, `sy=1.768586891`; the stable feature only normalizes those three values to zero when no genuine prior bound state exists and the known signature is present;
- Project-OFF unequal visible scaling is not fully supported by the current renderer path and is intentionally deferred.

## Current ADP Compatibility Hazards

The exact v0.99.30 ADP reference still:

- removes/intercepts `heroforgeui.js` before transactional validation;
- uses many exact compiled-source replacements;
- has no untouched-original fallback for that bundle path;
- contains duplicate Project ownership (new runtime/DOM compatibility plus old compiled React injection);
- depends on external Full Res renderer behavior;
- mixes unrelated features in the same bundle transform.

These are reasons to reconstruct the remaining posing subsystem, not to port the monolithic script.

## Not Yet Confirmed / Required Follow-up

- Exact current Full Res v0.80 projected/unequal renderer patch behavior and best maintained replacement strategy.
- Whether every legacy ±6 transform extreme is safe through runtime-only controls.
- True extra decal slot/schema expansion behavior in current HF Core Tweaks.
- Production coexistence/provider behavior with Lob v0.99.30 when Witch Dock owns additional posing functions.
- Cross-build stability of the selected-decal/projector/undo capability paths after future HeroForge updates.

## Capability Status Terms

- `available` — confirmed usable in the tested build.
- `unavailable` — required capability was not found or failed validation.
- `degraded` — partially usable with known limitations.
- `untested` — no current verification.

## Build Tracking Rules

For maintained feature compatibility, record:

- HeroForge build identifier or fingerprint where available;
- test date;
- capability status;
- affected feature IDs;
- failure reason;
- whether fallback preserved unmodified HeroForge behavior.

A changed build fingerprint is a revalidation trigger, not automatic proof of incompatibility.
