# Changelog

## HFC-2026-09-06-029 — Close Spinny v0.3.0 standalone validation

Date: 2026-09-06

### Summary

Recorded completion of the maintained Spinny v0.3.0 standalone validation stage.

Newly closed gates:

- full TRUE-3K 3072 Standard / 250-frame capture: PASS by user full-run validation;
- full TRUE-3K 3072 Slower / 500-frame capture: PASS by user full-run validation and successful post-validation runtime timing history;
- post-consolidation 1024 Standard / 250-frame regression: PASS with parser and restoration diagnostics.

The active next development stage is now Pause + interaction guards.

### 1024 regression diagnostics

HF-Chat-Bridge issue #491 confirmed:

- v0.3.0 / build `0.3.0-integrated-true3k-short-test`;
- status `downloaded`;
- 250/250 rendered and encoded;
- output 12,035,026 bytes;
- parser 1024x1024 / 250 frames / 10,000 ms / 40 ms x250 / loop 0;
- elapsed 272,058.2 ms;
- rotation restored true;
- error null.

### TRUE-3K 500-frame evidence

Runtime timing history retained:

- key `3072:true3k-phase-feed`;
- mode `full`;
- frames 500;
- average frame time ~3032.4224 ms;
- tail ~373.7 ms;
- successful update at `2026-09-06T12:06:28.050Z`.

That history is only written after mux/parser validation and download succeed. Combined with the user's report that the 3K/500 animation looked fantastic at correct resolution with clear movement, this validates the high-cost maintained TRUE-3K path.

The preceding 3072 Standard / 250-frame full run had already been reported as correct-resolution, clear-motion output with a quite accurate ETA.

### Decision

`media.spinny-mini-webp` v0.3.0 is now **standalone validated for its tested production paths on `heroforge07.1.9.98`**.

Native un-repaired HeroForge 3072 remains rejected.

### Next stage

Pause + interaction protection, followed by Witch Dock Dev host/popout/Developer-Mode integration after standalone guard validation.

### Touched files

Documentation only:

- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- `TESTING.md`
- `docs/feature-specs/spinny-mini-webp.md`
- `docs/investigations/INV-0004-spinny-mini-webp-2026-09-05.md`
- `docs/validation/spinny-mini-webp-v0.3.0-full-validation-2026-09-06.md` (new)

**Runtime behavior changed:** no. Documentation-only validation checkpoint.

---

## HFC-2026-09-06-028 — Validate integrated v0.3.0 TRUE-3K Short Test

Integrated TRUE-3K Short Test passed mechanically/visually. Full production validation is now closed by HFC-2026-09-06-029.

---

## HFC-2026-09-06-027 — Integrate TRUE-3K frame source and Short Test into Spinny v0.3.0

Promoted the validated TRUE-3K frame-source repair into the maintained standalone Spinny profile script as v0.3.0 and folded the 16-frame Short Test into the same capture engine.

---

Historical changelog entries remain preserved in Git history.
