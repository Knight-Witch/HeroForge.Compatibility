# Changelog

This is a **rolling current changelog**. Older verbose entries remain durable in Git history and should be fetched only when relevant.

## HFC-2026-09-12-029 — Validate native-reconcile architecture on Blood Moon and fix generation adoption

**Date:** 2026-09-12

### Summary

Ran the new native-reconcile standalone from a genuine native potato Blood Moon baseline. The produced HeroForge generation was structurally coherent and visually perfect: high-resolution body/decal quality, no poop, and no incorrect accessory channels. Alpha.1 nevertheless reported failure because its session guard incorrectly treated HeroForge's expected display/modded replacement as stale-session corruption.

### Confirmed live result

Before alpha:

- native atlas `4096x4096`;
- bodyLower/bodyUpper `256x256`, face `512x512`;
- target bakeSize `1024`;
- used texture sizes `256/256/512`;
- no target scale overrides.

After the real native-reconcile path:

- native coherent atlas `4096x4096`;
- scale `4/4/4`;
- BL/BU/face `1024x1024` each;
- bakeSize `2048`;
- `_usedTextureSize=1024`;
- valid 1024 body masks;
- Discus / Short Crown Horn / Celestial Circlet fallback counts `0/0/0`;
- Amanda visually confirmed body and decals look fantastic, no poop, and all color/material/emissive channels are correct.

### Code change

Advanced `rendering-texture-quality-native-reconcile.user.js` to `0.2.0-alpha.2`.

Alpha.2 keeps character/data/target-part identity as the safety boundary but adopts native replacement display/modded generations during settle/verification. It still does not create custom atlases, wrap `buildAtlas`, directly assign atlas objects, or run an ownership watcher.

### Validation

- `node --check` PASS;
- source audit PASS: no custom `CK.Atlas`, no buildAtlas assignment/wrapper, no direct atlas assignment;
- SHA-256 `27a8a0bba0b001d518d71b768ac4493eac93e15b441cebce63865f67a1a685ea`;
- runtime evidence Bridge #1719/#1723/#1725 plus Amanda visual confirmation.

### Next gate

Retest Blood Moon once on alpha.2, then switch to D4 for the historically sensitive body color/glyph-channel validation before any Witch Dock Dev promotion.

### Public impact

Standalone experimental branch only. Witch Dock Dev and Stable unchanged.

---

## HFC-2026-09-12-028 — Add native-reconcile texture alpha

Traced the native data/modded/atlas/display lifecycle and added `0.2.0-alpha.1`, which preserves only scale/bake/used-size/valid-mask source policy while returning atlas/resource ownership to HeroForge. Static validation passed; live validation was pending at that commit.

---

## HFC-2026-09-12-027 — Confirm native reconciliation restores channels while high-res survives

Entering Kitbash and clicking Blood Moon caused a native generation rebuild that repaired all visible accessory channels while preserving visually accepted high-resolution body/decals and no poop. Post-state: native `4096x4096`, scale `4/4/4`, BL/BU/face `1024x1024`, `bakeSize=2048`, `_usedTextureSize=1024`.

---

## Historical entries

Detailed HFC-2026-09-12-026 and earlier entries remain in Git history. Use the investigation/evidence ledger or Git history when older detail is material.
