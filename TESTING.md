# Testing

Standalone-first validation precedes Witch Dock integration.

## `media.screenshot-resolution`

HeroForge build: `heroforge07.1.9.98`.

Standalone, Witch Dock Dev and public Witch Dock Stable still-capture gates remain validated. This Spinny investigation does not reopen them.

## `media.spinny-mini-webp`

HeroForge build: `heroforge07.1.9.98`.

### Reference baselines

Native HeroForge WebP:

- 512x512;
- 386 frames;
- 17 ms/frame;
- 6562 ms;
- 58.82 FPS;
- infinite loop;
- 11,331,110 bytes.

Historical Lob HQ GIF:

- 1024x1024;
- 250 frames;
- 40 ms/frame / 25 FPS;
- 10.0 s;
- 145,375,926 bytes.

### v0.1.0 Lob-parity reference

`entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js`

- 1024x1024 / 250 frames / 10,000 ms / 40 ms/frame / infinite loop: **PASS**;
- downloaded/played successfully by user report;
- retained UI: 12.9 MiB;
- low-resolution independent mux proof and syntax check: PASS.

### Configurable profile validation

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

Current profiles:

- Standard: 10 s / 250 frames / 25 FPS;
- Slow: 15 s / 375 frames / 25 FPS;
- Slower: 20 s / 500 frames / 25 FPS;
- Very Slow: 30 s / 750 frames / 25 FPS;
- resolution independent at 1024 or 2048.

Live results reported by user:

- **1024 Standard / 250 frames: PASS / perfect**;
- **2048 Standard / 250 frames: PASS / perfect**;
- **1024 Very Slow / 750 frames: PASS / perfect**;
- **2048 Slower / 500 frames: PASS / perfect**;
- 1024 Very Slow output: approximately **34 MiB**;
- multiple successful captures in the same session: **PASS**;
- percent progress readout: **PASS / useful**;
- Rendering/Encoding phase display: **PASS / useful**;
- px/frame/FPS/workload info readout: **PASS / useful**.

Test context reported by user:

- very complex figure;
- many kitbash parts;
- special paints and heavy special effects;
- very high decal count;
- moderate/high Photo Booth complexity without the most extreme background/overlay load.

Under that workload, capture times varied with resolution/frame count as expected but remained acceptable. User reported 1024 Very Slow as roughly comparable in wall-clock time to Lob's historical HQ GIF capture/encode/delivery flow.

Scaling coverage relative to 1024 Standard:

- 1024 Standard / 250f = **1x** baseline: PASS;
- 1024 Very Slow / 750f = **3x** pixel-sample workload: PASS;
- 2048 Standard / 250f = **4x** pixel-sample workload: PASS;
- 2048 Slower / 500f = **8x** pixel-sample workload: PASS.

This provides live evidence for both independent axes and a combined high-resolution + increased-frame-count workload.

### v0.2.1 progress/ETA validation

Build: `0.2.1-progress-eta-runtime-rotation-webp-mux`.

Acceptance criteria and results:

1. Progress bar tracks capture without affecting output: **PASS / works great**.
2. First-run ETA begins from live measured frame cost and remains plausible: **PASS**; user reported approximately **3m 7s** and accurate/stable across the process.
3. Remaining/total estimates adapt rather than using output playback duration: **PASS**.
4. Second same-resolution capture receives a same-session seed: **PASS**; user reported approximately **2m 57s**.
5. Repeated capture in one session: **PASS**.
6. Final completion time remains visible: **PASS**.
7. Existing 1024 output/playback remains unchanged: **PASS**.

HF-Chat-Bridge issue #476 confirmed the second 1024 Standard run after capture work completed:

- diagnostics build: `0.2.1-progress-eta-runtime-rotation-webp-mux`;
- busy: false;
- frames rendered: 250;
- frames encoded: 250;
- encoded still-frame bytes: **13,682,734**;
- output bytes: **13,565,278**;
- parser width/height: **1024x1024**;
- parser frame count: **250**;
- parser total duration: **10,000 ms**;
- parser duration histogram: **40 ms x 250**;
- loop count: **0 / infinite**;
- actual wall-clock: **177,100.9 ms / 2m 57.1s**;
- final estimated total: **175,614.0 ms / 2m 55.6s**;
- absolute error: **1,486.9 ms / 1.49s**;
- relative error: **0.84%**;
- average measured frame processing: **706.716 ms**;
- EMA frame time: **700.434 ms**;
- blended predicted frame time: **702.319 ms**;
- final mux/verification tail: **33.5 ms**;
- rotation restored: **true**;
- error: **null**;
- retained status UI: `Downloaded 1024px Standard: 250 frames / 10.0 s / 12.9 MiB`;
- retained timing UI: `Completed in 2m 57s`.

Result: **v0.2.1 progress/ETA control regression closed / validated**.

### Still pending before Witch Dock Dev

- dedicated cancel/failure-path regression under an expensive profile;
- decide practical warnings/guardrails for high-cost profile combinations;
- optional 2048 Very Slow / 750-frame 12x stress case if needed to define a ceiling.

Specific 1024 Slow / 375 and 1024 Slower / 500 have not been separately exercised, but the tested 1024/750 and 2048/500 endpoints already cover greater frame-count and combined workloads. They are not currently treated as blockers absent a profile-specific regression.

Witch Dock integration: **not started**.
