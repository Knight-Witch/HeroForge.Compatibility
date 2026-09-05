# Pre-Flight Check Log

Use this file before committed repository updates to record what was checked, what can conflict, and what action is recommended.

## PFC-2026-09-05-008 — Synchronize stable corrected bound gizmo status

**Date:** 2026-09-05

### Target files

- `MASTER.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `MIGRATION_PLAN.md`
- `TESTING.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Required material reviewed

- `PROJECT_CONTRACT.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `ARCHITECTURE.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- `MIGRATION_PLAN.md`
- `TESTING.md`
- current Witch Dock public `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, and `HISTORY/BULLSHIT/BOUND_DECAL_GIZMO.md`
- current Witch Dock stable corrected-gizmo loader and accepted five source fragments
- WITCH_DEV v0.4.0, v0.4.1, and v0.4.2 runtime test results
- Witch Dock stable repair commit `1712b0ba24c8303d8d446d88cdf66199978045e7`

### Confirmed findings

- `decals.gizmo.bound-correction` has completed the intended standalone -> Witch Dock Dev -> Witch Dock Stable path.
- Move, Rotate, and Scale Ctrl+Z / Ctrl+Shift+Z passed live testing.
- The corrected Move undo problem was integration-specific: repeated `CK.activeTweak()` calls during pointer movement produced repeated intermediate history snapshots on the current runtime.
- The validated repair uses live character data change/refresh during Move and retains the existing final `CK.passiveChangeFinish()` commit.
- Existing sane Project ON/OFF state is preserved.
- Changing decal artwork while Project OFF preserves the prior finite bound transform.
- A brand-new Project-OFF slot with no genuine prior bound state can receive HeroForge's observed bad initializer near `v=1.503942117`, `s=1.768586891`, `sy=1.768586891`; the validated v0.4.2 repair normalizes only those three values to zero when the known signature is present.
- WITCH_DEV v0.4.1 failed the fresh-slot scale case because projected scale values were incorrectly treated as an authoritative bound baseline; v0.4.2 corrected that model by caching only genuine Project-OFF state.
- Public Witch Dock Stable does not depend on `HeroForge.Compatibility` runtime code or the HF-Chat-Bridge transport.
- Compatibility repository status files were stale because they still described the bound gizmo as an external v0.4.1 experiment awaiting Witch Dock integration.

### Material conflict risks

- Documentation-only update in `HeroForge.Compatibility`; do not modify maintained JavaScript, `/legacy/`, Witch Dock runtime code, or the HF-Chat-Bridge repository.
- Do not imply the entire `decals.advanced-posing` family is stable because the bound gizmo is stable.
- Do not collapse the remaining Full Res renderer audit, HF Core Tweaks slot audit, provider arbitration, or ADP coexistence gates into the completed gizmo migration.
- Preserve the explicit boundary that Witch Dock Stable consumes its own published module and does not load this repository's development head.
- Keep unequal Project-OFF visible scaling, exact artwork-center polish, and projector wireframe correction marked deferred rather than silently solved.

### Recommended action

Commit a documentation-only status synchronization recording the completed gizmo promotion and v0.4.2 repair. No runtime behavior changes. After this checkpoint, the next material Advanced Decal Posing stage may return to the exact v0.99.30 archival/dependency audits without reopening the stable gizmo implementation.

---

## PFC-2026-09-04-007 — ADP v0.99.30 decal posing subsystem audit

**Date:** 2026-09-04

### Target files

- `docs/script-audits/advanced-decal-posing-v0.99.30-decal-posing-subsystem.md`
- `MASTER.md`
- `FEATURE_INVENTORY.md`
- `MIGRATION_PLAN.md`
- `COMPATIBILITY.md`
- `TESTING.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Required material reviewed

