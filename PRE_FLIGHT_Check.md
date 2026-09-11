# Pre-Flight Check Log

## PFC-2026-09-11-019 — Replace 8192² fallback with validated rectangular atlas ladder

Date: 2026-09-11

### Target files

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

### Reviewed

- binding `PROJECT_CONTRACT.md`;
- current `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `MIGRATION_PLAN.md`, and `TESTING.md`;
- current texture-quality feature spec, investigation, and exact standalone v0.1.4 source blob `5b2d52cefe4cd79916a241214cb4807036046309`;
- feature branch head `a76b894069dca05f5bf0f4e6fe227e1e6b985112` and base tree `c0b303eacdf01020e63d5d4771383851c4bdc155` before packaging;
- live `CK.Atlas` constructor/getTargetTextureSize semantics already recovered in the investigation;
- v0.1.4 candidate diagnostics showing the current 8192x4096 candidate cannot protect all targets under the exact no-regression budget;
- HF-Chat-Bridge / Power results from the rectangular-sweep sequence, including issues #1271, #1284, #1287, #1288, #1290, #1291, #1292, and #1293;
- Amanda's direct visual acceptance of the live 8192x6144 protected state.

### Confirmed

- Current v0.1.4-style 8192x4096 allocation on Blood Moon gives bodyLower/bodyUpper/face `1024/1024/2048` and 116 unrelated allocation regressions under the exact displayed-baseline cap contract.
- The first detached rectangular sweep performed after v0.1.4 disable is invalid for candidate selection because disable had already restored body/head `bakeSize` ceilings to 1024. Since `CK.Atlas.getTargetTextureSize()` clamps at the baked ceiling, that sweep could not evaluate the intended 2048 protected target.
- A corrected detached sweep temporarily reproduced the actual pre-build metadata (`bakeSize=2048`, `_usedTextureSize=1024`) and restored it within the same bounded Power run.
- Corrected results were:
  - 8192x4096 -> `1024/1024/2048`, 116 unrelated regressions;
  - 8192x5120 -> `1024/1024/2048`, 116 unrelated regressions;
  - 8192x6144 -> `2048/2048/2048`, zero unrelated regressions;
  - 8192x7168 -> `2048/2048/2048`, zero unrelated regressions;
  - 8192x8192 -> `2048/2048/2048`, zero unrelated regressions.
- 8192x6144 is therefore the smallest tested safe candidate for the current Blood Moon allocation budget.
- A reversible live 8192x6144 test passed exact 2048 target allocations, valid 1024 masks, zero unrelated regressions, exact display/resource atlas object identity, and full display/color/decal UV binding coherence.
- Amanda visually confirmed correct body/skin/material colors, correct glyphs/paint, no blocked/corrupted body or face textures, good seams, and sharp/high-resolution decals.
- The temporary live test was rolled back through its captured snapshot; follow-up bridge verification confirmed coherent display/resource 8192x4096 state with exact same atlas object.
- 8192x8192 is not proven to be the direct cause of prior corruption, but it is no longer justified as a maintained fallback because the current target/no-regression contract already passes at 8192x6144 with less atlas area.
- v0.1.4 lifecycle ownership/coherence architecture remains valid and should be preserved unchanged in v0.1.5.
- `OWNERSHIP.md` does not require a content change; primary maintainer remains TBD, reviewer Amanda, experimental standalone only.

### Material conflict risks

- Non-power-of-two atlas height 6144 is live-validated on the current HeroForge runtime, but must be revalidated if HeroForge changes `CK.Atlas`, render-target sizing, or WebGL allocation assumptions.
- The Power-only live 6144 pass validates the allocation/mask/binding mechanism, not the full v0.1.5 standalone lifecycle. Booth off/on, disable/re-enable, figure change, and recovery-loop behavior remain separate acceptance gates.
- The no-unrelated-regression rule must not be weakened merely to fit a smaller atlas.
- Valid body masks must remain 1024; no 2048 mask request is introduced.
- v0.1.4's renderer/wrapper/atlas ownership checks, full UV checks, bounded recovery, and stale-session invalidation must be preserved.
- `/legacy/` and Witch Dock remain untouched.
- No broad `instantSettingsChange()`, `data.change()`, bundle patch, 4096-body promotion, or character-specific mask hard-code is permitted.

### Recommended action

Commit standalone v0.1.5 with the bounded candidate ladder `8192x4096 -> 8192x5120 -> 8192x6144 -> 8192x7168`, selecting the smallest candidate that reaches all three 2048 targets with zero unrelated allocation regression. Preserve v0.1.4 lifecycle-coherence behavior unchanged. Then install/test the actual standalone v0.1.5 for clean activation, Booth off/on recovery, disable/re-enable, figure change, and performance before Witch Dock Dev consideration.

**Runtime behavior changed:** yes, limited to the opt-in experimental standalone feature branch. Existing maintained modules, `/legacy/`, and public Witch Dock are unchanged.

---

## PFC-2026-09-10-018 — Repair protected-texture Booth lifecycle coherence

Date: 2026-09-10

### Target files

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

### Reviewed

- binding `PROJECT_CONTRACT.md` and repository `README.md`;
- current project tracking/architecture files;
- texture-quality feature spec, investigation, and standalone v0.1.3 source;
- Blood Moon report that v0.1.3 improved decals but produced persistent bizarre body/face textures, with Booth off temporarily exposing native low-resolution/seamed body before the bad state returned;
- live HF-Chat-Bridge state/source probes and color-bake/atlas-baker/native `modded.buildAtlas` source;
- existing manual protected-2048 D4/Blood Moon evidence and body-mask findings.

### Confirmed

- v0.1.3 passed adaptive allocation by selecting 8192x8192 and reaching bodyLower/bodyUpper/face 2048.
- The user observed improved decals and no supported paint-data mutation root cause.
- In the broken state, `display.atlas` remained protected while `modded.resourceAtlas` was a different atlas and `modded.buildAtlas` had reverted to HeroForge native ownership.
- Protected and resource packing locations differed, while visible material UVs remained tied to the protected display layout.
- The correct repair boundary is renderer/session ownership; stale sessions must be invalidated after ownership replacement.

### Material conflict risks

- Coherence recovery may temporarily show native/low-resolution textures before a fresh protected session is created.
- Exact pre-enable atlas restoration is safe only while the original session still owns the current renderer.
- Recovery waits must remain bounded.
- Repeated renderer replacement may be legitimate; v0.1.4 deliberately auto-disables after the bounded recovery budget rather than fighting HeroForge indefinitely.
- `/legacy/` and Witch Dock remain untouched.

### Recommended action

Commit standalone v0.1.4 with hard renderer/wrapper/atlas ownership postconditions, full target UV-location verification, stale-session invalidation, bounded settle/recovery, and fresh protected-session initialization while preserving the validated 1024-mask / 2048-target recipe.

**Runtime behavior changed:** yes, limited to the opt-in experimental standalone feature branch.

---

## PFC-2026-09-10-017 — Adaptive atlas-area fallback and persistent test telemetry

Date: 2026-09-10

### Confirmed

- v0.1.2 failed with baseline 8192x4096 and protected targets `1024/1024/2048`.
- Cloned target scale and temporary live target scale produced the same result, ruling out scale-object identity.
- More atlas area was the next supported bounded variable.
- Persistent diagnostics/error latch were required so failures remained observable.

### Recommended action

Commit standalone v0.1.3 with adaptive detached atlas candidates, persistent telemetry, exact pre-enable rollback, and 1024 mask safety.

**Runtime behavior changed:** yes, limited to the opt-in experimental standalone feature branch.

---

## PFC-2026-09-10-016 — Preserve exact pre-enable atlas during protected-texture apply

Date: 2026-09-10

### Confirmed

- Recomputing a native atlas is not behavior-neutral on an extreme figure.
- The correct safety reference is the exact displayed pre-enable atlas and exact `modded.resourceAtlas`.
- Allocation caps are scoped to the captured part set and stale caps must not be reused after part-set changes.

### Recommended action

Commit standalone v0.1.2 using the exact pre-enable displayed atlas baseline and exact atlas-object restoration on failure/disable.

**Runtime behavior changed:** yes, limited to the opt-in experimental standalone feature branch.

---

## PFC-2026-09-10-015 — Repair standalone protected-atlas allocation gate

Date: 2026-09-10

### Confirmed

- v0.1.0 failed closed because it omitted the `CK.Atlas` per-slot maximum allocation map.
- Correct design preserves unrelated slot budgets while allowing bodyLower/bodyUpper/face up to 2048.

### Recommended action

Commit standalone v0.1.1 with the allocation-cap builder and rerun Blood Moon.

**Runtime behavior changed:** yes, limited to the opt-in experimental standalone feature branch.

---

## PFC-2026-09-10-014 — Create experimental protected texture-quality standalone

Date: 2026-09-10

### Confirmed

- Extreme atlas pressure can visibly degrade body/head/decal quality.
- Protected 2048 body/head allocation with valid 1024 body masks works manually on D4/Blood Moon.
- Broad rebuild paths are rejected; bundle patching is unnecessary for the current named-runtime path.

### Recommended action

Create one isolated feature-branch standalone candidate and keep Witch Dock untouched until standalone lifecycle acceptance.

**Runtime behavior changed:** yes, only by adding the opt-in standalone experimental userscript.

---

Historical pre-flight entries through PFC-2026-09-05-013 remain preserved in Git history at/before `732dae09e83d712a26ac383f7b64ce9e27e07a59`.
