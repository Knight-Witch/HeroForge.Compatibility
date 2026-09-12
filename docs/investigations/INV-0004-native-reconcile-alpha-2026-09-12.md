# INV-0004 — Native-Reconcile Alpha Evidence

**Date:** 2026-09-12  
**Feature:** `rendering.texture-quality`  
**Purpose:** compact evidence supplement for the transition away from persistent protected-atlas ownership.

## TLDR

The native-reconcile architecture is visually validated on Blood Moon. Alpha.2 then exposed a D4-specific native behavior: HeroForge may promote a target from the 1024 seed to a 2048 used/allocation state during the adopted generation. Alpha.3 therefore treats 1024 as a minimum protected source size while continuing to hard-pin/verify the real 1024 body masks that prevent the known body color/glyph corruption path.

Core lifecycle:

`data.change(...) → modded.change(data) → native buildAtlas() → character.refresh() → character.update() → display.change(data) → display.update()`.

## Evidence

### NR-001 — Character scheduler consumer

`character.refresh()` sets `_needsUpdating`; `character.update()` consumes it, clears the flag, calls `display.change(character.data)`, then `display.update()`.

**Disposition:** CONFIRMED. Bridge #1700/#1702.

### NR-002 — Display adoption downstream of resource generation

`display.change(data)` loads resources selected by `data.modded` and adopts them through normal `_loaded(...)` handling.

**Disposition:** CONFIRMED. Bridge #1703.

### NR-003 — Data change invokes full modded generation

`character.data.change(...)` invokes `this.modded.change(this)`, later `_changePaints()`, and sets `needsDisplayUpdate=true`.

**Disposition:** CONFIRMED. Bridge #1706.

### NR-004 — Modded change ends in native atlas construction

`modded.change(data)` runs normal mod/resource derivation and ends with `this.buildAtlas()`.

**Disposition:** CONFIRMED. Bridge #1681.

### NR-005 — Native buildAtlas contract

Native `modded.buildAtlas()` assigns `resourceAtlas = new CK.Atlas({...parts}, ..., data.isUHD(), data.atlasScale)`.

**Disposition:** CONFIRMED. Bridge #1715.

### NR-006 — Avoid high-level character.change for the alpha

`CK.character.change(...)` adds event/history semantics beyond the lower-level generation path.

**Disposition:** CONFIRMED; lower-level lifecycle remains preferred. Bridge #1699.

### NR-007 — Correct generation uses explicit valid body masks

Correct Blood Moon uses real 1024 bodyLower/bodyUpper mask overrides, and each color-bake `masksMap` is that exact texture object.

**Disposition:** CONFIRMED; retain mask pinning. Bridge #1716/#1718.

### NR-008 — Persistent protected-atlas ownership is not required

The successful native-reconciled state uses a native 4096 atlas while preserving accepted high-resolution source settings. v0.1.5's wrapper/custom-atlas/watch architecture is therefore not required for quality and is the prime lifecycle-interference suspect.

**Disposition:** SUPPORTED STRONGLY.

### NR-009 — Alpha.1 implementation

Alpha.1 owns only scale/bake/used-size/valid masks and lets HeroForge own atlas/resource generation.

**Disposition:** IMPLEMENTED.

### NR-010 — Genuine Blood Moon potato baseline

With old Protected 2048 and Lob High Res Decals OFF, Blood Moon baseline was 4096x4096, BL/BU 256, face 512, bakeSize 1024, used 256/256/512, with no target scale overrides.

**Disposition:** CONFIRMED. Bridge #1719.

### NR-011 — Alpha.1 produced the target Blood Moon generation

One alpha.1 enable produced native 4096x4096, scale 4/4/4, BL/BU/face 1024, bakeSize 2048, used 1024, valid 1024 body masks, and zero fallback resources across Discus / Short Crown Horn / Celestial Circlet. Amanda visually confirmed fantastic body/decal quality, no poop, and no incorrect channels.

**Disposition:** CONFIRMED ARCHITECTURE PASS. Bridge #1723/#1725 + Amanda visual confirmation.

### NR-012 — Alpha.1 false failure was an identity-guard defect

Alpha.1 rejected HeroForge's legitimate replacement display/modded generation. Alpha.2 changed the safety boundary to adopt that generation while still requiring the same character/data/target part identities.

**Disposition:** CONFIRMED BOOKKEEPING DEFECT / CORRECTED IN ALPHA.2.

### NR-013 — Alpha.2 Blood Moon retest

Fresh Blood Moon alpha.2 retest stayed ON after one adopted native generation and verified native 4096x4096, scale 4/4/4, 1024 allocations, bakeSize 2048, used 1024, and pinned 1024 actual color-bake masks. Amanda visually reconfirmed the figure looks perfect.

**Disposition:** CONFIRMED RUNTIME + VISUAL PASS. Bridge #1727 + Amanda visual confirmation.

### NR-014 — D4 native baseline differs from Blood Moon

After a full page reload with alpha.2 OFF, D4 baseline was:

- atlas 4096x4096;
- bodyLower bake 1024 / used 512;
- bodyUpper bake 1024 / used 512;
- face bake 1024 / used 1024;
- no bodyLower/bodyUpper masksMapOverride.

**Disposition:** CONFIRMED. Bridge #1729.

### NR-015 — D4 native generation promoted bodyLower above the 1024 seed

One alpha.2 enable adopted one native generation. Before rollback, verification observed bodyLower:

- scale 4;
- bakeSize 2048;
- allocation 2048x2048;
- `_usedTextureSize=2048`.

The native 4096 atlas remained coherent. Alpha.2 rejected the state solely because it required `_usedTextureSize === 1024` exactly, then ran its existing rollback path. Readback showed alpha OFF, scheduler idle, and no stale body mask overrides.

**Disposition:** CONFIRMED NATIVE PROMOTION; ALPHA.2 VERIFIER FALSE-NEGATIVE. Bridge #1730/#1731.

### NR-016 — 1024 is a minimum source seed, not necessarily the final native used size

Blood Moon settles at used 1024, while D4 can natively promote bodyLower to used/allocation 2048 under the same scale 4 / bake 2048 policy. Therefore final `_usedTextureSize === 1024` is not a valid cross-figure invariant.

**Disposition:** CONFIRMED FROM CROSS-FIGURE RUNTIME EVIDENCE.

### NR-017 — Alpha.3 verifier contract

Alpha.3:

- still seeds `_usedTextureSize=1024` before reconciliation;
- accepts final used/allocation values from 1024 through the 2048 bake ceiling;
- records native promotion per target;
- still requires scale 4 and bakeSize 2048;
- still requires the loaded body masks to be real 1024 textures;
- additionally requires each actual body color-bake `masksMap` to be the exact pinned 1024 override object.

This deliberately permits native source-size promotion without permitting the known nonexistent-2048-mask fallback/corruption path.

**Disposition:** IMPLEMENTED / LIVE D4 VALIDATION PENDING.

## Next test gate

1. Update/reload alpha.3 on D4 so it starts OFF.
2. Run one enable and read back runtime verification before any retry.
3. Amanda visually validates the D4 body color/glyph channel, body/face quality, decals, accessory channels, and no poop/corruption.
4. Do not promote to Witch Dock Dev until D4 passes.
