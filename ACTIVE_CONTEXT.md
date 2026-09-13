# Active Context — `feature/rendering-texture-quality`

**Updated:** 2026-09-12  
**Active feature:** `rendering.texture-quality`  
**Current task:** promote validated native-reconcile standalone behavior into Witch Dock Dev for integrated testing.  
**Runtime posture:** old Protected 2048 standalone OFF; Lob High Res Decals OFF; standalone alpha.3 is the canonical validated reference. Stable remains untouched.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`
2. this file
3. `docs/investigations/INV-0004-current-state-2026-09-12.md`
4. `docs/investigations/INV-0004-native-reconcile-alpha-2026-09-12.md`
5. `docs/investigations/INV-0004-standalone-acceptance-2026-09-12.md`

## Standalone acceptance — PASS

### Blood Moon

Alpha.2 from a fresh native potato baseline passed both runtime and visual validation:

- native coherent atlas `4096x4096`;
- scale `4/4/4`;
- bodyLower/bodyUpper/face allocations `1024x1024`;
- `bakeSize=2048`, `_usedTextureSize=1024`;
- actual body color-bake masks were the exact pinned valid 1024 textures;
- expected native display/modded generation replacement was adopted;
- Amanda confirmed excellent body texture, sharp decals, no poop, and correct Discus / Celestial Circlet / Short Crown Horn channels.

Bridge evidence: #1727.

### D4

D4 was the body-color/glyph acceptance figure. Fresh alpha.3 baseline was native `4096x4096`, BL/BU `1024 bake / 512 used`, face `1024 / 1024`, alpha OFF.

One alpha.3 enable produced:

- native coherent atlas `4096x4096`;
- scale `4/4/4`;
- BL/BU/face allocations `2048x2048` each;
- `bakeSize=2048` and native-promoted `_usedTextureSize=2048` on all three targets;
- actual bodyLower/bodyUpper color-bake masks remained the exact pinned `1024x1024` textures;
- one expected native generation adoption;
- alpha remained ON with no script error.

Amanda visually confirmed D4 looks perfect: body color/paint and glyph channel correct, body/face sharp, decals correct, no poop/corruption, and no obvious wrong accessory material/color/emissive channels.

Bridge evidence: #1732/#1733.

**Disposition:** standalone acceptance gate CLOSED / PASS.

## Validated architecture

Keep only source-side quality policy and let HeroForge own generation:

- `atlasScale.bodyLower/bodyUpper/face = 4`;
- seed `bakeSize = 2048`;
- seed `_usedTextureSize = 1024` as a minimum, while allowing native promotion through 2048;
- hard-pin bodyLower/bodyUpper to real 1024 masks and verify those exact textures remain the actual color-bake `masksMap` inputs;
- use native `data.change({}) → modded.change/buildAtlas → character.refresh/update → display.change/update` reconciliation;
- adopt expected replacement display/modded generations while requiring character/data/target-part identity to remain stable.

Do **not** reintroduce custom `CK.Atlas` construction, buildAtlas wrapping, direct atlas assignment, giant-atlas forcing, or an automatic ownership watcher.

## Next gate — Witch Dock Dev

Port the validated alpha.3 behavior as a Dev-only Witch Dock service plus UI adapter. Requirements:

- off by default at runtime; loading the module must not mutate HeroForge;
- preserve alpha.3 enable/disable/rollback behavior;
- no runtime dependency on HeroForge.Compatibility or HF-Chat-Bridge;
- provide runtime diagnostics sufficient to confirm atlas, allocations, used sizes, native promotion, masks, generation adoption, and errors;
- integrated live validation must cover Blood Moon and D4 or an equivalent body-color/glyph figure;
- standalone alpha.3 remains canonical until Dev integration passes.

## Binding DO-NOT-REPEAT

Do not return to persistent protected-atlas ownership, giant-atlas forcing, generic rebakes, broad cache invalidation, skinMask sync, GPU prewarm, poop creation, meteorHammer hip-disc guesses, or per-slot Discus fixes.

## Promotion state

- v0.1.5: historical experimental reference only;
- v0.2.0-alpha.2: Blood Moon runtime + visual PASS;
- v0.2.0-alpha.3: D4 runtime + body-color/glyph visual PASS; current validated standalone reference;
- Witch Dock Dev: next stage;
- Stable: untouched.
