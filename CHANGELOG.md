# Changelog

All committed repository updates must be recorded here.

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