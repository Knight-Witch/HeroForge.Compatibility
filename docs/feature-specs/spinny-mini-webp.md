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

Native path rejected pending repair:

- 3072px — v0.2.2 full structural capture completed, but true-resolution visual fidelity FAILED.

Repair candidate:

- 3072px via explicit Effects-source phase feed — standalone Short Test candidate pending visual validation.

Deferred:

- 4096/8192 — not exposed by Spinny because Witch Dock `media.screenshot-resolution` currently owns square 4096/8192 `BT.maker.takeScreenshot` requests for still-image repair.

## 3072 fidelity result

The first v0.2.2 3072 Standard / 250-frame capture completed in approximately 25 minutes.

Confirmed:

- final animation container is 3072x3072;
- exactly 250 frames were produced;
- individual encoded frame payloads are also 3072-sized;
- the custom animated-WebP mux is not simply relabeling lower-size payloads.

Failed requirement:

- user inspection at native size found the image visibly blurry and consistent with lower-resolution content enlarged to 3072.

A subsequent 1024 Standard control capture was visually correct.

The feature must not claim native 3072 support merely because canvas/container dimensions match the requested size.

## Render-source diagnosis

A clean-page HF-Chat-Bridge Power trace established the relevant HeroForge screenshot topology on `heroforge07.1.9.98`:

- 1024 request → `CK.Effects.renderToCanvas(1024,1024,camera1024)`;
- 2048 request → repeated `renderToCanvas(1024,1024,camera2048)` phase/tile renders;
- 3072 request → `renderToCanvas(768,768,camera3072)` phase/tile renders.

The native `CK.Effects.renderToCanvas` implementation sizes the Effects render target from those supplied dimensions. Therefore the native 3072 path can return a 3072 canvas while its Effects/model raster source is materially smaller.

This is the confirmed primary cause of the observed native 3072 blur.

The 3072 / 768 ratio maps to a four-per-axis tiled phase layout under the already-validated TRUE-resolution topology model. Maintained repair code must derive and validate topology at runtime rather than hard-code a phase count.

## Required capabilities

Base feature:

- Photo Booth open with `BT.maker.enabled === true`;
- callable `BT.maker.takeScreenshot(width,height)`;
- writable finite `CK.character.display.rotation.y`;
- established HeroForge display refresh/occlusion/shadow/matrix behavior;
- browser `HTMLCanvasElement.toBlob(..., 'image/webp', quality)`;
- Blob/typed-array APIs.

TRUE-3K repair candidate additionally requires:

- callable `CK.Effects.renderToCanvas`;
- GPU texture/renderbuffer support for a 3072 Effects source;
- native tiled capture topology that can be classified unambiguously;
- temporary method replacement/restoration of `CK.Effects.renderToCanvas`.

## Accepted architecture

Serialization boundary:

```text
Spinny capture service
    ↓
HeroForge runtime rotation + refresh adapter
    ↓
frame source
    ↓
browser static-WebP encode per frame
    ↓
project-owned RIFF animated-WebP mux
    ↓
download
```

Validated native lower-resolution frame source:

```text
BT.maker.takeScreenshot(size,size)
```

Candidate repaired 3072 frame source:

```text
BT.maker.takeScreenshot(3072,3072)
    ↓
native Booth requests tiled Effects phases
    ↓
temporary CK.Effects.renderToCanvas adapter
    ↓
one true 3072 Effects source per animation frame
    ↓
derive requested native phase canvases from that source
    ↓
native Booth compositor finishes 3072 frame
```

This retains HeroForge's native Booth compositor while repairing only the lower-resolution model/Effects source. It does not depend on HeroForge's closure-local animation encoder.

## Provider ownership boundary

The TRUE-3K candidate must not replace `BT.maker.takeScreenshot`.

Public Witch Dock `media.screenshot-resolution` already owns that method for 4096/8192 repair and treats unexpected ownership replacement as degraded provider state.

The candidate therefore temporarily wraps only `CK.Effects.renderToCanvas` during an explicit 3072 Short Test. Non-matching Effects calls pass through unchanged, and the exact original method restores in `finally`.

## Memory behavior

Full Spinny:

- do not retain raw RGBA for all frames;
- encode each frame immediately to compressed static WebP;
- retain compressed image payload chunks only until final mux;
- reduce source canvas backing store after frame extraction.

TRUE-3K phase repair:

- one 3072x3072 RGBA Effects source is approximately 36 MiB;
- retain only the current animation frame's source pixels;
- release source pixels as soon as all native phases for that frame are supplied;
- do not accumulate repaired raw source frames across the animation.

## Short Test diagnostic companion — live validated

`entries/tampermonkey-standalone/spinny-mini-webp-short-test.user.js`

