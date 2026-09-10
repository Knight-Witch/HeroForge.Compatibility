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
- final manual user visual result before standalone packaging: body texture correct, seams correct, paints/material channels correct, decals high-confidence correct (~95% due Booth appearance ambiguity);
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

### Standalone v0.1.3 live result

v0.1.3 added adaptive atlas-area selection and persistent telemetry. On Blood Moon it passed the allocation gate but failed the renderer lifecycle gate.

Confirmed initial/quality behavior:

- the standalone selected the **8192x8192** fallback candidate;
- bodyLower/bodyUpper/face each resolved to **2048x2048**;
- valid 1024 body masks remained available/pinned;
- the user could see that decals had improved;
- paint/material color channels appeared correct;
- therefore the 2048 target and adaptive-area mechanism were not the source of the new visual corruption.

Confirmed Booth/lifecycle failure from live bridge inspection while the figure was visibly corrupted:

- `display.atlas`: **8192x8192** protected atlas;
- `modded.resourceAtlas`: **8192x4096** different atlas;
- feature state still reported enabled/active;
- `modded.buildAtlas` had reverted to HeroForge's native implementation, so the feature-owned wrapper was no longer installed;
- protected/display packing placed bodyLower/bodyUpper/face at pixel X offsets **0 / 2048 / 4096**;
- current resource-atlas packing placed bodyLower/bodyUpper/face at pixel X offsets **512 / 1024 / 1536**;
- visible display and color-bake material UVs matched the protected display atlas, proving that v0.1.3's width/height-only binding verification could call a split renderer state healthy;
- `colorBake.refresh(true)` and the atlas baker use `display.atlas` for UV/scissor/layout, while visible materials bind the baker's atlas render targets; the incompatible resource/display lifecycle state therefore cannot be treated as harmless metadata divergence;
- user-observed behavior matched the runtime state: Booth off temporarily removed the bizarre body/face blocks but exposed low-resolution native body/seams, then the v0.1.3 watcher restored the stale protected side and the corruption returned.

Result:

- adaptive protected-2048 allocation: **PASS**;
- visible decal improvement: **PASS**;
- paint/material-channel preservation in the observed state: **PASS / no corruption observed**;
- Booth renderer lifecycle coherence: **FAIL / diagnosed**;
- v0.1.3 is superseded by v0.1.4 and must not be promoted.

### Standalone v0.1.4 candidate

v0.1.4 keeps the proven quality recipe and changes the lifecycle contract:

- bodyLower/bodyUpper/face target remains 2048;
- current-figure valid body masks remain 1024;
- 8192x4096 remains the first detached candidate and 8192x8192 the only fallback;
- unrelated slots still may not fall below their exact pre-enable allocation;
- current `display` identity and `display.modded` identity are required session invariants;
- the current `modded.buildAtlas` function must be the exact wrapper owned by the session;
- `display.atlas`, `modded.resourceAtlas`, and the session's protected atlas must be the same object while the protected session is healthy;
- target display/color/decal bake materials must match the full X/Y/Z/W atlas UV location, not only a 2048-sized rectangle;
- a renderer/wrapper/atlas ownership replacement invalidates the old session instead of triggering blind stale-session reapply;
- recovery releases stale feature ownership, waits for the current HeroForge renderer identity/atlases/part signature to remain stable, aligns the visible display to HeroForge's current `resourceAtlas` through only `colorBake.invalidateCache()` + `colorBake.refresh(true)` when needed, waits again, and then creates a fresh protected session;
- two rapid recoveries within 30 seconds are allowed; further replacement in that burst auto-disables rather than fighting HeroForge indefinitely;
- exact pre-enable atlas-object restoration is used only while the original protected session still owns the current renderer. After HeroForge has replaced lifecycle ownership, disable returns the current renderer to coherent current-HeroForge resource/display state rather than forcing stale pre-transition atlas objects back onto it;
- telemetry adds `lastVerification`, wrapper ownership, modded/display identity, display/resource object identity, dimensions, and target packing/UV data.

Static validation:

- exact candidate userscript blob SHA: `5b2d52cefe4cd79916a241214cb4807036046309`;
- exact blob reproduced locally and `git hash-object` matched that SHA;
- `node --check` on that exact file: **PASS**;
- no `instantSettingsChange()`, `data.change()`, bundle patch, 4096-body target, or character-specific mask hard-code is introduced.

### Standalone v0.1.4 acceptance checklist

Pending from one clean Blood Moon page refresh after updating the standalone:

1. Confirm the installed script reports v0.1.4 and remains disabled by default.
2. Allow Blood Moon to settle, then enable once.
3. Bridge-confirm the selected atlas, BL/BU/face allocations, valid 1024 masks, wrapper ownership, and `display.atlas === modded.resourceAtlas === protectedAtlas` after activation.
4. Human-check body detail/seams, face, decals, paints/material channels, and obvious unrelated armor/prop/kitbash texture quality.
5. Toggle Photo Booth off and back on once. A temporary native transition is acceptable; persistent bizarre body/face texture blocks are not.
6. After Booth settles, bridge-confirm the feature either retained coherent ownership or performed one bounded fresh-session recovery and ended with coherent protected ownership. It must not blindly restore an obsolete session.
7. Disable and confirm the visible renderer returns to a coherent HeroForge/native state without requiring reload.
8. Re-enable and confirm repeated enable/disable is stable.
9. Switch to another figure while enabled and confirm fresh per-figure baseline/mask discovery rather than Blood Moon object/cap reuse.
10. Confirm ordinary atlas/part lifecycle changes do not create a recovery loop. If HeroForge repeatedly replaces ownership, the feature should auto-disable/fail closed.

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

Re-run the texture-quality suite when `CK.Atlas`, body mask/resource behavior, color-bake ownership, atlas allocation semantics, `display.modded`/`buildAtlas` lifecycle behavior, relevant GPU max texture capability, or current body metadata changes. Re-run the Photo Booth suite when the HeroForge build materially changes, named capture/Effects capabilities change, tile topology changes, or a native true-resolution Effects path appears. Lob-absent HeroForge-native resolution-menu injection remains a separate UI-adapter test track and does not reopen the validated capture-engine gate.

## Other maintained milestones

- Corrected bound decal gizmo: Witch Dock Stable with Move/Rotate/Scale undo-redo and transform-state preservation validated.
- Character local JSON: core Save/Load passed live; repeated-use/lifecycle pending.
- Projected decal state/control: runtime path confirmed; renderer dependency audit pending.
