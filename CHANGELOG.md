# Changelog

All committed repository updates must be recorded here.

## HFC-2026-08-06-001 — August 5 compatibility Stage 1

**Date:** 2026-08-06  
**Time:** 18:02 PDT

### Summary

Added the first maintained runtime code in HeroForge.Compatibility as three isolated standalone Tampermonkey test modules:

- complete character JSON file export/import,
- Photo Booth settings file export/import,
- experimental projected decal and unequal-scaling compatibility.

Recorded the HeroForge `heroforge08.1.9.74` investigation, feature contracts, build fingerprints, compatibility status, risks, ownership status, acceptance tests, and migration constraints.

### Runtime changes

#### Character JSON file I/O

- Uses independent Shadow DOM controls.
- Prefers the current `CK.UndoQueue` entry for export when usable.
- Falls back to `CK.character.data.getJson()`.
- Imports through `CK.tryLoadCharacter()`.
- Does not rewrite HeroForge bundles.

#### Photo Booth settings file I/O

- Uses independent Shadow DOM controls.
- Targets `BT.maker.effectState.save/load` on the current build.
- Retains a legacy `TN.tokenizer.effectState.toJson/fromJson` adapter for older compatible builds.
- Does not rewrite `boothui.js`.

#### Projected decal compatibility

- Treats Project and Unequal Scaling as one coupled feature.
- Intercepts `creationkit.js` before execution.
- Requires exactly one match and one postcondition for each of two patches.
- Syntax-checks the transformed bundle before execution.
- Loads untouched HeroForge `creationkit.js` when fetch, match, postcondition, or syntax validation fails before modified execution.
- Adds independent controls that write existing `forceProjectedScript` and `enableUnequalScaling` fields through `CK.activeTweak()`.
- Requires a page reload to enable or disable the renderer patch.
- Remains experimental and is verified only against `heroforge08.1.9.74` pending live testing.

### Touched files

- `entries/tampermonkey-standalone/hf-character-json-file-io.user.js`
- `entries/tampermonkey-standalone/hf-photo-booth-settings-file-io.user.js`
- `entries/tampermonkey-standalone/hf-projected-decal-transform.user.js`
- `tests/compatibility/projected-decals-stage1.test.mjs`
- `docs/feature-specs/STAGE1_AUG5_COMPATIBILITY.md`
- `docs/investigations/INV-2026-08-06-HF-081974.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `ARCHITECTURE.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- `entries/README.md`
- `tests/README.md`

### Test status

Passed:

- `node --check` for all three standalone scripts.
- Projected-decal fixture expected-match checks.
- Projected-decal postcondition checks.
- Transformed fixture syntax check.

Not yet performed:

- live HeroForge character JSON round trip,
- live Photo Booth settings round trip,
- live projected decal renderer validation,
- undo/redo and save/reload matrices,
- interaction testing with other unofficial scripts,
- Witch Dock Dev integration testing.

### Known limitations

- The projected module is a temporary feature-local bundle interceptor. It must migrate behind shared patch infrastructure before another maintained bundle-patch feature or Witch Dock integration.
- Competing `creationkit.js` rewriters are unsupported during projected-decal testing.
- Photo Booth save/load method signatures were observed but not yet proven through round-trip testing.
- Legacy source files remain outside `/legacy/` and must still be imported unchanged with provenance.
- Primary maintenance ownership remains unassigned.

### Witch Dock impact

None.

- No Witch Dock repository file changed.
- No production userscript changed.
- No public manifest changed.
- No Stable or Dev integration was performed.

### Rollback

Delete the three standalone entrypoints and their Stage 1 test/spec/investigation updates, or revert the branch before merge. The public Witch Dock repository requires no rollback.

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
