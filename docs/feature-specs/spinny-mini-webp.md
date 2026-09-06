# Feature Spec — Spinny Mini animated WebP

Feature ID: `media.spinny-mini-webp`

## Purpose

Provide higher-quality animated Spinny Mini export using animated WebP, replacing the broken legacy Higher Quality Spinny Mini GIF behavior while adding higher-resolution and slower-rotation profiles without brittle compiled-string patching.

## Current maintained standalone implementation

File:

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

Version: `0.3.0`
Build: `0.3.0-integrated-true3k-short-test`

Compatibility target: `heroforge07.1.9.98`.

Current disposition: **standalone validated for tested production profiles; Pause/interaction guards next; Witch Dock Dev integration not yet started.**

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
- 3072 Standard / 250 frames TRUE-3K: PASS
- 3072 Slower / 500 frames TRUE-3K: PASS
- 3072 integrated Short Test / 16 frames: PASS

Native un-repaired 3072 remains rejected.

## Confirmed native 3072 defect

Native HeroForge can return a structurally 3072 screenshot while rendering the Effects/model source at lower phase resolution.

Runtime trace established:

- 1024 request → `CK.Effects.renderToCanvas(1024,1024,camera1024)`;
- 2048 request → repeated `renderToCanvas(1024,1024,camera2048)` phases;
- 3072 request → repeated `renderToCanvas(768,768,camera3072)` phases.

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

Future interaction guards additionally require semantic evidence sufficient to classify camera input, Booth exit and Booth state-changing controls without coordinate assumptions.

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

Public Witch Dock `media.screenshot-resolution` owns that method for 4096/8192 still repair. The 3072 repair therefore operates one layer lower at `CK.Effects.renderToCanvas` during explicit frame capture.

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
- same cancel-after-current-frame behavior;
- same starting-rotation restoration;
- output labeled `SHORT_TEST`.

For Standard / 250-frame spacing, 16 samples span 21.6 degrees first-to-last.

### Short Test UI policy

- standalone development harness: directly visible;
- future Witch Dock normal mode: hidden;
- Witch Dock Developer Mode ON: visible through Spinny host;
- Developer Mode OFF: hidden;
- Developer Mode controls presentation only; it does not own capture logic.

## Validation evidence

### Integrated TRUE-3K Short Test

PASS. Native-size output looked genuinely 3K. Runtime history recorded `3072:true3k-phase-feed`, mode `short-test`, 16 frames and ~2123.48 ms average frame time after successful mux/parser/download.

### Full TRUE-3K captures

PASS at:

- 3072 Standard / 250 frames — user confirmed correct resolution, clear motion and quite accurate ETA;
- 3072 Slower / 500 frames — user confirmed fantastic correct-resolution output and clear movement; runtime retained a successful 500-frame `3072:true3k-phase-feed` post-validation timing entry (~3032.42 ms average frame time).

### Post-consolidation 1024 regression

PASS. HF-Chat-Bridge issue #491 confirmed 1024x1024 / 250 frames / 10,000 ms / `{40:250}` / loop 0, output 12,035,026 bytes, rotation restored true, error null.

## Pause / Resume contract — next stage

Pause is allowed only at safe completed-frame boundaries.

Required behavior:

- a pause request during a frame lets that frame finish;
- no next angular sample starts until resumed;
- already-compressed frames remain retained;
- resume continues from the next sample;
- no partial TRUE-3K phase feed may remain installed while paused;
- active ETA excludes or freezes indefinite paused time;
- multiple pause/resume cycles must be supported;
- cancel while paused must restore figure/runtime state and release retained capture state safely.

Diagnostics should include:

- `paused`;
- pause count;
- total paused duration;
- current/last pause timestamps as useful;
- cancellation cause;
- guarded action category when applicable.

## Interaction guard contract — next stage

While active or paused, actions that would invalidate capture continuity must warn before mutation.

Guard categories:

- camera/canvas wheel, drag/pointer or relevant keyboard manipulation;
- leaving Photo Booth;
- Booth view/backdrop/background/overlay/frame/lighting/effect controls;
- other semantically identified state changes that affect output frames.

Rules:

- do not use fixed screen coordinates;
- support HeroForge split left/right, grouped-right and mobile-bottom layouts;
- Spinny's own controls remain usable;
- choosing Stay blocks the invalidating event/action;
- choosing Cancel cancels capture safely first;
- do not blindly redispatch/replay pointer sequences after cancellation;
- failure to classify a required guard surface must be reported rather than silently assumed safe.

## Lifecycle

Current standalone feature blocks concurrent captures and restores figure rotation. TRUE-3K restores temporary Effects wrapping after every repaired frame.

Future Pause/guard listeners/DOM must be removable on dispose and must not intentionally affect HeroForge when no Spinny capture is active.

## 4K Spinny

Deferred. Current Witch Dock TRUE-resolution still provider owns square 4096/8192 screenshot requests. A future 4K animation path requires a separately validated explicit frame capability/bypass.

## Maintained v0.5.0 lifecycle / guard status

Version `0.5.0`, build `0.5.0-integrated-pause-interaction-guards`, is the maintained standalone implementation. Pause occurs only after a completed encoded frame; paused wall-clock time is separated from active ETA; cancel while paused restores state; capture-invalidating HeroForge interaction is blocked before mutation with Keep Capture / Cancel Capture choices. Consolidated guard integration passed live.
