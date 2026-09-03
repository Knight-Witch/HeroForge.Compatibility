# Pre-Flight Check Log

Use this file before committed repository updates to record what was checked, what can conflict, and what action is recommended.

## PFC-2026-09-03-004 — Record first live runtime capability evidence

**Date:** 2026-09-03  
**Time:** approximately 00:58 PDT

### Target files

- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `COMPATIBILITY.md`
- `TESTING.md`
- `docs/investigations/INV-0001-live-runtime-capability-probe-2026-09-03.md`

### Relevant history checked

- `PROJECT_CONTRACT.md`
- current `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, and `TESTING.md`
- HF-Chat-Bridge project contract and current read-only safety boundary
- Issue #8 successful `runtime.capabilityProbe`
- Issue #9 successful `runtime.describePath` result for `CK.display` with `getter_blocked`
- previously validated Issues #2 and #3 transport/resource evidence
- public `Knight-Witch/KnightWitch.Heroforge` boundary

### Confirmed findings

- Top-level named `HF` and `CK` function objects are present in the tested live HeroForge page.
- `HF` exposes named properties including `settings`, `loadedData`, `finishedLoading`, `Data`, `ThreeCharacters`, and `CustomFace`.
- `CK` exposes a large bounded named surface including character I/O, undo/redo, camera/display, tweak, and state-facing names.
- `TN`, `BT`, and `THREE` were not present as top-level globals in the tested page state.
- `React` and `ReactDOM` were present.
- `CK.display` is an accessor/getter and the generic read-only probe correctly refused to invoke it.
- Current live resources include `gated/advimport.js` in addition to the previously observed HeroForge core scripts.

### Conflict risks

- Named runtime presence must not be treated as a stable API guarantee without semantics/readiness/build validation.
- Accessor properties may execute HeroForge code on read; generic traversal must remain getter-blocked.
- The current script-resource probe strips URL query strings and therefore does not supply a durable build fingerprint.
- No feature code, patch, or Witch Dock production code is changed by this documentation update.

### Recommended action

Record the capability evidence as an active investigation. Collect the already queued bounded follow-up path/global probes. Do not weaken the generic getter block; if accessor inspection becomes necessary, design a narrowly allowlisted read-only probe with explicit side-effect review.

---

## PFC-2026-09-03-003 — Record validated live diagnostic transport

**Date:** 2026-09-03  
**Time:** approximately 00:50 PDT

### Target files

- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `COMPATIBILITY.md`
- `TESTING.md`

### Relevant history checked

- `PROJECT_CONTRACT.md`
- current `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, and `TESTING.md`
- HF-Chat-Bridge Issue #1 first live round-trip and duplicate-result defect
- HF-Chat-Bridge Issue #2 fresh relay v0.1.2 single-result retest beyond the lease interval
- HF-Chat-Bridge Issue #3 successful `runtime.listScripts` result
- public `Knight-Witch/KnightWitch.Heroforge` boundary

### Confirmed findings

- HF-Chat-Bridge end-to-end read-only transport is live-validated in the tested setup.
- Relay v0.1.2 passed the stale-open duplicate-request regression test.
- The first non-ping read-only probe successfully returned bounded live script-resource data.
- Maintained named runtime capabilities were still unproven at that stage.

### Recommended action

Record the validated diagnostic transport state, then run the bounded `runtime.capabilityProbe`.

---

## PFC-2026-09-02-002 — External HF-Chat-Bridge diagnostic scaffold status

**Date:** 2026-09-02  
**Time:** 23:51 PDT

### Summary

Recorded the external private diagnostic scaffold and its boundary from the maintained compatibility bridge before live validation.

---

## PFC-2026-07-13-001 — Initial Documentation Bootstrap

**Date:** 2026-07-13  
**Time:** 18:44 PDT

### Summary

Established the initial repository documentation, architecture, inventory, compatibility, ownership, migration, testing, source/entry/test guidance, and decision-record structure before runtime reconstruction.
