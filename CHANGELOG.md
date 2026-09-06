# Changelog

## HFC-2026-09-05-021 — Validate configurable Spinny profiles and add progress/ETA UX

Date: 2026-09-05

### Summary

Recorded the first successful v0.2.0 configurable-profile validation results and advanced the standalone profile test to v0.2.1 with progress-bar and device-relative ETA UI. Capture/render/mux behavior remains unchanged.

### Newly validated v0.2.0 results

On HeroForge `heroforge07.1.9.98`, user live testing reported:

- 1024 Standard / 250 frames / 25 FPS: **works perfectly**;
- 2048 Standard / 250 frames / 25 FPS: **works perfectly**;
- 1024 Very Slow / 750 frames / 25 FPS: **works perfectly**;
- 1024 Very Slow output: approximately **34 MiB**;
- multiple successful captures in the same session;
- percentage progress, Rendering/Encoding phase display, and px/frame/FPS/workload readout all working and useful;
- acceptable capture/resource behavior on a high-complexity figure with many kitbash parts, effects, special paints and a high decal count.

A 2048 / 500-frame capture was still running when this checkpoint was written and is not claimed as passed here. HF-Chat-Bridge was intentionally not inspected during that active run.

### v0.2.1 UX additions

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js` now adds:

- progress bar directly below the existing phase/frame/percentage status;
- elapsed time;
- estimated time remaining;
- estimated total capture time;
- ETA warm-up using measured current-capture frame processing time;
- continuously adapting smoothed prediction after five completed frames;
- same-session timing history keyed by resolution to improve later captures on the same page/session;
- completed wall-clock capture time in diagnostics/UI.

ETA history is intentionally not persisted across reloads, preventing one figure/session from becoming a stale predictor for another.

### Preserved runtime behavior

- 1024/2048 resolution and Standard/Slow/Slower/Very Slow profile definitions;
- constant 40 ms output frame timing / 25 FPS;
- runtime model rotation and refresh/occlusion sequencing;
- `BT.maker.takeScreenshot` frame production;
- immediate static-WebP encoding;
- compressed-frame payload retention;
- deterministic RIFF animation mux;
- dimensions/frame-count/duration/loop/timing verification;
- cancel/concurrency behavior and rotation restoration.

### Status

- v0.1.0 1024 parity reference: validated.
- v0.2.0 configurable core: **validated at 1024 Standard, 2048 Standard, and 1024 Very Slow**.
- v0.2.1 progress/ETA UI: implementation complete; live UX validation pending.
- public Witch Dock: unchanged.

### Touched files

- `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `TESTING.md`
- `docs/feature-specs/spinny-mini-webp.md`
- `docs/investigations/INV-0004-spinny-mini-webp-2026-09-05.md`

**Runtime behavior changed:** standalone test UI/diagnostics only. Public Witch Dock is unchanged.

---

## HFC-2026-09-05-020 — Add configurable Spinny WebP profile test

Date: 2026-09-05

### Summary

Added a separate v0.2.0 standalone candidate for `media.spinny-mini-webp` while preserving the validated v0.1.0 1024/250 parity script unchanged.

### Runtime implementation

New entry: `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js` v0.2.0.

Resolution and rotation duration are now independent profile dimensions:

- 1024px — validated baseline size;
- 2048px — experimental next size;
- Standard — 10 s / 250 frames / 40 ms / 25 FPS;
- Slow — 15 s / 375 frames / 40 ms / 25 FPS;
- Slower — 20 s / 500 frames / 40 ms / 25 FPS;
- Very Slow — 30 s / 750 frames / 40 ms / 25 FPS.

Slower profiles increase angular sample/frame count instead of holding the same sparse frames for longer.

The candidate deliberately preserves the validated v0.1.0 frame-production and mux path: HeroForge display Y rotation, established refresh/occlusion sequencing, `BT.maker.takeScreenshot`, immediate browser static-WebP encoding, compressed image-chunk retention, deterministic RIFF animation assembly, concurrency blocking, cancel behavior, and rotation restoration.

### Added diagnostics/verification

- Parser now verifies loop count as well as dimensions/frame count/total duration.
- Parser verifies the complete ANMF duration histogram is exactly the selected 40 ms duration for every frame.
- Plain `HFSpinnyMiniWebPProfilesTest.diagnostics` state is bridge-readable and records selected profile, exact output bytes, parser metrics, and rotation-restored status.
- Test UI displays a pixel-sample workload multiplier relative to validated 1024 Standard.

### Validation status

- v0.1.0 1024 Standard: **validated live and remains canonical fallback**.
- v0.2.0 source: implementation/source review complete; live validation pending at time of this commit.
- Public Witch Dock: unchanged.

### Touched files

- `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `TESTING.md`
- `docs/feature-specs/spinny-mini-webp.md`
- `docs/investigations/INV-0004-spinny-mini-webp-2026-09-05.md`

**Runtime behavior changed:** yes, on the standalone WIP branch only through a new experimental userscript. Existing v0.1.0 and public Witch Dock are unchanged.

---

## HFC-2026-09-05-019 — Validate first 1024 HQ Spinny WebP parity capture

Date: 2026-09-05

### Summary

Documentation-only validation checkpoint for `media.spinny-mini-webp` after the first full standalone 1024/250 capture succeeded live.

### Confirmed live result

- User reported: “the webp worked”.
- Successful script/build: `entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js` v0.1.0 / `0.1.0-runtime-rotation-webp-mux`.
- The script only downloads after mechanically validating 1024x1024 dimensions, exactly 250 frames, and exactly 10,000 ms total duration.
- All frames are written at 40 ms, yielding the intended 25 FPS effective cadence.
- Loop count is 0 / infinite by the deterministic ANIM mux.
- Retained live UI status reported: `Downloaded 1024px WebP: 250 frames / 10.0 s / 12.9 MiB`.
- Photo Booth capture capability remained ready after the completed capture.

### Status

- First Lob-parity milestone: **validated**.
- Witch Dock Dev/Stable: unchanged and not yet in scope.

**Runtime behavior changed:** no. No JavaScript changed and public Witch Dock behavior is unchanged.

---

## HFC-2026-09-05-018 — Add standalone 1024 HQ Spinny WebP parity test

Date: 2026-09-05

Added the first standalone runtime implementation for `media.spinny-mini-webp`, including the independent browser static-WebP encode plus project-owned animated-WebP RIFF mux path. Low-resolution proof and syntax passed; full parity validation was completed later in HFC-2026-09-05-019.

**Runtime behavior changed:** yes, standalone WIP only.

---

## HFC-2026-09-05-017 — Start Spinny Mini animated WebP reconstruction

Date: 2026-09-05

Documentation-only kickoff recording native HeroForge and historical Lob HQ baselines and the standalone-first reconstruction direction.

**Runtime behavior changed:** no.

---

Historical changelog entries through HFC-2026-09-05-016 remain preserved in Git history at/before `732dae09e83d712a26ac383f7b64ce9e27e07a59`.
