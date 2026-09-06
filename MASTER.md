# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Historical detail remains available in Git history; this file tracks the current active state.

## Current Phase

**`media.spinny-mini-webp` v0.2.1 remains the validated configurable behavior target for tested 1024/2048 profiles. v0.2.2 3072 structurally completes but fails true-resolution fidelity. The 16-frame Short Test is now live-validated as the rapid diagnostic, the native 3072 render-source loss is diagnosed, and a standalone TRUE-3K Effects-source repair companion is ready for live validation. Public Witch Dock remains untouched.**

`media.screenshot-resolution` and the corrected bound decal gizmo remain Witch Dock Stable.

## Repository Roles

- Compatibility / reconstruction: `Knight-Witch/HeroForge.Compatibility`
- Public Witch Dock consumer: `Knight-Witch/KnightWitch.Heroforge`
- Development-only live transport: private `Knight-Witch/HF-Chat-Bridge`
- Public Witch Dock runtime dependency on Compatibility `main`: **none**
- Validated Spinny parity reference: `entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js` v0.1.0
- Configurable Spinny profile test: `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js` v0.2.2
- Rapid partial-spin diagnostic: `entries/tampermonkey-standalone/spinny-mini-webp-short-test.user.js` v0.1.0
- TRUE-3K repair candidate: `entries/tampermonkey-standalone/spinny-mini-webp-3k-repair-companion.user.js` v0.1.0

## Spinny Mini animated WebP

Feature ID: `media.spinny-mini-webp`.

Accepted maintained serialization architecture:

```text
HeroForge runtime character rotation + refresh sequencing
→ frame capture surface
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

## 3072 Result — Structural PASS / Fidelity FAIL

The first 3072 Standard / 250-frame v0.2.2 capture completed in approximately 25 minutes.

Confirmed:

- final animated WebP is structurally 3072x3072;
- frame count is 250;
- individual encoded frame payloads are also 3072-sized;
- the animation mux is not simply labeling 2048 frame payloads as 3072.

However, user inspection at native size found the output visibly blurry and consistent with lower-resolution scene content enlarged into a 3072 canvas. The current native 3072 path therefore **fails the true-3K fidelity requirement**.

A follow-up 1024 Standard control capture was visually correct.

## Short Test Diagnostic — LIVE PASS

`spinny-mini-webp-short-test.user.js` build `0.1.0-short-test-16f-partial-arc` is now live-validated as the rapid diagnostic path.

It successfully:

- captured 16 contiguous samples using the selected profile's real angular spacing;
- downloaded a valid partial animated WebP;
- restored the figure correctly;
- reproduced the same blurry 3072 fidelity failure in a short run instead of requiring another ~25-minute full revolution.

The helper remains diagnostic scaffolding, not the production capture architecture.

## 3072 Render-Source Diagnosis — CONFIRMED

After a clean page reload, HF-Chat-Bridge/Power runtime tracing isolated the internal HeroForge screenshot behavior:

- 1024 screenshot: `CK.Effects.renderToCanvas(1024,1024,camera1024)`;
- 2048 screenshot: repeated `renderToCanvas(1024,1024,camera2048)` phase/tile renders;
- 3072 screenshot: native capture camera remains 3072x3072 while `CK.Effects.renderToCanvas` drops to **768x768** phase/tile renders.

`CK.Effects.renderToCanvas` itself sizes its Effects render target from the supplied dimensions. Therefore a structurally 3072 output does not imply a 3072 Effects/model source. This directly explains the observed blur and closes the key fault-boundary question.

The 3072 / 768 ratio yields a 4-per-axis phase topology under the already-validated TRUE-resolution classification model. The repair candidate derives/validates this live rather than hard-coding a fixed count.

## TRUE-3K Repair Candidate

New standalone diagnostic:

`spinny-mini-webp-3k-repair-companion.user.js`

Build: `0.1.0-3072-effects-source-phase-feed`.

Design:

- requires the existing profile test + Short Test companion;
- adds `TRUE 3K Test` to the same diagnostic panel;
- reuses the already-working Short Test rotation, frame timing, WebP encoding, mux, parser, download and cancel behavior;
- temporarily wraps only `CK.Effects.renderToCanvas` while the explicit TRUE-3K test runs;
- for each native 3072 animation frame, produces one genuine 3072x3072 Effects source and derives the native phase canvases from that source;
- uses the same phase-feed principle already validated by the TRUE 4K/8K still-capture repair;
- leaves `BT.maker.takeScreenshot` ownership untouched, avoiding collision with the Witch Dock 4096/8192 provider;
- restores the exact original Effects method in `finally`;
- records per-frame topology/source diagnostics.

Static syntax check: PASS. Live visual fidelity validation: pending.

## Interaction Guard Evidence

During the completed full 3072 run, two accidental mouse-wheel interactions over the HeroForge canvas changed the Booth camera and produced visible jumps in the WebP. This is direct validation that planned active-capture protection must cover camera and Booth-state interactions.

## 4K Spinny Decision

4K Spinny remains **deferred**. Square 4096/8192 `BT.maker.takeScreenshot` requests are owned by the Witch Dock TRUE-resolution still-capture provider. Do not add 4K Spinny through that surface without an explicit safe frame-capture capability/bypass.

## Current Gates

- `media.screenshot-resolution` Witch Dock Stable: validated.
- Spinny v0.1.0 Lob parity: validated.
- Spinny v0.2.1 tested 1024/2048 configurable behavior: validated.
- Spinny v0.2.2 3072 structural capture: completed.
- Spinny v0.2.2 native true-3072 fidelity: **FAIL / unsupported**.
- 1024 post-failure control: PASS by user report.
- Short Test diagnostic: **LIVE PASS**.
- Native 3072 render-source diagnosis: **CONFIRMED — 768px Effects tiles under a 3072 capture camera**.
- TRUE-3K repair companion syntax: PASS; live visual test pending.
- 4K Spinny: deferred.
- Pause/input guards: approved next standalone stage after resolution behavior is settled.
- Witch Dock Spinny integration: not started.

## Next Gate

1. Install the TRUE-3K repair companion alongside the existing profile + Short Test scripts.
2. Select **3072px + Standard** and run **TRUE 3K Test**.
3. Accept only if the partial WebP shows genuinely improved native-size detail and diagnostics confirm complete per-frame phase feeds plus Effects restoration.
4. If the short repaired result passes, integrate the proven frame-source repair into the maintained Spinny capture service/profile path.
5. Run one full 3072 Standard confirmation only after the repaired Short Test passes.
6. Then implement/test Pause and interaction guards separately.
7. Witch Dock Dev integration remains later and separate.

## Public Integration Rule

Standalone validation remains the laboratory. Public Witch Dock must not consume this WIP branch directly.
