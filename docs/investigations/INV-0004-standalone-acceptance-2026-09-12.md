# INV-0004 — Standalone Acceptance Checkpoint

**Date:** 2026-09-12  
**Feature:** `rendering.texture-quality`  
**Status:** standalone validation complete; ready for Witch Dock Dev integration

## TLDR

The replacement native-reconcile architecture has now passed two complementary live figures and the historical failure modes it was designed to avoid.

- **Blood Moon:** validates atlas pressure, body/decal quality, and accessory color/material/emissive coherence.
- **D4:** validates the body paint/glyph channel that Blood Moon does not expose well.

Both pass without poop and without persistent custom atlas ownership.

## Blood Moon pass

Fresh native potato baseline:

- atlas `4096x4096`;
- bodyLower/bodyUpper allocations `256x256`;
- face `512x512`;
- target bakeSize `1024`;
- used `256/256/512`;
- no target scale overrides.

Alpha.2 result:

- atlas `4096x4096`, display/resource atlas same native object;
- one expected HeroForge display/modded generation adoption;
- scale `4/4/4`;
- BL/BU/face allocations `1024x1024`;
- bakeSize `2048`;
- used `1024`;
- bodyLower/bodyUpper actual color-bake masks = exact pinned real 1024 textures;
- no script error.

Human visual acceptance:

- body texture excellent/high-resolution;
- decals sharp;
- no poop;
- Discus, Celestial Circlet, and Short Crown Horn color/material/emissive channels correct.

Evidence: Bridge #1727 + Amanda visual confirmation.

## D4 pass

Fresh native baseline:

- atlas `4096x4096`;
- bodyLower/bodyUpper `bakeSize=1024`, used `512/512`;
- face `bakeSize=1024`, used `1024`;
- alpha OFF.

Alpha.3 result:

- atlas `4096x4096`, display/resource atlas same native object;
- one expected generation adoption;
- scale `4/4/4`;
- BL/BU/face allocations `2048x2048`;
- bakeSize `2048`;
- HeroForge natively promoted used size to `2048` on all three targets;
- bodyLower/bodyUpper actual color-bake masks remained the exact pinned real `1024x1024` textures;
- alpha remained ON;
- no script error.

Human visual acceptance:

- body color/paint correct everywhere checked;
- historical body glyph/detail channel correct;
- body and face sharp/high-resolution;
- decals correct;
- no poop/corruption;
- no obvious wrong material/color/emissive channels elsewhere.

Evidence: Bridge #1732/#1733 + Amanda visual confirmation.

## Maintained conclusion

**CONFIRMED:** desired visual quality does not require persistent ownership of a giant custom atlas. High-resolution source policy can be seeded, HeroForge can natively rebuild/reselect resources and repack, and the resulting coherent native generation can preserve or exceed the requested body/head resolution.

**CONFIRMED:** `_usedTextureSize=1024` is a safe minimum seed, not a universal final value. HeroForge may legitimately promote to 2048 on lower-pressure figures.

**CONFIRMED:** body masks remain the special safety boundary. The feature must request/verify real 1024 masks and must not follow promoted source size into nonexistent 2048 mask requests.

**SUPPORTED strongly:** the old persistent Protected Textures generation/atlas ownership was the architectural source of the stale/incoherent generation behavior that native reconciliation repairs.

## Canonical Dev behavior to preserve

1. Module loads inert / OFF.
2. On explicit enable:
   - load and validate real 1024 body masks;
   - seed target atlasScale=4, bakeSize=2048, used=1024;
   - pin body mask overrides;
   - run the native data/modded/build/refresh lifecycle;
   - adopt replacement display/modded generations when character/data/target identities remain stable;
   - accept used/allocation values in `1024..2048`;
   - require actual body color-bake masks to be the exact pinned 1024 objects.
3. On failure/disable:
   - restore every owned source snapshot;
   - request native rebuild/refresh;
   - never restore stale atlas objects.
4. Never construct a custom `CK.Atlas`, wrap `buildAtlas`, directly assign display/resource atlas objects, or run a persistent ownership watcher.

## Promotion state

Standalone alpha.3: **PASS / canonical reference**.  
Witch Dock Dev: **next gate**.  
Stable: **untouched**.
