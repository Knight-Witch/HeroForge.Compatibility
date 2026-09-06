# Feature Spec — Spinny Mini animated WebP

Feature ID: `media.spinny-mini-webp`

## Purpose

Provide higher-quality animated Spinny Mini export using animated WebP, replacing the broken legacy Higher Quality Spinny Mini GIF behavior and adding higher-resolution plus slower-rotation profiles without brittle compiled-string patching.

## Validated behavior

Historical Lob-parity reference:

- animated WebP;
- 1024x1024;
- 250 frames;
- 40 ms/frame;
- 10.0-second revolution;
- 25 FPS;
- infinite loop.

Validated configurable standalone combinations:

- 1024 Standard / 250 frames;
- 2048 Standard / 250 frames;
- 1024 Very Slow / 750 frames;
- 2048 Slower / 500 frames.

Resolution and rotation speed are independent. Current speed profiles retain 40 ms/frame so slower motion gains additional angular samples rather than longer frame holds.

## Current resolution policy

Accepted:

- 1024px — validated Lob-parity baseline;
- 2048px — validated on tested combinations.

Rejected pending repair:

- 3072px — v0.2.2 full structural capture completed, but true-resolution visual fidelity **FAILED**.

Deferred:

- 4096/8192 — not exposed by Spinny because Witch Dock `media.screenshot-resolution` currently owns square 4096/8192 `BT.maker.takeScreenshot` requests for still-image repair.

## 3072 fidelity result

The first v0.2.2 3072 Standard / 250-frame capture completed in approximately 25 minutes.

Confirmed:

- final animation container is 3072x3072;
- exactly 250 frames were produced;
- individual encoded frame payloads are also 3072-sized;
- the custom animated-WebP mux is not simply relabeling 2048 payloads as 3072.

Failed requirement:

- user inspection at native size reports the image is visibly blurry and looks like lower-resolution content enlarged to 3072.

A subsequent 1024 Standard control capture was visually correct. Current evidence therefore points upstream of the mux/browser WebP encoder, toward HeroForge's higher-resolution screenshot/render source behavior.

The feature must not claim 3072 support until source-detail fidelity is demonstrated.

## Required capabilities

- Photo Booth open with `BT.maker.enabled === true`;
- callable `BT.maker.takeScreenshot(width,height)`;
- writable finite `CK.character.display.rotation.y`;
- established HeroForge display refresh/occlusion/shadow/matrix behavior;
- browser `HTMLCanvasElement.toBlob(..., 'image/webp', quality)`;
- Blob/typed-array APIs.

## Accepted architecture

```text
Standalone UI / future feature host
    ↓
media.spinny-mini-webp capture service
    ↓
HeroForge runtime rotation + refresh adapter
    ↓
BT.maker.takeScreenshot
    ↓
browser static-WebP encode per frame
    ↓
project-owned RIFF animated-WebP mux
    ↓
download
```

The maintained implementation does not depend on HeroForge's closure-local animation encoder.

## Memory behavior

- Do not retain raw RGBA for all frames.
- Encode each frame immediately to compressed static WebP.
- Retain compressed image payload chunks only until final mux.
- Reduce source canvas backing store after frame extraction.

## Short Test diagnostic companion

Temporary standalone diagnostic:

`entries/tampermonkey-standalone/spinny-mini-webp-short-test.user.js`

Build: `0.1.0-short-test-16f-partial-arc`.

Purpose:

Rapidly exercise the same selected-resolution frame path and produce a partial animated WebP so visual source-detail changes can be checked without a full long revolution.

Contract:

- requires the existing profile test global/UI;
- injects `Short Test` into the existing panel;
- captures exactly 16 contiguous frames;
- uses the selected resolution and selected speed's normal angular step;
- preserves current 40 ms frame duration;
- Standard / 250-frame selection covers 21.6 degrees from first to last frame;
- uses the same refresh/occlusion/shadow/matrix sequence;
- calls the same `BT.maker.takeScreenshot(size,size)` surface;
- uses the same browser static-WebP encoding and RIFF mux semantics;
- final output is parser-gated for requested dimensions, exactly 16 frames, expected duration, loop count and frame timing;
- records requested profile, returned canvas-size histogram, output bytes/parser metrics, elapsed time and rotation restore in `HFSpinnyMiniWebPShortTest.diagnostics`;
- disables base profile controls during the short test;
- Short Test button becomes `Cancel Test` while active;
- cancellation occurs after the current frame;
- original figure rotation restores in `finally`;
- refuses 4096/8192+ sizes.

This companion is diagnostic scaffolding, not the intended production/Witch Dock architecture. Once high-resolution behavior is settled, repeated capture mechanics should remain centralized in the maintained feature/service rather than duplicated permanently.

## Progress and ETA UX

The existing full-profile v0.2.1/v0.2.2 progress/ETA remains validated. The Short Test intentionally uses simple frame status rather than adding a second ETA subsystem.

## Interaction protection requirement

During the completed 3072 run, two accidental mouse-wheel camera interactions produced visible jumps in the output. Active-capture protection is therefore required before integration:

- camera/canvas manipulation;
- leaving Photo Booth;
- Booth view/backdrop/overlay/light/effect changes;
- other state changes that invalidate frame continuity.

Guard implementation remains a separate stage from the Short Test helper.

## Diagnostics / render-source limitation

Current full and short capture scripts can mechanically validate returned canvas and WebP dimensions, but those checks do not prove the scene was internally rasterized at the requested source resolution.

Runtime tracing must determine the actual render target/source size behind a 3072 screenshot request. HF-Chat-Bridge issue #478 is queued for that read-only investigation but had not returned at this checkpoint.

## Lifecycle

Full profile test:

- capability polling;
- capture/cancel;
- concurrent capture block;
- rotation restoration;
- dispose removes owned UI/style/timer/global.

Short Test companion:

- waits for the base profile test;
- attaches/removes only its own button/status/style/global/timers;
- does not modify the base script source;
- dispose is blocked while its capture is active.

## Failure behavior

- Render/encode/mux/validation failure stops the current capture.
- Restore original rotation where technically possible.
- Do not initialize capture when required capabilities are unavailable.
- Do not affect unrelated HeroForge behavior.
- Public Witch Dock remains untouched during standalone validation.

## Risk

High because media capture performs sustained render/encode work and relies on undocumented HeroForge screenshot behavior.

The 3072 result demonstrates that output dimensions alone are not a sufficient compatibility postcondition; visual/source-raster fidelity must be part of the acceptance gate for higher-resolution profiles.

## Ownership

- Primary maintainer: TBD.
- Reviewer: Amanda.
- Backup maintainer: TBD.
- Current disposition: tested 1024/2048 profiles validated; 3072 rejected pending render-path repair; Short Test diagnostic candidate pending live validation; no Witch Dock integration yet.

## Promotion gate

Do not integrate into Witch Dock Dev until:

- 3072 is either repaired and validated or removed/deferred from the intended integrated feature;
- Short Test has served its diagnostic purpose;
- Pause/input guards are separately implemented and validated if still intended;
- public integration is separately approved.
