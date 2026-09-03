# Changelog

All committed repository updates must be recorded here.

## HFC-2026-09-03-003 — Record validated HF-Chat-Bridge transport

**Date:** 2026-09-03  
**Time:** approximately 00:50 PDT

### Summary

Updated durable project status after the external private HF-Chat-Bridge passed its live read-only round-trip, duplicate-request regression retest, and first non-ping resource probe. Capability discovery is now the active diagnostic stage.

### Changed

- `MASTER.md` now records the diagnostic transport as live-validated and advances active work to runtime capability investigation.
- `COMPATIBILITY.md` distinguishes validated transport from still-unproven maintained runtime capabilities and records current live script-resource evidence.
- `TESTING.md` records passed `bridge.ping`, stale-open dedupe regression, and `runtime.listScripts` tests.
- Updated pre-flight/status tracking for the capability-probe stage.

### Touched files

- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `COMPATIBILITY.md`
- `TESTING.md`

### Runtime impact

Documentation/status only in `HeroForge.Compatibility`.

- No JavaScript changed in this repository.
- No HeroForge runtime behavior changed from this repository.
- No Witch Dock production file, manifest, or runtime behavior changed.
- HF-Chat-Bridge remains separate private diagnostic infrastructure.

### Test notes

External diagnostic evidence reviewed:

- Issue #2 fresh relay v0.1.2 `bridge.ping`: **passed exactly once** beyond the full lease interval.
- Issue #3 `runtime.listScripts`: **passed**, returning 27 bounded external script URLs.
- `runtime.capabilityProbe`: pending next.

### Rollback

Revert this documentation commit to restore the previous unvalidated diagnostic-transport status. The separate HF-Chat-Bridge repository and its runtime validation evidence are unaffected.

---

## HFC-2026-09-02-002 — Record external HF-Chat-Bridge diagnostic scaffold

**Date:** 2026-09-02  
**Time:** 23:51 PDT

### Summary

Recorded the new private `Knight-Witch/HF-Chat-Bridge` v0.1 read-only diagnostic scaffold as external development infrastructure and clarified that it is distinct from this repository's planned maintained compatibility bridge.

### Changed

- `MASTER.md` recorded the external diagnostic transport, its then-unvalidated state, and the next live round-trip/capability-probe gate.
- `ARCHITECTURE.md` defined the boundary between HF-Chat-Bridge diagnostics and the maintained feature compatibility bridge.
- `COMPATIBILITY.md` tracked the diagnostic transport separately without treating it as HeroForge build certification.
- `OWNERSHIP.md` recorded the diagnostic transport without silently assigning long-term maintenance.
- Added ADR-0004 documenting the separate, chat-independent diagnostic transport decision.

### Runtime impact

Documentation/status only in `HeroForge.Compatibility`.

- No JavaScript changed in this repository.
- No HeroForge runtime behavior changed from this repository.
- No Witch Dock production file, manifest, or runtime behavior changed.

### Rollback

Revert that documentation commit to remove the status/architecture references. The separate HF-Chat-Bridge repository is unaffected.

---

## HFC-2026-07-13-001 — Initial documentation and architecture bootstrap

**Date:** 2026-07-13  
**Time:** 18:44 PDT

### Summary

Established the initial durable documentation system for HeroForge.Compatibility.

Added canonical project-state, architecture, feature inventory, compatibility, ownership, migration, testing, documentation-area, legacy-area, source-area, entrypoint, manifest, and test-area guidance.

### Runtime impact

Documentation and repository structure only.

- No JavaScript changed.
- No HeroForge runtime behavior changed.
- No Witch Dock production files changed.
- No manifest or public userscript changed.

### Rollback

Revert this commit to return to the repository state containing only the initial README and `PROJECT_CONTRACT.md`.
