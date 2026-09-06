# Feature Spec — Spinny Mini animated WebP

Feature ID: `media.spinny-mini-webp`

## Purpose

Provide higher-quality animated Spinny Mini export using animated WebP, replacing the broken legacy Higher Quality Spinny Mini GIF behavior and adding higher-resolution plus slower-rotation profiles without brittle compiled-string patching.

## Validated behavior

Historical Lob-parity reference:

- 1024x1024
- 250 frames
- 40 ms/frame / 25 FPS
- 10.0-second revolution
- infinite loop

Validated configurable standalone combinations:

- 1024 Standard / 250 frames
- 2048 Standard / 250 frames
- 1024 Very Slow / 750 frames
- 2048 Slower / 500 frames

Resolution and rotation speed are independent. Current speed profiles retain 40 ms/frame so slower motion gains additional angular samples rather than longer frame holds.

## Resolution policy

Accepted:

- 1024px — validated Lob-parity baseline
- 2048px — validated on tested combinations
- TRUE-3K repaired frame source — validated by 16-frame Short Test; full 3072 production-profile gate still pending

Rejected:

- native HeroForge 3072 path — structurally 3072 but source-fidelity degraded because native Effects phases are 768px

Deferred:

- 4096/8192 Spinny — current Witch Dock `media.screenshot-resolution` owns square 4096/8192 `BT.maker.takeScreenshot` requests for still-image repair

## Native 3072 fidelity failure

The first v0.2.2 3072 Standard / 250-frame capture completed in approximately 25 minutes and produced a structurally correct 3072x3072 animation with genuine 3072-sized encoded frames. Native-size inspection was nevertheless visibly blurry.

A 1024 control remained visually correct.

Live trace established the cause:

- 1024 request → `CK.Effects.renderToCanvas(1024,1024,camera1024)`
- 2048 request → repeated `renderToCanvas(1024,1024,camera2048)` phases
- 3072 request → repeated `renderToCanvas(768,768,camera3072)` phases

The current `CK.Effects.renderToCanvas` implementation sizes its actual Effects render target from those supplied dimensions. Therefore returned canvas/WebP dimensions are not sufficient high-resolution postconditions.

## Required capabilities

Base capture:

- Photo Booth open with `BT.maker.enabled === true`
- callable `BT.maker.takeScreenshot(width,height)`
- writable finite `CK.character.display.rotation.y`
- established HeroForge display refresh/occlusion/shadow/matrix behavior
- browser `HTMLCanvasElement.toBlob(..., 'image/webp', quality)`
- Blob/typed-array APIs

TRUE-3K repaired frame source additionally requires:

- callable `CK.Effects.renderToCanvas`
- GPU texture/renderbuffer support for 3072
- native tiled capture topology that can be classified unambiguously
- temporary method replacement/restoration of `CK.Effects.renderToCanvas`

## Accepted serialization architecture

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

Lower-resolution frame source:

```text
BT.maker.takeScreenshot(size,size)
```

Repaired 3072 frame source:

```text
BT.maker.takeScreenshot(3072,3072)
    ↓
native Booth requests tiled Effects phases
    ↓
temporary CK.Effects.renderToCanvas adapter
    ↓
one true 3072x3072 Effects source per animation frame
    ↓
derive requested native phase canvases from that source
    ↓
native Booth compositor completes 3072 frame
```

This preserves HeroForge's native Booth compositor while repairing the lower-resolution model/Effects source.

## Provider ownership boundary

The repaired 3072 frame source must not replace `BT.maker.takeScreenshot`.

Public Witch Dock `media.screenshot-resolution` already owns that method for 4096/8192 repair and treats unexpected ownership replacement as degraded provider state.

The 3072 repair therefore temporarily adapts only `CK.Effects.renderToCanvas` during explicit repaired frame capture. Non-matching Effects calls pass through unchanged, and the exact original method restores after completion/failure/cancel.

## Topology contract

Do not hard-code the observed 4x4 grid as an assumed permanent HeroForge API.

Current validated runtime topology on `heroforge07.1.9.98`:

- target: 3072
- native tile: 768
- grid: 4 per axis
- expected phases: 16 per animation frame

Maintained code must derive and validate:

- tile size
- integral grid
- phase coordinates from camera offsets
- duplicate-phase rejection
- complete phase delivery
- source dimensions
- Effects restoration