- `PROJECT_CONTRACT.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `ARCHITECTURE.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- `MIGRATION_PLAN.md`
- `TESTING.md`
- `docs/script-audits/README.md`
- `docs/feature-specs/projected-decal-toggle.md`
- `docs/investigations/INV-0002-september-2026-adp-breakage-scope-v09923-correction.md`
- `docs/decisions/ADR-0002-immutable-legacy-sources.md`
- `docs/decisions/ADR-0003-standalone-first-promotion.md`
- committed `entries/tampermonkey-standalone/projected-decal-toggle.user.js`
- user-supplied `Advanced_Decal_Posing_KW_9-3-26_TEST_PATCH.js` v0.99.30, SHA-256 `659a84d1a4b01db4143d713618a216dd46dcc5dbed7bd6e668fe61290276170d`
- prior Lob architecture audit for dependency/history comparison
- current 2026-09-04 bound-gizmo runtime investigation and validation results

### Confirmed findings

- v0.99.30 is the current ADP reference for this work and is reported as the copy Lob is running.
- The current source has a newer runtime/DOM Project compatibility service using `UIState`, ordered decal metadata, and `CK.activeTweak`.
- The current source still retains the older compiled React Project/Unequal Scaling injection, creating duplicate ownership risk.
- Full List has a separate DOM control but the expanded catalog/filter behavior still depends on `heroforgeui.js` source transformation.
- Transform range expansion is still exact compiled-string UI patching.
- Project/Unequal renderer semantics are external to ADP and remain dependent on current Full Res behavior.
- Explicit decal slot-schema expansion is not confirmed in v0.99.30; current HF Core Tweaks must be audited before claiming first-pass slot parity.
- The corrected bound gizmo is not present in v0.99.30; the validated v0.4.1 gizmo is a new Knight Witch reconstruction.
- Repository status files were stale: committed standalone JSON/Project tests existed while `MASTER.md`/`COMPATIBILITY.md` still described no reconstructed features.

### Material conflict risks

- Do not port the v0.99.30 `heroforgeui.js` interceptor wholesale.
- Do not allow Witch Dock and Lob to mount duplicate Project/Full List controllers or independently drive the same posing state.
- Do not let Witch Dock independently patch `heroforgeui.js` while current Lob ADP owns that bundle.
- Do not silently depend on Full Res for renderer semantics in a future standalone/Witch Dock feature; declare and gate the renderer capability.
- Do not treat older ADP slot-expansion attribution as current v0.99.30 fact.
- Do not migrate unresolved short compiled patches without behavioral proof.
- The exact v0.99.30 source is not yet archived under `/legacy/`; archival is required before maintained reconstruction begins.

### Recommended action

Commit this documentation-only audit/status normalization. No JavaScript or runtime behavior changes. Next material stage must archive v0.99.30, audit current Full Res v0.80 projected renderer support, and audit HF Core Tweaks slot/schema behavior if slots remain first-pass scope before writing the consolidated production feature spec.

---

## PFC-2026-09-03-006 — Projected decal standalone reconstruction

**Date:** 2026-09-03

### Target files

