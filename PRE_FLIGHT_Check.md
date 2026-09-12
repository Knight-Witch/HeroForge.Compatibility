# Pre-Flight Check

This is the **compact operational preflight log**, not a second investigation history.

Before material committed work:

1. Read `PROJECT_CONTRACT.md` and branch `ACTIVE_CONTEXT.md`.
2. Read only the relevant policy/spec/investigation/source files routed by the task.
3. Inspect target files and directly connected modules.
4. Identify material conflict/rollback risks.
5. Define the narrow validation required for the change.

## PFC-2026-09-12-027 — Alpha.3 native-promotion verifier correction after D4 probe

**Scope:** correct alpha.2's quality verifier after D4 proved HeroForge can legitimately promote `_usedTextureSize` and packed allocation above the 1024 seed during native reconciliation.

**Reviewed:** `PROJECT_CONTRACT.md`; branch `ACTIVE_CONTEXT.md`; native-reconcile standalone source; current native-reconcile investigation supplement; Blood Moon alpha.2 runtime pass #1727; D4 baseline #1729; D4 alpha.2 enable/readback #1730/#1731.

**Confirmed before edit:**

- Blood Moon alpha.2 remained ON after one expected native generation adoption and reproduced the accepted 4096 atlas / scale 4 / 1024 allocations / bake 2048 / used 1024 / pinned 1024-mask state; Amanda visually reconfirmed it looks perfect;
- D4 native baseline differs from Blood Moon: BL/BU used 512, face used 1024, with no body mask overrides;
- on one D4 alpha.2 enable, HeroForge promoted bodyLower to used 2048 with a 2048x2048 allocation while scale remained 4 and bakeSize 2048;
- alpha.2 rejected that generation only because `verify()` required `usedTextureSize === 1024`;
- the failure path rolled back and left alpha OFF with an idle scheduler and no stale mask overrides;
- no D4 visual verdict was taken from that rejected transient generation.

**Target change:** advance standalone to `0.2.0-alpha.3`; keep 1024 as the seeded/minimum source size but accept native promotion through the 2048 bake ceiling.

**Safety tightening:** bodyLower/bodyUpper verification must still prove the actual color-bake `masksMap` is exactly the pinned valid 1024 override object. This prevents native source-size promotion from silently reopening the known nonexistent-2048-mask corruption path.

**Architecture constraints preserved:**

- no custom `CK.Atlas` construction;
- no buildAtlas replacement/wrapper;
- no direct `display.atlas` / `resourceAtlas` assignment;
- no automatic ownership watcher;
- character/data/target-part identity remains the stale-session safety boundary;
- scale remains 4 and bakeSize remains 2048;
- actual body masks remain hard-pinned/verified at 1024.

**Required live validation after commit:**

1. update/reload alpha.3 on D4 so it starts OFF;
2. capture baseline and run exactly one enable;
3. verify native promotion is accepted only if allocations/source sizes remain within 1024..2048 and pinned 1024 masks survive as actual color-bake inputs;
4. Amanda visually checks D4 body color/glyph correctness, body/face quality, decals, accessory channels, and no poop/corruption;
5. do not promote to Witch Dock Dev before D4 passes.

**Rollback:** v0.1.5 and alpha.2 history remain intact. D4 is not autosaved by HeroForge; failure path retains snapshot restore + native rebuild behavior.

**Public impact:** none. Witch Dock Dev and Stable unchanged.

---

## PFC-2026-09-12-026 — Alpha.2 native-generation adoption after Blood Moon live pass

Alpha.2 changed the stale-session boundary to adopt native display/modded replacement generations while preserving character/data/target-part identity checks. Subsequent Blood Moon retest passed; D4's native-promotion verifier case is superseded by PFC-027.

---

## Historical records

Older detailed preflight records remain in Git history. Fetch only the record relevant to the current decision.
