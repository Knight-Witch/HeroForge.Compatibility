# Testing

Standalone-first validation precedes Witch Dock integration.

## `rendering.texture-quality`

Runtime investigation target: live HeroForge `1.9.98` bundle family through 2026-09-10.

### Runtime mechanism proof

D4:

- valid native 1024 body masks confirmed;
- protected body/head 2048 allocation achieved;
- body skin/glyph color corrected after mask pinning;
- user visual result: body/decals materially improved and correct.

Blood Moon:

- native pressure state observed at 4096x4096 atlas, bodyLower/bodyUpper 256px, face 512px;
- manual protected atlas states produced bodyLower/bodyUpper/face 2048px;
- valid 1024 human body masks loaded and pinned;
- body display UV, base color-bake UV, and decal-bake UV confirmed at protected size during successful manual runs;
- final manual user visual result: body texture correct, seams correct, paints/material channels correct, decals high-confidence correct (~95% due Booth appearance ambiguity);
- user additionally reported no apparent degradation elsewhere on the figure with protected body/head 2048 active;
- detached 4096-body/8192x8192 layout packed successfully but is not an approved maintained target.

Rejected/negative probes:

- nonexistent 2048 body mask URLs -> load failure/fallback and wrong derived body colors;
- `hiRezNormalMaps` -> no useful seam fix;
- `seamFin` -> no useful seam fix;
- `maxTextures` -> not the body stack solution;
- broad `instantSettingsChange()` -> unacceptable derived renderer/material corruption risk.

### Standalone v0.1.0 result

Clean Blood Moon load with standalone initially disabled:

- native appearance/control path: reached;
- enable attempt: **FAIL**, with `Protected atlas could not allocate 2048px for bodyLower.`;
- fail-closed behavior: **PASS mechanically** — toggle returned off and body/head bake ceilings were restored to native 1024 values;
- diagnosis: `CK.Atlas` fourth constructor argument is the per-slot maximum allocation map; v0.1.0 omitted it, allowing unrelated slots to compete at ideal resolution and forcing the global packer to step the protected body allocation below 2048.

### Standalone v0.1.1 result

v0.1.1 added per-slot caps derived from a newly generated native-reference atlas, but the clean Blood Moon enable attempt still returned the same bodyLower allocation refusal.

Post-failure read-only runtime snapshot:

- active atlas: 8192x4096;
- `modded.resourceAtlas`: 8192x4096;
- bodyLower/bodyUpper/face `bakeSize`: 1024;
- bodyLower/bodyUpper/face `_usedTextureSize`: 1024;
- no bodyLower/bodyUpper/face entries persisted in `character.data.atlasScale`.

Conclusion:

- metadata rollback worked;
- atlas rollback did **not** preserve the actual pre-enable allocation state;
- calling HeroForge's original `buildAtlas()` to establish/restore the safety baseline can itself generate a different atlas on an extreme figure;
- a recomputed native atlas is therefore not a valid behavior-neutral reference for this feature.

### Standalone v0.1.2 result

v0.1.2 changed the transaction boundary to capture the exact currently displayed atlas and exact current `modded.resourceAtlas`, derive unrelated-slot caps directly from that displayed pre-enable atlas, and restore those exact objects on failure/disable.

Blood Moon initial activation still failed, but the failure was now diagnostic rather than ambiguous:

- pre-enable baseline atlas: **8192x4096**;
- protected candidate: **8192x4096**;
- bodyLower allocation: **1024**;
- bodyUpper allocation: **1024**;
- face allocation: **2048**;
- exact pre-enable state restoration: **retained by the v0.1.2 transaction design**;
- visible error retention: **FAIL** — the disabled watcher replaced the failure panel with the normal Ready state on its next tick, despite the failure remaining available in diagnostics.

A detached A/B runtime test then compared the same 8192x4096 construction with target scale entries supplied through a cloned scale object versus temporarily written to live `character.data.atlasScale`. Both returned **BL 1024 / BU 1024 / face 2048**, ruling out scale-object identity as the missing requirement.

Conclusion: under the exact pre-enable no-regression caps, current Blood Moon needs more atlas packing area if 2048 body/head is to be protected without sacrificing unrelated pre-enable allocations.

### Standalone v0.1.3 candidate

v0.1.3 keeps the maintained quality target at 2048 and changes only atlas-area selection/diagnostics:

- capture the exact current displayed/resource atlas baseline before mutation;
- load/pin each current figure's own valid 1024 body masks;
- raise bodyLower/bodyUpper/face bake ceilings to 2048 and hold source `_usedTextureSize` at 1024;
- construct **8192x4096 detached first** with per-slot caps based on the exact pre-enable allocations;
- if it cannot produce BL/BU/face 2048 with zero unrelated allocation regressions, construct **8192x8192 detached** as the only fallback candidate;
- assign only the smallest passing candidate;
- keep 4096-body allocation out of scope;
- preserve the reversible `buildAtlas` wrapper, narrow color-bake refresh, exact rollback, part-set fingerprinting, lifecycle reapply/auto-disable behavior;
- latch the last error visibly until another explicit enable attempt, explicit clear, or reload;
- expose bounded plain-data `attemptHistory`, `timeline`, `diagnostics`, and `lastError` for HF-Chat-Bridge inspection.

