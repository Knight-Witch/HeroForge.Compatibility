# Changelog

This is a **rolling current changelog**. Older verbose entries remain durable in Git history and should be fetched only when relevant.

## HFC-2026-09-12-033 — Close public Stable texture-quality release

**Date:** 2026-09-12

### Summary

Public Stable Texture Quality v0.1.0 passed the final clean Stable runtime and visual smoke. The release gate is closed.

### Stable validation

Public `Witch_Scripts` promotion commit `4bb0cc9ff18b7d797ead8d16f7a63032250616cf` loaded with Witch Dock Dev disabled and the standalone Texture Quality script absent.

Bridge #1747 confirmed the public service/UI loaded, started OFF/inert, left Blood Moon at a native coherent `4096x4096` baseline with BL/BU `used=512/512`, face `used=1024`, no target scale overrides, no body mask overrides, scheduler idle, and exactly one Booth runtime with BT/bootstrap present.

Bridge #1748 confirmed one controlled Stable enable resolved true, stayed ON with no error, adopted one expected native generation, verified coherent `4096x4096`, target allocations/used `1024/1024/1024`, exact pinned 1024 body masks, and scheduler idle.

Bridge #1750 found zero broken/fallback resource sets across 16 Discus, 2 Short Crown Horn, and 3 Celestial Circlet instances while retaining exactly one Booth runtime. Amanda visually confirmed the public result looks great.

### Persistence behavior recorded

Stable v0.1.0 intentionally does not persist enabled state across page reloads or figure changes. Same-character renderer refreshes can remain ON; character/data replacement clears stale session bookkeeping OFF. A future persistent preference should store only desired ON/OFF and create a fresh safe reconcile session per page/figure.

### Disposition

Public Stable v0.1.0 acceptance PASS / CLOSED. Stable closeout docs are recorded at `Knight-Witch/KnightWitch.Heroforge` commit `c93485d741fe9d1801b0f6924b7204a8d922792c`.

**Runtime behavior changed by this Compatibility checkpoint:** no.

---

## HFC-2026-09-12-032 — Close Witch Dock Dev acceptance and authorize Stable promotion

**Date:** 2026-09-12

The `rendering.texture-quality` native-reconcile architecture passed full Witch Dock Dev integration validation on D4 and Blood Moon, including lifecycle, native refresh, accessory-resource, and Booth-topology smoke. Amanda explicitly authorized Stable promotion.

---

## HFC-2026-09-12-031 — Close standalone texture-quality acceptance gate

**Date:** 2026-09-12

Standalone native-reconcile validation passed on Blood Moon and D4. Alpha.3 became the canonical validated source for Witch Dock Dev integration. No custom atlas, buildAtlas wrapper, direct atlas assignment, or persistent ownership watcher is used.

---

## HFC-2026-09-12-030 — Accept native source-size promotion for D4 alpha validation

Alpha.3 corrected alpha.2's exact-1024 verifier false-negative by accepting native source/allocation promotion through 2048 while tightening exact pinned-1024 body-mask verification.

---

## Historical entries

Detailed HFC-2026-09-12-029 and earlier entries remain in Git history. Use the investigation/evidence ledger or Git history when older detail is material.
