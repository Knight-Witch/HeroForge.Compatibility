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

### v0.2.1 validated configurable behavior

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

Speed profiles:

- Standard: 10 s / 250 frames / 25 FPS;
- Slow: 15 s / 375 frames / 25 FPS;
- Slower: 20 s / 500 frames / 25 FPS;
- Very Slow: 30 s / 750 frames / 25 FPS.

Live results reported by user:

- **1024 Standard / 250 frames: PASS / perfect**;
- **2048 Standard / 250 frames: PASS / perfect**;
- **1024 Very Slow / 750 frames: PASS / perfect**;
- **2048 Slower / 500 frames: PASS / perfect**;
- 1024 Very Slow output: approximately **34 MiB**;
- multiple successful captures in the same session: **PASS**;
- progress/readout UI: **PASS / useful**.

Scaling coverage relative to 1024 Standard:

- 1024 Standard / 250f = **1x**: PASS;
- 1024 Very Slow / 750f = **3x**: PASS;
- 2048 Standard / 250f = **4x**: PASS;
- 2048 Slower / 500f = **8x**: PASS.

### v0.2.1 progress/ETA validation

Build: `0.2.1-progress-eta-runtime-rotation-webp-mux`.

- progress bar: **PASS / works great**;
- first-run ETA approximately **3m 7s**, user reported accurate/stable throughout;
- second same-session 1024 Standard estimate approximately **2m 57s**: PASS;
- repeat capture in one page session: PASS;
- final completion time visible: PASS.

HF-Chat-Bridge issue #476 confirmed the second 1024 Standard run:

- 250/250 frames rendered and encoded;
- output: **13,565,278 bytes**;
- parser: **1024x1024 / 250 frames / 10,000 ms / 40 ms x 250 / loop 0**;
- actual wall-clock: **177,100.9 ms / 2m 57.1s**;
- final estimated total: **175,614.0 ms / 2m 55.6s**;
- error: **1,486.9 ms / 0.84%**;
- rotation restored: **true**;
- runtime error: **null**.

### Cancel validation

User independently tested the existing Cancel action and reported:

- cancellation completed cleanly;
- figure returned to the orientation where the capture started;
- zero follow-on issues were observed.

Result: **general cancel + rotation restore PASS by user report**. The exact cancelled profile was not recorded, so no specific expensive-profile combination is claimed from this result.

### v0.2.2 3072 candidate

Build: `0.2.2-3k-warning-runtime-rotation-webp-mux`.

Changes under test:

- new 3072px resolution option;
- no 4096/8192 Spinny options;
- red `LONG CAPTURE` warning for `size >= 2048` or `frames >= 500`;
- capture/mux/ETA core otherwise unchanged.

3072 workload matrix:

- 3072 Standard / 250f = **9x** baseline;
- 3072 Slow / 375f = **13.5x**;
- 3072 Slower / 500f = **18x**;
- 3072 Very Slow / 750f = **27x**.

Required first live test:

1. select **3072px**;
2. select **Standard / 250 frames**;
3. confirm the red long-capture warning appears;
4. run one full capture;
5. verify visual playback and report result/file size;
6. after completion, inspect bridge-readable diagnostics for 3072x3072, 250 frames, 10,000 ms, 40 ms x 250, loop 0, rotation restored true and error null.

3072 Slow/Slower/Very Slow are not blockers for the first 3K gate and remain unvalidated until explicitly exercised.

### 4K Spinny

**Deferred.** Current Witch Dock TRUE-resolution repair intercepts square 4096/8192 `BT.maker.takeScreenshot` requests. A 4096 Spinny option must not be added through that public surface without an explicit native-frame bypass/capability.

### Pause/input guards

Pause/resume and protective warnings for leaving Photo Booth, moving camera, or editing Booth settings remain a separate planned standalone change after 3072 Standard is isolated and tested.

Witch Dock Spinny integration: **not started**.
