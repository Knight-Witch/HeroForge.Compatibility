# Feature Spec — Spinny Mini animated WebP

Feature ID: `media.spinny-mini-webp`

## Purpose

Provide higher-quality animated Spinny Mini export using animated WebP, replacing the broken legacy Higher Quality Spinny Mini GIF behavior and adding higher-resolution plus slower-rotation profiles without returning to brittle compiled-string patching.

## Validated behavior

Historical Lob-parity reference:

- animated WebP;
- 1024x1024;
- 250 frames;
- 40 ms/frame;
- 10.0-second revolution;
- 25 FPS;
- infinite loop.

v0.1.0 validated that target live and produced a retained 12.9 MiB output.

The current configurable standalone core has additionally passed live at:

- 1024 Standard / 250 frames / 25 FPS;
- 2048 Standard / 250 frames / 25 FPS;
- 1024 Very Slow / 750 frames / 25 FPS, approximately 34 MiB;
- 2048 Slower / 500 frames / 25 FPS.

Resolution and rotation speed are independent. All current speed profiles retain 40 ms/frame so slower motion gains more angular samples instead of longer frame holds:

- Standard: 10 s / 250 frames;
- Slow: 15 s / 375 frames;
- Slower: 20 s / 500 frames;
- Very Slow: 30 s / 750 frames.

The 2048 Slower / 500-frame pass represents an 8x baseline pixel-sample workload and confirms a combined high-resolution + increased-frame-count profile.

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
- Retain compressed WebP image payload chunks only until final mux.
- Reduce source canvas backing store after frame extraction.
- Continue measuring final compressed-output verification at expensive profiles.

## Progress and ETA UX — validated

v0.2.1 adds UX/diagnostics only; it does not alter capture or mux semantics.

Required UI and current status:

- existing phase/frame/percentage status: validated;
- progress bar directly beneath that status: validated;
- elapsed wall-clock time: validated;
- estimated time remaining: validated;
- estimated total capture time: validated;
- existing resolution/frame/FPS/workload readout: validated/useful.

ETA model:

- estimate processing time from measured render+encode wall time per completed frame, never from animation playback duration;
- first current-capture prediction after five completed frames when no history exists;
- continuously adapt using a smoothed frame-time estimate plus current-run average;
- successful same-session timing seeds later captures of the same resolution;
- do not persist ETA timing across reloads or figures;
- final actual wall-clock capture duration remains visible and diagnostic-readable.

Live acceptance:

- first-run estimate approximately 3m 7s and reported accurate/stable throughout;
- second same-session 1024 Standard estimate approximately 2m 57s;
- bridge-confirmed second-run actual total 177.101 s versus final estimated 175.614 s;
- final total-time error 1.49 s / 0.84%.

This makes ETA relative to the active device, browser session, figure complexity, effects and selected resolution.

## Diagnostics — validated current build

For a completed v0.2.1 1024 Standard run, bridge-readable diagnostics confirmed:

- build `0.2.1-progress-eta-runtime-rotation-webp-mux`;
- 250/250 rendered and encoded;
- 13,565,278-byte final output;
- parsed 1024x1024 / 250 frames / 10,000 ms / 40 ms x 250 / loop 0;
- rotation restored true;
- error null.

## Lifecycle

- capability polling/refresh;
- capture;
- cancel after current frame;
- concurrent capture block;
- original rotation restoration in `finally`;
- idle `dispose()` removes UI/style/timer/global;
- no permanent HeroForge runtime override.

## Failure behavior

- Any render/encode/mux/validation failure stops capture.
- Restore original character rotation where technically possible.
- Do not initialize capture when required capabilities are unavailable.
- Do not affect unrelated HeroForge behavior.
- Public Witch Dock remains untouched during standalone validation.

## Risk

High due to sustained hundreds-of-frame rendering and potentially large compressed outputs. Known workload multipliers versus 1024 Standard are 4x for 2048 Standard, 3x for 1024 Very Slow, 8x for 2048 Slower and 12x for 2048 Very Slow by pixel samples.

The live 2048 Standard, 1024 Very Slow and 2048 Slower passes materially reduce uncertainty. The 2048 Very Slow 12x combination remains an optional stress case rather than a demonstrated prerequisite.

## Ownership

- Primary maintainer: TBD.
- Reviewer: Amanda.
- Backup maintainer: TBD.
- Current disposition: standalone v0.2.1 validated on tested profiles; not yet integrated into Witch Dock Dev.

## Promotion gate

Do not integrate into Witch Dock Dev until:

- practical warnings/guardrails for expensive profile combinations are decided;
- dedicated cancel/failure behavior is regressed on the current standalone build;
- any chosen optional stress case is completed if needed to establish the ceiling;
- public integration is separately approved.

The previous gates for 1024 behavior, 2048 Standard, slow-profile scaling, current-build rotation restoration, repeat-use, progress-bar UX and ETA accuracy are closed/validated.
