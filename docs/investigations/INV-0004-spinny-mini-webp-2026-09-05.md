# INV-0004 — Spinny Mini animated WebP reconstruction

Date opened: 2026-09-05
Status: **standalone v0.3.0 production-path validation complete; Pause + interaction guards active next stage**
HeroForge build: `heroforge07.1.9.98`
Feature: `media.spinny-mini-webp`

## Question

How can HeroForge's Spinny Mini WebP capability be reconstructed into a higher-resolution, configurable-speed feature without brittle compiled-string injection or PNG-series ZIP output?

## Confirmed baselines

Native HeroForge WebP:

- 512x512;
- 386 frames;
- 17 ms/frame;
- 6562 ms total;
- 58.82 FPS;
- infinite loop.

Historical Lob HQ reference:

- 1024x1024;
- 250 frames;
- 40 ms/frame / 25 FPS;
- 10.0 s revolution.

## Accepted serialization architecture

```text
HeroForge runtime character rotation
→ established display/occlusion refresh sequence
→ frame-source adapter
→ browser-native static WebP encoding per frame
→ project-owned animated-WebP RIFF mux
```

The private HeroForge animation encoder and Lob's compiled-string GIF patch are not required.

## Native 3072 failure and diagnosis

The first native 3072 Standard / 250-frame run completed structurally but looked blurry/upscaled at native size.

Runtime tracing confirmed:

- 1024 screenshot → `CK.Effects.renderToCanvas(1024,1024,camera1024)`;
- 2048 screenshot → repeated 1024 Effects phase renders;
- 3072 screenshot → repeated 768 Effects phase renders under a 3072 capture camera.

The native `renderToCanvas` sizes its render target from supplied width/height. Therefore final 3072 canvas dimensions do not prove 3072 source detail.

Conclusion: native un-repaired 3072 is unsupported.

## TRUE-3K repair

Validated architecture:

```text
BT.maker.takeScreenshot(3072,3072)
→ native compositor requests tiled Effects phases
→ temporary CK.Effects.renderToCanvas adapter
→ one real 3072x3072 Effects source for the frame
→ derive requested phases
→ validate topology/completeness
→ native compositor finishes frame
→ restore exact Effects method
```

The adapter derives current topology live rather than hard-coding the observed 768 / 4x4 arrangement as a permanent HeroForge contract.

The repair intentionally does not replace `BT.maker.takeScreenshot`, preserving Witch Dock TRUE-resolution still-provider ownership of square 4096/8192 routing.

## Repair principle validation

The standalone repair companion first validated:

- 16 repaired frames;
- native tile 768;
- 4x4 grid;
- 16/16 expected/supplied/unique phases per frame;
- one 3072 source render per frame;
- parser 3072x3072 / 16 frames / 640 ms / 40 ms x16 / loop 0;
- rotation restored;
- Effects restored;
- errors null;
- native-size fidelity PASS.

## v0.3.0 maintained integration

File:

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

Version: `0.3.0`
Build: `0.3.0-integrated-true3k-short-test`

Consolidated flow:

```text
full capture OR Short Test
→ selected profile
→ same rotation/refresh lifecycle
→ frame-source adapter
   ├── 1024/2048 native
   └── 3072 TRUE-3K phase feed
→ same WebP encode/mux/parser
→ same cancel/restore lifecycle
```

Short Test is retained as a supported diagnostic operation of this same engine.

## Integrated Short Test — PASS

The v0.3.0 3072 Standard / 16-frame Short Test completed and looked genuinely 3K.

Runtime history:

- key `3072:true3k-phase-feed`;
- mode `short-test`;
- frames 16;
- average frame time ~2123.48 ms.

History is written only after mux/parser/download success.

## Full maintained TRUE-3K validation — PASS

### 3072 Standard / 250 frames

User reported:

- completed full revolution;
- correct 3K resolution;
- clear movement;
- ETA quite accurate.

Status: PASS.

### 3072 Slower / 500 frames

