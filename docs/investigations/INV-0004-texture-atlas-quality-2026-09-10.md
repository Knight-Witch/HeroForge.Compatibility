# INV-0004 — Texture Atlas Quality / Protected Body Resolution

Date: 2026-09-08 through 2026-09-11  
Status: protected-2048 mechanism confirmed; 8192x6144 rectangular protected layout structurally and visually validated; standalone v0.1.5 lifecycle acceptance next  
Feature candidate: `rendering.texture-quality`

## Problem

HeroForge can reduce texture-atlas allocations dramatically on complex figures. The visible result includes soft body textures, more obvious body seams, and lower-detail decals. The threshold is not simply polygon/kitbash count; atlas pressure can change sharply as particular parts are added.

A separate historical account/session-specific quality complaint exists, but this investigation only claims the mechanisms directly confirmed in current runtime.

## Confirmed findings

### Native atlas pressure

Blood Moon, an extreme-complexity figure, has been directly observed in a low-quality state with sharply reduced body/head allocations. D4 can load with substantially healthier native allocations, demonstrating that the downgrade is scene/allocation dependent rather than one fixed global resolution.

### Protected 2048 allocation

Manually constructed protected `CK.Atlas` states, with bodyLower/bodyUpper/face priority/scale set to 4 and their bake ceilings at 2048, can produce:

- bodyLower: 2048x2048;
- bodyUpper: 2048x2048;
- face: 2048x2048.

Display material UV, base color-bake UV, and decal-bake UV have been confirmed against protected allocations during successful manual runs.

### Body mask hazard

The body mask path has mutable `_usedTextureSize` state. Experimental 2048 requests produced nonexistent URLs such as `humanToes_mask_2048.webp` and `human_mask_2048.webp`; HeroForge can then fall back to an invalid gray mask and corrupt body paint/glyph output even though saved character data is unchanged.

Resetting the source size to 1024, loading the real 1024 masks, and pinning them through `masksMapOverride` corrected body skin/glyph colors. The maintained feature therefore protects destination atlas allocation at 2048 while keeping valid body mask inputs at 1024.

### Broad rebuild path is unsafe

`CK.character.instantSettingsChange()` invokes broad character/display sequencing and correlated with unacceptable renderer/material-channel corruption during experiments. It is rejected for this feature.

The maintained path is narrow: protected atlas construction/assignment plus `colorBake.invalidateCache()` and `colorBake.refresh(true)`.

### Decal source resolution is mixed

Some Blood Moon decal source assets are 2048 while others are 512. Protected destination allocation prevents additional atlas downsampling but cannot create source detail that does not exist.

### Standalone v0.1.2 established the 8192x4096 area constraint

v0.1.2 used the exact displayed pre-enable atlas as its safety baseline. On the current Blood Moon allocation budget, the protected 8192x4096 candidate produced bodyLower/bodyUpper/face `1024/1024/2048`. A cloned target-scale object and temporary live scale entries produced the same result, ruling out scale-object identity as the missing requirement.

The supported variable became atlas packing area, not broader settings mutation or a higher body-resolution target.

### Standalone v0.1.3 proved allocation but exposed renderer lifecycle split

v0.1.3 selected 8192x8192 and reached bodyLower/bodyUpper/face 2048. Decal detail improved visibly. Later, Booth/HeroForge lifecycle replaced the feature-owned builder/resource state while the protected display atlas remained active.

Live inspection in the corrupted state confirmed:

- `display.atlas` remained the protected 8192x8192 atlas;
- `modded.resourceAtlas` had become a different 8192x4096 atlas;
- `modded.buildAtlas` had reverted to HeroForge's native implementation;
- the incompatible atlases used different target packing locations;
- visible target materials still matched the protected-display UV layout.

This explained the coherent-but-wrong body/face blocks. Booth off temporarily produced a coherent native/low-resolution state; the old v0.1.3 watcher then blindly reintroduced the stale protected side. The failure was renderer lifecycle ownership/coherence, not a reason to abandon the 2048 target.

### Standalone v0.1.4 repaired lifecycle ownership rules

v0.1.4 retained the 1024-mask / 2048-target recipe and added:

- current display/modded identity as session invariants;
- exact protected `buildAtlas` wrapper ownership;
- exact object identity between `display.atlas`, `modded.resourceAtlas`, and the protected atlas;
- full X/Y/Z/W target UV verification;
- stale-session invalidation after ownership replacement;
- bounded wait-for-current-renderer stabilization;
- current resource/display coherence hand-off followed by a fresh protected session;
- bounded recovery with fail-closed auto-disable.

The remaining concern was that its only larger-area fallback was 8192x8192, which doubled full atlas area relative to 8192x4096 and had been present in visually bad experimental states. Atlas area itself was not proven to be the corruption cause, but retaining 8192x8192 was unnecessary if a smaller rectangle could satisfy the contract.

## 2026-09-11 rectangular atlas investigation

### First sweep was invalid

A first detached sweep tested 8192 heights 4096, 5120, 6144, 7168, and 8192 after v0.1.4 had already been disabled. Disable had restored target `bakeSize` values to 1024.

