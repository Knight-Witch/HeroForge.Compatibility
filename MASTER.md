# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Keep it current when the active phase, architecture, feature status, blockers, ownership, or migration state changes.

## Current Phase

**Stage 1 standalone reconstruction and live-validation preparation.**

The first isolated Tampermonkey test modules have been implemented on a development branch after read-only capability and bundle probes of HeroForge build `heroforge08.1.9.74`.

## Current Repository Role

- Repository: `Knight-Witch/HeroForge.Compatibility`
- Production Witch Dock repository: `Knight-Witch/KnightWitch.Heroforge`
- Active development branch: `dev/aug5-compatibility-stage-1`
- Public runtime dependency from Witch Dock Stable: **none**
- Current code status: **three standalone test modules implemented; none live-validated**
- Current testing status: **static syntax and projected-patch fixture tests passed; live runtime tests pending**

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

## Initial Legacy Collection Reviewed

An initial bulk Tampermonkey export supplied by Amanda was inspected before repository bootstrap. The reviewed collection included:

- Advanced Decal Posing
- HF Core Tweaks
- Full Res Decals/Textures
- 2000 kitbash parts
- I love extra slots
- Camera Control Modifier
- Shader Fix for Photo Booth
- ReCK for Hero Forge (third-party reference, not Lob-authored)

The actual source files have **not yet been archived into `/legacy/` in this repository**. Until they are imported and provenance is recorded, legacy inventory entries remain provisional even where current runtime behavior has now been investigated.

## High-Priority Confirmed Architecture Problems

- Multiple legacy scripts intercept and replace core HeroForge bundles independently.
- Some bundle interception paths remove the original bundle before replacement validation and lack a safe untouched fallback.
- HF Core Tweaks and Full Res Decals/Textures compete over HeroForge initialization through shared global coordination.
- Advanced Decal Posing and Full Res contain an undeclared cross-script dependency for projected/unequal decal behavior.
- The 2000 kitbash script re-executes a modified `extras.js` after the original has already run.
- Several scripts use permanent non-configurable runtime overrides.
- Two scripts contain account-specific page-blanking/redirect kill-switch behavior that must not be migrated into maintained code.
- Advanced Decal Posing combines many unrelated domains and should not remain one feature module.

## August 5 Compatibility Investigation

Read-only probes confirmed HeroForge build `heroforge08.1.9.74` and recorded current fingerprints for `creationkit.js`, `heroforgeui.js`, and the new `boothui.js` bundle.

Confirmed findings include:

- Photo Booth controls and capture code moved into `boothui.js`.
- The old `TN.tokenizer.effectState` path is absent after Booth initialization.
- Current Booth settings methods are exposed through `BT.maker.effectState.save/load`.
- Character import/export named runtime surfaces remain available.
- The projected-decal renderer conditions changed, while saved decal records still retain `forceProjectedScript` and `enableUnequalScaling`.
- Native projected-decal tiling and layer ordering now exist.

See `docs/investigations/INV-2026-08-06-HF-081974.md`.

## Stage 1 Standalone Modules

| Feature | Entrypoint | Status |
|---|---|---|
| Character JSON file I/O | `entries/tampermonkey-standalone/hf-character-json-file-io.user.js` | Static checks passed; live round trip pending |
| Photo Booth settings file I/O | `entries/tampermonkey-standalone/hf-photo-booth-settings-file-io.user.js` | Runtime adapter observed; live round trip pending |
| Projected decal + unequal scaling compatibility | `entries/tampermonkey-standalone/hf-projected-decal-transform.user.js` | Critical experimental patch; static fixture passed; live testing pending |

These modules are not Witch Dock Dev or Stable code.

## Active Work

1. Live-test complete character JSON export/import.
2. Live-test Photo Booth settings save/load and determine serialized scope.
3. Live-test Project and Unequal Scaling across native tiling, layer reordering, undo/redo, save/reload, and JSON round trips.
4. Record concrete failures and repair only confirmed problems.
5. Import immutable legacy sources and provenance before broader reconstruction.
6. Extract validated repeated runtime access into the shared bridge.
7. Move any second bundle-patch feature behind shared interception infrastructure rather than adding another independent rewriter.

## Current Blockers

- None of the Stage 1 modules has completed live acceptance testing.
- Legacy source files are not yet present under `/legacy/`.
- Feature ownership with Lob/Clover has not been formally assigned.
- No shared bridge exists yet.
- No general shared patch engine exists yet; the projected standalone module contains a temporary feature-local validated interceptor and is not eligible for Witch Dock integration in that form.

## Migration Queue

| Area | Current State | Next Gate |
|---|---|---|
| Legacy script collection | Audited outside repo; not yet archived | Import immutable originals |
| August 5 investigation | Probe findings documented | Retain reports/fixtures and live-test modules |
| Character JSON file I/O | Standalone test implementation | Complete round-trip acceptance tests |
| Photo Booth settings file I/O | Standalone test implementation | Verify save/load contract and restored domains |
| Projected decal compatibility | Experimental standalone implementation | Complete critical live matrix and fallback tests |
| Shared bridge | Not implemented | Extract only after standalone behavior is validated |
| Shared patch engine | Not implemented | Required before additional maintained bundle patches |
| Witch Dock Dev integration | Not started | Standalone validation and explicit approval |
| Witch Dock Stable | No dependency | Separate future promotion review |

## Status Terms

- **Legacy reference** — immutable original source used to understand behavior.
- **Provisional inventory** — extracted from audit but not yet confirmed through normalized repo source and runtime testing.
- **Standalone test implementation** — reconstructed module exists but has not completed acceptance testing.
- **Standalone validated** — reconstructed module has passed its defined standalone acceptance tests.
- **Witch Dock Dev candidate** — standalone validated and approved for integration testing.
- **Stable candidate** — passed Witch Dock Dev testing and awaits explicit public promotion review.
- **Experimental only** — intentionally not eligible for stable integration yet.
- **Blocked** — a concrete dependency or unresolved failure prevents progress.
- **Deprecated** — should not be used as a current implementation.
- **Rejected** — intentionally not being adopted.
