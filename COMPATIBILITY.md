# Compatibility

Human-readable HeroForge compatibility status.

## Current State

Three standalone test implementations exist on `dev/aug5-compatibility-stage-1`. None has completed live acceptance testing, and none is eligible for Witch Dock integration or Stable use.

## Verified Build Evidence

**HeroForge build:** `heroforge08.1.9.74`  
**Probe date:** 2026-08-06

| Bundle | SHA-256 |
|---|---|
| `creationkit.js` | `f409276a1e6f5b3f1533f3922947c224f98fac61fa9a087834a93968727850c0` |
| `heroforgeui.js` | `c70ff17533376fe18f499beacefce10aef8da6d4ed4d270c127aa683bc5ad572` |
| `boothui.js` | `951ab2a272b8ee57c7d82bc2b317fa1c7a17e01e4dd2ef7d48ce1ce691643c78` |

A changed build or fingerprint is a revalidation trigger, not automatic proof that every runtime-only feature is broken.

## Component Status

| Component | Capability status | Implementation status | Last checked build | Notes |
|---|---|---|---|---|
| Shared compatibility bridge | unavailable | Not implemented | — | Stage 1 adapters remain local to standalone tests until behavior is validated. |
| Shared patch engine | unavailable | Not implemented | — | Required before adding another maintained core-bundle patch feature. |
| Character export runtime | available | Standalone test v0.1.0 | `heroforge08.1.9.74` | `CK.UndoQueue` and `CK.character.data.getJson` observed; end-to-end export untested. |
| Character import runtime | available | Standalone test v0.1.0 | `heroforge08.1.9.74` | `CK.tryLoadCharacter` observed; complete round trip untested. |
| Photo Booth settings runtime | available after Booth load | Standalone test v0.1.0 | `heroforge08.1.9.74` | `BT.maker.effectState.save/load` observed; serialization contract untested. |
| Projected renderer anchor | available for captured fixture/build | Experimental standalone v0.1.0 | `heroforge08.1.9.74` | Exact count and postcondition tests passed; live rendering untested. |
| Unequal-scaling renderer anchor | available for captured fixture/build | Coupled experimental standalone v0.1.0 | `heroforge08.1.9.74` | Exact count and postcondition tests passed; live rendering untested. |
| Native projected-decal tiling | available | No compatibility override implemented | `heroforge08.1.9.74` | Legacy tiling patch is a deprecation candidate. |
| Booth screenshot-size loop | available in `boothui.js` | No Stage 1 repair | `heroforge08.1.9.74` | Default observed setting can generate options through 2048; old 8K extension remains absent. |
| Witch Dock Dev integration | untested | Not started | — | Requires standalone validation and explicit approval. |
| Witch Dock Stable dependency | none | None | — | Public Witch Dock remains insulated from this branch. |

## Projected Patch Compatibility Gate

The Stage 1 projected module is compatible only when all of the following are true before modified execution:

1. `creationkit.js` is intercepted before execution.
2. The force-projection anchor occurs exactly once.
3. The unequal-scaling anchor occurs exactly once.
4. Each transformed postcondition occurs exactly once.
5. The transformed source passes JavaScript parsing.

If any pre-execution gate fails, the module loads untouched HeroForge `creationkit.js` and reports `fallback-original`.

A positive static match does not establish correct live behavior. The feature remains `untested` until the acceptance matrix is completed.

## Capability Status Terms

- `available` — required capability or source structure was observed on the tested build.
- `unavailable` — required capability was not found or failed validation.
- `degraded` — partially usable with known limitations.
- `untested` — implementation has not completed behavioral verification.

## Build Tracking Rules

For each compatibility check, record:

- HeroForge build identifier and bundle fingerprint where available,
- test date,
- capability status,
- affected feature IDs,
- failure reason,
- whether fallback preserved unmodified HeroForge behavior,
- live test scope and any untested domains.

A changed build fingerprint should trigger capability or patch revalidation rather than automatically declaring the entire build incompatible.
