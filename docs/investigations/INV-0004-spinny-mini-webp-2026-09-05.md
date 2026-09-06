# INV-0004 — Spinny Mini animated WebP reconstruction

Date opened: 2026-09-05
Status: active — configurable core validated across resolution and frame-count scaling; progress/ETA UX next
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

This path passed a four-frame browser decode microproof and then a full 1024/250 parity capture.

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

## v0.2.0 configurable profile result — multiple live passes

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

Profiles keep resolution independent from rotation duration, with constant 40 ms/frame / 25 FPS:

- Standard: 250 frames / 10 s;
- Slow: 375 frames / 15 s;
- Slower: 500 frames / 20 s;
- Very Slow: 750 frames / 30 s;
- resolution: 1024 or 2048.

User live results:

- **1024 Standard / 250 frames: PASS / works perfectly**;
- **2048 Standard / 250 frames: PASS / works perfectly**;
- **1024 Very Slow / 750 frames: PASS / works perfectly**;
- 1024 Very Slow output approximately **34 MiB**;
- multiple captures completed successfully in the same session;
- percentage, Rendering/Encoding display and profile information readout were all explicitly reported useful and working well.

Test environment was intentionally demanding: a very complex figure with many kitbash parts, special paints, heavy effects and a very high decal count, with moderately high Booth complexity. User reported capture time/resource behavior remained reasonable; 1024 Very Slow was roughly comparable in wall-clock time to Lob's historical HQ GIF flow.

This establishes that the independent mux implementation scales successfully along both axes already tested:

- resolution: 1024 → 2048 at 250 frames;
- angular samples/frame count: 250 → 750 at 1024.

A 2048 / 500-frame run was still active at the latest report. It remains unconfirmed until the user reports completion. Per explicit instruction, HF-Chat-Bridge is not inspected during that active capture.

## v0.2.1 UX investigation

Requested additions:

1. progress bar below the percentage readout;
2. time-left / total-time estimator that adapts to the current user/device and workload.

Accepted ETA strategy:

- measure real wall-clock render+encode time for each completed frame;
- do not derive capture ETA from output playback duration;
- show `estimating…` during an initial five-frame warm-up when no same-session resolution history exists;
- maintain both current-run average and exponential moving average of frame processing time;
- blend those values for a continuously adapting prediction;
- seed a later capture from successful same-session timing for the same resolution;
- keep history in memory only; reload clears it to prevent stale cross-figure/session estimates;
- retain actual completed wall-clock duration and timing data in plain diagnostics.

The progress bar uses the existing capture loop's frame/phase state and does not change capture sequencing.

## Remaining unknowns

- live accuracy/convergence of v0.2.1 ETA on first and repeated captures;
- result of the currently active 2048 / 500-frame run;
- practical behavior of 2048 Very Slow / 750 frames;
- exact high-profile output-memory ceiling;
- whether quality 0.95 should remain fixed for every eventual supported profile;
- final guardrails/warnings before Witch Dock integration.

## Safety / compatibility constraints

- no private/minified encoder dependency;
- no legacy exact compiled-string patching;
- no raw-RGBA accumulation across frames;
- block concurrent captures;
- restore character rotation after success/failure/cancel;
- leave validated still-capture feature untouched;
- public Witch Dock remains untouched until separate Dev integration.

## Next gate

1. Let the active v0.2.0 capture finish without bridge inspection.
2. Record its result when the user reports it.
3. Switch to v0.2.1.
4. Validate progress bar and ETA on one normal capture.
5. Optionally run a second same-resolution capture to verify same-session ETA seeding/adaptation.
6. Inspect bridge-readable diagnostics only after the user says active capture work is complete.
7. Decide remaining standalone guardrails before Witch Dock Dev.
