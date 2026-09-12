# Active Context — `feature/rendering-texture-quality`

**Updated:** 2026-09-12  
**Active feature:** `rendering.texture-quality`  
**Current task:** validate `0.2.0-alpha.3` on D4 specifically for the historical body color/glyph channel, after Blood Moon alpha.2 passed  
**Runtime posture:** old Protected 2048 standalone OFF; Lob High Res Decals OFF; native-reconcile standalone only.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`
2. this file
3. `docs/investigations/INV-0004-current-state-2026-09-12.md`
4. `docs/investigations/INV-0004-evidence-ledger.md`
5. `docs/investigations/INV-0004-native-reconcile-alpha-2026-09-12.md`

## Blood Moon acceptance — PASS

Alpha.2 was retested from a fresh native potato Blood Moon baseline. Bridge #1727 confirmed:

- alpha remained ON after one expected native generation adoption;
- native coherent atlas `4096x4096`;
- scale `4/4/4`;
- bodyLower/bodyUpper/face allocations `1024x1024` each;
- `bakeSize=2048` and `_usedTextureSize=1024` on all targets;
- bodyLower/bodyUpper actual color-bake masks were the pinned valid 1024 textures;
- no script error.

Amanda visually reconfirmed Blood Moon: body and decals look excellent, no poop, and Discus / Celestial Circlet / Short Crown Horn channels are correct.

**Disposition:** standalone architecture + alpha.2 generation-adoption bookkeeping PASS on Blood Moon.

## D4 baseline and alpha.2 result

D4 was then loaded and hard-reloaded so alpha started OFF.

Confirmed native baseline, Bridge #1729:

- alpha.2 OFF / idle;
- atlas `4096x4096`;
- bodyLower `bakeSize=1024`, `_usedTextureSize=512`;
- bodyUpper `bakeSize=1024`, `_usedTextureSize=512`;
- face `bakeSize=1024`, `_usedTextureSize=1024`;
- no bodyLower/bodyUpper `masksMapOverride`.

One alpha.2 enable, Bridge #1730, adopted one native generation and produced at least:

- atlas `4096x4096`, display/resource atlas coherent;
- bodyLower scale `4`, bakeSize `2048`;
- bodyLower allocation `2048x2048`;
- bodyLower `_usedTextureSize=2048`.

Alpha.2 then rejected the generation because its verifier incorrectly required `_usedTextureSize === 1024` exactly. It rolled back through the existing failure path. Readback #1731 showed alpha OFF, scheduler idle, target bake/used values returned to a native stable state, and no stale mask overrides remained.

**Important:** this was a verifier false-negative, not a D4 visual failure. No maintained conclusion about D4 body color/glyph correctness has been made yet.

## Alpha.3 correction

`0.2.0-alpha.3` changes only the quality-verification contract:

- still seeds `_usedTextureSize=1024` before native reconciliation;
- treats 1024 as the minimum protected source size, not a hard ceiling;
- accepts HeroForge native promotion up to the `bakeSize=2048` ceiling;
- records per-target `nativePromoted` state;
- still requires scale `4`, bakeSize `2048`, and allocations between 1024 and 2048;
- still hard-pins bodyLower/bodyUpper masks to real 1024 textures;
- now additionally requires the actual body color-bake `masksMap` to be that exact pinned 1024 override object.

No custom atlas creation, buildAtlas wrapper, direct atlas assignment, or ownership watcher was added.

## Why D4 is the remaining gate

Blood Moon does not expose the historical body color/glyph failure as clearly as D4. D4 must visually pass:

- body color/glyph channel correctness;
- body/face resolution;
- decal quality;
- no poop/corruption;
- normal accessory channels.

Do not promote to Witch Dock Dev until D4 passes this check.

## Binding DO-NOT-REPEAT

Do not return to persistent protected-atlas ownership, giant-atlas forcing, generic rebakes, broad cache invalidation, skinMask sync, GPU prewarm, poop creation, meteorHammer hip-disc guesses, or per-slot Discus fixes.

## Promotion state

- v0.1.5: historical experimental reference only;
- v0.2.0-alpha.2: Blood Moon runtime + visual PASS; D4 verifier false-negative because native promoted bodyLower to 2048;
- v0.2.0-alpha.3: current standalone candidate, pending D4 runtime + visual validation;
- Witch Dock Dev unchanged;
- Stable unchanged.
