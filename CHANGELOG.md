# Changelog

## HFC-2026-09-06-027 — Integrate TRUE-3K frame source and Short Test into Spinny v0.3.0

Date: 2026-09-06

### Summary

Promoted the validated TRUE-3K frame-source repair into the maintained standalone Spinny profile script as v0.3.0 and folded the 16-frame Short Test into the same capture engine.

The goal is to eliminate the permanent stacked-test architecture while preserving one canonical capture path for full capture, Short Test, WebP encoding/mux, cancellation, timing and restoration.

### Runtime changes

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

Version: `0.3.0`
Build: `0.3.0-integrated-true3k-short-test`

Changes:

- 1024 and 2048 continue using native `BT.maker.takeScreenshot(size,size)` frame capture.
- 3072 now uses the validated TRUE-3K phase-feed repair.
- Each repaired 3072 animation frame temporarily wraps `CK.Effects.renderToCanvas` only for that frame's synchronous screenshot call.
- The wrapper classifies the live native tile/grid topology, renders one genuine 3072x3072 Effects source, derives the requested native phases, validates complete delivery, and restores the exact Effects method immediately afterward.
- `BT.maker.takeScreenshot` is not replaced or reassigned, preserving the Witch Dock 4096/8192 still-provider ownership boundary.
- Added integrated `captureShortTest()` using 16 contiguous frames and the selected full profile's normal angular step.
- Short Test uses the same frame source, refresh sequencing, browser static-WebP encode, RIFF mux, parser and figure-rotation lifecycle as full capture.
- Added per-frame frame-source diagnostics for repaired 3072 output.
- Timing history is keyed by resolution + frame-source path, preventing old blurry/native 3072 timing from contaminating TRUE-3K estimates.
- Short Test can teach per-frame timing for a later full capture but does not seed the full capture with its small mux-tail cost.
- 3072 label now identifies the integrated TRUE-3K candidate rather than the rejected native 3K path.

### Short Test product decision

Short Test remains a maintained diagnostic capability.

- Standalone dev harness: visible directly.
- Future Witch Dock normal UI: hidden.
- Future Witch Dock Developer Mode: exposes Short Test and relevant diagnostics through the existing `KWDeveloperMode` visibility/state contract.
- Developer Mode does not own or duplicate Spinny capture logic.

### Preserved behavior

- Standard: 250 frames / 10 s / 40 ms
- Slow: 375 frames / 15 s / 40 ms
- Slower: 500 frames / 20 s / 40 ms
- Very Slow: 750 frames / 30 s / 40 ms
- browser static-WebP frame encoding
- deterministic project-owned animated-WebP RIFF mux
- parser validation
- cancel after current frame
- figure starting-rotation restoration
- long-capture warning / progress / ETA UI
- public Witch Dock unchanged
- 4K Spinny still deferred

### Static validation

- `node --check`: PASS
- all speed-profile frame durations retained: PASS
- full capture / Short Test / cancel APIs present: PASS
- rotation restoration path present: PASS
- per-frame Effects restoration path present: PASS
- `BT.maker.takeScreenshot` ownership replacement absent: PASS
- TRUE-3K timing history separated from native path: PASS

### Live validation status

Pending:

- integrated 3072 Standard Short Test;
- integrated full repaired 3072 Standard / 250 frames;
- optional lower-resolution regression smoke after consolidation.

The previously separate TRUE-3K repair principle itself is already validated mechanically and visually; this entry does not yet claim the complete integrated v0.3.0 3072 profile has passed.

### Touched files

- `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `ARCHITECTURE.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- `TESTING.md`
- `docs/feature-specs/spinny-mini-webp.md`
- `docs/investigations/INV-0004-spinny-mini-webp-2026-09-05.md`

**Runtime behavior changed:** yes — standalone Spinny v0.3.0 candidate only. Public Witch Dock unchanged.

---

## HFC-2026-09-06-026 — Validate TRUE-3K repaired Short Test

Validated the standalone repair companion's 16-frame TRUE-3K output mechanically and by native-size visual inspection.

---

## HFC-2026-09-06-025 — Diagnose 3072 render-source loss and add TRUE-3K repair companion

Confirmed native 3072 uses 768px Effects phase renders and added the standalone phase-feed repair candidate.

---

## HFC-2026-09-06-024 — Add Spinny Short Test companion and reject current 3072 fidelity

Recorded the structurally correct but visually blurry native 3072 full run and added the rapid partial-spin diagnostic.

---

Historical changelog entries remain preserved in Git history.
