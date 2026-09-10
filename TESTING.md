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
- protected 8192x4096 atlas produced bodyLower/bodyUpper/face 2048px;
- valid 1024 human body masks loaded and pinned;
- body display UV, base color-bake UV, and decal-bake UV confirmed at protected size during successful runs;
- final user visual result: body texture correct, seams correct, paints/material channels correct, decals high-confidence correct (~95% due Booth appearance ambiguity);
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

### Standalone v0.1.1 correction

The corrected allocator:

- runs HeroForge's original `buildAtlas()` to establish the current native allocation baseline;
- derives a per-slot cap map from those native allocations;
- preserves unrelated slots at no more than their native allocation while permitting bodyLower/bodyUpper/face up to 2048;
- supplies that cap map to the 8192x4096 `CK.Atlas` constructor;
- retains the existing postcondition that any unrelated slot below native allocation aborts activation.

### Standalone v0.1.1 acceptance checklist

Pending from a clean HeroForge load:

1. Load Blood Moon with the script disabled; confirm native appearance.
2. Enable v0.1.1; confirm status reports protected 2048 active rather than allocator refusal.
3. Confirm body, seams, paints/material channels, and decals remain correct.
4. Confirm no visible unrelated armor/prop/kitbash texture regression.
5. Disable; confirm native atlas/appearance returns without page reload.
6. Re-enable; confirm repeated enable/disable is stable.
7. Switch to another figure while enabled; confirm the feature discovers that figure's own masks and reapplies rather than reusing prior mask objects.
8. Exercise edits that cause normal atlas/material refresh; confirm lifecycle watcher preserves/reapplies protected state without repeated-loop failures.
9. Confirm auto-disable/fail-closed behavior on a deliberately unavailable required capability if practical.
10. Reload with the standalone installed; confirm it remains disabled by default and does not mutate HeroForge until enabled.

Witch Dock Dev integration is blocked until this checklist passes.

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

Re-run the texture-quality suite when `CK.Atlas`, body mask/resource behavior, color-bake ownership, atlas allocation semantics, or current body metadata changes. Re-run the Photo Booth suite when the HeroForge build materially changes, named capture/Effects capabilities change, tile topology changes, or a native true-resolution Effects path appears. Lob-absent HeroForge-native resolution-menu injection remains a separate UI-adapter test track and does not reopen the validated capture-engine gate.

## Other maintained milestones

- Corrected bound decal gizmo: Witch Dock Stable with Move/Rotate/Scale undo-redo and transform-state preservation validated.
- Character local JSON: core Save/Load passed live; repeated-use/lifecycle pending.
- Projected decal state/control: runtime path confirmed; renderer dependency audit pending.
