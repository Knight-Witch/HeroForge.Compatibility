# Active Context — `feature/rendering-texture-quality`

**Updated:** 2026-09-12  
**Active feature:** `rendering.texture-quality`  
**Current task:** identify and reproduce the native HeroForge reconciliation that preserves high-resolution body/decal quality while restoring accessory material channels  
**Runtime mutation posture:** **protect the current correct live Blood Moon state; read-only unless a new mutation is specifically justified**

## Read first for this branch

For texture-quality work, the minimum continuation set is:

1. `PROJECT_CONTRACT.md`
2. this file
3. `docs/investigations/INV-0004-current-state-2026-09-12.md`
4. `docs/investigations/INV-0004-evidence-ledger.md`

Read the older investigation, feature source/spec, or policy docs only when the next decision requires them.

## Current protected live Blood Moon state — CORRECT

Amanda triggered a native HeroForge transition by entering **Kitbash** and clicking the figure. Immediately afterward:

- all previously incorrect accessory color/material/emissive channels became visually correct;
- body texture remains visually high-resolution/good;
- decals remain visually sharp/high-resolution;
- no poop corruption is present;
- `display.atlas` is now **4096x4096**;
- `atlasScale.bodyLower/bodyUpper/face = 4/4/4` remains live;
- bodyLower/bodyUpper/face each currently occupy **1024x1024** atlas regions;
- their part state remains `bakeSize=2048`, `_usedTextureSize=1024`;
- Protected Textures standalone is **OFF**;
- Lob High Res Decals is **OFF**.

Do not reload, resize, force a mode transition, invoke broad settings changes, or intentionally recreate the broken state on this live figure without a specific reason.

## Decisive lifecycle result

Immediately before the Kitbash/click event, the same figure had:

- good high-resolution body and decals;
- no poop;
- an `8192x4096` atlas generation;
- incorrect accessory channels.

The Kitbash/click event produced a new native `4096x4096` generation and repaired all visible channel errors **without reducing the visually accepted body/decal quality and without requiring poop**.

Therefore:

- poop is **not required** for material recovery;
- a native HeroForge reconciliation/rebuild can repair accessory state while preserving the high-resolution source settings;
- the investigation should no longer treat persistent `8192x4096` ownership as synonymous with the desired result.

## Exact user-facing affected parts

Amanda identified the previously wrong HeroForge parts as:

- **Short Crown Horn** → internal `spikeSmall`, confirmed slots `k_157` / `k_158`;
- **Celestial Circlet** → internal `starCirclet`, slot `k_139`;
- **Discus** → multiple `discus` instances; 16 are present in the current reconciled figure.

Do not resume broad pelvis guessing or treat the earlier six-piece meteorHammer family as the visible discs.

## Post-reconciliation resource state

Confirmed after the Kitbash/click rebuild:

- `k_157/k_158` Short Crown Horn now use real `spikeSmall_aaid_64.png` plus real `spikeSmall_mask_128.webp` on color/emissive;
- in the prior broken generation those same Short Crown Horn slots used the real **128x128** AAID variant, so the rebuild changed native resource-size selection as well as atlas packing;
- `k_139` Celestial Circlet currently uses real `starCirclet_aaid_64.png` plus real `starCirclet_mask_128.webp`;
- all **16 Discus** instances now have non-fallback AAID and mask resources on both color and emissive;
- the main `elegantSimple` horns, which had 1x1 fallback resources in the broken generation, now have real AAID/mask resources.

These changes establish a generation-level reconciliation event. They do **not** prove that any single resource change alone caused the visual repair.

## Current architecture direction

The historical minimal high-resolution recipe and the new correct state now share the important source-side settings:

- `atlasScale.bodyLower/bodyUpper/face = 4`;
- target `bakeSize=2048`;
- `_usedTextureSize=1024`.

The historical recipe then allowed native `modded.buildAtlas` lifecycle ownership. The current correct state was likewise reached only after HeroForge performed a native rebuild/repack.

**Strong supported direction:** preserve the high-resolution source/allocation inputs while returning atlas packing/resource selection/reconciliation ownership to native HeroForge as much as possible. The persistent protected-atlas lifecycle introduced by later Protected Textures revisions may be owning too much of the generation lifecycle.

This is not yet a final root-cause proof. The exact Kitbash/click call chain still needs to be identified.

## Binding DO-NOT-REPEAT summary

Do not repeat without genuinely new evidence:

- generic physical/physical2/emissive rebakes;
- broad color-cache invalidation;
- accessory skinMask synchronization;
- GPU prewarm;
- cloned/shared body-mask variants;
- duplicate bake/refresh;
- broad `instantSettingsChange()`;
- atlas-size-only fixes;
- direct per-slot real-resource corrections to guessed Discus slots;
- the six-slot meteorHammer family color rebake as a hip-disc fix;
- direct targeted AAID/mask substitutions as a substitute for native generation reconciliation.

Also remember the corrected bake pipeline: `bakeAtlas()` writes a `*Src` scratch target; normal visible completion requires the native `bakePartDecals` / `dilate` path when `useLiveTextures=false`.

## Next investigation sequence

1. Preserve the current correct generation and inspect source/runtime **read-only**.
2. Identify the native event chain invoked by **enter Kitbash → click figure** that caused the atlas/resource/material generation rebuild.
3. Determine which of those calls are necessary versus incidental: likely candidates include native `modded.buildAtlas`, paint/material setup, colorBake refresh, resource-size selection, atlas packing, and `updateDisplayMaterials`.
4. Design an instrumented reproduction that keeps `atlasScale=4`, `bakeSize=2048`, `_usedTextureSize=1024` while allowing HeroForge's native reconciliation to complete.
5. Do not intentionally break this current figure merely to obtain a before-state. Use source inspection, existing bad-state evidence, hooks, or a safely reproducible separate state first.
6. Only after the lifecycle is understood should the standalone v0.1.5 architecture be changed.

## HF-Chat-Bridge boundary

HF-Chat-Bridge is healthy development infrastructure. Use narrow compact probes autonomously; do not load Bridge repo documentation unless the transport itself becomes the subject.

## Promotion state

- current standalone source remains experimental v0.1.5 on this branch;
- the live correct state was reached by native HeroForge interaction, not by a committed feature fix;
- Witch Dock Dev/Stable promotion remains blocked;
- public Witch Dock is untouched.

## Update rule

Update this file only when the branch-level current state, protected runtime baseline, or next investigation direction materially changes. Put individual probe history in the evidence ledger rather than expanding this router indefinitely.
