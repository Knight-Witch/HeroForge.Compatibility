# Changelog

## HFC-2026-09-10-020 — Add adaptive atlas-area selection and persistent texture diagnostics

Date: 2026-09-10

### Summary

Responds to the third standalone `rendering.texture-quality` enable failure on Blood Moon. v0.1.2 correctly preserved the exact pre-enable atlas but proved that an 8192x4096 atlas cannot satisfy the current safety contract while simultaneously preserving every unrelated pre-enable slot allocation and raising bodyLower/bodyUpper/face to 2048.

### Confirmed failure / diagnosis

- v0.1.2 reported baseline `8192x4096` and a protected attempt of bodyLower `1024`, bodyUpper `1024`, face `2048`.
- The failure was retained in diagnostics but the disabled watcher immediately overwrote the visible panel with the normal Ready status, making the useful error difficult to capture.
- A passive bridge recorder confirmed that status transition without mutating renderer state.
- A detached A/B runtime test constructed the same 8192x4096 atlas once with a cloned target scale and once with temporary live `character.data.atlasScale` target entries. Both produced bodyLower/bodyUpper `1024` and face `2048`, ruling out cloned-vs-live scale-object identity as the missing requirement.
- The supported current constraint is atlas packing area under the exact pre-enable no-unrelated-regression policy, not failure to request 2048 body/head ceilings.

### Runtime behavior changed

Standalone v0.1.3 only:

- keeps 2048 as the bodyLower/bodyUpper/face quality target;
- captures the exact pre-enable atlas and per-slot allocation baseline as before;
- tests `8192x4096` as the first detached protected candidate;
- if that candidate cannot reach 2048 for all three targets without lowering an unrelated slot, tests `8192x8192` as a second detached candidate;
- assigns only the smallest candidate that passes both target-allocation and unrelated-slot postconditions;
- does **not** enable the separate 4096-body experiment;
- keeps valid current-figure 1024 body-mask pinning and the narrow color-bake refresh path;
- latches the last enable/disable error in the UI until another explicit enable attempt, explicit clear, or page reload;
- records capped `attemptHistory` and state-change `timeline` as plain data on `window.HFProtectedTextureQualityTest` so HF-Chat-Bridge can inspect test behavior without timing screenshots or accessor reads;
- includes candidate atlas dimensions, target allocations, regressions, baseline allocations, and mask paths in persistent diagnostics;
- continues exact pre-enable restoration, part-set fingerprinting, reversible `buildAtlas` ownership, lifecycle reapply, and fail-closed behavior.

No `instantSettingsChange()`, `data.change()`, bundle patch, 4096 body target, character-specific mask hard-code, `/legacy/` modification, or Witch Dock change is introduced.

### Validation status

- v0.1.0 initial enable: **FAIL / recorded**;
- v0.1.1 initial enable: **FAIL / recorded**;
- v0.1.2 initial enable: **FAIL / diagnosed** (`8192x4096 -> BL 1024 / BU 1024 / face 2048` under the safety caps);
- detached cloned-vs-live scale-object test: **PASS / equivalent result**, ruling out scale-object identity;
- passive bridge recorder: **installed and verified**, confirming the visible error-overwrite bug;
- v0.1.3 JavaScript syntax: **PASS** (`node --check`) on the prepared source;
- v0.1.3 GitHub runtime blob: **fetched back/reviewed before commit packaging**;
- v0.1.3 clean-load human activation: **pending**.

### Touched files

