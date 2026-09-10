# Pre-Flight Check Log

## PFC-2026-09-10-014 — Create experimental protected texture-quality standalone

Date: 2026-09-10

### Target files

- `entries/tampermonkey-standalone/rendering-texture-quality.user.js`
- `docs/feature-specs/rendering-texture-quality.md`
- `docs/investigations/INV-0004-texture-atlas-quality-2026-09-10.md`
- `MASTER.md`
- `ARCHITECTURE.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- `MIGRATION_PLAN.md`
- `TESTING.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Reviewed

- binding `PROJECT_CONTRACT.md`;
- `README.md`, `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `MIGRATION_PLAN.md`, and `TESTING.md`;
- current standalone Tampermonkey packaging pattern (`photo-booth-true-resolution.user.js`);
- current feature-spec pattern;
- HF-Chat-Bridge runtime findings from D4 and Blood Moon, including mask-path/resource probes, atlas allocation probes, color/decal bake UV probes, and broad-rebuild failure states;
- current live visual acceptance from Amanda.

### Confirmed

- Blood Moon can be degraded natively to 256px bodyLower/bodyUpper and 512px face within a 4096x4096 atlas.
- D4 and Blood Moon both support a protected 8192x4096 atlas with 2048 bodyLower/bodyUpper/face allocations.
- Valid 1024 body masks prevent the nonexistent 2048-mask fallback corruption observed during experiments.
- Narrow color-bake refresh preserves correct final materials on the accepted path; broad `instantSettingsChange()` is rejected.
- Final Blood Moon protected state was visually accepted for body, seams, paints/channels and high-confidence decal quality.
- A 4096-body detached layout is possible but is outside the maintained first target.

### Material conflict risks

- `/legacy/` is immutable and is not touched.
- Public Witch Dock is not touched.
- No bundle patch is introduced.
- No character-specific mask path/object is persisted.
- Feature starts disabled and fails closed if required capabilities/resources/postconditions fail.
- Loaded mask resource cache ownership has no confirmed explicit release API yet; this limitation is documented.

### Recommended action

Create one isolated feature-branch commit containing the experimental standalone v0.1.0 and durable documentation. Human standalone lifecycle acceptance is the next gate; do not integrate Witch Dock yet.

**Runtime behavior changed:** yes, but only by adding a new opt-in standalone experimental userscript on the Compatibility feature branch. Existing maintained runtime files and public Witch Dock behavior are unchanged.

---

Historical pre-flight entries through PFC-2026-09-05-013 remain preserved in Git history at/before `732dae09e83d712a26ac383f7b64ce9e27e07a59`.
