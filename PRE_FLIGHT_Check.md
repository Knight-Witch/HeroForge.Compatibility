# Pre-Flight Check

This is the **compact operational preflight log**, not a second investigation history.

Before material committed work:

1. Read `PROJECT_CONTRACT.md` and branch `ACTIVE_CONTEXT.md`.
2. Read only the relevant policy/spec/investigation/source files routed by the task.
3. Inspect target files and directly connected modules.
4. Identify material conflict/rollback risks.
5. Define the narrow validation required for the change.

## PFC-2026-09-12-028 — Standalone acceptance checkpoint before Witch Dock Dev promotion

**Scope:** close the native-reconcile standalone acceptance gate after alpha.3 passed D4 and record the exact behavior that must be preserved in Witch Dock Dev.

**Reviewed:** `PROJECT_CONTRACT.md`; branch `ACTIVE_CONTEXT.md`; `docs/policies/FEATURE_LIFECYCLE_TESTING_RELEASE.md`; alpha.3 standalone source; Blood Moon pass #1727; D4 baseline #1732; D4 alpha.3 enable/readback #1733; Amanda's visual confirmations on both figures.

**Confirmed before this checkpoint:**

- Blood Moon alpha.2: native coherent 4096 atlas, scale 4, 1024 allocations, bake 2048, used 1024, exact pinned 1024 body masks, no script error, visually excellent body/decals, no poop, and correct accessory channels;
- D4 alpha.3 baseline: native 4096 atlas, BL/BU bake 1024 used 512, face bake 1024 used 1024, alpha OFF;
- D4 alpha.3 enable: one native generation adoption, native coherent 4096 atlas, scale 4, BL/BU/face 2048 allocations, bake 2048, native-promoted used 2048 on all three targets, exact pinned 1024 body masks, alpha ON, no script error;
- Amanda confirmed D4 body color/paint and glyph channel are correct, body/face and decals are sharp, no poop/corruption, and no wrong accessory channels.

**Disposition:** standalone validation PASS. Alpha.3 becomes the canonical source behavior for the Dev integration stage.

**Dev promotion requirements:**

- off by default after load; loading the Dev module must not mutate HeroForge;
- preserve alpha.3 source policy, native reconcile, generation adoption, exact pinned-mask checks, rollback, and stale-character safety;
- no custom atlas construction, buildAtlas wrapper, direct atlas assignment, or ownership watcher;
- no runtime dependency on HeroForge.Compatibility or HF-Chat-Bridge;
- integrated Dev UI should expose explicit enable/disable plus useful diagnostics without changing existing Witch Dock tools;
- module versions/manifest identities must be registered and cache-keyed per Witch Dock module-versioning rules;
- Stable remains untouched until integrated Dev runtime + human visual acceptance.

**Conflict risks:** Witch Dock Dev already contains Booth/media/decal compatibility modules. Texture-quality integration must not wrap or replace their HeroForge lifecycle surfaces, must not auto-enable itself, and must keep failures isolated to this feature.

**Validation next:** static syntax/manifest/module-identity audit, then live Dev load with feature OFF, one controlled enable on Blood Moon and D4/equivalent body-glyph case, one disable/restore check, and normal Witch Dock/Booth smoke as relevant.

**Runtime behavior changed by this checkpoint:** no. Public Stable unchanged.

---

## PFC-2026-09-12-027 — Alpha.3 native-promotion verifier correction after D4 probe

Alpha.3 changed 1024 from an exact used-size requirement to the minimum protected source size while retaining a 2048 ceiling and exact pinned-1024 body color-mask verification. Subsequent D4 runtime + visual validation passed; superseded by PFC-028.

---

## Historical records

Older detailed preflight records remain in Git history. Fetch only the record relevant to the current decision.
