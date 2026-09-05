# Changelog

All committed repository updates must be recorded here.

## HFC-2026-09-05-011 — Add standalone Photo Booth true-resolution 4K proof

**Date:** 2026-09-05

### Summary

Recorded the current Photo Booth high-resolution capture diagnosis and added a standalone 4096px proof that bypasses the new private Booth capture/compositing helper without patching `boothui.js`. The proof uses the named `CK.Capture.renderToImage` runtime path with the active Photo Booth camera and explicitly requests a 1x 4096x4096 render target.

### Added

- `entries/tampermonkey-standalone/photo-booth-true-resolution.user.js` — standalone v0.1.0 4K proof.
- `docs/feature-specs/photo-booth-screenshot-resolution.md` — behavior/capability/lifecycle contract for `media.screenshot-resolution`.
- `docs/investigations/INV-0003-photo-booth-high-res-capture-2026-09-05.md` — current-runtime diagnosis and repair rationale.

### Confirmed diagnosis

- Current ADP v0.99.30 still exposes 4096px and 8192px by changing the Photo Booth resolution-loop ceiling from `<=2*CK.Settings.screenshotSize` to `<=4*CK.Settings.screenshotSize` while setting `CK.Settings.screenshotSize = 2048`.
- Amanda confirmed the downloaded files have literal 4K/8K dimensions but visibly lack corresponding detail; 8K is softer still at 100% view.
- After a normal 4096px Lob capture, live `CK.Capture.renderTarget` remained 2048x2048.
- Temporarily changing `CK.Settings.screenshotSize` to 4096 did not change the real render target; it still ended at 2048x2048. The setting was restored to 2048.
- Current `CK.Capture.renderToImage` has no 2048 hard clamp and can size its render target from requested width/height and AA factor.
- Current WebGL capability reports `maxTextureSize = 16384` on the tested machine/browser.

### Standalone proof behavior

- Requires Photo Booth to be open/initialized.
- Uses the active Booth camera with current `CK.renderManager.camera` only as fallback.
- Calls `CK.Capture.renderToImage(4096, 4096, camera, 1, true)`.
- Verifies both the real render target and returned canvas are 4096x4096 before downloading.
- Uses current named `boothScreenshotStarted` / `boothScreenshotFinished` events when available.
- Restores the pre-existing `CK.Capture.renderTarget` dimensions after capture.
- Exposes `HFPhotoBoothTrueResolutionTest.lastCapture` diagnostic metadata.
- Does not enable 8K yet; 8192px remains gated until 4K visual parity passes.

### Test status

- JavaScript syntax check with Node: **passed**.
- Existing 4096 Lob path real-render diagnosis: **passed live** (2048x2048 underlying target).
- `CK.Settings.screenshotSize = 4096` hypothesis: **rejected live** (target remained 2048x2048).
- Standalone true-4096 render/download: **pending Amanda live test**.
- Photo Booth visual/effect parity: **pending Amanda live test**.
- 8K: **not enabled / pending 4K gate**.

### Runtime impact

Repository code only until Amanda installs the standalone test.

- No Witch Dock Dev or Stable runtime code changed.
- No current Lob/ADP source changed.
- No HeroForge bundle interception or patching added.
- No persistent HeroForge or character setting is changed by initialization.
- Exact ADP v0.99.30 source is still not archived under `/legacy/`; that provenance gate remains open before final maintained parity status.

### Next gate

Install the standalone 4K proof, capture the same Photo Booth scene, verify `lastCapture.renderTarget` and canvas are 4096x4096, and compare real detail/effects against the existing blurry Lob 4096 output. Only after that passes should 8192px be enabled.

### Rollback

Disable/remove the standalone Tampermonkey test or revert this commit. Native HeroForge and Lob capture actions are not replaced by the proof.

---

## HFC-2026-09-05-010 — Synchronize corrected bound gizmo Stable status

**Date:** 2026-09-05

### Summary

Updated `HeroForge.Compatibility` durable status after `decals.gizmo.bound-correction` completed standalone validation, Witch Dock Dev testing, and explicit Witch Dock Stable promotion. Recorded the later WITCH_DEV v0.4.0-v0.4.2 undo/transform-state repair and removed stale claims that the gizmo remained an external v0.4.1 experiment awaiting extraction.

