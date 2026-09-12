# Changelog

This is a **rolling current changelog**. Older verbose entries remain durable in Git history and should be fetched only when relevant.

## HFC-2026-09-12-028 — Add native-reconcile texture alpha

**Date:** 2026-09-12

### Summary

Traced the native HeroForge generation/scheduler boundary far enough to implement a parallel `rendering.texture-quality` alpha that stops owning atlas objects and instead preserves only proven high-resolution source inputs while letting HeroForge perform resource selection, atlas construction, loading, and display adoption.

### Added

- `entries/tampermonkey-standalone/rendering-texture-quality-native-reconcile.user.js` v`0.2.0-alpha.1`;
- `docs/investigations/INV-0004-native-reconcile-alpha-2026-09-12.md`;
- updated `ACTIVE_CONTEXT.md` to route continuation work to the new evidence/prototype.

### Confirmed call chain

- `character.data.change(...)` → `modded.change(data)` → native `buildAtlas()`;
- native `buildAtlas()` assigns `resourceAtlas = new CK.Atlas(...parts..., data.isUHD(), data.atlasScale)`;
- `character.refresh()` → `character.update()` → `display.change(character.data)` → `display.update()`;
- current correct Blood Moon bodyLower/bodyUpper retain real 1024 mask overrides that are also the actual color-bake mask textures.

### Alpha boundary

The alpha does **not** create a custom atlas, override `modded.buildAtlas`, directly assign `display.atlas`/`resourceAtlas`, or run a persistent ownership watcher. It snapshots/restores only the source objects it touches and uses native reconstruction for enable/disable reconciliation.

### Validation

- static syntax: `node --check` PASS;
- source audit: no `new CK.Atlas`, no buildAtlas override, no direct atlas assignment;
- userscript SHA-256 at commit preparation: `a6f835156bc52da024933699462fc8d51fe95e743afa3fa265b75ee246242a23`;
- bridge source/read-only evidence: #1699, #1700, #1702, #1703, #1706, #1715, #1716, #1718.

### Runtime/public impact

No live alpha activation was performed. The preserved correct Blood Moon figure was read only and remains the protected baseline. Existing v0.1.5 source remains untouched. Witch Dock Dev and public Stable are untouched.

---

## HFC-2026-09-12-027 — Confirm native reconciliation restores channels while high-res survives

Entering Kitbash and clicking Blood Moon caused a native generation rebuild that repaired all visible accessory channels while preserving visually accepted high-resolution body/decals and no poop. Post-state: native `4096x4096`, scale `4/4/4`, BL/BU/face `1024x1024`, `bakeSize=2048`, `_usedTextureSize=1024`. This shifted the architecture direction away from persistent giant-atlas ownership.

**Runtime impact of the documentation commit:** none.

---

## Historical entries

Detailed HFC-2026-09-12-026 and earlier entries remain in Git history at and before the parent of this rolling changelog. Use the relevant investigation/evidence ledger or Git history when older detail is material.
