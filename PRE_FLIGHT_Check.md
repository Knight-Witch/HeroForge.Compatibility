# Pre-Flight Check

This is the **compact operational preflight log**, not a second investigation history.

Before material committed work:

1. Read `PROJECT_CONTRACT.md` and branch `ACTIVE_CONTEXT.md`.
2. Read only the relevant policy/spec/investigation/source files routed by the task.
3. Inspect target files and directly connected modules.
4. Identify material conflict/rollback risks.
5. Define the narrow validation required for the change.

## PFC-2026-09-12-030 — Final public Stable acceptance / release closeout

**Scope:** close the public Stable release gate for `rendering.texture-quality`, update the branch router, and record the next optional persistence improvement without changing runtime code.

**Reviewed:** binding `PROJECT_CONTRACT.md`; current branch `ACTIVE_CONTEXT.md`; Stable promotion commit `4bb0cc9ff18b7d797ead8d16f7a63032250616cf`; public Stable baseline #1747; Stable enable/readback #1748; Stable accessory/topology smoke #1750; Amanda's final public visual confirmation; current Stable service/UI source behavior around page reload and stale-figure handling.

**Confirmed public Stable behavior:**

- Stable service/UI v0.1.0 loaded with Witch Dock Dev disabled and standalone Texture Quality absent;
- clean public baseline: native coherent 4096 atlas, BL/BU bake 1024 used 512, face bake/used 1024, no target scale overrides, no body mask overrides, scheduler idle;
- Booth topology remained exactly one `/gated/booth.js`, with BT/bootstrap present;
- one controlled public enable resolved true and left service ON / not busy / no error;
- verification PASS: one expected generation adoption, coherent 4096 atlas, target allocations/used 1024, exact pinned 1024 body masks, scheduler idle;
- targeted accessory scan: 16 Discus / 2 Short Crown Horn / 3 Celestial Circlet, zero broken/fallback resource sets;
- Amanda visually confirmed the public Stable result looks great.

**Disposition:** public Stable v0.1.0 acceptance PASS / CLOSED. Stable closeout docs: `Knight-Witch/KnightWitch.Heroforge` commit `c93485d741fe9d1801b0f6924b7204a8d922792c`.

**Current persistence behavior:**

- page reload starts a fresh OFF service;
- UI calls `service.refresh()` every 250 ms;
- character/data replacement triggers stale-figure handling, clears the old session, and reports OFF for the new figure;
- normal renderer refresh on the same character can remain ON and adopt replacement display/modded generations.

**Next optional enhancement:** persistent desired ON/OFF preference with fresh safe per-page/per-figure reconciliation. Persistence must never reuse per-figure source snapshots across character boundaries. Any implementation must follow the normal Dev-first lifecycle and revalidate reload + figure-switch behavior before Stable promotion.

**Conflict risks if persistence is implemented later:** automatic enable must wait for HeroForge readiness, avoid duplicate concurrent reconcile, fail closed if capability/masks are unavailable, and distinguish user preference from current figure session state. It must not reintroduce an ownership watcher or stale snapshot replay.

**Runtime behavior changed by this checkpoint:** no. Documentation/router update only.

---

## PFC-2026-09-12-029 — Witch Dock Dev acceptance before Stable promotion

Dev integration PASS on D4 and Blood Moon; Stable promotion explicitly authorized. Superseded by PFC-030 for release progression.

---

## PFC-2026-09-12-028 — Standalone acceptance checkpoint before Witch Dock Dev promotion

Standalone validation PASS on Blood Moon and D4; alpha.3 became the canonical Dev source. Superseded by later release checkpoints.

---

## Historical records

Older detailed preflight records remain in Git history. Fetch only the record relevant to the current decision.
