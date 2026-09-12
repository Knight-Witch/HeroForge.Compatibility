# Pre-Flight Check

This is the **compact operational preflight log**, not a second investigation history.

Before material committed work:

1. Read `PROJECT_CONTRACT.md` and branch `ACTIVE_CONTEXT.md`.
2. Read only the relevant policy/spec/investigation/source files routed by the task.
3. Inspect target files and directly connected modules.
4. Identify material conflict/rollback risks.
5. Define the narrow validation required for the change.

## PFC-2026-09-12-025 — Native-reconcile texture alpha

**Scope:** add a separate standalone alpha after read-only source/runtime tracing established the native data/modded/atlas/display lifecycle. Do not replace v0.1.5 or mutate the protected Blood Moon baseline.

**Reviewed:** `PROJECT_CONTRACT.md`; branch `ACTIVE_CONTEXT.md`; current INV-0004 state and evidence ledger; v0.1.5 standalone source; texture-quality feature spec; Bridge #1699/#1700/#1702/#1703/#1706/#1681/#1715/#1716/#1718.

**Confirmed before edit:**

- `data.change(...)` invokes `modded.change(data)`, which ends in native `buildAtlas()`;
- native `buildAtlas()` assigns `resourceAtlas` from current parts, UHD state, and `data.atlasScale`;
- `character.refresh()` schedules `character.update()`, which calls `display.change(data)` then `display.update()`;
- high-level `character.change` adds events/history semantics that are not required for the first prototype;
- v0.1.5 persistently wraps `buildAtlas`, owns/assigns atlas objects, and watches/reasserts ownership;
- the current correct Blood Moon uses real 1024 bodyLower/bodyUpper mask overrides as its actual color-bake masks.

**Target changes:**

- add `entries/tampermonkey-standalone/rendering-texture-quality-native-reconcile.user.js` v`0.2.0-alpha.1`;
- add compact native-reconcile evidence supplement;
- update branch active context, changelog, and this preflight record.

**Architecture constraints:**

- no custom `CK.Atlas` construction;
- no `modded.buildAtlas` replacement/wrapper;
- no direct `display.atlas` or `modded.resourceAtlas` assignment;
- no automatic watcher fighting HeroForge;
- source policy limited to target atlasScale=4, bakeSize=2048, `_usedTextureSize=1024`, and validated 1024 body masks;
- restore every scale/part/mesh object actually touched, including objects refreshed during native reconciliation;
- live acceptance requires separate safe figure/state plus human visual validation.

**Static validation:** `node --check` PASS; grep audit found no custom atlas construction, buildAtlas replacement, or direct atlas assignment. SHA-256 `a6f835156bc52da024933699462fc8d51fe95e743afa3fa265b75ee246242a23`.

**Runtime validation:** not yet performed by design. Only read-only bridge probes were run against the preserved correct Blood Moon; health check remained idle/coherent at `4096x4096`.

**Rollback:** alpha is a new parallel file; v0.1.5 is unchanged. Alpha enable snapshots all owned source fields. Disable/failure restores those snapshots and requests native `data.change({}) + refresh()` rather than restoring stale atlas objects.

**Public impact:** none. Witch Dock Dev and Stable unchanged.

---

## PFC-2026-09-12-024 — Native Kitbash reconciliation checkpoint

Recorded the decisive user-triggered Kitbash/click repair: all accessory channels corrected while body/decal quality remained accepted; native atlas became `4096x4096` with scale `4/4/4` and target allocations `1024x1024`.

**Runtime/public impact of that documentation commit:** none.

---

## Historical records

Older detailed preflight records remain in Git history. Fetch only the record relevant to the current decision.