If HeroForge changes topology ambiguously, repaired 3072 capture must fail rather than guess.

## Memory behavior

Full Spinny:

- do not retain raw RGBA for all animation frames
- encode each completed frame immediately to compressed static WebP
- retain compressed payload chunks only until final mux
- reduce source canvas backing store after extraction

TRUE-3K frame repair:

- one 3072x3072 RGBA Effects source is approximately 36 MiB
- retain only the current animation frame's source pixels
- release those pixels after all native phases for that frame are supplied
- never accumulate repaired raw 3072 sources across the animation

## Short Test diagnostic — validated

`entries/tampermonkey-standalone/spinny-mini-webp-short-test.user.js`

Build: `0.1.0-short-test-16f-partial-arc`.

- 16 contiguous frames
- selected profile's normal angular spacing and frame duration
- Standard / 250-frame selection: 1.44 degrees/sample, 21.6 degrees first-to-last
- same refresh/occlusion/shadow/matrix sequence
- same static-WebP encode and RIFF mux semantics
- parser-gated dimensions/frame count/timing/loop
- cancellation after current frame
- starting rotation restored in `finally`
- 4096/8192+ refused

Live result: PASS as rapid diagnostic infrastructure. Baseline 3072 Short Test reproduced the native blur.

## TRUE-3K repair companion — validated Short Test

`entries/tampermonkey-standalone/spinny-mini-webp-3k-repair-companion.user.js`

Version: 0.1.0
Build: `0.1.0-3072-effects-source-phase-feed`

Purpose:

Prove that feeding native 3072 phases from a real 3072 Effects source restores native-size detail.

Live validation:

- status: PASS
- ~30.448 s
- 16 repaired animation frames
- tile 768 / grid 4
- 16/16 expected/supplied/unique phases per frame
- one 3072 source render per frame
- 256 total phases
- output 4,589,972 bytes
- parsed 3072x3072 / 16 frames / 640 ms / 40 ms x16 / loop 0
- rotation restored true
- Effects restored true
- errors null
- user native-size visual fidelity: PASS

Conclusion: **TRUE-3K frame-source repair is validated.**

The companion remains diagnostic scaffolding. The proven repair should be integrated into the maintained Spinny capture service/profile path rather than requiring users to keep stacked test scripts.

## Progress and ETA UX

The existing full-profile progress/ETA remains validated. Integrating repaired 3072 must preserve the current progress/ETA contract unless testing proves a change is needed.

Because repaired 3072 per-frame cost differs substantially from the old native 3072 path, timing prediction must learn from actual repaired-frame timing rather than reuse stale native-3072 history blindly.

## Interaction protection requirement

Two accidental mouse-wheel camera interactions during the first full native 3072 capture produced visible jumps. Active-capture protection is required before Witch Dock integration:

- camera/canvas manipulation
- leaving Photo Booth
- Booth view/backdrop/overlay/light/effect changes
- other state changes that invalidate frame continuity

Guard implementation remains a separate stage from resolution repair.

## Lifecycle

Maintained feature should support:

- initialize
- capture
- cancel
- disable/dispose where practical
- starting-rotation restoration
- temporary Effects-adapter restoration
- concurrent capture blocking

## Failure behavior

- stop current capture on render/encode/mux/validation failure
- restore starting rotation where technically possible
- restore exact Effects method after repaired 3072 capture
- fail on unavailable/ambiguous capabilities or topology
- do not affect unrelated HeroForge behavior
- public Witch Dock remains untouched during standalone validation

## Risk

High because sustained media capture relies on undocumented HeroForge screenshot topology and significant GPU/browser resources.

High-resolution acceptance requires both mechanical diagnostics and human native-size fidelity validation.

## Ownership

- Primary maintainer: TBD
- Reviewer: Amanda
- Backup maintainer: TBD
- Current disposition: 1024/2048 tested profiles validated; native 3072 rejected; TRUE-3K frame-source repair validated by Short Test; full repaired 3072 Standard pending; no Witch Dock Spinny integration yet

## Promotion gate

Do not integrate Spinny into Witch Dock Dev until:

- validated TRUE-3K repair is integrated into the maintained standalone feature
- integrated Short Test passes
- one full repaired 3072 Standard run passes if 3072 remains an intended production profile
- Pause/input guards are separately implemented and validated if still intended
- public integration is separately approved
