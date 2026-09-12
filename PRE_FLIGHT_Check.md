# Pre-Flight Check

This is the **compact operational preflight log**, not a second investigation history.

Before material committed work:

1. Read `PROJECT_CONTRACT.md` and branch `ACTIVE_CONTEXT.md`.
2. Read only the relevant policy/spec/investigation/source files routed by the task.
3. Inspect target files and directly connected modules.
4. Identify material conflict/rollback risks.
5. Define the narrow validation required for the change.

## PFC-2026-09-12-026 — Alpha.2 native-generation adoption after Blood Moon live pass

**Scope:** correct alpha.1 bookkeeping after the first real standalone-path Blood Moon validation proved the native-reconcile architecture visually works.

**Reviewed:** `PROJECT_CONTRACT.md`; `ACTIVE_CONTEXT.md`; current INV-0004 state; native-reconcile evidence supplement; alpha.1 source; Blood Moon baseline/readback Bridge #1719/#1723/#1725; Amanda's visual confirmation.

**Confirmed before edit:**

- genuine native baseline was 4096x4096 with BL/BU 256, face 512, bakeSize 1024, used 256/256/512, no target scale overrides;
- one actual alpha.1 enable path produced native 4096x4096 with scale 4/4/4, BL/BU/face 1024, bakeSize 2048, used 1024, valid 1024 body masks, and zero fallbacks across Discus/Short Crown Horn/Celestial Circlet;
- Amanda confirmed body/decal quality is excellent, no poop, and all visible accessory channels are correct;
- alpha.1's only observed failure was its strict display/modded identity guard; HeroForge legitimately replaced those generation objects during the successful reconcile.

**Target change:** advance standalone to `0.2.0-alpha.2` and adopt replacement display/modded generations while preserving character/data/target-part identity as the stale-session safety boundary.

**Architecture constraints preserved:**

- no custom `CK.Atlas` construction;
- no buildAtlas replacement/wrapper;
- no direct `display.atlas` / `resourceAtlas` assignment;
- no automatic ownership watcher;
- source policy remains scale 4, bakeSize 2048, `_usedTextureSize=1024`, validated 1024 body masks;
- actual character/data or target-part changes still fail closed.

**Static validation:** `node --check` PASS; source audit PASS; SHA-256 `27a8a0bba0b001d518d71b768ac4493eac93e15b441cebce63865f67a1a685ea`.

**Runtime validation required after commit:**

1. reload/update alpha.2 on Blood Moon;
2. verify alpha.2 remains ON after native generation replacement and reproduces the accepted visual result;
3. switch to D4 and validate the body color/glyph channel specifically;
4. do not promote to Witch Dock Dev before D4 passes.

**Rollback:** v0.1.5 remains untouched historical reference; alpha.2 is standalone-only. Existing local HeroForge saves are not overwritten unless the user manually saves them.

**Public impact:** none. Witch Dock Dev and Stable unchanged.

---

## PFC-2026-09-12-025 — Native-reconcile texture alpha

Added parallel `0.2.0-alpha.1` after tracing the native data/modded/build/display lifecycle. Static/source validation passed; the subsequent live Blood Moon run is recorded in PFC-026.

---

## Historical records

Older detailed preflight records remain in Git history. Fetch only the record relevant to the current decision.
