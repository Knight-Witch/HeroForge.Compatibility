# Changelog

## HFC-2026-09-06-028 — Validate integrated v0.3.0 TRUE-3K Short Test

Date: 2026-09-06

### Summary

Recorded the first live validation of the consolidated Spinny v0.3.0 capture engine at 3072 TRUE-3K using the integrated 16-frame Short Test.

User native-size inspection passed: the downloaded Short Test is visibly sharp and retains the previously validated TRUE-3K detail rather than reproducing the blurry native-3072 baseline.

### Runtime evidence

HF-Chat-Bridge read-only issue #490 confirmed the active implementation is:

- version `0.3.0`;
- build `0.3.0-integrated-true3k-short-test`.

The successful Short Test had already updated session timing history under the repaired-source key:

- timing key: `3072:true3k-phase-feed`;
- mode: `short-test`;
- frames: 16;
- average frame time: approximately 2123.48 ms;
- frame source: `true3k-phase-feed`;
- Short Test mux-tail value intentionally stored as 0 for future full-run ETA seeding.

Because v0.3.0 updates timing history only after WebP mux/parser validation and download succeed, the presence of this 16-frame history record confirms the integrated Short Test reached the successful post-validation path.

### Later overwritten `lastCapture`

A later full 3072 capture was started and cancelled after two frames, overwriting the successful Short Test `lastCapture` record before diagnostics were read.

That later cancelled run independently confirmed:

- full mode used `true3k-phase-feed`;
- both completed frames used native 768px tiles / 4x4 grid;
- 16 expected / 16 supplied / 16 unique phases per completed frame;
- one 3072 source render per completed frame;
- `effectsRestored: true` for both completed frames;
- figure rotation restored: true;
- cancellation error was the expected `Capture cancelled.`

Therefore the detailed Short Test parser snapshot is no longer available in `lastCapture`, but its successful completion is supported by the download observed by the user, visual inspection, and the post-validation timing-history record.

### Decision

Integrated v0.3.0 TRUE-3K Short Test: **PASS**.

The next required gate is one full repaired 3072 Standard / 250-frame capture. Complete 3072 production-profile validation is still pending that full run.

### Touched files

Documentation only:

- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `TESTING.md`
- `docs/feature-specs/spinny-mini-webp.md`
- `docs/investigations/INV-0004-spinny-mini-webp-2026-09-05.md`
- `docs/validation/spinny-mini-webp-v0.3.0-short-test-2026-09-06.md` (new)

**Runtime behavior changed:** no. Documentation-only validation checkpoint.

---

## HFC-2026-09-06-027 — Integrate TRUE-3K frame source and Short Test into Spinny v0.3.0

Promoted the validated TRUE-3K frame-source repair into the maintained standalone Spinny profile script as v0.3.0 and folded the 16-frame Short Test into the same capture engine.

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
