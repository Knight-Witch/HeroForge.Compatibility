# Pre-Flight Check

This is the **compact operational preflight log**, not a second investigation history.

Before material committed work:

1. Read `PROJECT_CONTRACT.md` and branch `ACTIVE_CONTEXT.md`.
2. Read only the relevant policy/spec/investigation/source files routed by the task.
3. Inspect target files and directly connected modules.
4. Identify material conflict/rollback risks.
5. Define the narrow validation required for the change.

## PFC-2026-09-12-029 — Witch Dock Dev acceptance before Stable promotion

**Scope:** close the integrated Dev gate for `rendering.texture-quality`, refresh the branch router, and authorize the next stage only after explicit user approval.

**Reviewed:** `PROJECT_CONTRACT.md`; stale branch `ACTIVE_CONTEXT.md`; validated standalone alpha.3 architecture; Witch Dock Dev integration results; D4 lifecycle evidence #1735/#1737/#1738/#1739/#1740; Blood Moon integrated evidence #1741/#1742/#1744/#1745/#1746; Amanda's visual confirmations on both figures.

**Confirmed D4 Dev behavior:**

- clean load: service/UI v0.1.0 loaded once, service OFF/inert, standalone global absent;
- enable: native coherent 4096 atlas, target allocations/used 2048, exact pinned 1024 body masks, one expected generation adoption, no error;
- visual: historical body color/glyph path correct, body/face and decals sharp, no poop/corruption, no wrong material/color/emissive channels;
- disable: target scale overrides and body mask overrides absent afterward, native 4096 rebuild, scheduler idle;
- repeat OFF -> ON: PASS;
- native OFF rebuild recalculated used sizes to 1024/1024/1024 rather than exact initial 512/512/1024; exact transient native used-size restoration is not claimed.

**Confirmed Blood Moon Dev behavior:**

- clean load: native 4096 atlas, no feature-owned scale/mask overrides, standalone absent;
- enable: native coherent 4096 atlas, target allocations/used 1024, exact pinned 1024 body masks, one expected generation adoption, no error;
- targeted scan: zero broken/fallback resources across 16 Discus, 2 Short Crown Horn, 3 Celestial Circlet instances;
- visual: body/decal quality, no poop, and accessory color/material/emissive channels all correct;
- ordinary native `CK.character.refresh()` while ON: service remained enabled and verified after adopting the replacement generation;
- topology smoke: exactly one loaded `/gated/booth.js`; BT/bootstrap present; Texture Quality service/UI present; no duplicate Booth runtime introduced.

**Disposition:** Witch Dock Dev acceptance PASS at Dev head `c8f8000d9562dbc315dc867af655358177e18d54`.

**Stable promotion decision:** Amanda explicitly said “go for it” after the completed Dev gate. Stable promotion is therefore authorized.

**Stable promotion requirements:**

- do not merge the whole Dev branch;
- promote only the validated Texture Quality service/UI, exact required Stable manifest registration/URLs, and durable Stable docs;
- preserve v0.1.0 service/UI behavior unless a mechanical branch-path/cache-key adjustment is required;
- inspect current Stable head first so unrelated public changes are not overwritten;
- run syntax/manifest/version identity checks before moving the Stable ref;
- after public promotion, perform a clean Stable load and narrow live smoke through HF-Chat-Bridge;
- if the Stable smoke fails, stop public expansion and repair in Dev.

**Conflict risks:** WITCH_DEV_UI contains unrelated Booth/media/decal work that must not be merged wholesale. Stable manifest may differ from Dev, so only the Texture Quality entries should be added against the current public file. Existing public module versions and loaders should remain unchanged unless strictly required by this feature.

**Runtime behavior changed by this checkpoint:** no. This is a Compatibility documentation/router update only; public Stable remains unchanged until the separate Stable commit.

---

## PFC-2026-09-12-028 — Standalone acceptance checkpoint before Witch Dock Dev promotion

Standalone validation PASS on Blood Moon and D4; alpha.3 became the canonical Dev source. Superseded by PFC-029 for release progression.

---

## Historical records

Older detailed preflight records remain in Git history. Fetch only the record relevant to the current decision.
