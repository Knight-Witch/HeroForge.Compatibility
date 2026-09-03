# Changelog

All committed repository updates must be recorded here.

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
