# INV-0004 — Spinny Mini animated WebP reconstruction

Date opened: 2026-09-05
Status: active — v0.2.1 configurable standalone and progress/ETA validated; final safety/guardrail decisions remain before Witch Dock Dev
HeroForge build: `heroforge07.1.9.98`
Feature: `media.spinny-mini-webp`

## Question

How can HeroForge's new Spinny Mini WebP capability be reconstructed into a higher-resolution, configurable-speed feature without brittle compiled-string injection or PNG-series ZIP output?

## Confirmed baselines

Native HeroForge WebP:

- 512x512;
- 386 frames;
- 17 ms/frame;
- 6562 ms total;
- 58.82 FPS;
- infinite loop;
- 11,331,110 bytes.

Historical Lob HQ GIF:

- 1024x1024;
- 250 frames;
- 40 ms/frame / 25 FPS;
- 10.0 s;
- 145,375,926 bytes.

## Architecture decision — confirmed

A stable private animated-WebP encoder seam was not required. The maintained path is:

```text
HeroForge runtime character rotation
→ established display/occlusion refresh sequence
→ BT.maker.takeScreenshot(frameSize, frameSize)
→ browser-native static WebP encoding per frame
→ project-owned animated-WebP RIFF mux
```

This path passed a four-frame browser decode microproof and then full live profile captures.

## v0.1.0 parity result — PASS

`entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js`

- 1024x1024;
- 250 frames;
- 10,000 ms;
- 40 ms/frame;
- infinite loop;
- retained UI: 12.9 MiB;
- user reported the WebP worked.

The first Lob-parity milestone is closed.

## Configurable profile result — multiple live passes

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

Profiles keep resolution independent from rotation duration, with constant 40 ms/frame / 25 FPS:

- Standard: 250 frames / 10 s;
- Slow: 375 frames / 15 s;
- Slower: 500 frames / 20 s;
- Very Slow: 750 frames / 30 s;
- resolution: 1024 or 2048.

User live results:

- **1024 Standard / 250 frames: PASS / perfect**;
- **2048 Standard / 250 frames: PASS / perfect**;
- **1024 Very Slow / 750 frames: PASS / perfect**;
- **2048 Slower / 500 frames: PASS / perfect**;
- 1024 Very Slow output approximately **34 MiB**;
- multiple captures completed successfully in the same session;
- percentage, Rendering/Encoding display and profile information readout were explicitly reported useful and working well.

Test environment was intentionally demanding: a very complex figure with many kitbash parts, special paints, heavy effects and a very high decal count, with moderately high Booth complexity. User reported capture time/resource behavior remained reasonable; 1024 Very Slow was roughly comparable in wall-clock time to Lob's historical HQ GIF flow.

Scaling evidence relative to 1024 Standard:

- 1024 Standard / 250f = 1x baseline: PASS;
- 1024 Very Slow / 750f = 3x pixel-sample workload: PASS;
- 2048 Standard / 250f = 4x pixel-sample workload: PASS;
- 2048 Slower / 500f = 8x pixel-sample workload: PASS.

This establishes successful independent scaling along resolution and angular-sample/frame-count axes plus a combined high-resolution + increased-frame-count case.

## v0.2.1 progress/ETA result — PASS

Requested additions:

1. progress bar below the percentage readout;
2. time-left / total-time estimator adapting to the current device/workload.

Implemented ETA strategy:

- measure real wall-clock render+encode time for each completed frame;
- do not derive capture ETA from output playback duration;
- show `estimating…` during initial warm-up when no same-session resolution history exists;
- maintain current-run average and exponential moving average of frame processing time;
- blend those values for a continuously adapting prediction;
- seed later captures from successful same-session timing for the same resolution;
- keep history in memory only; reload clears it;
- retain actual completed wall-clock duration and timing data in plain diagnostics.

Human acceptance:

- progress bar: **works great**;
- first v0.2.1 1024 Standard estimate: approximately **3m 7s**, reported accurate and stable across the entire process;
- second same-session 1024 Standard estimate: approximately **2m 57s**.

HF-Chat-Bridge issue #476 read diagnostics after all active capture work was complete.

Second 1024 Standard run:

- build `0.2.1-progress-eta-runtime-rotation-webp-mux`;
- busy false after completion;
- 250/250 frames rendered and encoded;
- encoded still-frame total 13,682,734 bytes;
- final WebP 13,565,278 bytes;
- parser 1024x1024 / 250 frames / 10,000 ms / 40 ms x 250 / loop 0;
- actual wall-clock 177,100.9 ms / 2m 57.1s;
- final estimated total 175,614.0 ms / 2m 55.6s;
- absolute estimation error 1,486.9 ms / 1.49s;
- relative estimation error 0.84%;
- measured average frame time 706.716 ms;
- EMA frame time 700.434 ms;
- blended predicted frame time 702.319 ms;
- assembly/tail 33.5 ms;
- rotation restored true;
- error null;
- retained status `Downloaded 1024px Standard: 250 frames / 10.0 s / 12.9 MiB`;
- retained timing `Completed in 2m 57s`.

Result: the ETA model is not merely plausible; on the bridge-confirmed repeated control it finished within **0.84%** of actual total capture time.

## Remaining unknowns / decisions

- practical warning/guardrail policy for expensive combinations;
- dedicated cancel/failure-path regression under an expensive profile;
- optional 2048 Very Slow / 750-frame 12x stress test if needed to define the upper practical ceiling;
- whether quality 0.95 should remain fixed for every eventual supported profile;
- Witch Dock Dev integration shape and UI placement.

Specific intermediate profiles such as 1024 Slow / 375 and 1024 Slower / 500 have not been individually exercised, but higher 1024 frame-count and combined 2048/500 workloads have passed. They are not currently treated as blockers absent profile-specific evidence.

## Safety / compatibility constraints

- no private/minified encoder dependency;
- no legacy exact compiled-string patching;
- no raw-RGBA accumulation across frames;
- block concurrent captures;
- restore character rotation after success/failure/cancel;
- leave validated still-capture feature untouched;
- public Witch Dock remains untouched until separate Dev integration.

## Next gate

1. Preserve v0.2.1 runtime unchanged while recording this validation checkpoint.
2. Decide whether the 2048 Very Slow 12x case is needed or should simply carry a warning.
3. Run dedicated cancel/failure-path regression on the current standalone build.
4. Define practical high-cost profile guardrails.
5. Only then begin a separate Witch Dock Dev integration stage.
