# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Keep it current when the active phase, architecture, feature status, blockers, ownership, or migration state changes.

## Current Phase

**Repository bootstrap, legacy audit normalization, and live runtime capability investigation.**

The separate private `Knight-Witch/HF-Chat-Bridge` diagnostic transport is live-validated. The first bounded current-runtime capability probe is complete and shows usable named top-level `HF` and `CK` surfaces worth investigating before bundle-level discovery.

## Current Repository Role

- Repository: `Knight-Witch/HeroForge.Compatibility`
- Production Witch Dock repository: `Knight-Witch/KnightWitch.Heroforge`
- External diagnostic transport repository: `Knight-Witch/HF-Chat-Bridge` (private; v0.1 transport validated; read-only probes active)
- Public runtime dependency from Witch Dock Stable: **none**
- Current code status: **no reconstructed runtime modules committed yet**
- Current testing status: **validated external live diagnostic transport; first capability probe complete; maintained compatibility capabilities not yet implemented**

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

The transport path is live-validated. Findings obtained through it still require normal compatibility review before they become maintained bridge capabilities or feature assumptions.

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

The actual source files have **not yet been archived into `/legacy/` in this repository**. Until they are imported and provenance is recorded, the inventory remains provisional and based on the completed initial audit.

## High-Priority Confirmed Architecture Problems From Initial Audit

- Multiple legacy scripts intercept and replace core HeroForge bundles independently.
- Some bundle interception paths remove the original bundle before replacement validation and lack a safe untouched fallback.
- HF Core Tweaks and Full Res Decals/Textures compete over HeroForge initialization through shared global coordination.
- Advanced Decal Posing and Full Res contain an undeclared cross-script dependency for projected/unequal decal behavior.
- The 2000 kitbash script re-executes a modified `extras.js` after the original has already run.
- Several scripts use permanent non-configurable runtime overrides.
- Two scripts contain account-specific page-blanking/redirect kill-switch behavior that must not be migrated into maintained code.
- Advanced Decal Posing combines many unrelated domains and should not remain one feature module.

## Live Diagnostic Evidence

Confirmed on 2026-09-03 through `HF-Chat-Bridge`:

- authenticated HeroForge page context is reachable from the read-only userscript;
- the complete ChatGPT -> GitHub -> local relay -> HeroForge -> GitHub -> ChatGPT round-trip works;
- relay v0.1.2 prevents the confirmed stale-open duplicate-request race in the tested scenario;
- `runtime.listScripts` returned current HeroForge script resources including `ckvendor.js`, `renderkit.js`, `shaderkit.js`, `hfuivendor.js`, `extras.js`, `materialui.js`, `accounts.js`, `community.js`, and `gated/advimport.js`;
- `runtime.capabilityProbe` found top-level named `HF` and `CK` function objects;
- `TN`, `BT`, and `THREE` were not present as top-level globals in the tested page state;
- `React` and `ReactDOM` were present;
- `CK.display` is an accessor/getter, and the generic read-only path correctly refused to invoke it.

Detailed evidence: `docs/investigations/INV-0001-live-runtime-capability-probe-2026-09-03.md`.

These are diagnostic observations, not yet maintained API/capability guarantees.

## Active Work

- Import the original bulk script collection into immutable `/legacy/` paths.
- Create normalized per-script audits from the initial review.
- Finalize stable feature IDs and dependency relationships.
- Continue bounded follow-up probes of confirmed `HF` / `CK` candidates.
- Distinguish plain data properties from accessors before designing adapters.
- Identify a safe HeroForge build/fingerprint source.
- Record confirmed capability evidence before implementing the maintained compatibility bridge.

## Next Planned Development Stage

1. Collect the queued `runtime.describePath` / `runtime.searchGlobals` results.
2. Determine which useful `HF` / `CK` paths are plain data properties and which require deliberate getter access.
3. If getter access is required, design a narrowly allowlisted read-only probe rather than weakening generic traversal.
4. Capture a build/fingerprint source suitable for compatibility tracking.
5. Continue legacy import and audit normalization.
6. Reconstruct lower-risk runtime features as standalone Tampermonkey tests once required capabilities are confirmed.

## Current Blockers

- Legacy source files are not yet present in the repository.
- Maintained current-build capability definitions have not yet been formalized from the live diagnostic evidence.
- A durable HeroForge build identifier/fingerprint has not yet been captured.
- Feature ownership with Lob has not yet been formally assigned.
- No maintained shared compatibility bridge or patch engine exists yet.

## Migration Queue

| Area | Current State | Next Gate |
|---|---|---|
| Legacy script collection | Audited outside repo; not yet archived | Import immutable originals |
| Feature inventory | Provisional | Confirm against archived source |
| HF-Chat-Bridge diagnostic transport | v0.1 transport validated; capability probes active | Follow-up paths + cross-chat validation |
| Maintained compatibility bridge | Planned | Confirmed named capability semantics/readiness |
| Standalone modules | Not started | Audit/spec + capabilities first |
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
