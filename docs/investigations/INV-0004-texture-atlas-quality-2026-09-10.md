# INV-0004 — Texture Atlas Quality / Protected Body Resolution

Date: 2026-09-08 through 2026-09-10  
Status: protected-2048 mechanism confirmed; standalone v0.1.3 lifecycle failure diagnosed; v0.1.4 lifecycle-coherence validation next  
Feature candidate: `rendering.texture-quality`

## Problem

HeroForge can reduce texture-atlas allocations dramatically on complex figures. The visible result includes soft body textures, more obvious body seams, and lower-detail decals. The threshold is not simply polygon/kitbash count; atlas pressure can change sharply as particular parts are added.

A separate historical account/session-specific quality complaint exists, but this investigation only claims the mechanisms directly confirmed in current runtime.

## Confirmed findings

### Native atlas pressure

Blood Moon, an extreme-complexity figure, was directly observed in a clean low-quality state with:

- atlas: 4096x4096;
- bodyLower: 256x256;
- bodyUpper: 256x256;
- face: 512x512.

This directly explains the visible "potato" body/decal result on that figure.

D4 could load with substantially healthier native allocations, demonstrating that the downgrade is scene/allocation dependent rather than one fixed global resolution.

### Protected 2048 allocation

Manually constructed protected `CK.Atlas` states, with bodyLower/bodyUpper/face priority/scale set to 4 and their bake ceilings at 2048, produced:

- bodyLower: 2048x2048;
- bodyUpper: 2048x2048;
- face: 2048x2048.

Display material UV, base color-bake UV, and decal-bake UV were confirmed against the protected allocation during successful manual runs.

### Body mask hazard

The body mask path has mutable `_usedTextureSize` state and only increases unless explicitly reset. Experimental 2048 requests produced URLs such as:

- `bodyLower/.../humanToes_mask_2048.webp`
- `bodyUpper/.../human_mask_2048.webp`

Those assets failed to load. HeroForge then used a gray fallback mask, causing wrong body paint/glyph results even though saved character paints/decals were unchanged.

Resetting the source size to 1024, loading the real 1024 masks, and pinning them through `masksMapOverride` corrected D4's body skin/glyph colors. Blood Moon's 1024 human body masks also loaded successfully.

### Broad rebuild path is unsafe

`CK.character.instantSettingsChange()` invokes broad character/display change/update sequencing. During this investigation it correlated with derived renderer corruption including incorrect metal/emissive/paint channels. It is rejected for the maintained texture feature.

The narrow path — protected atlas construction, assignment, `colorBake.invalidateCache()`, and `colorBake.refresh(true)` — produced the accepted manual result without broad character reconstruction.

### Decal source resolution is mixed

Blood Moon's actual decal stack included both 2048 and 512 source assets. Confirmed examples included 2048 `bodyFrecklesLow`, `roan`, and tattoo assets, while `circleGradient`, `human_seam`, and `weathering` assets were 512. The protected atlas can prevent additional destination downsampling, but cannot increase inherent source resolution.

### 4096 body allocation is technically packable, not validated

A detached 8192x8192 atlas experiment with cloned body part metadata and a 4096 bake ceiling successfully packed bodyLower/bodyUpper at 4096 and face at 2048 on Blood Moon. This was not adopted: the protected 2048 target already achieved the desired visual result, and 4096 requires separate performance/lifecycle testing.

### Standalone v0.1.2 exposed an atlas-area constraint

After v0.1.0 and v0.1.1 failures were diagnosed, standalone v0.1.2 correctly used the exact displayed pre-enable atlas as its allocation/safety baseline. On the current Blood Moon state:

- pre-enable atlas: 8192x4096;
- protected candidate: 8192x4096;
- bodyLower: 1024;
- bodyUpper: 1024;
- face: 2048.

This result occurred with the per-slot cap map preserving unrelated slots at their exact pre-enable allocation sizes. Therefore the 8192x4096 packer could not simultaneously preserve that allocation budget and raise all three protected targets to 2048.

