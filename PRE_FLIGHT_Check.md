# Pre-Flight Check Log

Use this file before committed repository updates to record what was checked, what can conflict, and what action is recommended.

## PFC-2026-08-06-001 — August 5 Compatibility Stage 1

**Date:** 2026-08-06  
**Time:** 18:02 PDT

### Goal

Create isolated standalone test modules for:

- complete character JSON file export/import,
- Photo Booth settings file export/import,
- projected decal and unequal-scaling compatibility.

### Target files

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

### Required documents reviewed

- `PROJECT_CONTRACT.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `ARCHITECTURE.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- relevant legacy architecture audit
- Advanced Decal Posing Clover Fix 2
- Full Res Decals/Textures 0.74 projected-renderer logic
- August 5 read-only probe reports

### Confirmed evidence

- HeroForge build: `heroforge08.1.9.74`.
- `creationkit.js` SHA-256: `f409276a1e6f5b3f1533f3922947c224f98fac61fa9a087834a93968727850c0`.
- `heroforgeui.js` SHA-256: `c70ff17533376fe18f499beacefce10aef8da6d4ed4d270c127aa683bc5ad572`.
- `boothui.js` SHA-256: `951ab2a272b8ee57c7d82bc2b317fa1c7a17e01e4dd2ef7d48ce1ce691643c78`.
- Character named runtime APIs remain available.
- Photo Booth state moved to `BT.maker.effectState.save/load` after Booth initialization.
- Projected renderer decision points changed while custom state fields remain in saved decal records.

### Directly connected modules reviewed

- No prior maintained runtime module existed in this repository.
- Public Witch Dock remains external and unchanged.
- Clover's Advanced Decal Posing repairs only `heroforgeui.js` and still relies on a separate projected-renderer patch.
- Full Res Decals/Textures combines unrelated `creationkit.js` patches and lacks transactional fallback.

### Material conflict risks

- **Core-bundle interception:** The projected module must run with all other `creationkit.js` rewriters disabled. Competing interceptors are unsupported.
- **Build specificity:** The projected patch is verified only against the captured build and must report other builds as unverified.
- **Partial initialization:** Both required projected patches must validate before modified bundle execution. Failure must load untouched HeroForge source.
- **Double execution:** After a modified core bundle begins executing, the module must not attempt to execute the untouched bundle as a late fallback.
- **Booth method contract:** `BT.maker.effectState.save/load` exists, but serialized breadth and exact behavior remain untested.
- **Character export source:** Legacy behavior used the current UndoQueue entry. The standalone implementation preserves that preference and falls back to `getJson()`.
- **Ownership:** Amanda is reviewer, not automatically primary maintainer for Lob-derived features.
- **Status overstatement:** Static checks do not constitute live compatibility validation.
- **Witch Dock contamination:** No Witch Dock code, manifest, or production branch may be changed during this stage.

### Recommended action

Proceed on a dedicated development branch with three isolated standalone scripts. Mark projected decals experimental and critical. Complete live acceptance tests before shared-bridge extraction or any Witch Dock consideration.

---

## PFC-2026-07-13-001 — Initial Documentation Bootstrap

**Date:** 2026-07-13  
**Time:** 18:44 PDT

### Target files

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
- documentation-area README files
- initial architecture decision records
- `legacy/README.md`
- `tests/README.md`
- `src/README.md`
- `entries/README.md`
- `manifests/README.md`

### Relevant history checked

- `PROJECT_CONTRACT.md`
- existing repository `README.md`
- initial full script-collection audit completed in the originating project conversation
- current Witch Dock repository architecture and manifest/loading documentation from `Knight-Witch/KnightWitch.Heroforge`

### Connected modules reviewed

- No runtime modules exist yet in this repository.
- Public Witch Dock remains external and unchanged.
- No manifest or production loader is being added.

### Conflict risks

- Documentation could overstate findings derived from the pre-repository ZIP audit. Mitigation: initial feature and compatibility entries are labeled provisional or untested.
- The new structure must not imply that every legacy feature is approved for Witch Dock. Mitigation: migration and ownership documents explicitly require separate disposition and promotion.
- No JavaScript files changed.
- No HeroForge runtime behavior changed.
- No Witch Dock manifest, public userscript, module, or runtime behavior changed.

### Recommended action

Proceed with one atomic documentation-bootstrap commit. Import immutable legacy source files and normalize per-script audits before beginning reconstruction.
