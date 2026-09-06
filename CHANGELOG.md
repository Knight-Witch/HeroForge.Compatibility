# Changelog

## HFC-2026-09-06-030 — Validate Spinny v0.4.0 Pause/Resume candidate

Date: 2026-09-06

### Summary

Recorded successful standalone live validation of the local Spinny v0.4.0 Pause/Resume candidate build `0.4.0-frame-boundary-pause-resume`.

User-reported requested live tests all passed:

- 1024 Short Test pause/resume;
- TRUE-3K 3072 Short Test pause/resume;
- pause after the current frame completes;
- resume at the next sample;
- cancel while paused;
- restoration behavior;
- paused-time/ETA behavior.

The broad read-only Photo Booth DOM probe #492 later completed but exceeded the bridge response limit; guard discovery therefore continues with narrower semantic probes.

### Important source-status distinction

The maintained branch runtime entry remains v0.3.0 until the already-tested v0.4.0 source is promoted in a separate atomic source/docs checkpoint. This documentation checkpoint does not claim otherwise.

### Next stage

Interaction-guard discovery and implementation for camera/canvas input, Photo Booth exit, and continuity-invalidating Booth state changes.

**Runtime behavior changed:** no in this commit. Documentation records a separately tested local candidate.

---

## HFC-2026-09-06-029 — Close Spinny v0.3.0 standalone validation

v0.3.0 production-path validation closed successfully. Historical detail remains preserved in Git history.