A detached A/B test then repeated the same 8192x4096 construction with target scale entries supplied through a cloned scale object and through temporary live `character.data.atlasScale` entries. Both returned the same `1024/1024/2048` target allocations. Scale-object identity is therefore ruled out as the missing requirement.

The supported next variable was **atlas packing area**, not broader settings mutation or a higher body-resolution target.

### Error visibility / diagnostic observability

The v0.1.2 failure remained available in the feature's diagnostic state, but the disabled watcher overwrote the visible failure panel with the normal Ready message on its next tick. A passive bridge recorder confirmed this transition.

v0.1.3 added bounded plain-data telemetry (`diagnostics`, `lastError`, `attemptHistory`, `timeline`) and a visible error latch. This made the subsequent Booth lifecycle failure inspectable while the bad visual state was still present.

### Standalone v0.1.3 proved adaptive allocation and exposed a renderer-lifecycle split

On Blood Moon, v0.1.3 successfully passed the detached adaptive allocation gate:

- 8192x4096 remained insufficient under the exact pre-enable no-regression budget;
- the 8192x8192 fallback was selected;
- bodyLower/bodyUpper/face each resolved to 2048;
- the user observed visibly sharper/improved decals;
- paint/material channels appeared correct.

A new visual failure remained: body and face showed coherent but obviously wrong texture blocks. Turning Photo Booth off temporarily removed those blocks, but the resulting body was the low-resolution native state with obvious seams. The bad high-resolution state then returned.

Live HF-Chat-Bridge inspection while the corrupted state was visible confirmed:

- `display.atlas` was the protected **8192x8192** atlas;
- `display.modded.resourceAtlas` was a different **8192x4096** atlas;
- the feature still reported enabled/active;
- `display.modded.buildAtlas` was HeroForge's native function rather than the exact wrapper installed by the v0.1.3 session;
- the protected/display atlas packed bodyLower/bodyUpper/face at pixel X positions **0 / 2048 / 4096**;
- the current resource atlas packed the same slots at **512 / 1024 / 1536**;
- visible target materials used protected-display UV vectors (`0/.25/.5` X offsets with `.25` scales), so v0.1.3's old check that only converted UV scale into a 2048 width/height could not detect the incompatible atlas origin/layout.

HeroForge source inspection confirmed the color-bake path uses `display.atlas` dimensions and material `uvPosScl` for atlas scissor/layout, and `updateDisplayMaterials()` binds the atlas baker's render targets back to visible materials. The resource/display split therefore cannot be dismissed as two harmless references to equivalent packing.

This is a separate failure from the earlier invalid 2048 mask problem. The valid 1024 masks were still available, and paint/channel corruption was not observed. The supported root cause of the new body/face failure is **renderer lifecycle ownership/coherence**, not failure of the 2048 target itself.

### Why Booth off looked temporarily correct

The observed sequence is now mechanically explained:

1. v0.1.3 holds a protected display atlas.
2. HeroForge/Booth lifecycle replaces or resets the underlying `modded.buildAtlas` ownership and creates a new native resource atlas.
3. The display and resource atlas layouts diverge.
4. Booth off temporarily reaches a coherent native/low-resolution renderer state, so the bizarre blocks disappear but native seams/detail loss return.
5. v0.1.3 sees only that the protected allocation is gone and blindly reapplies the old protected session instead of recognizing the renderer lifecycle boundary.
6. The incompatible split is reintroduced and the bizarre body/face state returns.

The maintained feature must therefore invalidate stale sessions when ownership changes instead of treating every loss as a normal same-session reapply.

## Visual acceptance

### D4

Protected high-resolution body allocation plus valid 1024 body masks produced correct skin/glyph colors and visibly improved body/decal detail. The user reported the result looked correct.

### Blood Moon manual path

The final manual protected-2048 result before standalone packaging was reported as:

