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

The configurable profile core has additionally passed live at:

- 1024 Standard / 250 frames / 25 FPS;
- 2048 Standard / 250 frames / 25 FPS;
- 1024 Very Slow / 750 frames / 25 FPS, approximately 34 MiB.

Resolution and rotation speed are independent. All current speed profiles retain 40 ms/frame so slower motion gains more angular samples instead of longer frame holds:

- Standard: 10 s / 250 frames;
- Slow: 15 s / 375 frames;
- Slower: 20 s / 500 frames;
- Very Slow: 30 s / 750 frames.

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

## Progress and ETA UX

v0.2.1 adds UX/diagnostics only; it must not alter capture or mux semantics.

Required UI:

- existing phase/frame/percentage status;
- progress bar directly beneath that status;
- elapsed wall-clock time;
- estimated time remaining;
- estimated total capture time;
- existing resolution/frame/FPS/workload readout.

ETA model:

- estimate processing time from measured render+encode wall time per completed frame, never from animation playback duration;
- first current-capture prediction after five completed frames;
- continuously adapt using a smoothed frame-time estimate plus current-run average;
- successful same-session timing may seed later captures of the same resolution;
- do not persist ETA timing across reloads or figures;
- final actual wall-clock capture duration remains visible and diagnostic-readable.

This intentionally makes ETA relative to the active device, browser session, figure complexity, effects and selected resolution.

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

High due to sustained hundreds-of-frame rendering and potentially large compressed outputs. Known workload multipliers versus 1024 Standard are 4x for 2048 Standard, 3x for 1024 Very Slow and 12x for 2048 Very Slow by pixel samples.

The live 2048 Standard and 1024 Very Slow passes materially reduce uncertainty, but combined high-resolution + long-duration profiles still require measurement before being treated as routine supported combinations.

## Ownership

- Primary maintainer: TBD.
- Reviewer: Amanda.
- Backup maintainer: TBD.
- Current disposition: standalone validated configurable core; v0.2.1 UX validation pending.

## Promotion gate

Do not integrate into Witch Dock Dev until:

- v0.2.1 progress/ETA UI is live-validated without capture regression;
- active 2048/500 result is recorded when complete;
- full-run rotation restoration/diagnostics are checked on the current configurable build;
- practical limits/guardrails for expensive combinations are decided from measurement;
- cancel/failure behavior remains safe;
- public integration is separately approved.
