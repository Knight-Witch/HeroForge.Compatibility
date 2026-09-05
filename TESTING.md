# Testing

Standalone-first validation precedes Witch Dock integration.

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
- existing Lob-injected HeroForge 8192 control -> Witch Dock provider -> grouped repaired capture: **passed perfectly**;
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

Re-run the Photo Booth suite when the HeroForge build materially changes, named capture/Effects capabilities change, tile topology changes, or a native true-resolution Effects path appears. Lob-absent HeroForge-native resolution-menu injection is a separate UI-adapter test track and does not reopen the validated capture-engine gate.

## Other maintained milestones

- Corrected bound decal gizmo: Witch Dock Stable with Move/Rotate/Scale undo-redo and transform-state preservation validated.
- Character local JSON: core Save/Load passed live; repeated-use/lifecycle pending.
- Projected decal state/control: runtime path confirmed; renderer dependency audit pending.
