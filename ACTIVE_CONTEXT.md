# Active Context — `feature/rendering-texture-quality`

**Updated:** 2026-09-12  
**Active feature:** `rendering.texture-quality`  
**Current task:** public Stable v0.1.0 release is complete and validated; next optional follow-up is persistent user preference with fresh safe per-figure reconciliation.  
**Runtime posture:** old Protected 2048 standalone OFF; Lob High Res Decals OFF; standalone alpha.3, Witch Dock Dev v0.1.0, and public Stable v0.1.0 are all validated.

## Minimum continuation set

1. `PROJECT_CONTRACT.md`
2. this file
3. `docs/investigations/INV-0004-current-state-2026-09-12.md`
4. `docs/investigations/INV-0004-native-reconcile-alpha-2026-09-12.md`
5. `docs/investigations/INV-0004-standalone-acceptance-2026-09-12.md`

## Standalone acceptance — PASS

### Blood Moon

Native reconcile produced a coherent `4096x4096` atlas, target allocations `1024x1024`, `bakeSize=2048`, used `1024`, exact real pinned 1024 body masks, and correct accessory channels. Amanda confirmed excellent body texture, sharp decals, no poop, and correct Discus / Celestial Circlet / Short Crown Horn channels.

Bridge evidence: #1727.

### D4

D4 validated the body color/glyph path. Native reconcile produced coherent `4096x4096`, BL/BU/face `2048x2048` allocations with native-promoted used `2048`, exact real pinned 1024 body masks, and correct visual body paint/glyph behavior.

Bridge evidence: #1732/#1733.

## Witch Dock Dev integration — PASS

Dev service/UI v0.1.0 preserved the validated architecture and passed integrated live validation.

### D4

- clean reload: service/UI loaded once, service OFF/inert, standalone global absent;
- one enable: native coherent `4096x4096`, target allocations/used `2048`, exact pinned 1024 masks, one expected generation adoption, no error;
- Amanda visually confirmed body color/glyph, body/face, decals, and material/color/emissive channels all correct;
- controlled disable removed all owned target scale and mask overrides and rebuilt natively;
- OFF -> ON repeated successfully.

Bridge evidence: #1735, #1737, #1738, #1739, #1740.

### Blood Moon

- clean reload: native `4096x4096`, no scale or mask overrides, standalone absent;
- one enable: native coherent `4096x4096`, target allocations/used `1024`, exact pinned 1024 body masks, one expected generation adoption, no error;
- resource scan found zero fallback/broken resources across 16 Discus, 2 Short Crown Horn, and 3 Celestial Circlet instances;
- Amanda confirmed the integrated result still looks correct;
- an ordinary native `CK.character.refresh()` while ON remained verified and adopted the replacement generation;
- non-invasive integration smoke found exactly one loaded `/gated/booth.js`, BT/bootstrap present, and Texture Quality service/UI present with no duplicate Booth runtime introduced.

Bridge evidence: #1741, #1742, #1744, #1745, #1746.

**Disposition:** Witch Dock Dev acceptance gate CLOSED / PASS at `Knight-Witch/KnightWitch.Heroforge` Dev head `c8f8000d9562dbc315dc867af655358177e18d54`.

## Public Stable — PASS / RELEASE CLOSED

Public `Witch_Scripts` promotion commit: `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`.
Final Stable documentation closeout: `c93485d741fe9d1801b0f6924b7204a8d922792c`.

Clean Stable load with Dev/standalone disabled confirmed:

- public service/UI v0.1.0 loaded and started OFF/inert;
- no target scale or body mask overrides before enable;
- Blood Moon native baseline `4096x4096`, BL/BU `1024 bake / 512 used`, face `1024 / 1024`;
- exactly one Booth runtime with BT/bootstrap intact.

One controlled Stable enable confirmed:

- service ON, no error, `lastVerification.ok=true`;
- one expected native generation adoption;
- coherent native `4096x4096` atlas;
- target allocations/used `1024/1024/1024`;
- exact pinned `1024x1024` body color-bake masks;
- scheduler idle.

Final Stable accessory scan found zero broken/fallback resource sets across 16 Discus, 2 Short Crown Horn, and 3 Celestial Circlet instances. Amanda visually confirmed the public Stable result looks great.

Bridge evidence: #1747, #1748, #1750.

**Disposition:** public Stable v0.1.0 acceptance gate CLOSED / PASS.

## Validated architecture

Keep only source-side quality policy and let HeroForge own generation:

- `atlasScale.bodyLower/bodyUpper/face = 4`;
- seed `bakeSize = 2048`;
- seed `_usedTextureSize = 1024` as a minimum, allowing native promotion through 2048;
- hard-pin bodyLower/bodyUpper to real 1024 masks and verify those exact textures remain actual color-bake `masksMap` inputs;
- use native `data.change({}) → modded.change/buildAtlas → character.refresh/update → display.change/update` reconciliation;
- adopt expected replacement display/modded generations while requiring character/data/target-part identity to remain stable.

Do **not** reintroduce custom `CK.Atlas` construction, buildAtlas wrapping, direct atlas assignment, giant-atlas forcing, or an automatic ownership watcher.

## Current persistence behavior / next optional enhancement

Stable v0.1.0 intentionally starts OFF on every page load and turns OFF when HeroForge changes to a different figure. The UI polls `service.refresh()` every 250 ms; `handleStaleFigure()` discards stale session snapshots on character/data replacement and requires a fresh enable for the new figure. A normal renderer refresh on the same character can remain ON and adopt replacement display/modded generations.

If persistence is implemented next, persist only the user's desired ON/OFF preference. Every new page/figure must create a fresh safe session and reconcile against the current character; never carry per-figure snapshots across character boundaries. This change must go Standalone/Dev-first or Dev-first with explicit lifecycle validation before another Stable update.

## Binding DO-NOT-REPEAT

Do not return to persistent protected-atlas ownership, giant-atlas forcing, generic rebakes, broad cache invalidation, skinMask sync, GPU prewarm, poop creation, meteorHammer hip-disc guesses, or per-slot Discus fixes.

## Promotion state

- v0.1.5: historical experimental reference only;
- standalone v0.2.0-alpha.3: PASS;
- Witch Dock Dev v0.1.0: PASS;
- public Stable v0.1.0: PASS / validated;
- next work, if desired: persistent user preference with fresh per-figure safe reconcile.
