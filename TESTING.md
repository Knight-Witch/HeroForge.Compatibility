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

### Standalone v0.1.0 acceptance checklist

Pending from a clean HeroForge load:

1. Load a normal/moderate figure with the script disabled; confirm native appearance.
2. Enable the standalone; confirm status reports 8192x4096 and protected 2048 body/head.
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
- existing Lob-injected HeroForge 8192 grouped capture -> Witch Dock provider -> repaired capture: **passed perfectly**;
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
