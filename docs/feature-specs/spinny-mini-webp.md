# Feature Spec — Spinny Mini animated WebP

Feature ID: `media.spinny-mini-webp`

## Purpose

Provide higher-quality animated Spinny Mini export using animated WebP, replacing the broken legacy Higher Quality Spinny Mini GIF behavior while adding higher-resolution and slower-rotation profiles without brittle compiled-string patching.

## Current maintained standalone implementation

File:

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

Version: `0.5.0`
Build: `0.5.0-integrated-pause-interaction-guards`

Compatibility target: `heroforge07.1.9.98`.

Current disposition: **standalone validated; Witch Dock Dev validated; public Witch Dock v1.2.0 promoted; clean public v1.2.0 smoke pending.**

Original Spinny promotion commit: `8d96dd803f452c3c7b623c6963b4fdb3ef762f59`.

Current public host/UI release commit: `b5e366e3f6c06d661e8bc1d59f8cb190ad7401f6`. Spinny service/UI runtime source is unchanged by v1.2.0.

## Historical Lob-parity reference

- animated WebP;
- 1024x1024;
- 250 frames;
- 40 ms/frame / 25 FPS;
- 10.0 s revolution;
- infinite loop.

## Full capture profiles

- Standard: 250 frames / 10,000 ms / 40 ms/frame
- Slow: 375 frames / 15,000 ms / 40 ms/frame
- Slower: 500 frames / 20,000 ms / 40 ms/frame
- Very Slow: 750 frames / 30,000 ms / 40 ms/frame

Slower motion uses additional angular samples, not repeated/held frames.

## Validated profile matrix

- 1024 Standard / 250 frames: PASS
- 2048 Standard / 250 frames: PASS
- 1024 Very Slow / 750 frames: PASS
- 2048 Slower / 500 frames: PASS
- repaired 3072 Standard / 250 frames TRUE-3K: PASS
- repaired 3072 Slower / 500 frames TRUE-3K: PASS
- repaired 3072 integrated Short Test / 16 frames: PASS

Native unrepaired 3072 remains rejected.

## Confirmed native 3072 defect

Native HeroForge can return a structurally 3072 screenshot while rendering the Effects/model source at lower phase resolution.

Runtime trace established:

- 1024 request -> `CK.Effects.renderToCanvas(1024,1024,camera1024)`;
- 2048 request -> repeated `renderToCanvas(1024,1024,camera2048)` phases;
- 3072 request -> repeated `renderToCanvas(768,768,camera3072)` phases.

The native `renderToCanvas` implementation sizes its Effects target from supplied dimensions. Native 3072 therefore loses source detail despite a 3072 final canvas.

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

Witch Dock integrated delivery additionally requires:

