# INV-0004 — Texture Atlas Quality / Protected Body Resolution

Date: 2026-09-08 through 2026-09-10  
Status: runtime mechanism confirmed; standalone validation next  
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

An explicitly constructed 8192x4096 `CK.Atlas`, with bodyLower/bodyUpper/face priority/scale set to 4 and their bake ceilings at 2048, produced:

- bodyLower: 2048x2048;
- bodyUpper: 2048x2048;
- face: 2048x2048.

Display material UV, base color-bake UV, and decal-bake UV were confirmed against the protected allocation during successful runs.

### Body mask hazard

The body mask path has mutable `_usedTextureSize` state and only increases unless explicitly reset. Experimental 2048 requests produced URLs such as:

- `bodyLower/.../humanToes_mask_2048.webp`
- `bodyUpper/.../human_mask_2048.webp`

Those assets failed to load. HeroForge then used a gray fallback mask, causing wrong body paint/glyph results even though saved character paints/decals were unchanged.

Resetting the source size to 1024, loading the real 1024 masks, and pinning them through `masksMapOverride` corrected D4's body skin/glyph colors. Blood Moon's 1024 human body masks also loaded successfully.

### Broad rebuild path is unsafe

`CK.character.instantSettingsChange()` invokes broad character/display change/update sequencing. During this investigation it correlated with derived renderer corruption including incorrect metal/emissive/paint channels. It is rejected for the maintained texture feature.

The narrow path — protected atlas construction, assignment, `colorBake.invalidateCache()`, and `colorBake.refresh(true)` — produced the accepted result without broad character reconstruction.

### Decal source resolution is mixed

Blood Moon's actual decal stack included both 2048 and 512 source assets. Confirmed examples included 2048 `bodyFrecklesLow`, `roan`, and tattoo assets, while `circleGradient`, `human_seam`, and `weathering` assets were 512. The protected atlas can prevent additional destination downsampling, but cannot increase inherent source resolution.

### 4096 body allocation is technically packable, not validated

A detached 8192x8192 atlas experiment with cloned body part metadata and a 4096 bake ceiling successfully packed bodyLower/bodyUpper at 4096 and face at 2048 on Blood Moon. This was not adopted: the protected 2048 target already achieved the desired visual result, and 4096 requires separate performance/lifecycle testing.

## Visual acceptance

### D4

Protected high-resolution body allocation plus valid 1024 body masks produced correct skin/glyph colors and visibly improved body/decal detail. The user reported the result looked correct.

### Blood Moon

Final protected-2048 result was reported as:

- body texture correct;
- seams correct;
- paints/material channels correct;
- decals likely correct/high-resolution, approximately 95% confidence due Booth paint/lighting appearance making exact visual discrimination difficult.

An earlier isolated skirt-metal channel error occurred during broader experimental states, but the final narrow protected state did not reproduce that channel corruption.

## Diagnostic transport caveat

HF-Chat-Bridge Power experiments revealed a development-tool lifecycle trap: persistent set restorers can be flushed by later Power runs, making a previously protected atlas appear to "decay" back to native. This contamination is not evidence that HeroForge's normal `buildAtlas()` independently reverted the validated state; a temporary `buildAtlas` counter observed no call during a stable protected window.

The maintained standalone feature must not depend on HF-Chat-Bridge and must own its runtime lifecycle directly.

## Supported inference

The general HeroForge quality downgrade experienced by complex scenes is primarily an atlas-allocation pressure policy: destination regions are reduced sharply to make the atlas fit. Protecting body/head allocations while expanding the atlas avoids that downgrade on the tested figures.

## Not proven

- The January GPU-crash/account-specific quality change has not been proven to share the same root cause.
- The exact internal trigger that decides the native atlas dimensions for every scene is not fully mapped.
- Long-session memory behavior and spin-capture performance are separate open investigations.

## Maintained direction

Proceed with a standalone, reversible, capability-gated `rendering.texture-quality` test using:

- normal atlas mode;
- 8192x4096 protected atlas;
- bodyLower/bodyUpper/face at 2048;
- figure-specific valid 1024 body masks;
- narrow color-bake refresh only;
- pre-apply native-vs-protected allocation regression check;
- lifecycle watcher/reapply;
- fail-closed disable/restore.

Do not integrate into Witch Dock until standalone enable/disable, figure-change, and reload behavior pass.
