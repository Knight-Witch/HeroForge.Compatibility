# Active Context — `feature/rendering-texture-quality`

**Updated:** 2026-09-12  
**Active feature:** `rendering.texture-quality`  
**Current task:** validate a native-reconcile high-resolution prototype that preserves proven source-side quality inputs while leaving atlas/resource generation ownership to HeroForge  
**Runtime posture:** **protect the current correct Blood Moon state; do not activate experimental texture code on it**

## Minimum continuation set

Read, in order:

1. `PROJECT_CONTRACT.md`
2. this file
3. `docs/investigations/INV-0004-current-state-2026-09-12.md`
4. `docs/investigations/INV-0004-evidence-ledger.md`
5. `docs/investigations/INV-0004-native-reconcile-alpha-2026-09-12.md`

Read the old full investigation, feature spec, v0.1.5 source, or policies only when the next decision requires them.

## Protected live Blood Moon — CORRECT

Amanda's native **Kitbash → click figure** transition repaired all previously wrong accessory material/color/emissive channels while preserving high-resolution body texture, sharp decals, and a no-poop state.

Current accepted state:

- `display.atlas = 4096x4096`;
- `atlasScale.bodyLower/bodyUpper/face = 4/4/4`;
- bodyLower/bodyUpper/face allocations = `1024x1024` each;
- target parts remain `bakeSize=2048`, `_usedTextureSize=1024`;
- bodyLower and bodyUpper each use a real validated 1024 mask override, and their color-bake `masksMap` is the exact same texture object as that override (Bridge #1716/#1718);
- Protected Textures standalone OFF;
- Lob High Res Decals OFF.

Do not reload, resize, broad-refresh, force a mode transition, or intentionally recreate the broken generation on this figure merely for instrumentation.

## Native lifecycle now traced

Confirmed source/runtime chain:

1. `CK.character.change(e, ...)` normally calls `character.data.change(e, character.settings)` and then `character.refresh()`; using the high-level method also participates in character events/history semantics. Bridge #1699.
2. `character.data.change(...)` runs `this.modded.change(this)`, later `this.modded._changePaints()`, and sets `needsDisplayUpdate=true`. Bridge #1706.
3. `modded.change(data)` runs HeroForge's normal mod/resource derivation stages and ends with `this.buildAtlas()`. Bridge #1681.
4. Native `modded.buildAtlas()` assigns `this.resourceAtlas = new CK.Atlas({...this.parts}, ..., this.data.isUHD(), this.data.atlasScale)`. It does not need or return a custom protected atlas. Bridge #1715.
5. `character.refresh()` sets `_needsUpdating`; `character.update()` consumes it, calls `display.change(character.data)`, then `display.update()`. Bridge #1700/#1702.
6. `display.change(data)` loads resources selected by `data.modded` and then adopts them through its normal `_loaded(...)` path. Bridge #1703.

This closes the old uncertainty about the scheduler/build boundary. The exact UI-internal Kitbash click handler is no longer required to prototype the native generation path.

## Architecture conclusion

**Confirmed:** v0.1.5 owns much more than the successful native recovery requires. It installs a persistent `modded.buildAtlas` wrapper, constructs large detached atlas candidates, assigns `modded.resourceAtlas` and `display.atlas`, and watches/reasserts ownership.

**Supported inference:** that persistent ownership can preserve an internally coherent but stale/wrong generation and interfere with HeroForge's native resource-size/material reconciliation.

**Leading replacement:** keep only the source-side inputs that coexist in the historical working recipe and the current correct generation, then invoke/allow the native generation lifecycle.

Those inputs are:

- `data.atlasScale.bodyLower/bodyUpper/face = 4`;
- target `bakeSize = 2048`;
- target `_usedTextureSize = 1024`;
- validated per-figure bodyLower/bodyUpper 1024 mask overrides.

Do **not** custom-build/assign an atlas, override `buildAtlas`, or continuously fight native lifecycle ownership.

## New standalone alpha

Parallel prototype:

`entries/tampermonkey-standalone/rendering-texture-quality-native-reconcile.user.js`

Version: `0.2.0-alpha.1`

The alpha deliberately leaves v0.1.5 untouched as historical comparison evidence. It:

- snapshots only fields it owns;
- validates/loads current figure's 1024 body masks;
- applies scale/bake/used-size/mask policy;
- calls `data.change({}, settings)` for full native generation derivation;
- reapplies only the proven source-side policy in case native change refreshed part objects;
- calls the unmodified native `modded.buildAtlas()` once;
- calls `character.refresh()` and waits for native display/resource coherence;
- verifies target scale/bake/used-size, >=1024 target allocations, shared display/resource atlas identity, and actual 1024 color-bake masks;
- has no atlas wrapper, no direct `display.atlas`/`resourceAtlas` assignment, and no automatic ownership watcher;
- on disable/failure, restores every source object it actually touched and lets `data.change({}) + refresh()` rebuild natively rather than restoring stale atlas objects.

**Status:** static/source validated only. It has not been activated in HeroForge and must not be activated on the preserved Blood Moon baseline.

## Binding DO-NOT-REPEAT

Do not repeat without genuinely new evidence:

- poop creation as a recovery strategy;
- broad `instantSettingsChange()`;
- generic physical/physical2/emissive rebakes;
- broad color-cache invalidation;
- accessory skinMask synchronization;
- GPU prewarm;
- cloned/shared mask variations;
- duplicate bake/refresh attempts;
- atlas-size-only fixes;
- meteorHammer as the visible hip-disc fix;
- direct guessed Discus resource substitutions as a substitute for full native generation reconciliation.

Remember: `bakeAtlas()` writes scratch `*Src`; visible completion requires the ordinary decal/dilate path when live textures are off.

## Next test sequence

1. Keep Blood Moon untouched.
2. Install/run `0.2.0-alpha.1` only on a separate safely reproducible figure/state.
3. Capture baseline atlas/allocation/material appearance.
4. Enable alpha once; read back runtime verification before any retry.
5. Amanda visually checks body quality, decals, paint/material/emissive channels, and absence of corruption.
6. Test disable/restore once and read back state.
7. If standalone passes, exercise an ordinary native lifecycle transition/figure change.
8. Only after standalone acceptance consider replacing v0.1.5 and promoting narrowly to Witch Dock Dev. Stable remains untouched until Dev validation.

## Promotion state

- v0.1.5 remains historical experimental reference, not promoted;
- v0.2.0-alpha.1 is the leading standalone architecture but is unvalidated live;
- Witch Dock Dev unchanged;
- public Witch Dock unchanged.
