# Changelog

## HFC-2026-09-12-023 — Add canonical texture investigation checkpoint

Date: 2026-09-12

### Summary

Adds a durable cross-chat checkpoint for the active Blood Moon texture/material investigation so future continuation chats do not repeat already-completed probes or silently reopen ruled-out theories.

The checkpoint records the current good-resolution/no-poop baseline, binding `DO NOT REPEAT` exclusions, the newly mapped meteor-hammer family, corrected Nova 3 channel assignments, current paint/palette coherence findings, and the next allowed investigation direction around exact visible patch mapping and renderer-generation reconciliation.

### Runtime behavior changed

None. Documentation-only update. No HeroForge runtime state, standalone script, Witch Dock code, `/legacy/`, or bundle patch changed.

### Touched files

- `docs/investigations/INV-0004-current-state-2026-09-12.md`
- `CHANGELOG.md`

---

## HFC-2026-09-11-022 — Replace 8192² texture fallback with validated rectangular atlas ladder

Date: 2026-09-11

### Summary

Advances the experimental `rendering.texture-quality` standalone to v0.1.5 after a corrected rectangular-atlas investigation established that the current Blood Moon scene does not require the previous 8192x8192 fallback. The smallest tested candidate that reaches bodyLower/bodyUpper/face 2048 while preserving every unrelated pre-enable allocation is **8192x6144**.

v0.1.5 preserves all v0.1.4 renderer lifecycle/ownership safeguards and changes only the bounded atlas-area selection policy plus matching UI/build metadata.

### Confirmed diagnosis / validation

- v0.1.4-style 8192x4096 allocation on the current Blood Moon baseline produces bodyLower/bodyUpper/face `1024/1024/2048` and 116 unrelated allocation regressions.
- A first detached rectangular sweep performed after v0.1.4 disable was invalid because disable had already restored target `bakeSize` ceilings to 1024. Since `CK.Atlas.getTargetTextureSize()` clamps at the baked ceiling, that sweep could not evaluate the intended 2048 protected target.
- A corrected detached sweep temporarily reproduced the actual protected pre-build metadata (`bakeSize=2048`, `_usedTextureSize=1024`) and restored it transactionally.
- Corrected sweep results:
  - 8192x4096 -> `1024/1024/2048`, 116 unrelated regressions;
  - 8192x5120 -> `1024/1024/2048`, 116 unrelated regressions;
  - 8192x6144 -> `2048/2048/2048`, zero unrelated regressions;
  - 8192x7168 -> `2048/2048/2048`, zero unrelated regressions;
  - 8192x8192 -> `2048/2048/2048`, zero unrelated regressions.
- 8192x6144 is therefore the smallest tested safe candidate for the current Blood Moon allocation budget.
- A reversible live 8192x6144 test passed exact target allocations, valid current-figure 1024 masks, zero unrelated regressions, exact display/resource atlas object identity, and full display/color/decal UV binding coherence.
- Amanda visually confirmed correct body/skin/material colors, correct glyphs/paint, no blocked/corrupted body or face textures, good body seams, and sharp/high-resolution decals.
- The temporary live state was rolled back through its captured snapshot; bridge verification confirmed coherent display/resource 8192x4096 state using the same atlas object afterward.
- 8192x8192 is not proven to be the direct cause of prior visual corruption, but it is no longer justified as a maintained fallback because 8192x6144 already satisfies the full current contract with less atlas area.

### Runtime behavior changed

Standalone v0.1.5 only:

- version/build advances to `0.1.5-protected-2048-rectangular-atlas`;
- detached candidate order becomes `8192x4096`, `8192x5120`, `8192x6144`, `8192x7168`;
- the first candidate reaching all three protected 2048 allocations with zero unrelated regression is selected;
- 8192x8192 is removed from the maintained fallback list;
- failure remains fail-closed if none of the bounded candidates qualify;
- valid 1024 body-mask handling is unchanged;
- exact displayed-baseline cap derivation is unchanged;
- renderer/display/modded identity checks are unchanged;
- exact protected `buildAtlas` wrapper ownership is unchanged;
- exact display/resource/protected atlas object identity is unchanged;
- full target display/color/decal UV-location verification is unchanged;
- stale-session invalidation, bounded settle/recovery, current-resource coherence hand-off, and exact-safe restore behavior are unchanged;
- UI detail text now describes bounded rectangular candidate selection instead of 8192x8192 fallback mode.