Build: `0.1.0-short-test-16f-partial-arc`.

Purpose:

Rapidly exercise the selected-resolution frame path and produce a partial animated WebP so fidelity changes can be checked without a full long revolution.

Contract:

- requires the existing profile test;
- captures exactly 16 contiguous frames;
- uses selected resolution and selected speed's normal angular step;
- preserves current 40 ms frame duration;
- Standard / 250-frame selection covers 21.6 degrees first-to-last;
- reuses normal refresh/occlusion/shadow/matrix sequence;
- uses browser static-WebP encoding and RIFF mux semantics;
- parser-gates requested dimensions, 16 frames, duration, loop and frame timing;
- records output/rotation diagnostics;
- cancellation after current frame;
- original rotation restores in `finally`;
- refuses 4096/8192+ sizes.

Live result:

- helper works correctly and downloads the expected partial animation;
- baseline 3072 Short Test remains blurry, reproducing the full-run defect;
- Short Test is therefore accepted as diagnostic scaffolding.

## TRUE-3K repair companion

`entries/tampermonkey-standalone/spinny-mini-webp-3k-repair-companion.user.js`

Version: 0.1.0.
Build: `0.1.0-3072-effects-source-phase-feed`.

Purpose:

Prove whether feeding the native 3072 Booth compositor from a real 3072 Effects source restores true source detail.

Contract:

- requires the profile test and Short Test companion;
- adds `TRUE 3K Test` to the same diagnostic panel;
- invokes the existing Short Test rather than implementing another animation serializer;
- temporarily wraps only `CK.Effects.renderToCanvas`;
- classifies matching 3072 capture-camera tile topology live;
- renders one true 3072 Effects source per animation frame;
- derives each requested native phase by interleaving pixels from that source, following the validated TRUE-resolution phase-feed principle;
- rejects duplicate phases, topology changes, incomplete feeds and invalid source dimensions;
- releases current-frame source data when its phase feed completes;
- delegates cancel to the Short Test;
- records per-frame topology/source data under `HFSpinnyMiniWebP3KRepair.diagnostics`;
- restores `CK.Effects.renderToCanvas` in `finally`.

Status: syntax PASS; live visual fidelity pending.

This companion is diagnostic scaffolding. If it passes, the proven frame-source repair should be integrated into the maintained Spinny service rather than requiring users to install permanent stacked test companions.

## Progress and ETA UX

The existing full-profile v0.2.1/v0.2.2 progress/ETA remains validated. Short Test and TRUE-3K diagnostic companions intentionally keep their own status lightweight.

## Interaction protection requirement

During the completed 3072 run, two accidental mouse-wheel camera interactions produced visible jumps in the output. Active-capture protection is required before integration:

- camera/canvas manipulation;
- leaving Photo Booth;
- Booth view/backdrop/overlay/light/effect changes;
- other state changes that invalidate frame continuity.

Guard implementation remains separate from the current resolution repair.

## Lifecycle

Full profile test:

- capability polling;
- capture/cancel;
- concurrent capture block;
- rotation restoration;
- dispose removes owned UI/style/timer/global.

Short Test:

- attaches/removes only its own UI/style/global/timers;
- reuses the main feature's runtime assumptions;
- restores figure rotation through its capture `finally`.

TRUE-3K repair companion:

- installs no permanent HeroForge capture wrapper;
- owns only its UI/status/global and temporary Effects wrapper;
- delegates animation cancellation to Short Test;
- restores exact Effects method on completion/failure/cancel;
- dispose blocked while active.

## Failure behavior

- render/encode/mux/validation failure stops the current capture;
- restore original rotation and Effects method where technically possible;
- fail on unavailable/ambiguous required capabilities;
- do not affect unrelated HeroForge behavior;
- public Witch Dock remains untouched during standalone validation.

## Risk

High because media capture performs sustained render/encode work and relies on undocumented HeroForge screenshot topology.

The native 3072 result demonstrates that output dimensions alone are not a sufficient compatibility postcondition. Higher-resolution acceptance requires both mechanical topology/source checks and human native-size fidelity validation.

## Ownership

- Primary maintainer: TBD.
- Reviewer: Amanda.
- Backup maintainer: TBD.
- Current disposition: tested 1024/2048 profiles validated; native 3072 rejected; Short Test diagnostic validated; TRUE-3K repair candidate pending live visual validation; no Witch Dock Spinny integration yet.

## Promotion gate

Do not integrate Spinny into Witch Dock Dev until:

- TRUE-3K repair either passes and is integrated into the maintained standalone feature or 3072 is explicitly removed/deferred;
- a repaired full 3072 Standard run passes if 3072 remains an intended production profile;
- Pause/input guards are separately implemented and validated if still intended;
- public integration is separately approved.