### Confirmed Stable milestone

- Move Ctrl+Z / Ctrl+Shift+Z: passed.
- Rotate Ctrl+Z / Ctrl+Shift+Z: passed.
- Scale Ctrl+Z / Ctrl+Shift+Z: passed.
- Existing sane Project ON/OFF state preservation: passed.
- Decal artwork replacement while Project OFF preserves the prior finite bound transform: passed.
- Fresh decal slot first Project-OFF conversion no longer accepts HeroForge's observed bad initializer near `v=1.503942117`, `s=1.768586891`, `sy=1.768586891`; v0.4.2 normalizes only those three values to zero when no genuine prior bound state exists.
- WITCH_DEV v0.4.1's failed fresh-slot scale model was corrected by treating only genuine Project-OFF state as authoritative bound transform history.
- Public Witch Dock repair commit: `1712b0ba24c8303d8d446d88cdf66199978045e7`.

### Diagnosis recorded

- With correction disabled, HeroForge's native Project-OFF gizmo produced working undo entries, isolating the undo regression to corrected Move integration.
- Corrected Move had been using `CK.activeTweak()` repeatedly during pointer movement; current runtime behavior records repeated intermediate history snapshots through that path.
- The accepted repair performs live character data change/refresh during Move and leaves `CK.passiveChangeFinish()` as the single completed-drag undo commit.
- `characterEnterChange` observation is lifecycle-managed to preserve real bound transform state across relevant Project/decal-art transitions.

### Status corrections

Updated:

- `MASTER.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `MIGRATION_PLAN.md`
- `TESTING.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

The remaining `decals.advanced-posing` family is still not approved or implemented merely because the bound gizmo reached Stable. Full Res renderer audit, HF Core Tweaks slot audit, canonical v0.99.30 archival, and provider/coexistence work remain separate gates.

### Runtime impact

Documentation only.

- No JavaScript changed in `HeroForge.Compatibility`.
- No HeroForge runtime behavior changed.
- No public or Dev Witch Dock runtime code changed by this commit.
- No legacy source under `/legacy/` was modified.
- No HF-Chat-Bridge runtime code changed.

### Next gate

Return to the remaining Advanced Decal Posing dependency/ownership work without reopening the now-stable bound gizmo except for regression/compatibility maintenance.

### Rollback

Revert this documentation-only status synchronization. The already-promoted Witch Dock Stable feature is unaffected.

---

## HFC-2026-09-04-009 — Audit current ADP v0.99.30 decal posing subsystem

**Date:** 2026-09-04

### Summary

Audited the exact `Advanced_Decal_Posing_KW_9-3-26_TEST_PATCH.js` v0.99.30 source currently identified by Amanda as the patched ADP copy Lob is running, limited intentionally to the decal posing subsystem. Normalized repository status around the completed bound-gizmo investigation and the existing committed standalone reconstructions.

### Added

- `docs/script-audits/advanced-decal-posing-v0.99.30-decal-posing-subsystem.md`

### Confirmed audit findings

- Current v0.99.30 Project compatibility has a viable runtime/DOM path using `UIState`, ordered decal metadata, and `CK.activeTweak`.
- The same source still retains the older compiled React Project/Unequal Scaling injection, creating duplicate ownership risk.
- Full List UI/state is separate from the `heroforgeui.js` catalog/filter source transform.
- Transform range expansion remains exact compiled-string UI patching.
- Project and Unequal Scaling renderer behavior remains an external Full Res dependency.
- Explicit slot-schema expansion is not confirmed in this v0.99.30 file; current HF Core Tweaks requires a targeted audit before first-pass slot parity can be claimed.
- The corrected bound gizmo is not legacy v0.99.30 behavior; it is a new Knight Witch reconstruction.

### Bound gizmo status recorded

Recorded the external v0.4.1 current-build validation milestone:

