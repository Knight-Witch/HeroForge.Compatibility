# INV-0004 — Current Texture Investigation State

Date: 2026-09-12  
Status: active validation; native-reconcile architecture visually passed on Blood Moon  
Feature: `rendering.texture-quality`

## TLDR

The replacement architecture has now been exercised from a clean native potato baseline on Blood Moon and produced the desired result without persistent protected-atlas ownership.

Native baseline before alpha:

- atlas `4096x4096`;
- bodyLower/bodyUpper `256x256`;
- face `512x512`;
- `bakeSize=1024`;
- `_usedTextureSize=256/256/512`;
- no target atlasScale overrides.

After one real `0.2.0-alpha.1` enable path:

- atlas remained native `4096x4096`;
- scale became `4/4/4`;
- bodyLower/bodyUpper/face became `1024x1024` each;
- target `bakeSize=2048`;
- target `_usedTextureSize=1024`;
- valid 1024 bodyLower/bodyUpper masks were active;
- Discus / Short Crown Horn / Celestial Circlet fallback-resource counts were all zero.

Amanda visually confirmed:

- body texture looks fantastic/high-resolution;
- decals look fantastic/sharp;
- **no poop**;
- **no incorrect color/material/emissive channels**.

This directly validates the native-generation architecture on the complex Blood Moon scene.

## Bookkeeping false-negative discovered

Alpha.1 reported `HeroForge replaced the character/display during reconcile.` even though the produced generation was correct.

The actual failure was the alpha's identity guard: HeroForge legitimately replaced `character.display` / `display.modded` during the native reconcile. The script treated that expected lifecycle boundary as stale-session corruption.

The useful native generation was not rolled back because the old session object was no longer considered current. Readback proved the new generation was coherent and visually correct.

## Alpha.2 change

Alpha.2 keeps the character/data identity and target-part identity as the safety boundary, but permits/adopts replacement display/modded generations created by HeroForge during reconciliation. It still refuses mutation if the actual character/data or target parts change unexpectedly.

No architecture expansion was added:

- no custom atlas;
- no `buildAtlas` wrapper;
- no direct display/resource atlas assignment;
- no watcher;
- only scale=4, bakeSize=2048, `_usedTextureSize=1024`, valid 1024 body masks, native data/modded/build/display lifecycle.

## Current acceptance sequence

1. Update/reload alpha.2 on Blood Moon.
2. Capture native potato baseline.
3. Enable alpha.2 once and verify it remains logically ON after adopting the native replacement generation.
4. Amanda reconfirms Blood Moon visual result.
5. Switch to D4.
6. Capture D4 native baseline.
7. Enable alpha.2 once.
8. Amanda specifically verifies D4's historically sensitive body color/glyph channel, plus body/face resolution, decals, and absence of poop.
9. Only after both figures pass consider Witch Dock Dev integration.

## Claim levels

**Confirmed:** native reconciliation can preserve high-resolution body/decal quality and correct accessory channels; the standalone source-policy/native-generation sequence produced the target Blood Moon output from a genuine potato baseline.

**Confirmed:** display/modded replacement is part of the successful native lifecycle and must be adopted rather than treated as failure.

**Supported:** the maintained fix can remain narrowly source-side and leave atlas/resource generation to HeroForge.

**Open:** D4 body-color/glyph validation and alpha.2 enable/disable bookkeeping across the adopted generation.

## DO-NOT-REPEAT

Do not reopen giant protected-atlas ownership, generic rebakes, broad cache invalidation, skinMask synchronization, GPU prewarm, poop creation, meteorHammer hip-disc mapping, or targeted Discus resource substitutions as primary fixes.