User reported:

- full capture completed;
- output looked fantastic;
- resolution correct;
- movement clear.

HF-Chat-Bridge issue #491 retained:

- key `3072:true3k-phase-feed`;
- mode `full`;
- frames 500;
- average frame time ~3032.4224 ms;
- tail ~373.7 ms;
- successful update at `2026-09-06T12:06:28.050Z`.

Because timing history is written only after mux/parser/download, the runtime record confirms a successful maintained 500-frame full path.

Status: PASS.

## Post-consolidation 1024 regression — PASS

HF-Chat-Bridge issue #491 captured:

- status `downloaded`;
- 250 rendered / 250 encoded;
- output 12,035,026 bytes;
- parser 1024x1024 / 250 frames / 10,000 ms / `{40:250}` / loop 0;
- elapsed 272,058.2 ms;
- rotation restored true;
- error null.

This closes the v0.3.0 consolidation regression gate.

## Standalone conclusion

`media.spinny-mini-webp` v0.3.0 is validated for the tested production profiles on `heroforge07.1.9.98`.

Validated matrix:

- 1024 Standard / 250f;
- 2048 Standard / 250f;
- 1024 Very Slow / 750f;
- 2048 Slower / 500f;
- 3072 Standard / 250f TRUE-3K;
- 3072 Slower / 500f TRUE-3K;
- 3072 integrated Short Test / 16f.

## Interaction-guard evidence

During the original long native-3072 run, two accidental mouse-wheel interactions over the HeroForge canvas changed the camera and produced visible jumps in the output.

This is direct evidence that production Spinny needs interaction protection.

## Active next investigation — Pause + interaction guards

### Pause requirement

- pause only between fully completed frames;
- a request during a frame finishes that frame first;
- no partial TRUE-3K phase feed may remain active while paused;
- preserve already-compressed frames;
- resume at the next angular sample;
- freeze/exclude paused duration from ETA;
- support multiple pause/resume cycles;
- safe cancel while paused.

### Guard requirement

During active or paused capture, warn before actions that would invalidate continuity:

- camera/canvas wheel or pointer drag;
- relevant camera keyboard input;
- leaving Photo Booth;
- Booth view/backdrop/background/overlay/frame/light/effect changes;
- other semantically identified output-state mutations.

### Layout requirement

HeroForge has at least:

- split left/right layout;
- grouped right-side layout;
- mobile bottom layout.

No fixed coordinates may be used.

### Guard decision behavior

- Stay: prevent the invalidating action and keep capture alive.
- Cancel: safely cancel capture first; do not blindly replay/redispatch the triggering pointer sequence.

Spinny's own Pause/Resume/Cancel controls must remain usable while guards are active.

### Diagnostics target

Add/retain fields for:

- paused state;
- pause count;
- total paused duration;
- pause timestamps as useful;
- cancellation cause;
- guarded action category;
- restoration state.

### Investigation plan

1. Probe the live Photo Booth DOM/runtime surfaces in an idle session.
2. Identify semantic evidence for canvas/camera target, Booth exit and state-changing Booth controls.
3. Repeat probes across relevant layouts where practical.
4. Do not promote selector assumptions from one layout without evidence.
5. Implement guards first in the standalone v0.3.x line.
6. Test 1024 native and 3072 TRUE-3K Pause/Resume/guard behavior.
7. Only after standalone validation proceed to Witch Dock Dev host integration.

## Short Test future Witch Dock policy

- Spinny service owns `captureShortTest()`;
- standalone harness exposes it directly;
- Witch Dock normal UI hides it;
- Witch Dock Developer Mode reveals it via `KWDeveloperMode.enabled` / `onChange()`;
- Developer Mode does not duplicate capture logic.

## 4K collision

4K Spinny remains deferred. Witch Dock Stable `media.screenshot-resolution` owns square 4096/8192 `BT.maker.takeScreenshot` requests. A future 4K animation path requires a separately validated explicit frame capability/bypass.
