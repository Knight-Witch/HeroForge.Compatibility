# INV-0004 — Current Texture Investigation State

Date: 2026-09-12  
Status: active investigation; **current live Blood Moon state is visually correct and must be preserved**  
Feature: `rendering.texture-quality`

> **READ THIS FILE BEFORE FURTHER TEXTURE-QUALITY PROBES OR EDITS.**
>
> This is the canonical current-state checkpoint. The figure has now crossed from the previously broken high-resolution generation into a native-reconciled generation where the accessory channels are correct. Do not restart from the earlier broken-state assumptions simply because a chat rolls over.

## TLDR state transition

Immediately before the decisive event, Blood Moon had:

- good/high-resolution body texture;
- sharp/high-resolution decals;
- no poop corruption;
- atlas `8192x4096`;
- accessory paint/material/emissive channels visibly wrong.

Amanda then entered **Kitbash** and clicked the figure. That native HeroForge interaction immediately produced:

- **all previously wrong accessory channels visually correct**;
- body texture still visually high-resolution/good;
- decals still visually sharp/high-resolution;
- still no poop;
- atlas repacked to **4096x4096**;
- `atlasScale.bodyLower/bodyUpper/face = 4/4/4` preserved;
- bodyLower/bodyUpper/face each packed at **1024x1024**;
- body/head part state still `bakeSize=2048`, `_usedTextureSize=1024`.

This is the strongest lifecycle result in the investigation.

## What is now confirmed

### Poop is not required for recovery

The old workflow often showed a transient poop state before HeroForge self-healed, so poop and channel recovery were historically correlated. The new Kitbash/click event repaired every visible channel while the figure was already no-poop.

**Confirmed:** poop itself is not the repair mechanism. A native HeroForge lifecycle/reconciliation event is capable of repairing accessory state without poop.

### Native reconciliation can preserve the useful high-resolution state

The correct post-rebuild atlas is `4096x4096`, but it is not the low-quality native baseline:

- clean native pre-high-res baseline was `4096x4096` with bodyLower/bodyUpper about `256x256`, face about `512x512`, `bakeSize=1024`, and no scale override;
- current reconciled state is `4096x4096` with bodyLower/bodyUpper/face all `1024x1024`, `bakeSize=2048`, `_usedTextureSize=1024`, and scale `4/4/4`.

Amanda visually confirmed the current body/decal quality remains good.

Therefore the desired result does **not** require persistent ownership of an `8192x4096` or larger display atlas. The high-resolution source/allocation settings can survive a native repack.

### The native rebuild changed accessory resource selection/binding

The Kitbash/click rebuild did more than repaint pixels.

Confirmed examples:

- **Short Crown Horn** — internal `spikeSmall`, `k_157/k_158`:
  - broken generation: real `spikeSmall_aaid_128.png` / real 128 mask, with 128-scale accessory allocation;
  - correct generation: real `spikeSmall_aaid_64.png` plus real `spikeSmall_mask_128.webp`, with a 64x64 packed slot.
- main `elegantSimple` horns:
  - broken generation: 1x1 fallback AAID/mask;
  - correct generation: real AAID/mask resources.
- **Celestial Circlet** — internal `starCirclet`, `k_139`:
  - current correct generation: real 64 AAID + real 128 mask, 64x64 packed slot.
- **Discus**:
  - current figure contains 16 Discus instances;
  - post-reconciliation fallback scan found **zero** 1x1 AAID/mask fallbacks on color or emissive across all 16.

These facts prove the native transition rebuilt/reselected accessory generation inputs. They do not prove that any one resource change alone is the sole visual cause.

## Exact user-facing affected parts

Amanda identified the earlier visibly wrong HeroForge parts as:

- **Short Crown Horn** → internal `spikeSmall`, known slots `k_157/k_158`;
- **Celestial Circlet** → internal `starCirclet`, `k_139`;
- **Discus** → multiple instances; exact two/three visually salient slots are less important now because the native rebuild repaired the family coherently.

This supersedes the earlier pelvis-guessing path. Do not resume treating the six mapped meteorHammer links as the visible hip discs.

## Strong supported architecture inference

The historical pre-Protected-Textures manual recipe was minimal:

- set `atlasScale.bodyLower/bodyUpper/face=4`;
- target `bakeSize=2048`;
- `_usedTextureSize=1024`;
- use valid body masks;
- allow native `modded.buildAtlas` / renderer lifecycle to proceed;
- no persistent protected buildAtlas wrapper or generation ownership.

The newly correct state has the same useful high-resolution source-side values and was reached only after HeroForge performed a native rebuild/repack.

**Strong supported inference:** later Protected Textures lifecycle ownership was likely preserving a high-resolution atlas generation too aggressively and preventing or short-circuiting the native reconciliation that reselects accessory resources, repacks the atlas, and restores coherent material channels.

This is not yet a final root-cause proof. We still need the exact Kitbash/click event chain.

## Important test-harness correction

HeroForge's atlas pipeline has separate scratch and visible targets:

- `atlasBaker.bakeAtlas(type, map)` renders into `targetsRGBA.<type>Src`;
- normal visible completion, when `useLiveTextures=false`, proceeds through `liveTextures.bakePartDecals(...)` and `atlasBaker.dilate(type)` into `targetsRGBA.<type>`.

