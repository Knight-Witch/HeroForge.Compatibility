# Changelog

## HFC-2026-09-10-017 — Add experimental protected texture-quality standalone

Date: 2026-09-10

### Summary

Adds the first standalone test implementation of `rendering.texture-quality`, based on the validated D4/Blood Moon protected-2048 runtime mechanism.

### Runtime behavior

New opt-in standalone script only:

- requires HeroForge texture-atlas mode and named runtime capabilities;
- loads each current figure's valid 1024 body masks and pins them through runtime overrides;
- raises current bodyLower/bodyUpper/face bake ceilings to 2048;
- installs a reversible per-display atlas builder that constructs 8192x4096 with cloned body/head scale priority;
- refuses the protected layout if any unrelated slot would be smaller than a detached native-reference allocation;
- uses narrow `colorBake.invalidateCache()` + `colorBake.refresh(true)` only;
- verifies protected atlas/material/bake bindings;
- watches character/display/atlas lifecycle and reapplies with cooldown;
- auto-disables/restores native ownership after repeated failures;
- exposes manual enable/disable/dispose through the standalone test UI/global.

Existing maintained runtime files are unchanged. Public Witch Dock is unchanged.

### Confirmed design decisions

- 2048 body/head protection is the maintained first target.
- 4096 body allocation remains an unshipped experiment.
- `instantSettingsChange()` is rejected for this feature.
- nonexistent 2048 body-mask asset requests are rejected; valid current-figure 1024 masks are required.
- `character.data.atlasScale` is not persistently mutated by the standalone candidate.

### Validation status

- underlying runtime mechanism: passed D4 and Blood Moon visual/runtime probes;
- standalone JavaScript syntax: passed `node --check` before commit;
- standalone human enable/disable/figure-change acceptance: pending;
- Witch Dock Dev: not started;
- Witch Dock Stable: not approved.

### Touched files

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

---

Historical changelog entries through HFC-2026-09-05-016 remain preserved in Git history at/before `732dae09e83d712a26ac383f7b64ce9e27e07a59`.
