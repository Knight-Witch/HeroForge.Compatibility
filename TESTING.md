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

### v0.2.0 configurable profile validation

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

Profiles remain:

- Standard: 10 s / 250 frames / 25 FPS;
- Slow: 15 s / 375 frames / 25 FPS;
- Slower: 20 s / 500 frames / 25 FPS;
- Very Slow: 30 s / 750 frames / 25 FPS;
- resolution independent at 1024 or 2048.

Live results reported by user:

- **1024 Standard / 250 frames: PASS / works perfectly**;
- **2048 Standard / 250 frames: PASS / works perfectly**;
- **1024 Very Slow / 750 frames: PASS / works perfectly**;
- 1024 Very Slow output: approximately **34 MiB**;
- multiple successful captures in the same session: basic repeated-use **PASS**;
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

Not yet recorded as passed:

- 2048 / 500 frames: actively running at latest report;
- 1024 Slow / 375 specifically;
- 1024 Slower / 500 specifically;
- 2048 Very Slow / 750;
- dedicated cancel/failure regression under high profiles.

Per user instruction, do not inspect HF-Chat-Bridge until the active capture is reported complete.

### v0.2.1 progress/ETA candidate

Runtime capture/mux core is preserved. New UX-only behavior:

- progress bar immediately below status/percentage;
- elapsed wall-clock time;
- estimated time remaining;
- estimated total capture time;
- first live current-capture estimate after five completed frames;
- smoothed prediction combining EMA and current-run average frame cost;
- same-session per-resolution timing history to seed subsequent captures;
- no localStorage or cross-reload timing persistence;
- completed actual wall-clock duration stored in `lastCapture.elapsedMs`;
- timing details exposed in diagnostics.

ETA acceptance criteria:

1. Progress bar tracks the existing percentage without affecting capture.
2. First-run ETA begins as `estimating…`, then converges after live samples.
3. Remaining time decreases plausibly and adapts when frame processing changes.
4. Estimated total reflects actual device/figure processing rather than animation playback duration.
5. A second same-resolution capture in the same page session receives an immediate seeded estimate, then adapts to live samples.
6. Reload clears timing history.
7. Final completion time remains visible after download.
8. Existing 1024/2048 output metrics and playback remain unchanged.

Witch Dock integration: **not started**.
