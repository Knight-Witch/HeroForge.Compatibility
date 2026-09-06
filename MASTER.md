# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Historical detail remains available in Git history; this file tracks the current active state.

## Current Phase

**`media.spinny-mini-webp` v0.2.1 remains the validated configurable behavior target for tested 1024/2048 profiles. v0.2.2 3072 structurally completed but failed true-resolution visual fidelity. A separate 16-frame Short Test companion is now the diagnostic path for high-resolution iteration. Public Witch Dock remains untouched.**

`media.screenshot-resolution` and the corrected bound decal gizmo remain Witch Dock Stable.

## Repository Roles

- Compatibility / reconstruction: `Knight-Witch/HeroForge.Compatibility`
- Public Witch Dock consumer: `Knight-Witch/KnightWitch.Heroforge`
- Development-only live transport: private `Knight-Witch/HF-Chat-Bridge`
- Public Witch Dock runtime dependency on Compatibility `main`: **none**
- Validated Spinny parity reference: `entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js` v0.1.0
- Configurable Spinny profile test: `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js` v0.2.2
- High-resolution diagnostic companion: `entries/tampermonkey-standalone/spinny-mini-webp-short-test.user.js` v0.1.0

## Spinny Mini animated WebP

Feature ID: `media.spinny-mini-webp`.

Accepted maintained architecture:

```text
HeroForge runtime character rotation + refresh sequencing
→ BT.maker.takeScreenshot
→ per-frame browser static WebP encoding
→ deterministic project-owned RIFF animated-WebP mux
```

Validated lower-resolution behavior on `heroforge07.1.9.98`:

- 1024 Standard / 250 frames: PASS;
- 2048 Standard / 250 frames: PASS;
- 1024 Very Slow / 750 frames: PASS;
- 2048 Slower / 500 frames: PASS;
- repeated captures: PASS;
- progress/ETA: PASS;
- parser and rotation restoration: PASS;
- general cancel/restore: PASS by user report.

## 3072 Result — Fidelity FAIL

The first 3072 Standard / 250-frame v0.2.2 capture completed in approximately 25 minutes.

Confirmed:

- final animated WebP is structurally 3072x3072;
- frame count is 250;
- individual encoded frame payloads are also 3072-sized;
- the animation mux is therefore not simply labeling 2048 frame payloads as 3072.

However, user inspection at native size found the output visibly blurry and consistent with a lower-resolution scene render enlarged into a 3072 canvas. The current 3072 mode therefore **fails the true-3K fidelity requirement** and is not accepted as supported output.

A follow-up 1024 Standard control capture was visually correct, narrowing the problem to the higher-resolution HeroForge screenshot/render path rather than the general animated-WebP serialization path.

Current v0.2.2 validates returned canvas/container dimensions only; it does not prove the internal scene raster was rendered at the requested resolution.

## Short Test Diagnostic Companion

`spinny-mini-webp-short-test.user.js` build `0.1.0-short-test-16f-partial-arc` is a disposable standalone diagnostic companion.

It:

- requires the existing profile test;
- adds a `Short Test` button to that panel;
- captures 16 contiguous frames using the currently selected resolution and speed;
- preserves the selected full profile's real angular spacing and 40 ms frame duration;
- at Standard / 250-frame spacing covers 21.6 degrees from first to last sample;
- uses the same refresh/occlusion, screenshot, static-WebP encode and RIFF mux mechanics as the full capture;
- records bridge-readable diagnostics under `HFSpinnyMiniWebPShortTest`;
- restores starting rotation in `finally`;
- refuses 4096/8192+ while the TRUE-resolution still provider owns those requests.

Based on the completed 25-minute 3072 full run, a 16-frame 3072 Short Test is expected to take roughly 1.6 minutes if per-frame cost is similar. This is only an estimate until live-tested.

## Interaction Guard Evidence

During the completed 3072 run, two accidental mouse-wheel interactions over the HeroForge canvas changed the Booth camera and produced visible jumps in the WebP. This is now direct validation that the planned capture guard must intercept/warn on camera and Booth-state interactions during active/paused capture.

## Bridge Diagnostic Status

HF-Chat-Bridge read-only issue #478 was queued to inspect the screenshot/effects render path after the page became idle. At the time of this checkpoint it had not been picked up; no runtime result is claimed yet.

## 4K Spinny Decision

4K Spinny remains **deferred**. Square 4096/8192 `BT.maker.takeScreenshot` requests are owned by the Witch Dock TRUE-resolution still-capture provider. Do not add 4K Spinny through that surface without an explicit safe frame-capture capability/bypass.

## Current Gates

- `media.screenshot-resolution` Witch Dock Stable: validated.
- Spinny v0.1.0 Lob parity: validated.
- Spinny v0.2.1 tested 1024/2048 configurable behavior: validated.
- Spinny v0.2.2 3072 structural capture: completed.
- Spinny v0.2.2 **true 3072 fidelity: FAIL / unsupported**.
- 1024 post-failure control: PASS by user report.
- Short Test companion syntax: PASS; live test pending.
- 4K Spinny: deferred.
- Pause/input guards: approved next standalone stage.
- Witch Dock Spinny integration: not started.

## Next Gate

1. Install the Short Test companion alongside v0.2.2.
2. Run 3072 + Standard + Short Test and confirm it produces the expected 16-frame partial WebP quickly.
3. Resume runtime render-path tracing when HF-Chat-Bridge is responsive; identify the actual source/render size behind a 3072 screenshot request.
4. Do not run another full 3072 spin until a candidate true-resolution fix passes Short Test visually.
5. After resolution behavior is settled, implement/test Pause and interaction guards separately.
6. Begin Witch Dock Dev integration only after the standalone feature gate is explicitly closed.

## Public Integration Rule

Standalone validation remains the laboratory. Public Witch Dock must not consume this WIP branch directly.
