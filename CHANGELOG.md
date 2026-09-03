# Changelog

All committed repository updates must be recorded here.

## HFC-2026-09-03-007 — Add standalone character local JSON test

**Date:** 2026-09-03

### Summary

Added the first standalone reconstruction for the currently broken Advanced Decal Posing v0.99.23 local character JSON Save/Load feature. The test uses confirmed named `CK` runtime surfaces and independent UI rather than repairing brittle `heroforgeui.js` native React injection.

### Added

- `entries/tampermonkey-standalone/character-local-json.user.js` — standalone v0.1.0 test.
- `docs/feature-specs/character-local-json.md` — feature behavior, capability, lifecycle, and acceptance contract.

### Confirmed evidence used

HF-Chat-Bridge Issues #19, #20, #22, #26, #27, #30, and #31 confirmed the legacy feature's required runtime surfaces remain present, including the live UndoQueue snapshot array/index and `CK.tryLoadCharacter`.

### Behavior

- Save uses `CK.UndoQueue.queue[CK.UndoQueue.currentIndex]`, matching Advanced Decal Posing v0.99.23.
- Load parses a user-selected JSON file and calls `CK.tryLoadCharacter` with the legacy message/callback pattern.
- UI is an independent temporary test panel plus Tampermonkey menu commands.
- No HeroForge bundle is intercepted or modified.
- No HeroForge runtime function is replaced.
- No Witch Dock code changed.

### Test status

- JavaScript syntax check with Node: **passed**.
- Live capability discovery: **passed**.
- Live Save JSON behavior: **pending Amanda test**.
- Live Load JSON behavior: **pending Amanda test**.
- Repeated-use / reload / dispose tests: **pending**.

### Rollback

Disable/remove the standalone Tampermonkey test or revert this commit. Advanced Decal Posing and unmodified HeroForge behavior are otherwise untouched.

---

## HFC-2026-09-03-006 — Correct September ADP investigation source

**Date:** 2026-09-03

### Summary

Amanda supplied the current 9/2/26 Tampermonkey export after the first breakage note was written. The active Advanced Decal Posing reference is v0.99.23, superseding the provisional v0.99.20 File Library copy.

### Recorded commits

- `42e692e3f41aac6d745a4f006796760db511d8a7` — initial documentation-only breakage scope written before the newer export was supplied.
- `cce4b9df1733a93be46c64684fad2c009c7d3463` — documentation-only correction identifying v0.99.23 and the 9/2/26 export as canonical for this investigation.

### Runtime impact

Documentation only. No HeroForge runtime behavior, maintained JavaScript, or Witch Dock production code changed.

---

## HFC-2026-09-03-004 — Record first live runtime capability investigation

**Date:** 2026-09-03  
**Time:** approximately 00:58 PDT

### Summary

Recorded the first bounded live runtime capability probe and the first confirmed accessor safety boundary. The tested page exposes named top-level `HF` and `CK` surfaces, while `CK.display` is getter-backed and remains intentionally blocked by generic read-only traversal.

### Added

- `docs/investigations/INV-0001-live-runtime-capability-probe-2026-09-03.md`

### Changed

- `MASTER.md` advances current work from transport bring-up to named runtime capability investigation.
- `COMPATIBILITY.md` records the observed `HF` / `CK` / React globals and the absence of top-level `TN` / `BT` / `THREE` in the tested page state.
- `TESTING.md` records the passed capability probe and `CK.display` getter-block result.
- Updated pre-flight tracking for the follow-up path/accessor investigation.

### Runtime evidence

- Issue #8 `runtime.capabilityProbe`: **passed**.
- Top-level `HF`: **available**.
- Top-level `CK`: **available**.
- Top-level `TN`, `BT`, `THREE`: **unavailable in tested state**.
- Top-level `React`, `ReactDOM`: **available**.
- Issue #9 `runtime.describePath` on `CK.display`: probe completed and returned **`getter_blocked`** without invoking the accessor.
- Live script resources included `gated/advimport.js` in addition to the previously observed core HeroForge scripts.

### Touched files

- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `COMPATIBILITY.md`
- `TESTING.md`
- `docs/investigations/INV-0001-live-runtime-capability-probe-2026-09-03.md`

### Runtime impact

Documentation/investigation only in `HeroForge.Compatibility`.

- No JavaScript changed in this repository.
- No HeroForge runtime state was mutated by the recorded probes.
- No Witch Dock production file, manifest, or runtime behavior changed.

### Next gate

Collect queued bounded follow-up probes, distinguish data properties from accessors, identify a safe build/fingerprint source, and only then design the first maintained capability adapter.

### Rollback

Revert this documentation commit to remove the recorded investigation/status. External HF-Chat-Bridge issues/results remain unaffected.

---

## HFC-2026-09-03-003 — Record validated HF-Chat-Bridge transport

**Date:** 2026-09-03  
**Time:** approximately 00:50 PDT

### Summary

Updated durable project status after the external private HF-Chat-Bridge passed its live read-only round-trip, duplicate-request regression retest, and first non-ping resource probe. Capability discovery became the active diagnostic stage.

### Runtime impact

Documentation/status only in `HeroForge.Compatibility`.

---

## HFC-2026-09-02-002 — Record external HF-Chat-Bridge diagnostic scaffold

**Date:** 2026-09-02  
**Time:** 23:51 PDT

### Summary

Recorded the private HF-Chat-Bridge scaffold as external development infrastructure and clarified its boundary from the planned maintained compatibility bridge.

### Runtime impact

Documentation/status only in `HeroForge.Compatibility`.

---

## HFC-2026-07-13-001 — Initial documentation and architecture bootstrap

**Date:** 2026-07-13  
**Time:** 18:44 PDT

### Summary

Established the initial durable documentation system for HeroForge.Compatibility.

### Runtime impact

Documentation and repository structure only.