Several early direct targeted-bake comparisons stopped at the scratch stage. Their **human no-change observations remain real**, but they are not valid proof that a supplied input failed to alter scratch output. Later A/Bs that explicitly included `dilate()` are the authoritative final-atlas tests.

Do not repeat a scratch-only targeted bake as if it were a complete native render test.

## Completed direct-fix paths that remain ruled out

### Generic channel/cache work

Already insufficient:

- forced physical/physical2/emissive rebakes;
- candidate color-cache invalidation;
- accessory skinMask synchronization;
- duplicate/second refresh;
- body UV synchronization;
- GPU/resource prewarm;
- cloned/shared mask variants;
- broad `instantSettingsChange()`.

### MeteorHammer guess

The six-slot family `k_86/k_87/k_88/k_113/k_114/k_115` was fully run through the proper color pipeline including dilation. All six final visible color regions were byte-identical before/after. Amanda later identified the actual problematic asset family as **Discus**.

Do not repeat the meteorHammer family rebake as a hip-disc fix.

### Targeted Discus resource substitutions

In the broken `8192x4096` generation, several Discus instances had fallback inputs and dead emissive regions. Supplying real Discus resources and running the full color/emissive pipeline could change their final atlas pixels and make emissive regions nonzero, but Amanda saw **no change to the visible wrong-channel symptom** for the guessed slots.

Important examples:

- `k_107/k_112` targeted pair: atlas changed, visible symptom did not;
- `k_102/k_203`: emissive changed from zero to 5,120 lit pixels each, then restored exactly; visible symptom still did not change.

Therefore direct per-slot resource repair inside the already-broken generation is not a sufficient substitute for native generation reconciliation.

### Simple stale visible binding

In the broken generation, affected/control samples had:

- live UV == bake UV;
- live color/physical/emissive atlas texture objects == current visible targets;
- no liveTextureSlot/hybrid/livePatched override on the affected candidates.

So the problem was not simply a stale visible UV rectangle or duplicate final texture object.

## Historical poop behavior — corrected interpretation

Before persistent Protected Textures ownership, the high-resolution workflow could show transient poop and later self-heal with no data edits. Booth/mode transitions could also coincide with recovery.

The new result changes the interpretation:

- poop was an **observable symptom of an incoherent/intermediate generation**, not a required repair step;
- the repair is the broader native renderer/atlas/material reconciliation;
- Kitbash/click can trigger that reconciliation directly while the figure is already visually clean.

Do not intentionally recreate poop as a fix strategy.

## Current protected live baseline

Preserve this exact state while source/lifecycle inspection continues:

- all accessory channels visually correct;
- body high-resolution/good;
- decals sharp/high-resolution;
- no poop;
- atlas `4096x4096`;
- scale `4/4/4`;
- BL/BU/face allocations `1024x1024` each;
- BL/BU/face `bakeSize=2048`, `_usedTextureSize=1024`;
- Protected Textures OFF;
- Lob High Res Decals OFF.

Do not casually reload, resize, switch modes, or broad-refresh this figure.

## Exact next investigation direction

The question is now:

> **What native HeroForge calls did Kitbash → figure click execute that rebuilt the generation from broken 8192x4096 into coherent 4096x4096 while preserving scale=4 / 2048 bake targets / 1024 used textures?**

Next work should be diagnostic and lifecycle-focused:

1. inspect the Kitbash selection/click path in source/runtime without mutating the current figure;
2. identify calls into native `modded.buildAtlas`, paint/material setup, resource-size selection, `colorBake.refresh`, atlas packing, and `updateDisplayMaterials`;
3. distinguish which calls cause generation reconstruction versus merely UI/selection work;
4. design a narrow programmatic reconciliation that preserves the high-resolution source settings and lets native HeroForge own the actual rebuild/repack;
5. only then revise the standalone architecture;
6. test the new architecture Standalone → Witch Dock Dev → Stable, with human visual validation.

Do not intentionally recreate the broken generation on the current figure merely to obtain instrumentation. Prefer source inspection, existing bad-state evidence, hooks that do not alter behavior, or a separate safely reproducible state.

## Current claim levels

**Confirmed:** native Kitbash/click reconciliation fixed every visible accessory channel while preserving visually good body/decal quality and no poop; atlas changed 8192x4096 → 4096x4096; scale 4/4/4 and 1024 body/head allocations survived; accessory resource selection/binding changed.

**Supported inference:** persistent protected-atlas lifecycle ownership was interfering with a native generation reconciliation that the old minimal recipe allowed.

**Hypothesis:** the maintained fix can be reduced to preserving high-resolution source/allocation inputs and then deliberately invoking/allowing the correct native build/reconciliation sequence. The exact necessary call chain remains to be proven.

## Cross-chat rule

A continuation chat should begin with:

1. `PROJECT_CONTRACT.md`;
2. `ACTIVE_CONTEXT.md`;
3. this file;
4. `INV-0004-evidence-ledger.md`.

Do not restart from the old 8192x4096 broken baseline or retry completed per-slot fixes unless new evidence specifically reopens them.

Documentation checkpoint only; no runtime behavior is changed by the repository update that stores this state.