- `entries/tampermonkey-standalone/rendering-texture-quality.user.js`
- `docs/feature-specs/rendering-texture-quality.md`
- `docs/investigations/INV-0004-texture-atlas-quality-2026-09-10.md`
- `MASTER.md`
- `FEATURE_INVENTORY.md`
- `ARCHITECTURE.md`
- `COMPATIBILITY.md`
- `MIGRATION_PLAN.md`
- `TESTING.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

---

## HFC-2026-09-10-019 — Use exact pre-enable atlas baseline for protected textures

Date: 2026-09-10

### Summary

Fixes the second standalone `rendering.texture-quality` enable failure observed on Blood Moon. v0.1.1 still failed with `Protected atlas could not allocate 2048px for bodyLower.` because its safety baseline was recomputed by calling HeroForge's native `buildAtlas()` instead of preserving the atlas HeroForge was actually displaying before enable.

### Confirmed failure

A read-only post-failure snapshot confirmed that v0.1.1 restored bodyLower/bodyUpper/face `bakeSize` and `_usedTextureSize` to 1024, but its rollback had replaced the pre-enable atlas with a newly generated 8192x4096 native atlas. That proved the baseline/rollback path itself could change renderer allocation state even though activation failed.

### Runtime behavior changed

Standalone v0.1.2 only:

- captures the exact current `display.atlas` and `modded.resourceAtlas` before any feature mutation;
- derives unrelated-slot allocation caps directly from that displayed pre-enable atlas;
- does not call HeroForge's original `buildAtlas()` to establish the initial safety baseline;
- raises only bodyLower/bodyUpper/face runtime bake ceilings/caps to 2048 and retains the validated current-figure 1024 body-mask pinning;
- constructs the protected 8192x4096 atlas against the exact pre-enable allocation budget;
- records baseline and attempted target allocations when allocation fails, so a future refusal reports what the packer actually produced;
- restores the exact pre-enable atlas objects on failed enable and manual disable instead of generating a new native atlas;
- fingerprints the current part set and reinitializes when the part set changes rather than applying stale allocation caps;
- preserves reversible `buildAtlas` ownership, narrow color-bake refresh, lifecycle monitoring, and fail-closed behavior.

No `instantSettingsChange()`, `data.change()`, bundle patch, character-specific mask hard-code, or public Witch Dock change is introduced.

### Validation status

- v0.1.0 clean-load enable: **FAIL / diagnosed**;
- v0.1.1 clean-load enable: **FAIL / diagnosed**;
- v0.1.1 metadata rollback: **PASS** for body/head sizes;
- v0.1.1 atlas rollback: **FAIL** — pre-enable atlas identity/allocation was not preserved;
- v0.1.2 JavaScript syntax: **PASS** (`node --check`);
- v0.1.2 clean-load human enable/disable/figure-change acceptance: **failed at initial activation; superseded by v0.1.3**.

### Touched files

- `entries/tampermonkey-standalone/rendering-texture-quality.user.js`
- `docs/feature-specs/rendering-texture-quality.md`
- `ARCHITECTURE.md`
- `TESTING.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

---

## HFC-2026-09-10-018 — Fix protected texture allocator to preserve native slot budgets

Date: 2026-09-10

### Summary

Fixes the first standalone `rendering.texture-quality` enable failure observed on a clean Blood Moon load.

### Confirmed failure

Standalone v0.1.0 failed closed with `Protected atlas could not allocate 2048px for bodyLower.` The rollback restored body/head bake ceilings to native 1024 values and did not leave a half-enabled protected state.

Source-level diagnosis of `CK.Atlas` confirmed the constructor's fourth argument is a per-slot maximum allocation map. v0.1.0 passed no map, so the allocator attempted to satisfy all slots' ideal sizes inside 8192x4096 and globally stepped resolution down until the scene packed. On an extreme figure this reduced the protected body slot below 2048.

### Runtime behavior changed

Standalone v0.1.1 only:

- asks HeroForge's original `buildAtlas()` for the current native allocation baseline;
- derives per-slot native allocation caps from that atlas;
- preserves those caps for unrelated slots while allowing bodyLower/bodyUpper/face up to 2048;
- constructs the protected 8192x4096 atlas with that cap map plus the existing cloned body/head priority scale;
- still refuses activation if any unrelated slot resolves below native allocation;
- keeps figure-specific 1024 mask pinning, narrow color-bake refresh, reversible `buildAtlas` ownership, lifecycle monitoring, and fail-closed rollback.

No `instantSettingsChange()`, `data.change()`, bundle patch, character-specific mask hard-code, or public Witch Dock change is introduced.

### Validation status

- v0.1.0 clean-load enable: **FAIL / diagnosed**;
- v0.1.0 failure rollback: **PASS mechanically**;
- corrected allocator source reasoning: **confirmed against live `CK.Atlas` constructor source**;
- v0.1.1 JavaScript syntax: **passed before commit**;
- v0.1.1 clean-load human enable/disable/figure-change acceptance: **failed at initial activation; superseded by v0.1.2**.

### Touched files

- `entries/tampermonkey-standalone/rendering-texture-quality.user.js`
- `docs/feature-specs/rendering-texture-quality.md`
- `ARCHITECTURE.md`
- `TESTING.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

---

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
