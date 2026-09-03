# Changelog

All committed repository updates must be recorded here.

## HFC-2026-09-02-002 — Record external HF-Chat-Bridge diagnostic scaffold

**Date:** 2026-09-02  
**Time:** 23:51 PDT

### Summary

Recorded the new private `Knight-Witch/HF-Chat-Bridge` v0.1 read-only diagnostic scaffold as external development infrastructure and clarified that it is distinct from this repository's planned maintained compatibility bridge.

### Changed

- `MASTER.md` now records the external diagnostic transport, its unvalidated state, and the next live round-trip/capability-probe gate.
- `ARCHITECTURE.md` now defines the boundary between HF-Chat-Bridge diagnostics and the maintained feature compatibility bridge.
- `COMPATIBILITY.md` now tracks the diagnostic transport separately without treating it as HeroForge build certification.
- `OWNERSHIP.md` records the diagnostic transport without silently assigning long-term maintenance.
- Added ADR-0004 documenting the separate, chat-independent diagnostic transport decision.
- Updated pre-flight/status tracking for the new development stage.

### Touched files

- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `ARCHITECTURE.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- `docs/decisions/ADR-0004-external-chat-diagnostic-transport.md`

### Runtime impact

Documentation/status only in `HeroForge.Compatibility`.

- No JavaScript changed in this repository.
- No HeroForge runtime behavior changed from this repository.
- No Witch Dock production file, manifest, or runtime behavior changed.
- HF-Chat-Bridge executable scaffold exists only in its separate private repository and remains unvalidated until local setup/live testing.

### Test notes

- Verified the HF-Chat-Bridge userscript committed on its `main` branch matches the statically checked v0.1 userscript blob.
- No live HeroForge round-trip has been claimed.

### Rollback

Revert this documentation commit to remove the status/architecture references. The separate HF-Chat-Bridge repository is unaffected by that rollback.

---

## HFC-2026-07-13-001 — Initial documentation and architecture bootstrap

**Date:** 2026-07-13  
**Time:** 18:44 PDT

### Summary

Established the initial durable documentation system for HeroForge.Compatibility.

Added canonical project-state, architecture, feature inventory, compatibility, ownership, migration, testing, documentation-area, legacy-area, source-area, entrypoint, manifest, and test-area guidance.

### Touched files

- `README.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `ARCHITECTURE.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- `MIGRATION_PLAN.md`
- `TESTING.md`
- `docs/**/README.md`
- `docs/decisions/ADR-0001-separate-repository.md`
- `docs/decisions/ADR-0002-immutable-legacy-sources.md`
- `docs/decisions/ADR-0003-standalone-first-promotion.md`
- `legacy/README.md`
- `tests/README.md`
- `src/README.md`
- `entries/README.md`
- `manifests/README.md`

### Runtime impact

Documentation and repository structure only.

- No JavaScript changed.
- No HeroForge runtime behavior changed.
- No Witch Dock production files changed.
- No manifest or public userscript changed.

### Test notes

No runtime testing applicable. Repository state and document consistency reviewed as a documentation bootstrap.

### Rollback

Revert this commit to return to the repository state containing only the initial README and `PROJECT_CONTRACT.md`.