- `entries/tampermonkey-standalone/projected-decal-toggle.user.js`
- `docs/feature-specs/projected-decal-toggle.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Required material reviewed

- `PROJECT_CONTRACT.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `ARCHITECTURE.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- `TESTING.md`
- current standalone character JSON reconstruction
- canonical user-supplied 2026-09-02 script export, including Advanced Decal Posing v0.99.23 and Full Res Decals/Textures
- current projected-decal renderer investigation evidence
- current HeroForge native Mirror `CK.activeTweak` update pattern from the August targeted compatibility capture
- Amanda's live projected Slot F state and uploaded local JSON save

### Confirmed findings

- Local JSON Save and Load core behavior passed Amanda's live test before this reconstruction proceeds.
- Advanced Decal Posing's missing Project control is a UI injection failure; its persisted field remains present.
- The legacy control writes `forceProjectedScript` on `decals.splatter[...]`.
- Current Full Res renderer logic consumes that field as a tri-state override: undefined/native, true/projected, false/unprojected.
- Live `CK.character.data.decals` exposes `bodyLower`, `bodyUpper`, `face`, and `splatter` on the loaded test figure.
- The uploaded figure JSON contains 35 splatter records, 34 with `forceProjectedScript: false`, one without the field, and none with `true`.
- The Slot F test candidate uses numeric key `6`; its saved record has decal ID `20990` and current Project state `false`.
- Current HeroForge's native Mirror action still updates the selected decal through `CK.activeTweak({decals: ...})`, preserving the surrounding bucket and record state.

### Supported inference

- Alphabetic Slot F is mapped to numeric splatter key `6` by the standalone test harness. That mapping is highly consistent with the UI/data layout but the exact human-readable `Four Rune Spell Column` -> ID `20990` relationship is not promoted to confirmed until the live test affects the expected Slot F decal.

### Material conflict risks

- The standalone test must not repair or reintroduce the old `heroforgeui.js` compiled-string injection.
- The test must preserve all other decal buckets and records when changing one `forceProjectedScript` field.
- The Full Res renderer dependency remains external to this feature; if its renderer patch is absent, changing the field may persist without affecting rendering.
- Automatic synchronization with HeroForge's currently selected native decal slot is not yet proven, so v0.1.0 requires explicit slot selection.
- Existing figure data must not be silently changed on initialization. Mutation occurs only after explicit ON/OFF/Native button use.
- No Witch Dock production file is touched.

### Recommended action

Commit standalone v0.1.0 using the named `CK.activeTweak` runtime path and independent UI. Validate Slot F ON/OFF/Native behavior, re-pose behavior, JSON persistence, undo/redo, and disposal before considering native selected-slot detection or Witch Dock Dev integration.

---

## PFC-2026-09-03-005 — Character local JSON standalone reconstruction

**Date:** 2026-09-03

### Target files

- `entries/tampermonkey-standalone/character-local-json.user.js`
- `docs/feature-specs/character-local-json.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Canonical reference reviewed

- User-supplied 2026-09-02 Tampermonkey export.
- `Advanced Decal Posing.user.js` v0.99.23, SHA-256 `08dfb5bf7e75c2e4d92b0e0d856d49b04f3ee28a04836fa014a327312573f039`.
- Relevant v0.99.23 local Save/Load implementation and its `heroforgeui.js` injection anchor.
- Current project contract, master state, architecture, feature inventory, compatibility, ownership, testing, and investigation notes.

### Confirmed live runtime evidence

- `CK.UndoQueue` exists and exposes `queue` / `currentIndex` (HF-Chat-Bridge #19).
- `CK.tryLoadCharacter` exists (#20).
- `CK.character.data` exists (#22).
- `CK.toJson` / `CK.fromJson` exist (#26 / #27).
- `CK.UndoQueue.queue` is currently an array (#30).
- `CK.UndoQueue.currentIndex` is currently numeric (#31).

### Diagnosis

The direct local Save/Load feature's required named runtime surfaces still exist. The missing local controls therefore do not justify repairing the old native React / compiled `heroforgeui.js` injection. The lower-risk reconstruction is independent UI calling the still-present named runtime behavior.

### Material conflict risks

- Export must use the current UndoQueue index so it does not save a stale snapshot.
- Import intentionally mutates the active character only after explicit user file selection, matching legacy behavior.
- The standalone test must not intercept or replace `heroforgeui.js`.
- The standalone test must not override HeroForge runtime methods.
- Advanced Decal Posing v0.99.23 may remain enabled; its missing native Save/Load injection should not conflict with the independent panel.
- No Witch Dock production file is touched.

### Recommended action

Commit standalone test v0.1.0, install it separately in Tampermonkey, validate save/load/repeated use, and only then update durable feature status or begin the projected-decal repair.

---

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

Record the capability evidence as an active investigation. Collect the already queued bounded follow-up probes. Do not weaken the generic getter block; if accessor inspection becomes necessary, design a narrowly allowlisted read-only probe with explicit side-effect review.

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
