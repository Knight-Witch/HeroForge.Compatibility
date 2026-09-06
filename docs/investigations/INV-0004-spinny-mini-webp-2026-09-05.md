# INV-0004 — Spinny Mini animated WebP reconstruction

Date opened: 2026-09-05
Status: active — v0.2.1 validated; v0.2.2 3072 candidate next; Pause/input guards separated
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

## Validated profile results

- 1024 Standard / 250f: PASS / perfect;
- 2048 Standard / 250f: PASS / perfect;
- 1024 Very Slow / 750f: PASS / perfect;
- 2048 Slower / 500f: PASS / perfect;
- multiple captures in one session: PASS;
- progress/ETA UI: PASS;
- parser verification and rotation restoration: PASS.

User also tested Cancel and reported clean cancellation, return to the starting figure orientation and zero issues. Exact cancelled profile was not recorded.

Scaling evidence relative to 1024 Standard:

- 1x: 1024 Standard / 250f — PASS;
- 3x: 1024 Very Slow / 750f — PASS;
- 4x: 2048 Standard / 250f — PASS;
- 8x: 2048 Slower / 500f — PASS.

## v0.2.1 ETA result — PASS

Human acceptance:

- progress bar works great;
- first 1024 Standard ETA approximately 3m 7s and accurate/stable across the run;
- second same-session estimate approximately 2m 57s.

HF-Chat-Bridge issue #476 confirmed the second 1024 Standard run:

- 250/250 frames rendered and encoded;
- final WebP 13,565,278 bytes;
- parser 1024x1024 / 250 frames / 10,000 ms / 40 ms x 250 / loop 0;
- actual wall-clock 177,100.9 ms;
- final estimated total 175,614.0 ms;
- error 1,486.9 ms / 0.84%;
- rotation restored true;
- runtime error null.

## 3072 investigation

User requested a 3K/4K extension, then chose to defer 4K and proceed with 3K after compatibility review.

3072 workload relative to 1024 Standard:

- Standard / 250f: 9x;
- Slow / 375f: 13.5x;
- Slower / 500f: 18x;
- Very Slow / 750f: 27x.

Supported inference:

- the existing compressed-frame architecture should scale to 3072 without a structural change because it does not retain raw RGBA for all frames;
- practical browser/GPU/canvas cost is materially higher and must be measured live;
- one 3072 RGBA canvas is approximately 36 MiB before compression, versus approximately 16 MiB at 2048 and 4 MiB at 1024.

Confirmed compatibility point:

- current Witch Dock TRUE-resolution repair intercepts square **4096 and 8192** `BT.maker.takeScreenshot` requests;
- **3072 does not match those interception sizes**, so it continues down the normal screenshot path used by current Spinny captures.

v0.2.2 therefore adds `3072px — 3K experimental` and leaves 4096 absent.

## 4K collision — confirmed and deferred

Witch Dock Stable `media.screenshot-resolution` installs a provider wrapper around `BT.maker.takeScreenshot`. When enabled, square 4096/8192 requests are routed into `runTrueResolutionCapture(...)` for repaired still capture.

Therefore a naive 4096 Spinny profile would invoke the TRUE-4K still repair once per animation frame. That is an architectural collision, not merely a performance concern.

Decision: **4K Spinny deferred**. Revisit only if an explicit native/unrepaired frame-capture capability is exposed safely by the provider/compatibility bridge.

## High-workload warning

v0.2.2 adds red advisory text under the timer whenever:

- resolution >= 2048; or
- frame count >= 500.

The warning reports the workload multiplier. It does not block capture.

## Pause/resume design

User requested a possible Pause button plus protective warnings if a paused/in-progress capture would be invalidated by:

- leaving Photo Booth;
- moving the Booth camera;
- changing Booth controls such as view/backdrop/overlays/light.

Design direction:

- pause only between complete frames;
- retain already-compressed frame payloads;
- resume at the next angular sample;
- freeze active-processing ETA while paused;
- do not use pixel coordinates because HeroForge has left/right split, right-grouped and mobile/bottom layouts and browser resizing changes element positions;
- classify/intercept semantic DOM/runtime interactions rather than fixed screen locations;
- warn before an invalidating action and cancel safely rather than silently producing discontinuous animation.

This change is intentionally **not** bundled into v0.2.2. A live DOM probe was attempted through HF-Chat-Bridge issue #477 but the relay did not return a result, so no unverified selector assumptions are being promoted into code.

## v0.2.2 first validation gate

Run exactly one initial 3072 Standard / 250-frame capture.

Accept only if:

- UI shows 3072 and red long-capture warning;
- capture completes without browser/HeroForge failure;
- output plays correctly;
- parser confirms 3072x3072 / 250 frames / 10,000 ms / 40 ms x 250 / loop 0;
- rotation is restored;
- no error remains in diagnostics.

Do not treat 3072 Slow/Slower/Very Slow as validated from a Standard pass.

## Safety / compatibility constraints

- no private/minified encoder dependency;
- no legacy exact compiled-string patching;
- no raw-RGBA accumulation across frames;
- block concurrent captures;
- restore character rotation after success/failure/cancel;
- do not route 4096 Spinny frames through the still-capture repair provider;
- leave validated still-capture behavior untouched;
- public Witch Dock remains untouched until separate Dev integration.

## Next gate

1. Install/test v0.2.2 at 3072 Standard / 250f.
2. Record parser/output/ETA/resource result.
3. If 3072 Standard passes, decide whether any 3072 longer-duration profile merits additional testing.
4. Separately resume Pause/input-guard probing and implementation.
5. Only after those standalone decisions begin a separate Witch Dock Dev integration stage.