- body texture correct;
- seams correct;
- paints/material channels correct;
- decals likely correct/high-resolution, approximately 95% confidence due Booth paint/lighting appearance making exact visual discrimination difficult.

An earlier isolated skirt-metal channel error occurred during broader experimental states, but the final narrow protected state did not reproduce that channel corruption.

### Blood Moon standalone v0.1.3

- protected 2048 allocation: passed;
- decal detail improvement: visibly passed;
- paint/material channels: appeared correct;
- persistent body/face texture correctness through Booth lifecycle: failed;
- failure was captured live and correlated with exact wrapper/atlas ownership divergence.

## Diagnostic transport caveat

HF-Chat-Bridge Power experiments previously revealed a development-tool lifecycle trap: persistent set restorers can be flushed by later Power runs, making a protected atlas appear to "decay" back to native. That earlier contamination remains a separate diagnostic-tool issue.

The v0.1.3 standalone failure described above is different: the standalone owned its own runtime lifecycle, and direct read-only inspection found its wrapper absent plus an incompatible live resource/display atlas split while the bad visual state was present.

A large detached pressure probe also previously exceeded the relay's mutation-capable lease. That reinforces the maintained rule that the standalone feature should capture its own bounded test telemetry and should not depend on repeated Power mutations for observability.

The maintained standalone feature must not depend on HF-Chat-Bridge and must own its runtime lifecycle directly.

## Supported inference

The general HeroForge quality downgrade experienced by complex scenes is primarily an atlas-allocation pressure policy: destination regions are reduced sharply to make the atlas fit. Protecting body/head allocations while increasing atlas packing area when necessary avoids that downgrade on the tested manual states.

For the current Blood Moon exact pre-enable allocation budget, 8192x4096 is insufficient under the standalone's no-unrelated-regression contract, while v0.1.3 proved an 8192x8192 fallback can reach 2048 for all target slots.

The severe coherent-but-wrong body/face blocks seen under v0.1.3 are strongly supported as an atlas lifecycle coherence failure: HeroForge replaced the protected builder/resource state while the protected display atlas remained, producing incompatible packing layouts. They are not supported as a paint-data mutation or a reason to abandon 2048 protection.

## Not proven

- The January GPU-crash/account-specific quality change has not been proven to share the same root cause.
- The exact internal trigger that decides the native atlas dimensions for every scene is not fully mapped.
- The exact HeroForge Booth method that replaces/resets `modded.buildAtlas` ownership has not been reduced to one named lifecycle callback; v0.1.4 therefore detects the resulting capability/object-state transition rather than patching an unproven specific callback.
- Standalone v0.1.4 has not yet been human-validated on Blood Moon.
- 8192x8192 fallback GPU/VRAM impact has not yet been characterized in normal use.
- Long-session memory behavior and spin-capture performance are separate open investigations.

## Maintained direction

Proceed with standalone v0.1.4 using the already validated allocation recipe plus strict lifecycle coherence:

- normal atlas mode;
- bodyLower/bodyUpper/face maintained at 2048;
- figure-specific valid 1024 body masks;
- exact pre-enable per-slot allocation baseline/caps;
- detached 8192x4096 candidate first;
- detached 8192x8192 candidate only if the smaller atlas cannot satisfy 2048 targets with zero unrelated allocation regressions;
- narrow color-bake refresh only;
- current display/modded identity and exact protected `buildAtlas` wrapper ownership as required session invariants;
- exact shared object identity for `display.atlas`, `modded.resourceAtlas`, and the protected atlas;
- full target UV offset/scale verification, not size-only verification;
- stale-session invalidation on lifecycle replacement;
- wait-for-current-renderer stability, current-resource/display coherence hand-off, then fresh protected-session recovery;
- bounded recovery with fail-closed auto-disable rather than an unbounded fight;
- persistent bounded ownership/coherence diagnostics/error latch.

Do not integrate into Witch Dock until v0.1.4 activation, Booth lifecycle, disable/re-enable, figure-change, visual correctness, and fallback performance behavior pass.
