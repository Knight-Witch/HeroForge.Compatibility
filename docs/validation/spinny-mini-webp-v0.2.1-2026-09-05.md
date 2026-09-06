# Validation — Spinny Mini WebP v0.2.1

Date: 2026-09-05
HeroForge build: `heroforge07.1.9.98`
Feature: `media.spinny-mini-webp`
Standalone entry: `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`
Build: `0.2.1-progress-eta-runtime-rotation-webp-mux`

## Human acceptance results

User live testing reported:

- 1024 Standard / 250 frames / 25 FPS: **PASS / perfect**.
- 2048 Standard / 250 frames / 25 FPS: **PASS / perfect**.
- 1024 Very Slow / 750 frames / 25 FPS: **PASS / perfect**.
- 2048 Slower / 500 frames / 25 FPS: **PASS / perfect**.
- 1024 Very Slow output size: approximately **34 MiB**.
- Multiple captures in one session: **PASS**.
- Existing percentage, Rendering/Encoding phase display, and px/frame/FPS/workload readout: **PASS / useful**.
- v0.2.1 progress bar: **PASS / works great**.
- First-run ETA: approximately **3m 7s**, reported accurate and stable throughout the capture.
- Second same-session 1024 Standard ETA: approximately **2m 57s**.

The test figure was intentionally high-complexity: many kitbash parts, special paints/effects, very high decal count, and moderately high Photo Booth complexity.

## Bridge-confirmed second 1024 Standard run

HF-Chat-Bridge diagnostic issue #476 read plain `HFSpinnyMiniWebPProfilesTest.diagnostics` after all active captures were complete.

Confirmed state:

- build: `0.2.1-progress-eta-runtime-rotation-webp-mux`;
- busy: `false`;
- requested profile: 1024 / Standard / 250 frames / 40 ms / 25 FPS / 10,000 ms / loop 0;
- frames rendered: **250**;
- frames encoded: **250**;
- encoded still-frame bytes accumulated: **13,682,734**;
- final output bytes: **13,565,278**;
- parser width/height: **1024x1024**;
- parser frame count: **250**;
- parser total duration: **10,000 ms**;
- parser duration histogram: **40 ms x 250**;
- parser loop count: **0 / infinite**;
- rotation restored: **true**;
- error: **null**.

Timing diagnostics for that second run:

- actual total: **177,100.9 ms / 2m 57.1s**;
- final estimated total: **175,614.0 ms / 2m 55.6s**;
- absolute estimation error: **1,486.9 ms / 1.49s**;
- relative estimation error: **0.84%**;
- measured average frame processing time: **706.716 ms**;
- EMA frame time: **700.434 ms**;
- blended predicted frame time: **702.319 ms**;
- final assembly/tail time: **33.5 ms**.

Retained UI after completion:

- status: `Downloaded 1024px Standard: 250 frames / 10.0 s / 12.9 MiB`;
- timing: `Completed in 2m 57s`.

## Scaling evidence

Relative to 1024 Standard / 250 frames:

- 2048 Standard / 250 frames = **4x pixel-sample workload**: PASS.
- 1024 Very Slow / 750 frames = **3x pixel-sample workload**: PASS.
- 2048 Slower / 500 frames = **8x pixel-sample workload**: PASS.

This establishes successful standalone scaling in both resolution and angular-sample/frame-count dimensions, including a combined high-resolution + increased-frame-count case.

## Validation conclusion

v0.2.1 standalone configurable Spinny WebP is validated for the tested profiles and its progress/ETA UI is validated. Same-session ETA seeding and adaptation are working. Full-run parser validation, rotation restoration, and repeated-use behavior passed on the current v0.2.1 build.

Still intentionally outside this validation:

- 2048 Very Slow / 750-frame 12x stress case;
- dedicated cancel/failure-path regression under expensive profiles;
- final practical warning/guardrail policy;
- Witch Dock Dev integration.

**Runtime behavior changed:** no. This file records live validation only.
