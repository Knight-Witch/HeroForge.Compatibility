# Feature Spec — Spinny Mini animated WebP

Feature ID: `media.spinny-mini-webp`

## Purpose

Provide higher-quality animated Spinny Mini export using animated WebP, replacing the broken legacy Higher Quality Spinny Mini GIF behavior while adding higher-resolution and slower-rotation profiles without brittle compiled-string patching.

## Current maintained standalone candidate

File:

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

Version: `0.3.0`
Build: `0.3.0-integrated-true3k-short-test`

## Historical Lob-parity reference

- animated WebP;
- 1024x1024;
- 250 frames;
- 40 ms/frame;
- 10.0 s revolution;
- 25 FPS;
- infinite loop.

## Validated lower-resolution combinations

- 1024 Standard / 250 frames;
- 2048 Standard / 250 frames;
- 1024 Very Slow / 750 frames;
- 2048 Slower / 500 frames.

Resolution and rotation speed are independent. Current speed profiles retain 40 ms/frame so slower motion gains additional angular samples rather than longer frame holds.

## Resolution policy

Accepted lower-resolution behavior:

- 1024px — validated Lob-parity baseline;
- 2048px — validated on tested combinations.

Rejected native path:

- native 3072px — structurally completes but source fidelity FAILS.

Validated repair capability:

- 3072px via TRUE-3K Effects-source phase feed — PASS mechanically and visually.

Current integrated candidate:

- v0.3.0 routes 3072 through the validated repaired frame source;
- integrated 3072 Standard Short Test: **PASS**;
- full repaired 3072 Standard / 250-frame confirmation: pending.

Deferred:

- 4096/8192 Spinny — not exposed while Witch Dock `media.screenshot-resolution` owns square 4096/8192 screenshot routing.

## Confirmed native 3072 defect

The first native 3072 Standard / 250-frame capture completed in approximately 25 minutes.

Confirmed:

- final animation 3072x3072;
- exactly 250 frames;
- individual encoded frame payloads 3072-sized;
- custom animated-WebP mux not falsely relabeling lower-size payloads.

Failed requirement:

- native-size visual detail was blurry and looked like lower-resolution content enlarged to 3072.

A subsequent 1024 control capture was visually correct.

Runtime trace established:

- 1024 request → `CK.Effects.renderToCanvas(1024,1024,camera1024)`;
- 2048 request → repeated `renderToCanvas(1024,1024,camera2048)` phases;
- 3072 request → repeated `renderToCanvas(768,768,camera3072)` phases.

The native `renderToCanvas` implementation sizes its Effects render target from those supplied dimensions. Therefore native 3072 output dimensions do not imply 3072 source-detail fidelity.

## Required capabilities

Base feature:

- Photo Booth open with `BT.maker.enabled === true`;
- callable `BT.maker.takeScreenshot(width,height)`;
- writable finite `CK.character.display.rotation.y`;
- established display/occlusion/shadow/matrix refresh behavior;
- browser `HTMLCanvasElement.toBlob(..., 'image/webp', quality)`;
- Blob/typed-array APIs.

TRUE-3K additionally requires:

- callable `CK.Effects.renderToCanvas`;
- GPU texture/renderbuffer support for a 3072 Effects source;
- classifiable native tiled capture topology;
- temporary replace/restore capability for `CK.Effects.renderToCanvas`.

## Serialization architecture

```text
Spinny capture service
    ↓
HeroForge runtime rotation + refresh adapter
    ↓
frame-source adapter
    ↓
browser static-WebP encode per frame
    ↓
project-owned RIFF animated-WebP mux
    ↓
parser validation
    ↓
download
```

The feature does not depend on HeroForge's closure-local animation encoder.

## Frame-source behavior

### 1024 / 2048

Use native:

```text
BT.maker.takeScreenshot(size,size)
```

### 3072 TRUE-3K

For one explicit animation frame:

