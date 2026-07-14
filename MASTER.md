# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Keep it current when the active phase, architecture, feature status, blockers, ownership, or migration state changes.

## Current Phase

**Repository bootstrap and legacy audit normalization.**

The project contract and foundational tracking structure are being established before code reconstruction begins.

## Current Repository Role

- Repository: `Knight-Witch/HeroForge.Compatibility`
- Production Witch Dock repository: `Knight-Witch/KnightWitch.Heroforge`
- Public runtime dependency from Witch Dock Stable: **none**
- Current code status: **no reconstructed runtime modules committed yet**
- Current testing status: **documentation/bootstrap only**

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

The actual source files have **not yet been archived into `/legacy/` in this repository**. Until they are imported and provenance is recorded, the inventory below is provisional and based on the completed initial audit.

## High-Priority Confirmed Architecture Problems From Initial Audit

- Multiple legacy scripts intercept and replace core HeroForge bundles independently.
- Some bundle interception paths remove the original bundle before replacement validation and lack a safe untouched fallback.
- HF Core Tweaks and Full Res Decals/Textures compete over HeroForge initialization through shared global coordination.
- Advanced Decal Posing and Full Res contain an undeclared cross-script dependency for projected/unequal decal behavior.
- The 2000 kitbash script re-executes a modified `extras.js` after the original has already run.
- Several scripts use permanent non-configurable runtime overrides.
- Two scripts contain account-specific page-blanking/redirect kill-switch behavior that must not be migrated into maintained code.
- Advanced Decal Posing combines many unrelated domains and should not remain one feature module.

## Active Work

- Establish durable project documentation and directory rules.
- Import the original bulk script collection into immutable `/legacy/` paths.
- Create normalized per-script audits from the initial review.
- Finalize stable feature IDs and dependency relationships.
- Design the first read-only HeroForge bridge/capability probe.

## Next Planned Development Stage

After legacy import and audit normalization:

1. Build a read-only bridge probe.
2. Validate currently accessible named runtime surfaces and readiness timing.
3. Reconstruct lower-risk runtime features as standalone Tampermonkey tests.
4. Begin with candidates such as camera bounds and extra mini slots before invasive bundle-patch features.

## Current Blockers

- Legacy source files are not yet present in the repository.
- Current HeroForge build capabilities have not yet been probed by this project.
- Feature ownership with Lob has not yet been formally assigned.
- No shared bridge or patch engine exists yet.

## Migration Queue

| Area | Current State | Next Gate |
|---|---|---|
| Legacy script collection | Audited outside repo; not yet archived | Import immutable originals |
| Feature inventory | Provisional | Confirm against archived source |
| Bridge | Planned | Read-only capability probe |
| Standalone modules | Not started | Audit/spec first |
| Witch Dock Dev integration | Not started | Standalone validation first |
| Witch Dock Stable | No dependency | Separate future promotion review |

## Status Terms

- **Legacy reference** — immutable original source used to understand behavior.
- **Provisional inventory** — extracted from audit but not yet confirmed through normalized repo source and runtime testing.
- **Standalone candidate** — coherent feature suitable for independent reconstruction/testing.
- **Standalone validated** — reconstructed module has passed its defined standalone acceptance tests.
- **Witch Dock Dev candidate** — standalone validated and approved for integration testing.
- **Stable candidate** — passed Witch Dock Dev testing and awaits explicit public promotion review.
- **Experimental only** — intentionally not eligible for stable integration yet.
- **Blocked** — a concrete dependency or unresolved failure prevents progress.
- **Deprecated** — should not be used as a current implementation.
- **Rejected** — intentionally not being adopted.