- stable projector-volume center;
- per-frame camera tracking;
- screen-space Move horizontal/vertical renderer regression passes;
- Rotate and Scale state/restore passes;
- disable/re-enable lifecycle pass;
- human Move and Rotate usability pass;
- uneven Project-OFF visual scale intentionally deferred.

### Status corrections

Updated `MASTER.md`, `FEATURE_INVENTORY.md`, `MIGRATION_PLAN.md`, `COMPATIBILITY.md`, and `TESTING.md` so they no longer claim that no reconstructed standalone work exists and so the next Advanced Decal Posing reconstruction gates are explicit.

### Touched files

- `docs/script-audits/advanced-decal-posing-v0.99.30-decal-posing-subsystem.md`
- `MASTER.md`
- `FEATURE_INVENTORY.md`
- `MIGRATION_PLAN.md`
- `COMPATIBILITY.md`
- `TESTING.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Runtime impact

Documentation only.

- No JavaScript changed in `HeroForge.Compatibility`.
- No HeroForge runtime behavior changed.
- No public or Dev Witch Dock runtime behavior changed.
- No legacy source under `/legacy/` was modified.

### Test notes

No new runtime test was performed by this commit. The audit records already completed live/runtime evidence and human validation from the current investigation.

### Next gate

Before maintained Advanced Decal Posing implementation begins:

1. archive exact ADP v0.99.30 source under immutable `/legacy/`;
2. audit current Full Res v0.80 projected/unequal renderer support;
3. audit current HF Core Tweaks decal slot/schema behavior if slots remain in first-pass scope;
4. write the consolidated feature specification.

### Rollback

Revert this documentation commit. External diagnostic issues and already completed live tests are unaffected.

---

## HFC-2026-09-03-008 — Record JSON live pass and add projected-decal standalone test

**Date:** 2026-09-03

### Summary

Recorded Amanda's successful live local JSON Save/Load test and added the first standalone reconstruction test for the missing Advanced Decal Posing v0.99.23 Project control.

### JSON validation

- Standalone local JSON Save: **passed live**.
- Standalone local JSON Load: **passed live**.
- The loaded JSON preserved the figure's decal data and could be reloaded successfully.
- Full repeated-use / reload / dispose acceptance remains pending; the broken core Save/Load behavior is restored.

### Added

- `entries/tampermonkey-standalone/projected-decal-toggle.user.js` — standalone Project state test v0.1.0.
- `docs/feature-specs/projected-decal-toggle.md` — projected-decal behavior, capability, lifecycle, and acceptance contract.

### Confirmed projected-decal evidence

- Advanced Decal Posing v0.99.23 writes `forceProjectedScript` on splatter decal records.
- Supplied Full Res renderer support treats `undefined` as native behavior, `true` as force projected, and `false` as force unprojected.
- Live `CK.character.data.decals` exposes current decal buckets.
- Amanda's uploaded JSON contains 35 splatter records; 34 explicitly contain `forceProjectedScript: false`, one leaves the field undefined, and none currently contain `true`.
- The Slot F test candidate maps to splatter key `6`, decal ID `20990`, current state `false`.
- Current HeroForge's native Mirror handler still uses `CK.activeTweak({decals: ...})` to update one decal record while preserving the surrounding decal state.

### Behavior

- Test UI is independent of HeroForge React and does not patch `heroforgeui.js`.
- Manual slot selector is used for v0.1.0 because automatic native selected-slot discovery is not yet proven.
- `ON` writes `forceProjectedScript: true`.
- `OFF` writes `forceProjectedScript: false`.
- `Native` writes `forceProjectedScript: undefined`.
- No HeroForge function is replaced and no Witch Dock code changed.

### Test status

- JavaScript syntax check with Node: **passed**.
- Live projected-decal state inspection: **passed**.
- Live Project ON/OFF/Native behavior: **pending Amanda test**.
- Re-pose persistence / JSON persistence / undo-redo / dispose: **pending**.

### Rollback

Disable/remove the standalone projected-decal test or revert this commit. Existing decal data changes made by explicit test button presses must be reversed with OFF/Native, HeroForge undo, or a prior saved state as appropriate.

---

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
- Live script resources included `gated/advimport.js` in addition to the previously observed HeroForge core scripts.

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