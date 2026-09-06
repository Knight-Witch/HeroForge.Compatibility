# Changelog

## HFC-2026-09-06-024 — Add Spinny Short Test companion and reject current 3072 fidelity

Date: 2026-09-06

### Summary

Recorded the completed v0.2.2 3072 Standard result as a **true-resolution fidelity failure** despite structurally correct 3072 output, and added a standalone `Short Test` diagnostic companion so future high-resolution changes can be checked with a small contiguous partial spin instead of a 25-minute full revolution.

### Confirmed 3072 result

- 3072 Standard / 250 frames completed in approximately **25 minutes**.
- Uploaded output is structurally 3072x3072 and contains 250 animated frames.
- Individual encoded frame payloads are also genuinely 3072-sized; the project-owned mux is not falsely wrapping 2048 frame payloads as 3072.
- At native display size, user reported the result is visibly blurry and appears equivalent to a lower-resolution render enlarged to 3072.
- Therefore the current 3072 option **fails the true-3K fidelity requirement** and is not accepted as supported output.
- A follow-up 1024 Standard control capture was visually correct, narrowing the defect to the higher-resolution HeroForge screenshot/render path rather than the WebP/mux architecture generally.
- Two accidental mouse-wheel camera interactions during the 3072 run produced visible jumps in the output, providing direct evidence for the planned capture interaction guards.

### Added diagnostic companion

New file:

`entries/tampermonkey-standalone/spinny-mini-webp-short-test.user.js`

Build: `0.1.0-short-test-16f-partial-arc`.

Behavior:

- installs alongside the existing v0.2.2 profile test;
- injects a `Short Test` button into the existing panel;
- uses the currently selected resolution/speed;
- captures 16 contiguous frames rather than a full revolution;
- preserves the selected full profile's real angular step and 40 ms frame duration;
- at Standard / 250-frame spacing, first-to-last sample span is 21.6 degrees;
- uses the same HeroForge refresh/occlusion sequence, `BT.maker.takeScreenshot`, browser static-WebP encoding and RIFF animation mux logic;
- downloads a labeled `SHORT_TEST` WebP;
- records returned canvas-size histogram, parser metrics, output bytes, elapsed time and rotation restoration in `HFSpinnyMiniWebPShortTest.diagnostics`;
- short-test button becomes `Cancel Test` while active and cancels after the current frame;
- disables the base profile controls during the diagnostic;
- refuses 4096/8192+ sizes to avoid the known TRUE-resolution still-provider collision.

### Expected time benefit

If 3072 per-frame cost remains similar to the completed 25-minute run, 16/250 frames should take roughly **1.6 minutes** rather than ~25 minutes. This is an estimate only; live Short Test timing remains pending.

### Bridge status

HF-Chat-Bridge read-only issue #478 was queued to inspect `BT.maker.takeScreenshot`, `CK.Effects.renderToCanvas` and provider state, but had not been picked up at this checkpoint. No runtime finding is claimed from that request yet.

### Validation status

- Short Test source `node --check`: **PASS**.
- Short Test live run: pending.
- 3072 true-resolution fidelity: **FAIL / unsupported** pending upstream render-path diagnosis and repair.
- 1024 control: **PASS by user report**.
- 2048 previously validated profiles remain unchanged.
- 4K Spinny remains deferred.
- Public Witch Dock unchanged.

### Touched files

- `entries/tampermonkey-standalone/spinny-mini-webp-short-test.user.js` (new)
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- `TESTING.md`
- `docs/feature-specs/spinny-mini-webp.md`
- `docs/investigations/INV-0004-spinny-mini-webp-2026-09-05.md`
- `docs/validation/spinny-mini-webp-v0.2.2-3072-fidelity-2026-09-06.md` (new)

**Runtime behavior changed:** standalone diagnostic companion only. Existing v0.2.2 and public Witch Dock are unchanged.

---

## HFC-2026-09-05-023 — Add 3072 Spinny profile and long-capture warning

v0.2.2 added the experimental 3072 selection and high-workload warning while preserving the validated lower-resolution capture/mux core. The subsequent live 3072 result is superseded by HFC-2026-09-06-024 above.

---

Historical changelog entries through HFC-2026-09-05-022 remain preserved in Git history.
