# Changelog

This is a **rolling current changelog**. Older verbose entries remain durable in Git history and should be fetched only when relevant.

## HFC-2026-09-12-031 — Close standalone texture-quality acceptance gate

**Date:** 2026-09-12

### Summary

`rendering.texture-quality` native-reconcile standalone validation is complete. Blood Moon passed the accessory-channel / atlas-pressure case and D4 passed the historically sensitive body color/glyph case.

### Blood Moon acceptance

Alpha.2 remained ON after adopting one native HeroForge generation and produced native coherent `4096x4096` output with scale `4/4/4`, target allocations `1024x1024`, bakeSize `2048`, used `1024`, and exact pinned 1024 body masks. Amanda visually confirmed excellent body/decal quality, no poop, and correct Discus / Celestial Circlet / Short Crown Horn channels. Bridge #1727.

### D4 acceptance

Alpha.3 started from native `4096x4096` with BL/BU used `512/512`, face used `1024`, then one enable produced native coherent `4096x4096` with scale `4/4/4`, BL/BU/face allocations `2048x2048`, bakeSize `2048`, native-promoted used `2048` on all three targets, and exact pinned 1024 body color-bake masks. Amanda visually confirmed body color/paint and glyph correctness, sharp body/face and decals, no poop/corruption, and no wrong accessory channels. Bridge #1732/#1733.

### Disposition

Standalone acceptance PASS. Alpha.3 is the canonical validated reference for Witch Dock Dev promotion.

### Architecture retained

No custom `CK.Atlas`, no buildAtlas wrapper/replacement, no direct atlas assignment, no persistent ownership watcher. 1024 is the seeded/minimum source size; HeroForge may natively promote through the 2048 bake ceiling while body masks remain exact real 1024 inputs.

### Next gate

Port this behavior into Witch Dock Dev as an off-by-default runtime service plus UI adapter, then run integrated regression before any Stable promotion.

**Runtime behavior changed by this documentation checkpoint:** no. Public Stable remains unchanged.

---

## HFC-2026-09-12-030 — Accept native source-size promotion for D4 alpha validation

Alpha.3 corrected alpha.2's exact-1024 verifier false-negative by accepting native source/allocation promotion through 2048 while tightening exact pinned-1024 body-mask verification.

---

## HFC-2026-09-12-029 — Validate native-reconcile architecture on Blood Moon and fix generation adoption

Blood Moon alpha.1 produced the correct native high-resolution generation and Amanda visually confirmed body/decal quality, no poop, and correct accessory channels. Alpha.2 fixed the false stale-session failure by adopting HeroForge replacement display/modded generations.

---

## Historical entries

Detailed HFC-2026-09-12-028 and earlier entries remain in Git history. Use the investigation/evidence ledger or Git history when older detail is material.
