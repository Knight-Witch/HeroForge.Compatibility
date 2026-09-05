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
- Witch Dock direct TRUE 4K/TRUE 8K buttons: **capture behavior passed** after cycling provider toggle;
- initial direct-button disabled state: **reproduced/diagnosed** as stale UI readiness after provider installed before Photo Booth opened;
- capture engine did not require change.

### Witch Dock Stable promotion

Public consumer commit: `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`.

- exact Dev-tested provider blob promoted: static parity confirmed by identical blob SHA;
- public readiness adapter: JavaScript syntax passed;
- public manifest: JSON parse passed;
- `Witch_Dock.user.js`: unchanged;
- `tools/Booth.js`: unchanged;
- clean public refresh smoke with temporary Dev/standalone scripts disabled: **pending**.

## Current public smoke checklist

1. Disable the temporary standalone v0.6 true-resolution userscript and WITCH_DEV_PHOTO loader.
2. Refresh HeroForge with normal public Witch Dock and current Lob/ADP enabled.
3. Open Photo Booth; Witch Dock High Resolution Capture buttons should become clickable without cycling the repair toggle.
4. Capture 4096 from HeroForge's existing Lob-injected resolution choice; verify correct true-4K output.
5. Capture 8192 from the same HeroForge UI; verify grouped true-8K behavior without whiteout.
6. Run Witch Dock direct TRUE 4K and TRUE 8K once each.
7. Verify a normal lower-resolution capture still works.
8. Disable/re-enable the repair control and verify upstream capture restoration/reinstallation.

## Other maintained milestones

- Corrected bound decal gizmo: Witch Dock Stable with Move/Rotate/Scale undo-redo and transform-state preservation validated.
- Character local JSON: core Save/Load passed live; repeated-use/lifecycle pending.
- Projected decal state/control: runtime path confirmed; renderer dependency audit pending.
