# Active Context — `feature/rendering-texture-quality`

**Updated:** 2026-09-12  
**Active feature:** `rendering.texture-quality`  
**Current task:** validate `0.2.0-alpha.2` on Blood Moon, then validate D4 specifically for the body color/glyph channel  
**Runtime posture:** old Protected 2048 standalone OFF; Lob High Res Decals OFF; use native-reconcile alpha only.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`
2. this file
3. `docs/investigations/INV-0004-current-state-2026-09-12.md`
4. `docs/investigations/INV-0004-evidence-ledger.md`
5. `docs/investigations/INV-0004-native-reconcile-alpha-2026-09-12.md`

## Decisive live result — native-reconcile architecture works

Blood Moon was reloaded to a genuine native potato baseline with the old Protected 2048 test disabled:

- atlas `4096x4096`;
- bodyLower/bodyUpper `256x256`;
- face `512x512`;
- target bake ceilings `1024`;
- `_usedTextureSize = 256/256/512`;
- no target atlasScale overrides;
- native-reconcile alpha present but OFF.

Bridge then invoked `0.2.0-alpha.1` once. The script reported failure only because its `sameSession()` guard treated HeroForge's expected display/modded-generation replacement as stale-session corruption. The resulting HeroForge generation itself was successful:

- atlas `4096x4096`;
- display/resource atlas coherent;
- scale `4/4/4`;
- bodyLower/bodyUpper/face allocations `1024x1024` each;
- target `bakeSize=2048`;
- target `_usedTextureSize=1024`;
- valid 1024 bodyLower/bodyUpper masks active;
- fallback scan for Discus / Short Crown Horn / Celestial Circlet = `0 / 0 / 0`.

Amanda visually confirmed the resulting Blood Moon state is **perfect**:

- body texture high-resolution;
- decals sharp/high-resolution;
- no poop;
- no incorrect accessory color/material/emissive channels.

This is the first direct standalone-path visual validation of the replacement architecture.

## Alpha.1 bookkeeping defect

**Confirmed:** HeroForge replaces the display/modded generation during the successful native reconcile. Alpha.1 incorrectly required the original display/modded object identities to survive and therefore declared a false failure after the useful native transition had already succeeded.

This is not evidence against the architecture. The successful output is exactly the lifecycle we intended to permit.

## Alpha.2 correction

`entries/tampermonkey-standalone/rendering-texture-quality-native-reconcile.user.js` is now `0.2.0-alpha.2`.

Alpha.2:

- still anchors safety to the same `CK.character` and `character.data` objects plus the same target body/head part identities;
- **adopts** a replacement `character.display` / `display.modded` generation when HeroForge creates one during reconciliation;
- counts adopted generations in verification;
- continues to fail closed if the actual character/data or target part identities change unexpectedly;
- retains the same source policy: atlasScale 4, bakeSize 2048, `_usedTextureSize=1024`, valid 1024 body masks;
- still does not construct a custom `CK.Atlas`, override `buildAtlas`, assign display/resource atlas objects, or run an ownership watcher.

Static validation: `node --check` PASS; alpha.2 SHA-256 `27a8a0bba0b001d518d71b768ac4493eac93e15b441cebce63865f67a1a685ea`.

## Why D4 is the second acceptance figure

Blood Moon is excellent for atlas-pressure, decal sharpness, poop, and accessory-channel validation, but it does not expose the historical body color/glyph failure as clearly as D4.

After alpha.2 passes once on Blood Moon, switch to D4 and validate specifically:

- body color/glyph channel correctness;
- body/face resolution;
- decal quality;
- no poop/corruption;
- valid 1024 body masks;
- normal accessory channels.

Do not promote to Witch Dock Dev until the D4 body-channel check passes.

## Binding DO-NOT-REPEAT

Do not return to persistent protected-atlas ownership, giant-atlas forcing, generic rebakes, broad cache invalidation, skinMask sync, GPU prewarm, poop creation, meteorHammer hip-disc guesses, or per-slot Discus fixes. Those paths are already disposed in the evidence ledger.

## Promotion state

- v0.1.5: historical experimental reference only;
- v0.2.0-alpha.1: architecture visually validated on Blood Moon, but bookkeeping false-negative on native display replacement;
- v0.2.0-alpha.2: current standalone candidate, pending Blood Moon bookkeeping retest and D4 body-channel validation;
- Witch Dock Dev unchanged;
- Stable unchanged.