Because `CK.Atlas.getTargetTextureSize()` clamps desired size at each part's baked ceiling, this sweep could not meaningfully test 2048 body protection. Its `targetOk=false` results were therefore invalid for candidate selection. This is recorded explicitly so the false conclusion is not reused.

### Corrected detached sweep

The corrected sweep reproduced the standalone's actual pre-build target metadata inside a bounded Power call:

- bodyLower/bodyUpper/face `bakeSize=2048`;
- bodyLower/bodyUpper/face `_usedTextureSize=1024`;
- target cloned scale = 4;
- exact current displayed baseline allocation caps;
- all temporary metadata restored before the probe returned.

Results:

| Candidate | BL / BU / Face | Unrelated regressions | Result |
|---|---|---:|---|
| 8192x4096 | 1024 / 1024 / 2048 | 116 | reject |
| 8192x5120 | 1024 / 1024 / 2048 | 116 | reject |
| 8192x6144 | 2048 / 2048 / 2048 | 0 | pass |
| 8192x7168 | 2048 / 2048 / 2048 | 0 | pass |
| 8192x8192 | 2048 / 2048 / 2048 | 0 | pass |

This proves 8192x6144 is the smallest tested safe candidate for the current Blood Moon baseline under the feature's exact no-unrelated-regression contract.

### Live 8192x6144 structural validation

A reversible Power-only live test then applied the same maintained recipe using 8192x6144. It passed:

- bodyLower/bodyUpper/face = 2048x2048;
- zero unrelated allocation regressions;
- valid 1024 bodyLower/bodyUpper masks;
- `display.atlas === modded.resourceAtlas` using the same 8192x6144 object;
- target display material UVs correct;
- target color-bake UVs correct;
- available target decal-bake UVs correct.

The exact recorded result was:

`{"ok":true,"atlas":[8192,6144],"targets":[[2048,2048],[2048,2048],[2048,2048]],"regs":0,"masks":[1024,1024],"sameAtlas":true,"bindings":true}`

### Human visual acceptance

Amanda confirmed the live 8192x6144 state had:

- correct body/skin/material colors;
- correct glyphs/paint;
- no blocked/corrupted body or face textures;
- correct body seams;
- sharp/high-resolution decals.

The temporary live test was then rolled back through its captured snapshot. Bridge verification confirmed coherent display/resource restoration at 8192x4096 using the same atlas object.

## Supported inference

The general HeroForge quality downgrade experienced by complex scenes is primarily an atlas-allocation pressure policy: destination regions are reduced sharply to make the atlas fit. Protecting body/head allocations while increasing atlas packing area only as needed avoids that downgrade on the tested states.

For the current Blood Moon exact pre-enable allocation budget, 8192x4096 and 8192x5120 are insufficient under the no-unrelated-regression contract, while 8192x6144 is sufficient. Therefore v0.1.5 can remove the unnecessary 8192x8192 maintained fallback without weakening the quality/safety contract.

The severe coherent-but-wrong body/face blocks seen under v0.1.3 remain strongly supported as a renderer lifecycle coherence failure. 8192x8192 atlas area correlated with poor performance/visual experimental states but is not proven as the direct corruption cause.

## Not proven

- The January GPU-crash/account-specific quality change has not been proven to share the same root cause.
- The exact internal trigger that decides native atlas dimensions for every scene is not fully mapped.
- The exact Booth callback that replaces/resets `modded.buildAtlas` ownership has not been reduced to one named lifecycle method; the maintained feature detects resulting ownership/state transitions instead.
- The actual standalone v0.1.5 lifecycle behavior has not yet passed Booth off/on, disable/re-enable, or figure-change acceptance.
- Long-session memory/performance behavior remains open.
- Non-power-of-two 6144 atlas height is current-runtime validated but should be revalidated if HeroForge changes atlas/render-target assumptions.

## Maintained direction

Proceed with standalone v0.1.5 while preserving v0.1.4 lifecycle-coherence architecture:

- normal atlas mode;
- bodyLower/bodyUpper/face target 2048;
- figure-specific valid 1024 body masks;
- exact pre-enable per-slot allocation baseline/caps;
- detached candidate ladder 8192x4096 -> 8192x5120 -> 8192x6144 -> 8192x7168;
- select the smallest candidate with exact target allocations and zero unrelated regression;
- fail closed if no bounded candidate qualifies;
- no maintained 8192x8192 fallback;
- narrow color-bake refresh only;
- exact renderer/wrapper/atlas ownership invariants;
- full target UV offset/scale verification;
- stale-session invalidation on lifecycle replacement;
- wait-for-current-renderer stability, current-resource/display coherence hand-off, then fresh protected-session recovery;
- bounded recovery with fail-closed auto-disable;
- persistent bounded diagnostics/error latch.

Do not integrate into Witch Dock until the actual standalone v0.1.5 passes clean activation, Booth lifecycle, disable/re-enable, figure-change, visual correctness, and acceptable performance behavior.