Static validation:

- v0.1.3 JavaScript syntax: **PASS** (`node --check`) on the prepared source;
- GitHub runtime blob was fetched back and reviewed before commit packaging.

### Standalone v0.1.3 acceptance checklist

Pending from one clean Blood Moon page refresh:

1. Confirm the installed script reports v0.1.3 and remains disabled by default.
2. Allow Blood Moon to settle, then enable once.
3. Do not stack further texture mutations. Read `window.HFProtectedTextureQualityTest.attemptHistory`, `diagnostics`, `lastError`, and `timeline` through HF-Chat-Bridge after the attempt.
4. If activation fails, confirm the last error remains visible and the exact pre-enable state is restored; use the captured candidate rows for the next diagnosis.
5. If activation succeeds, confirm reported selected atlas and BL/BU/face allocations are 2048 and no unrelated allocation regression was recorded.
6. Human-check body detail, seams, paints/material channels, decals, and obvious unrelated armor/prop/kitbash texture quality.
7. Disable and confirm the exact pre-enable atlas/appearance returns without reload.
8. Re-enable and confirm repeated enable/disable is stable.
9. Switch to another figure while enabled and confirm a fresh per-figure baseline/mask discovery occurs rather than reusing Blood Moon objects/caps.
10. Exercise an ordinary part-set/atlas lifecycle change and confirm reinitialization/reapply does not loop or corrupt paints.

Witch Dock Dev integration remains blocked until this checklist passes.

## `media.screenshot-resolution`

HeroForge build: `heroforge07.1.9.98`.

### Standalone baseline

- TRUE 4096 one-source adaptive phase feed: passed mechanically and visually.
- TRUE 8192 grouped four-shifted-4096 source design: passed mechanically and visually; user reported it worked perfectly and was very easy on the GPU.
- Combined standalone v0.6 TRUE 4K regression: passed.
- Combined standalone v0.6 TRUE 8K regression: passed perfectly.
- One-shot maintained 8192 Effects path: rejected due repeated white renderer-reset/blank output.
- Sandbox/page-context, minimal packaging, and alternate export method: rejected as root-cause fixes.

### Witch Dock Dev integration

WITCH_DEV_PHOTO provider build `0.7.0-witch-dock-dev-provider` with current Lob/ADP present:

- existing Lob-injected HeroForge 4096 control -> Witch Dock provider -> repaired capture: **passed perfectly**;
- existing Lob-injected HeroForge 8192 grouped capture -> Witch Dock provider: **passed perfectly**;
- Witch Dock direct TRUE 4K/TRUE 8K capture behavior: **passed**;
- initial direct-button disabled state: **reproduced/diagnosed** as stale UI readiness after provider installed before Photo Booth opened;
- capture engine did not require change.

### Witch Dock Stable validation

Public consumer promotion: `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`.

Static/public preparation:

- exact Dev-tested provider blob promoted: parity confirmed by identical blob SHA;
- public readiness adapter: JavaScript syntax passed;
- public manifest: JSON parse passed;
- `Witch_Dock.user.js`: unchanged;
- `tools/Booth.js`: unchanged.

Clean public smoke with temporary Dev/standalone scripts disabled:

- direct Witch Dock buttons became usable without cycling the repair toggle: **passed**;
- HeroForge/Lob 4096 -> public Witch Dock provider: **passed perfectly**;
- HeroForge/Lob 8192 -> public grouped provider: **passed perfectly**;
- public Witch Dock direct TRUE 4K: **passed perfectly**;
- public Witch Dock direct TRUE 8K: **passed perfectly**;
- user overall public result: **works perfectly**.

Stable gate: **closed / validated**.

## Future regression triggers

Re-run the texture-quality suite when `CK.Atlas`, body mask/resource behavior, color-bake ownership, atlas allocation semantics, relevant GPU max texture capability, or current body metadata changes. Re-run the Photo Booth suite when the HeroForge build materially changes, named capture/Effects capabilities change, tile topology changes, or a native true-resolution Effects path appears. Lob-absent HeroForge-native resolution-menu injection remains a separate UI-adapter test track and does not reopen the validated capture-engine gate.

## Other maintained milestones

- Corrected bound decal gizmo: Witch Dock Stable with Move/Rotate/Scale undo-redo and transform-state preservation validated.
- Character local JSON: core Save/Load passed live; repeated-use/lifecycle pending.
- Projected decal state/control: runtime path confirmed; renderer dependency audit pending.
