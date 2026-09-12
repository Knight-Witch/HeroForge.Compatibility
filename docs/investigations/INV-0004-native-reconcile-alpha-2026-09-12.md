# INV-0004 — Native-Reconcile Alpha Evidence

**Date:** 2026-09-12  
**Feature:** `rendering.texture-quality`  
**Purpose:** compact evidence supplement for the transition away from persistent protected-atlas ownership.

## TLDR

HeroForge's native generation path is now traced far enough to build a non-invasive architecture prototype. The important boundary is not a guessed Kitbash UI function; it is the ordinary data/modded/display lifecycle:

`data.change(...) → modded.change(data) → native buildAtlas() → character.refresh() → character.update() → display.change(data) → display.update()`.

A parallel standalone alpha now preserves only the proven high-resolution source inputs and lets HeroForge construct/select/adopt its own atlas/resources. It has not yet been activated live.

## Evidence

### NR-001 — Character scheduler consumer

**Result:** `character.refresh()` sets `_needsUpdating`; `character.update()` consumes it, clears the flag, calls `display.change(character.data)`, then `display.update()`.

**Disposition:** **CONFIRMED**.

**Evidence:** Bridge #1700, #1702.

### NR-002 — Display adoption is downstream of resource-atlas construction

**Result:** `display.change(data)` asks `CustomDisplay._getResources(data.modded, ...)`, loads those resources, and calls its normal `_loaded(...)` path. The fresh `data.modded.resourceAtlas` therefore exists before display adoption.

**Disposition:** **CONFIRMED**.

**Evidence:** Bridge #1703.

### NR-003 — Data change invokes full modded generation

**Result:** `character.data.change(...)` invokes `this.modded.change(this)`, later `_changePaints()`, and sets `needsDisplayUpdate=true`.

**Disposition:** **CONFIRMED**.

**Evidence:** Bridge #1706.

### NR-004 — Modded change ends in native atlas construction

**Result:** `modded.change(data)` runs normal mod/resource derivation and ends with `this.buildAtlas()`.

**Disposition:** **CONFIRMED**.

**Evidence:** Bridge #1681.

### NR-005 — Native buildAtlas contract

**Result:** current native `modded.buildAtlas()` assigns:

`this.resourceAtlas = new CK.Atlas({...this.parts}, ..., this.data.isUHD(), this.data.atlasScale)`

It does not require a custom atlas object and does not need a persistent wrapper.

**Disposition:** **CONFIRMED**.

**Evidence:** Bridge #1715.

### NR-006 — High-level character.change adds unrelated semantics

**Result:** `CK.character.change(e, ...)` calls `data.change(e, settings)` and `refresh()`, but also emits character events and normally participates in saved-change/undo history behavior.

**Disposition:** **CONFIRMED; avoid as first alpha trigger when lower-level lifecycle is sufficient**.

**Evidence:** Bridge #1699.

### NR-007 — Correct generation still uses explicit valid 1024 body masks

**Result:** on the currently correct Blood Moon generation, both bodyLower and bodyUpper have own `masksMapOverride` textures at 1024x1024; each color-bake `masksMap` is the exact same texture object as its override.

**Disposition:** **CONFIRMED; retain validated 1024 mask pinning in alpha**.

**Evidence:** Bridge #1716, #1718.

### NR-008 — Persistent protected-atlas ownership is no longer the leading design

**Result:** v0.1.5 installs a `buildAtlas` wrapper, creates detached giant atlases, assigns display/resource atlas objects, and watches/reasserts ownership. The successful native-reconciled generation instead uses a native 4096 atlas while retaining accepted high-resolution source settings.

**Disposition:** **SUPPORTED STRONGLY as architecture problem; do not delete v0.1.5 until alpha passes**.

**Evidence:** v0.1.5 source + main INV-0004 TQ-048–TQ-052.

### NR-009 — Native-reconcile standalone alpha

**Result:** added parallel `0.2.0-alpha.1` prototype that owns scale/bake/used-size/valid masks only, invokes native data/modded rebuild, requests one native buildAtlas after reapplying policy to refreshed parts, then lets the normal character scheduler adopt/display it. No custom atlas creation, buildAtlas wrapper, direct atlas assignment, or lifecycle watcher.

**Disposition:** **IMPLEMENTED / STATIC-VALIDATED / LIVE UNVALIDATED**.

**Source:** `entries/tampermonkey-standalone/rendering-texture-quality-native-reconcile.user.js`.

## Claim levels

**Confirmed:** the core generation/scheduler chain above; native buildAtlas consumes `data.atlasScale`; current correct body masks remain pinned to valid 1024 resources; v0.1.5 owns atlas lifecycle persistently.

**Supported inference:** `data.change({}, settings)` is a suitable low-level way to request the same native generation derivation without `character.change` history/event semantics; a second native `buildAtlas()` after reapplying target metadata should preserve the refreshed resource selection while honoring current high-resolution source caps.

**Hypothesis awaiting live test:** the alpha sequence reproduces the useful native reconciliation consistently on a safely reproducible non-Blood-Moon state and avoids v0.1.5's wrong-channel generation failure.

## Test gate

Do not test on the preserved Blood Moon. First live validation must use a separate state and must include runtime readback plus Amanda's visual check. A timed-out or uncertain mutation must be read back before any retry.
