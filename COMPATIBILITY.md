# Compatibility

Human-readable HeroForge compatibility status.

## Current State

The repository now contains early standalone reconstructions, while the newest bound-gizmo work remains an externally validated experiment awaiting maintained extraction.

Current live decal investigation evidence is from HeroForge build `heroforge07.1.9.93`.

The private `Knight-Witch/HF-Chat-Bridge` workbench transport is development infrastructure only. It is not a production dependency or the maintained compatibility bridge.

| Component | Current status | Last verified HeroForge build | Notes |
|---|---|---|---|
| HF-Chat-Bridge diagnostic/workbench transport | Live validated for current bounded read/write workflow | `heroforge07.1.9.93` / 2026-09-04 investigation | Development-only external transport; not a Witch Dock dependency. |
| Shared maintained compatibility bridge | Not implemented | — | Current decal findings define candidate capabilities but are not yet normalized into bridge modules. |
| Shared patch engine | Not implemented | — | Required before adopting unavoidable Full Res/creationkit renderer patches. |
| Character local JSON standalone | Core Save/Load passed live | Current live page 2026-09-03 | Repeated-use/lifecycle acceptance still pending. |
| Projected decal state/control | Runtime path confirmed; maintained standalone consolidation pending | `heroforge07.1.9.93` | `CK.activeTweak` state path works; exact Full Res v0.80 renderer dependency still requires audit. |
| Corrected bound decal gizmo v0.4.1 | Standalone behavior validated externally | `heroforge07.1.9.93` | Move/Rotate/Scale/lifecycle passed defined current tests; unequal bound scale rendering deferred. |
| Witch Dock Dev integration | Not started | — | Requires maintained standalone posing module and coexistence testing first. |
| Witch Dock Stable dependency | None | — | Stable remains insulated from compatibility development head. |

## Confirmed Current Decal Evidence

On the tested current build:

- selected splatter decal metadata is available through `CK.character.display.modded.orderedDecals.splatter`;
- current ADP compatibility can resolve selection using `UIState.editorMenu_color_decals_decals` plus ordered mapping metadata;
- decal records are writable through `CK.activeTweak({ decals: ... })`;
- `forceProjectedScript` remains the projection override field used by the current Lob patch ecosystem;
- ADP v0.99.30 explicitly relies on Full Res v0.80 for renderer consumption of that field;
- native HeroForge's bound decal Transformer follows `decalLocator`, whose raw position is not the rendered projector center;
- the validated corrected gizmo uses a shared projector/character frame and a separate corrected transform UI rather than retargeting the native Transformer;
- Move requires direct H/V/D state adaptation because the native transform listener did not preserve the required arbitrary camera-plane depth component in testing;
- native rotation and logarithmic scale semantics can be reused through the validated adapter path;
- Project-OFF unequal visible scaling is not fully supported by the current renderer path and is intentionally deferred.

## Current ADP Compatibility Hazards

The exact v0.99.30 ADP reference still:

- removes/intercepts `heroforgeui.js` before transactional validation;
- uses many exact compiled-source replacements;
- has no untouched-original fallback for that bundle path;
- contains duplicate Project ownership (new runtime/DOM compatibility plus old compiled React injection);
- depends on external Full Res renderer behavior;
- mixes unrelated features in the same bundle transform.

These are reasons to reconstruct the posing subsystem, not to port the monolithic script.

## Not Yet Confirmed / Required Follow-up

- Exact current Full Res v0.80 projected/unequal renderer patch behavior and best maintained replacement strategy.
- Whether every legacy ±6 transform extreme is safe through runtime-only controls.
- True extra decal slot/schema expansion behavior in current HF Core Tweaks.
- Production coexistence behavior with Lob v0.99.30 when Witch Dock owns some or all posing functions.
- Cross-build stability of the current selected-decal/projector capability paths.

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