- a host download operation capable of receiving the finished Blob and filename;
- current public implementation: Promise-backed `WitchDock.downloadBlob` using userscript `GM_download` callbacks.

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
host download boundary
```

Do not retain raw RGBA for all animation frames. Encode each frame immediately and retain compressed WebP payloads until final mux.

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
- rejects invalid/ambiguous topology;
- validates phase offsets against camera-view geometry;
- rejects duplicate phases;
- requires complete phase delivery;
- requires one true source render in current tiled mode;
- validates source dimensions;
- passes unrelated Effects calls through unchanged;
- supports direct native true-3072 passthrough if HeroForge later provides it;
- restores the exact original Effects method after every repaired frame.

## Provider ownership boundary

Spinny must not replace `BT.maker.takeScreenshot`.

Public Witch Dock `media.screenshot-resolution` owns that method for square 4096/8192 still repair. Spinny 1024/2048/3072 requests pass through that provider's non-owned sizes, while the 3072 fidelity repair operates one layer lower at `CK.Effects.renderToCanvas` during explicit frame capture.

The 4096 ownership collision remains a compatibility constraint, but **4096 animated-WebP expansion is not an active roadmap item** unless explicitly reopened.

## Short Test diagnostic operation

Short Test is a maintained operation of the same Spinny capture service.

Contract:

- exactly 16 contiguous frames;
- same selected resolution;
- same selected speed profile's angular spacing;
- same 40 ms frame duration;
- same refresh sequence;
- same frame-source adapter;
- same WebP encoder/mux/parser;
- same Pause/Cancel/restoration lifecycle;
- output labeled `SHORT_TEST`.

For Standard / 250-frame spacing, 16 samples span 21.6 degrees first-to-last.

### Short Test UI policy

- standalone development harness: directly visible;
- Witch Dock normal mode: hidden;
- Witch Dock Developer Mode ON: visible through Spinny host in Dev and public Stable v1.2.0;
- Developer Mode OFF: hidden;
- Developer Mode controls presentation/diagnostics only; it does not own capture logic.

Public Stable v1.2.0 includes Developer Mode v0.3.0 as an optional/default-OFF About toggle, so Short Test is available for troubleshooting without exposing it in normal mode.

## Pause / Resume contract

Pause is allowed only at safe completed-frame boundaries.

Validated behavior:

- a pause request during a frame lets that frame finish;
- no next angular sample starts until resumed;
- already-compressed frames remain retained;
- resume continues from the next sample;
- no partial TRUE-3K phase feed remains installed while paused;
- active ETA excludes indefinite paused time;
- multiple pause/resume cycles are supported;
- cancel while paused releases the waiter and restores figure/runtime state safely.

Diagnostics include pause state/count/duration and cancellation/guard context.

## Interaction guard contract

While active or paused, actions that would invalidate capture continuity are intercepted before HeroForge mutation.

Current validated behavior:

- camera/canvas pointer interaction: blocked + warning;
- relevant Photo Booth/state-changing UI interaction: blocked + warning;
- wheel/scroll: silently blocked with no warning modal;
- Spinny controls remain usable;
- choosing Keep Capture leaves the capture running and the attempted mutation blocked;
- choosing Cancel cancels capture first and requires the intended action to be repeated after cleanup;
- pointer sequences are not blindly replayed;
- classification does not rely on fixed screen coordinates.

## Witch Dock host integration

Final Dev consumer:

- service v0.5.1 / build `0.5.1-witch-dock-dev-download-scroll-guard`;
- UI v0.1.1 / build `0.1.1-dev-download-ux`;
- commit `fa75a9c1790009b4b4ae1a1162d419982e20545e`.

Integrated behavior passed placement, popout, Pause/Resume, cancel, ETA and guard testing. Final hardening re-smoke confirmed privileged WebP download and silent wheel/scroll blocking.

The original page-context anchor download could silently fail to initiate a visible browser download despite successful mux/parser completion. The accepted Witch Dock integration therefore moves the final file-save boundary into the userscript shell:

```text
Spinny output Blob
→ WitchDock.downloadBlob(blob, filename)
→ GM_download
→ success / error / timeout callback
```

Spinny waits for that callback before marking the integrated download confirmed.

The optional transient `Download complete` UI flash is best-effort only. It was not observed in the final Dev smoke and is not part of the functional acceptance gate.

## Public Stable promotion

Original Spinny promotion (Witch Dock v1.1.0):

`8d96dd803f452c3c7b623c6963b4fdb3ef762f59`

Current public Witch Dock v1.2.0 host/UI release:

`b5e366e3f6c06d661e8bc1d59f8cb190ad7401f6`

The v1.2.0 promotion keeps Stable Spinny service/UI source unchanged and narrowly adds the separately validated tab presentation, compact High Res service/UI ownership split, canonical module registry and Developer Mode v0.3.0. The Dev loader remains excluded.

Status is **Stable promoted / clean public v1.2.0 smoke pending**. Do not label the current public gate fully validated until that smoke runs with Dev/temporary scripts disabled.

## Clean public smoke gate

Minimum required test:

1. Public Witch Dock v1.2.0 active; Dev/temporary Spinny scripts disabled.
2. Confirm the promoted tab presentation and compact High Res section.
3. Enable Developer Mode from About and confirm public module versions/builds.
4. Run 1024px Standard Short Test and confirm WebP download succeeds through the public host.
5. Confirm wheel over HeroForge canvas is silently ignored and one non-wheel continuity-invalidating action still produces the guard warning.
6. Disable Developer Mode and confirm diagnostic/Short Test UI cleans up normally.

If this passes, close the current public Stable gate with documentation-only checkpoints. A new expensive 3072 production run is not required absent regression evidence.

## Lifecycle

The maintained feature blocks concurrent captures, restores figure rotation, restores temporary TRUE-3K Effects ownership after every repaired frame, releases Pause waiters on cancellation, and installs removable guard listeners/DOM. One Spinny failure must not intentionally disable unrelated Witch Dock or unmodified HeroForge behavior.
