# Pre-Flight Check Log

## PFC-2026-09-06-020 — Add short partial-spin diagnostic companion after 3072 fidelity failure

Date: 2026-09-06

### Target files

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

### Required material reviewed

- binding `PROJECT_CONTRACT.md`;
- branch head before this stage: `997f1181af9954262e19ee04723be6137f891b79`;
- `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`;
- current Spinny feature spec/investigation;
- current v0.2.2 source and public API;
- completed 3072 Standard user result and uploaded WebP;
- follow-up 1024 Standard control capture reported visually correct;
- user report that two scroll-wheel camera interactions during the 3072 run caused visible jumps in the resulting animation;
- Witch Dock TRUE-resolution provider ownership of square 4096/8192 requests.

### Confirmed findings

- The completed 3072 Standard run took approximately 25 minutes and produced a structurally 3072x3072 animated WebP with 250 frames.
- Inspection of the uploaded file confirmed the animation container and individual encoded frame payloads are genuinely 3072-sized; the mux is not merely declaring 3072 around 2048 frame payloads.
- User visual inspection at native size found the 3072 result blurry and consistent with a lower-resolution render enlarged to 3072. Therefore **true 3K fidelity failed** even though output dimensions passed.
- A new 1024 Standard control run was visually correct, so the failure is specific to the higher-resolution path rather than a general WebP/mux defect.
- Current v0.2.2 verifies returned canvas/container dimensions but cannot verify internal HeroForge scene-raster resolution.
- Two accidental mouse-wheel camera changes during capture produced visible discontinuities, directly validating the need for planned capture interaction guards.
- HF-Chat-Bridge read-only probe #478 was queued to inspect the current screenshot/render path but had not been picked up at this checkpoint; no runtime result is claimed from it.

### Diagnostic implementation intent

Add a separate disposable companion rather than modifying v0.2.2:

- requires the existing `HFSpinnyMiniWebPProfilesTest` standalone script;
- injects a `Short Test` button into the existing test panel;
- captures exactly **16 contiguous frames**;
- preserves the selected profile's normal angular spacing (`360 / full-profile frame count`), rather than sparsely sampling a full revolution;
- preserves the selected 40 ms frame timing and current resolution;
- uses the same HeroForge refresh/occlusion sequence, `BT.maker.takeScreenshot`, static browser WebP encoder, and RIFF mux logic;
- downloads a labeled `SHORT_TEST` animated WebP;
- exposes bridge-readable `HFSpinnyMiniWebPShortTest.diagnostics` including selected profile, angular step/arc, returned canvas-size histogram, output/parser data, elapsed time and rotation restoration;
- uses its own cancel-after-current-frame behavior;
- disables the base profile controls during a short test;
- refuses 4096/8192+ sizes to avoid the known TRUE-resolution still-provider collision.

At Standard / 250-frame angular spacing, 16 frames cover 15 intervals = **21.6 degrees** from first to last sample. Relative to the completed 25-minute 250-frame 3072 run, expected processing time is roughly 1.6 minutes if per-frame cost is similar.

### Material risks

- The helper intentionally duplicates a bounded subset of the validated capture/mux mechanics as a diagnostic companion. It is not a production architecture or Witch Dock integration target.
- Short Test can prove whether a candidate resolution change visibly improves source detail much faster, but it still cannot by itself reveal HeroForge's hidden internal render target size without runtime tracing.
- The current camera/Booth interaction guards are not yet implemented; users must still avoid camera/Booth changes during the short test.
- A partial looping WebP necessarily jumps from its final frame back to the first; loop continuity is not an acceptance criterion for this diagnostic.
- 3072 remains unsupported for true-resolution output until the upstream render-source issue is diagnosed and corrected.

### Test status before commit

- `spinny-mini-webp-short-test.user.js`: local `node --check` **PASS**.
- Live Short Test: pending.
- Public Witch Dock: untouched.

### Recommended action

Install the companion alongside v0.2.2 and run **3072 + Standard + Short Test** first. Use the resulting partial WebP only to judge render fidelity and exercise the same per-frame path quickly. Keep 3072 full-spin support rejected until a true-resolution fix passes Short Test and then one full validation run.

**Runtime behavior changed:** yes, standalone diagnostic companion only. Existing v0.2.2 and public Witch Dock behavior are unchanged.

---

## PFC-2026-09-05-019 — Add 3072 Spinny profile and high-workload warning

v0.2.2 added experimental 3072 plus the long-capture warning while preserving the validated lower-resolution capture/mux core. 4K was deferred due the Witch Dock TRUE-resolution provider collision.

**Runtime behavior changed:** standalone WIP profile/UI only.

---

Historical pre-flight records through PFC-2026-09-05-018 remain preserved in Git history.
