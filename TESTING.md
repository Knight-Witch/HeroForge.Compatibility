# Testing

Standalone-first validation precedes Witch Dock integration.

## `rendering.texture-quality`

Runtime investigation target: live HeroForge `1.9.98` bundle family through 2026-09-11.

### Runtime mechanism proof

D4:

- valid native 1024 body masks confirmed;
- protected body/head 2048 allocation achieved;
- body skin/glyph color corrected after mask pinning;
- user visual result: body/decals materially improved and correct.

Blood Moon:

- severe native atlas pressure observed with body/head allocation downgrade;
- manual protected atlas states produced bodyLower/bodyUpper/face 2048px;
- valid 1024 human body masks loaded and pinned;
- body display UV, base color-bake UV, and decal-bake UV confirmed during successful manual runs;
- broad `instantSettingsChange()` rejected because of renderer/material corruption risk;
- detached 4096-body work remains experimental and is not an approved maintained target.

### Standalone v0.1.0-v0.1.2 diagnosis

- v0.1.0 failed closed because it omitted the `CK.Atlas` per-slot maximum allocation map.
- v0.1.1 added caps but used a freshly generated native-reference atlas, proving that recomputing native atlas state is not behavior-neutral on an extreme figure.
- v0.1.2 preserved the exact displayed pre-enable baseline. Its 8192x4096 protected candidate produced bodyLower/bodyUpper/face `1024/1024/2048` under the exact no-unrelated-regression budget.
- cloned target scale versus temporary live target scale produced the same result, ruling out scale-object identity.

### Standalone v0.1.3 live result

v0.1.3 added adaptive atlas area and reached bodyLower/bodyUpper/face 2048 using 8192x8192. Decal detail visibly improved, but Booth renderer lifecycle later replaced feature ownership.

Confirmed failure state:

- `display.atlas` remained the protected atlas;
- `modded.resourceAtlas` became a different native atlas;
- `modded.buildAtlas` reverted to HeroForge's native function;
- the two atlases used incompatible target packing locations;
- visible material UVs remained tied to the protected display atlas.

Result:

- protected-2048 allocation: **PASS**;
- visible decal improvement: **PASS**;
- renderer lifecycle coherence: **FAIL / diagnosed**;
- v0.1.3 superseded.

### Standalone v0.1.4 architecture

v0.1.4 retained the quality recipe and repaired lifecycle ownership:

- current display/modded identity required;
- exact protected `buildAtlas` wrapper ownership required;
- `display.atlas`, `modded.resourceAtlas`, and protected atlas must be the same object;
- full target X/Y/Z/W UV locations verified for display/color/decal materials;
- renderer ownership replacement invalidates the old session;
- recovery releases stale ownership, waits for current HeroForge renderer stability, aligns display to current resource atlas if needed, then creates a fresh protected session;
- repeated recovery is bounded and fails closed;
- exact pre-enable object restore is used only while the original session still owns the current renderer.

The v0.1.4 implementation itself is preserved as the lifecycle base for v0.1.5.

### 2026-09-11 rectangular candidate sweep

#### Invalid first sweep

The first rectangular sweep was run after v0.1.4 had already been disabled. Disable had restored bodyLower/bodyUpper/face `bakeSize` to 1024. Because `CK.Atlas.getTargetTextureSize()` cannot exceed a part's bake ceiling, that sweep could not evaluate the intended 2048 protected target and is **invalid for candidate selection**.

#### Corrected detached sweep

The corrected sweep temporarily reproduced the actual standalone pre-build metadata inside one bounded Power run and restored it before returning:

- bodyLower/bodyUpper/face `bakeSize=2048`;
- `_usedTextureSize=1024`;
- target cloned scale = 4;
- exact current displayed baseline caps.

Results:

| Atlas | BL | BU | Face | Unrelated regressions | Result |
|---|---:|---:|---:|---:|---|
| 8192x4096 | 1024 | 1024 | 2048 | 116 | FAIL |
| 8192x5120 | 1024 | 1024 | 2048 | 116 | FAIL |
| 8192x6144 | 2048 | 2048 | 2048 | 0 | PASS |
| 8192x7168 | 2048 | 2048 | 2048 | 0 | PASS |
| 8192x8192 | 2048 | 2048 | 2048 | 0 | PASS detached only |

Conclusion: **8192x6144 is the smallest tested safe candidate** for the current Blood Moon baseline.

### Live 8192x6144 acceptance

A reversible Power-only live test applied 8192x6144 with the maintained target/mask policy.

Structural checks:

- bodyLower/bodyUpper/face = 2048x2048: **PASS**;
- unrelated allocation regressions = 0: **PASS**;
- bodyLower/bodyUpper masks = valid 1024px resources: **PASS**;
- `display.atlas === modded.resourceAtlas`: **PASS**;
- atlas dimensions = 8192x6144 on both references: **PASS**;
- target display material UV bindings: **PASS**;
- target color-bake UV bindings: **PASS**;
- available target decal-bake UV bindings: **PASS**.

Human visual checks from Amanda:

1. body/skin/material colors correct: **PASS**;
2. glyphs/paint correct: **PASS**;
3. no weird blocked/corrupted body or face textures: **PASS**;
4. body seams good: **PASS**;
5. decals sharp/high-resolution: **PASS**.

The temporary live state was then rolled back through its captured snapshot. Follow-up bridge verification reported display 8192x4096, resource 8192x4096, and exact same atlas object: **PASS**.

### Standalone v0.1.5 candidate

v0.1.5 keeps all v0.1.4 lifecycle behavior and changes only the maintained atlas-area policy plus corresponding UI/build metadata:

- candidate order: `8192x4096`, `8192x5120`, `8192x6144`, `8192x7168`;
- select the first candidate reaching all three 2048 targets with zero unrelated regression;
- no maintained 8192x8192 fallback;
- fail closed if no bounded candidate qualifies;
- 1024 body masks, exact baseline caps, ownership invariants, full UV checks, recovery bounds, and restore behavior remain unchanged.

### Standalone v0.1.5 acceptance checklist

Pending after installing the committed v0.1.5 standalone:

1. Confirm installed script reports v0.1.5 / `0.1.5-protected-2048-rectangular-atlas` and remains disabled by default.
2. Allow Blood Moon to settle, then enable once.
3. Bridge-confirm selected atlas, BL/BU/face allocations, valid 1024 masks, wrapper ownership, and `display.atlas === modded.resourceAtlas === protectedAtlas`.
4. Confirm the selected candidate is the smallest passing one; on the equivalent current Blood Moon baseline this is expected to be 8192x6144.
5. Human-check body detail/seams, face, decals, paints/material channels, and obvious unrelated texture quality.
6. Toggle Photo Booth off and back on once. Persistent bizarre body/face texture blocks are not acceptable.
7. After Booth settles, bridge-confirm coherent ownership or one bounded fresh-session recovery; obsolete sessions must not be blindly restored.
8. Disable and confirm coherent HeroForge/native restore without reload.
9. Re-enable and confirm repeated enable/disable stability.
10. Switch to another figure while enabled and confirm fresh per-figure baseline/mask discovery rather than Blood Moon object/cap reuse.
11. Confirm ordinary atlas/part lifecycle changes do not create a recovery loop. If HeroForge repeatedly replaces ownership, the feature should auto-disable/fail closed.
12. Observe normal interaction/performance long enough to catch obvious 6144 render-target regressions.

Witch Dock Dev integration remains blocked until this checklist passes.

## `media.screenshot-resolution`

HeroForge build: `heroforge07.1.9.98`.

### Standalone baseline

- TRUE 4096 one-source adaptive phase feed: passed mechanically and visually.
- TRUE 8192 grouped four-shifted-4096 source design: passed mechanically and visually; user reported it worked perfectly and was easy on the GPU.
- Combined standalone v0.6 TRUE 4K regression: passed.
- Combined standalone v0.6 TRUE 8K regression: passed perfectly.
- One-shot maintained 8192 Effects path: rejected due repeated white renderer-reset/blank output.

### Witch Dock Dev / Stable

- Lob-present HeroForge 4096 route through Witch Dock provider: **passed perfectly**.
- Lob-present HeroForge 8192 grouped route: **passed perfectly**.
- Witch Dock direct TRUE 4K/TRUE 8K: **passed**.
- Public promotion commit: `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`.
- Clean public smoke passed both HeroForge/Lob routes and both Witch Dock direct routes.
- Stable gate: **closed / validated**.

## Future regression triggers

Re-run the texture-quality suite when `CK.Atlas`, body mask/resource behavior, color-bake ownership, atlas allocation semantics, `display.modded`/`buildAtlas` lifecycle behavior, GPU max texture capability, current body metadata, WebGL/render-target dimension behavior, or relevant HeroForge build topology changes.

Re-run the Photo Booth suite when the HeroForge build materially changes, named capture/Effects capabilities change, tile topology changes, or a native true-resolution Effects path appears.

## Other maintained milestones

- Corrected bound decal gizmo: Witch Dock Stable with Move/Rotate/Scale undo-redo and transform-state preservation validated.
- Character local JSON: core Save/Load passed live; repeated-use/lifecycle pending.
- Projected decal state/control: runtime path confirmed; renderer dependency audit pending.