No `instantSettingsChange()`, `data.change()`, bundle patch, 4096 body target, character-specific mask hard-code, `/legacy/` modification, or Witch Dock change is introduced.

### Validation status

- corrected detached rectangular sweep: **PASS**;
- 8192x6144 target allocation / no-regression gate: **PASS**;
- live 8192x6144 valid 1024 mask check: **PASS**;
- live 8192x6144 display/resource atlas identity: **PASS**;
- live 8192x6144 display/color/decal UV coherence: **PASS**;
- live 8192x6144 human visual acceptance: **PASS** across colors/materials, glyphs/paint, body/face sampling, seams, and decal sharpness;
- temporary live-test rollback to coherent 8192x4096 baseline: **PASS**;
- actual standalone v0.1.5 clean activation: **pending after install/update**;
- Booth off/on lifecycle recovery: **pending**;
- disable/re-enable lifecycle: **pending**;
- figure-change lifecycle: **pending**;
- Witch Dock Dev: **not started / still blocked**.

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

## HFC-2026-09-10-021 — Repair protected texture atlas lifecycle coherence

Date: 2026-09-10

### Summary

Repairs the standalone `rendering.texture-quality` lifecycle failure exposed by the first successful v0.1.3 Blood Moon activation. v0.1.3 proved the adaptive allocator can reach the maintained 2048 body/head target, but a subsequent Photo Booth renderer transition replaced protected atlas ownership while leaving the old protected display atlas active. The resulting incompatible display/resource atlas layouts produced severe coherent-but-wrong body/face textures.

### Runtime behavior changed

Standalone v0.1.4 added hard renderer/modded/wrapper/atlas ownership checks, exact protected atlas object identity, full target UV-location verification, stale-session invalidation, bounded wait-for-current-renderer recovery, and coherent current-resource hand-off before creating a fresh protected session.

### Validation status

- v0.1.3 protected allocation: **PASS**;
- v0.1.3 Booth renderer lifecycle: **FAIL / diagnosed**;
- exact v0.1.4 candidate blob SHA: `5b2d52cefe4cd79916a241214cb4807036046309`;
- v0.1.4 syntax/static packaging: **PASS**;
- later allocation policy superseded by v0.1.5 rectangular ladder after 2026-09-11 runtime validation.

---

## HFC-2026-09-10-020 — Add adaptive atlas-area selection and persistent texture diagnostics

Date: 2026-09-10

### Summary

Responded to the v0.1.2 Blood Moon allocation failure by adding adaptive detached atlas-area selection plus persistent bridge-readable diagnostics/error state.

### Confirmed diagnosis

- v0.1.2 baseline 8192x4096 produced bodyLower/bodyUpper/face `1024/1024/2048`.
- cloned versus temporary-live target scale produced the same result, ruling out scale-object identity.
- more packing area was the supported next variable.

### Runtime behavior changed

Standalone v0.1.3 tested 8192x4096 then 8192x8192, selected the smallest passing candidate, retained valid 1024 body masks, and added persistent bounded telemetry/error latch.

---

## HFC-2026-09-10-019 — Use exact pre-enable atlas baseline for protected textures

Date: 2026-09-10

### Summary

Changed the transaction boundary to preserve the exact displayed pre-enable atlas/resource objects instead of calling native `buildAtlas()` to synthesize a reference. This made rollback behavior-neutral and produced useful exact-baseline allocation diagnostics.

---

## HFC-2026-09-10-018 — Fix protected texture allocator to preserve native slot budgets

Date: 2026-09-10

### Summary

Confirmed the `CK.Atlas` fourth constructor argument is a per-slot maximum allocation map and corrected the standalone to preserve unrelated slot budgets while allowing bodyLower/bodyUpper/face up to 2048.

---

## HFC-2026-09-10-017 — Add experimental protected texture-quality standalone

Date: 2026-09-10

### Summary

Added the first opt-in standalone implementation of `rendering.texture-quality` from the manually validated D4/Blood Moon protected-2048 mechanism. Public Witch Dock remained unchanged.

---

Historical changelog entries through HFC-2026-09-05-016 remain preserved in Git history at/before `732dae09e83d712a26ac383f7b64ce9e27e07a59`.
