# INV-0004 — Native-Reconcile Alpha Evidence

**Date:** 2026-09-12  
**Feature:** `rendering.texture-quality`  
**Purpose:** compact evidence supplement for the transition away from persistent protected-atlas ownership.

## TLDR

The native-reconcile architecture is now visually validated on Blood Moon from a genuine native potato baseline. Alpha.1 produced the correct native `4096x4096` high-resolution generation with correct accessory channels and no poop, but incorrectly declared failure because its guard rejected HeroForge's expected display/modded replacement. Alpha.2 fixes only that bookkeeping boundary by adopting the new generation.

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

### NR-010 — Genuine potato baseline before standalone validation

With old Protected 2048 and Lob High Res Decals OFF, Blood Moon baseline was:

- atlas 4096x4096;
- BL/BU 256x256;
- face 512x512;
- bakeSize 1024;
- used 256/256/512;
- no target scale overrides;
- alpha present but OFF.

**Disposition:** CONFIRMED. Bridge #1719.

### NR-011 — Alpha.1 produced the target native generation

One actual alpha.1 enable path produced:

- native 4096x4096 coherent display/resource atlas;
- scale 4/4/4;
- BL/BU/face 1024x1024 each;
- bakeSize 2048;
- used 1024;
- valid 1024 body masks;
- zero fallback resources across Discus / Short Crown Horn / Celestial Circlet.

Amanda visually confirmed fantastic body/decal quality, no poop, and no incorrect channels.

**Disposition:** CONFIRMED ARCHITECTURE PASS. Bridge #1723/#1725 + Amanda visual confirmation.

### NR-012 — Alpha.1 false failure is an identity-guard defect

Alpha.1 reported `HeroForge replaced the character/display during reconcile.` The resulting generation was nevertheless correct. HeroForge's native lifecycle legitimately replaced the display/modded generation, which alpha.1 had forbidden.

**Disposition:** CONFIRMED BOOKKEEPING DEFECT; architecture remains valid.

### NR-013 — Alpha.2 generation adoption

Alpha.2 changes the safety boundary:

- same `CK.character` and `character.data` are still required;
- same target body/head part identities are still required;
- replacement `character.display` / `display.modded` generations are adopted and counted;
- true character/data/target changes still fail closed.

No custom atlas creation, buildAtlas wrapper, direct atlas assignment, or watcher was added.

**Disposition:** IMPLEMENTED / STATIC-VALIDATED; live retest pending.

Static validation: `node --check` PASS; SHA-256 `27a8a0bba0b001d518d71b768ac4493eac93e15b441cebce63865f67a1a685ea`.

## Next test gate

1. Retest Blood Moon with alpha.2 and confirm the script stays ON after adopting the native generation.
2. Visually reconfirm Blood Moon.
3. Switch to D4 and validate the body color/glyph channel specifically, because Blood Moon does not expose that historical failure as well.
4. Do not promote to Witch Dock Dev until D4 passes.