```text
BT.maker.takeScreenshot(3072,3072)
    ↓
native Booth requests tiled Effects phases
    ↓
temporary CK.Effects.renderToCanvas adapter
    ↓
one genuine 3072x3072 Effects source
    ↓
derive requested phase canvases by interleaving source pixels
    ↓
native Booth compositor finishes 3072 frame
    ↓
restore exact CK.Effects.renderToCanvas
```

The adapter:

- derives tile size/grid live;
- rejects non-square/invalid/ambiguous topology;
- validates phase offsets against native camera-view geometry;
- rejects duplicate phases;
- requires a complete phase feed;
- requires one true source render for current tiled mode;
- validates source dimensions;
- passes unrelated Effects calls through unchanged;
- supports future native true-3072 passthrough if HeroForge begins providing it directly;
- restores the exact original Effects method after every repaired frame.

## Integrated v0.3.0 Short Test validation

The maintained v0.3.0 engine has now passed the integrated 3072 Standard Short Test.

Confirmed evidence:

- user native-size visual result: sharp/genuine 3K PASS;
- session timing key: `3072:true3k-phase-feed`;
- mode: `short-test`;
- frames: 16;
- average measured frame time: ~2123.48 ms;
- successful timing-history write proves the run passed mux/parser validation and download, because v0.3.0 writes that history only after those gates succeed.

A later full 3072 capture was started and cancelled after two frames, overwriting `lastCapture`. Both completed frames still reported complete 768px / 4x4 / 16-phase repaired topology, one 3072 source render and Effects restoration true, with final figure rotation restored.

## Provider ownership boundary

Spinny must not replace `BT.maker.takeScreenshot`.

Public Witch Dock `media.screenshot-resolution` owns that method for 4096/8192 repair and treats unexpected ownership loss as degraded state.

The 3072 repair therefore operates one level lower at `CK.Effects.renderToCanvas` and only during an explicit repaired frame.

## Memory behavior

- Do not retain raw RGBA for all frames.
- Encode each frame immediately to compressed static WebP.
- Retain compressed image payload chunks only until final mux.
- Reduce source canvas backing stores after extraction.
- TRUE-3K retains only the current frame's real 3072 RGBA Effects source (~36 MiB) while deriving its native phases.
- Release repaired source pixels before the next animation frame.

## Full capture profiles

- Standard: 250 frames / 10,000 ms / 40 ms/frame
- Slow: 375 frames / 15,000 ms / 40 ms/frame
- Slower: 500 frames / 20,000 ms / 40 ms/frame
- Very Slow: 750 frames / 30,000 ms / 40 ms/frame

## Short Test diagnostic operation

Short Test is a maintained operation of the same Spinny capture service.

Contract:

- exactly 16 contiguous frames;
- same selected resolution;
- same selected speed profile's angular spacing;
- same 40 ms frame duration;
- same refresh/occlusion/shadow/matrix sequence;
- same frame-source adapter;
- same static-WebP encoder;
- same RIFF mux and parser;
- same cancel-after-current-frame behavior;
- same starting-rotation restoration;
- output filename/status labeled `SHORT_TEST`.

For Standard / 250-frame spacing, 16 samples span 21.6 degrees first-to-last.

## Short Test UI policy

Standalone Tampermonkey testing is a development harness, so Short Test is directly visible there.

Future Witch Dock:

- normal users: Short Test hidden;
- Developer Mode ON: Spinny host reveals Short Test and developer diagnostics;
- Developer Mode OFF: those diagnostic controls disappear;
- Developer Mode only controls visibility/state and does not own capture logic.

## Remaining validation gate

Before complete 3072 production-profile validation:

1. run one full repaired 3072 Standard / 250-frame capture;
2. require 3072x3072 / 250 frames / 10,000 ms / 40 ms x250 / loop 0;
3. require complete per-frame TRUE-3K repair diagnostics and restoration;
4. verify native-size fidelity and browser/resource behavior;
5. record elapsed time / ETA accuracy / output size;
6. run a lower-resolution regression smoke before Witch Dock integration.
