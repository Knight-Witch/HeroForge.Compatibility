# Changelog

This is a **rolling current changelog**. Older verbose entries remain durable in Git history and should be fetched only when relevant.

## HFC-2026-09-12-030 — Accept native source-size promotion for D4 alpha validation

**Date:** 2026-09-12

### Summary

Blood Moon alpha.2 retest passed both runtime and visual acceptance. D4 then exposed a distinct native behavior: after reconciliation HeroForge promoted bodyLower to `_usedTextureSize=2048` with a `2048x2048` packed allocation. Alpha.2 falsely rejected that generation because its verifier required `_usedTextureSize === 1024` exactly.

### Confirmed live evidence

Blood Moon alpha.2, Bridge #1727:

- alpha stayed ON after one expected native generation adoption;
- native coherent atlas `4096x4096`;
- scale `4/4/4`;
- BL/BU/face `1024x1024` each;
- bakeSize `2048`, used `1024`;
- actual body color-bake masks remained the pinned valid 1024 textures;
- Amanda visually confirmed excellent body/decal quality, no poop, and correct accessory channels.

D4 native baseline, Bridge #1729:

- atlas `4096x4096`;
- BL/BU bakeSize `1024`, used `512/512`;
- face bakeSize `1024`, used `1024`;
- no body mask overrides.

D4 alpha.2 attempt, Bridge #1730/#1731:

- one native generation was adopted;
- bodyLower reached scale `4`, bakeSize `2048`, allocation `2048x2048`, used `2048`;
- alpha.2 rejected only the exact-1024 verifier condition and then rolled back cleanly.

### Code change

Advanced `rendering-texture-quality-native-reconcile.user.js` to `0.2.0-alpha.3`.

Alpha.3 keeps 1024 as the seeded/minimum protected source size but accepts native promotion through the 2048 bake ceiling. It also tightens body-mask verification: the actual color-bake `masksMap` must remain the exact pinned valid 1024 override object.

### Architecture unchanged

No custom `CK.Atlas`, no buildAtlas wrapper/replacement, no direct display/resource atlas assignment, and no automatic ownership watcher.

### Next gate

Reload/update alpha.3 on D4, run one enable, then Amanda visually validates the body color/glyph channel plus body/face quality, decals, accessory channels, and absence of poop/corruption. Do not promote to Witch Dock Dev before this passes.

### Public impact

Standalone experimental branch only. Witch Dock Dev and Stable unchanged.

---

## HFC-2026-09-12-029 — Validate native-reconcile architecture on Blood Moon and fix generation adoption

Blood Moon alpha.1 produced the correct native high-resolution generation and Amanda visually confirmed body/decal quality, no poop, and correct accessory channels. Alpha.2 fixed the false stale-session failure by adopting HeroForge replacement display/modded generations.

---

## HFC-2026-09-12-028 — Add native-reconcile texture alpha

Added the parallel native-reconcile standalone after tracing the native data/modded/build/display lifecycle.

---

## Historical entries

Detailed HFC-2026-09-12-027 and earlier entries remain in Git history. Use the investigation/evidence ledger or Git history when older detail is material.
