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

Validated configurable standalone combinations:

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

## Current resolution policy

v0.2.2 exposes:

- 1024px — validated Lob-parity baseline;
- 2048px — validated resolution on tested combinations;
- 3072px — experimental 3K candidate.

3072 workload relative to 1024 Standard:

- Standard: 9x;
- Slow: 13.5x;
- Slower: 18x;
- Very Slow: 27x.

4096/8192 are intentionally **not** exposed by Spinny. The current Witch Dock `media.screenshot-resolution` provider intercepts square 4096/8192 `BT.maker.takeScreenshot` requests for still-image repair. A 4K Spinny mode therefore requires a separately designed native-frame bypass/capability before it can be considered safe.

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

A single 3072x3072 RGBA canvas is approximately 36 MiB before compression. v0.2.2 still holds only one source canvas at a time plus accumulated compressed frame payloads.

## Progress and ETA UX — validated

v0.2.1 added progress/ETA UI without changing capture or mux semantics.

Live acceptance:

- progress bar: validated;
- first-run estimate approximately 3m 7s and reported accurate/stable throughout;
- second same-session 1024 Standard estimate approximately 2m 57s;
- bridge-confirmed second-run actual total 177.101 s versus final estimated 175.614 s;
- final total-time error 1.49 s / 0.84%.

ETA remains device/session relative and is derived from measured render+encode wall time per completed frame.

## High-workload warning

v0.2.2 adds red `LONG CAPTURE` text directly beneath the timing line when either:

- resolution is 2048 or higher; or
- frame count is 500 or higher.

The warning includes the selected pixel-sample workload multiplier. It is advisory only and does not block capture.

## Diagnostics — validated current lower-resolution build

For a completed v0.2.1 1024 Standard run, bridge-readable diagnostics confirmed:

- build `0.2.1-progress-eta-runtime-rotation-webp-mux`;
- 250/250 rendered and encoded;
- 13,565,278-byte final output;
- parsed 1024x1024 / 250 frames / 10,000 ms / 40 ms x 250 / loop 0;
- rotation restored true;
- error null.

The same parser/diagnostic contract is preserved in v0.2.2 and must validate the first 3072 Standard capture before that profile is accepted.

## Lifecycle

- capability polling/refresh;
- capture;
- cancel after current frame;
- concurrent capture block;
- original rotation restoration in `finally`;
- idle `dispose()` removes UI/style/timer/global;
- no permanent HeroForge runtime override.

User live testing has confirmed the general Cancel path stops cleanly and restores the figure to its starting orientation without observed follow-on issues. Exact cancelled profile was not recorded.

## Pause/resume design status

Pause/resume is approved as a separate next-stage feature after 3072 Standard validation. It should pause only between complete frames, preserve already-compressed frames, freeze active-processing ETA while paused, and protect against camera/Booth-state changes that would invalidate continuity. It must not be bundled into the first 3072 test build.

## Failure behavior

- Any render/encode/mux/validation failure stops capture.
- Restore original character rotation where technically possible.
- Do not initialize capture when required capabilities are unavailable.
- Do not affect unrelated HeroForge behavior.
- Public Witch Dock remains untouched during standalone validation.

## Risk

High due to sustained hundreds-of-frame rendering and potentially large compressed outputs.

Validated workload multipliers include 1x, 3x, 4x and 8x. 3072 Standard begins at 9x and remains unvalidated. 3072 longer-duration combinations reach 13.5x/18x/27x and should not be treated as routine until measured.

## Ownership

- Primary maintainer: TBD.
- Reviewer: Amanda.
- Backup maintainer: TBD.
- Current disposition: v0.2.1 validated on tested profiles; v0.2.2 3072 standalone candidate pending live validation; no Witch Dock integration yet.

## Promotion gate

Do not integrate into Witch Dock Dev until:

- 3072 Standard is either validated or explicitly rejected/deferred;
- Pause/input-guard work is separately implemented and validated if it remains part of the intended integrated feature;
- public integration is separately approved.

The previous gates for 1024 behavior, tested 2048 behavior, slow-profile scaling, repeat-use, progress/ETA, parser validation, rotation restoration and general Cancel behavior are closed/validated.
