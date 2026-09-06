# Spinny Mini WebP v0.3.0 — Integrated TRUE-3K Short Test Validation

Date: 2026-09-06
HeroForge build: `heroforge07.1.9.98`
Feature: `media.spinny-mini-webp`
Implementation: `spinny-mini-webp-profiles.user.js`
Version: `0.3.0`
Build: `0.3.0-integrated-true3k-short-test`
Status: **PASS — integrated TRUE-3K Short Test**

## Test profile

- Resolution: 3072px
- Rotation: Standard
- Mode: Short Test
- Full-profile reference: 250 frames / 10 seconds / 40 ms per frame
- Short Test frames: 16 contiguous samples
- Angular spacing: same as Standard full profile
- Frame source: `true3k-phase-feed`

## User visual result

The downloaded Short Test completed successfully and was inspected at native size.

Result: **PASS — output looks genuinely 3K and retains the sharpness of the previously validated repaired TRUE-3K companion output.**

This does not reproduce the blurry/upscaled appearance of HeroForge's native 3072 path.

## Runtime evidence

HF-Chat-Bridge read-only issue #490 confirmed the installed runtime:

- version: `0.3.0`;
- build: `0.3.0-integrated-true3k-short-test`.

The successful Short Test left session timing history:

- key: `3072:true3k-phase-feed`;
- `frameMs`: approximately 2123.48125;
- `tailMs`: 0;
- `frames`: 16;
- `mode`: `short-test`;
- `frameSource`: `true3k-phase-feed`.

In v0.3.0, this timing-history record is written only after:

1. every requested frame is rendered and encoded;
2. the animated WebP is muxed;
3. parser validation succeeds;
4. the output download is initiated.

Therefore the surviving timing-history record confirms the integrated Short Test reached the successful post-validation path.

## `lastCapture` overwrite note

Before diagnostics were read, a later full 3072 capture was started and cancelled after two frames. That later run replaced the Short Test's `lastCapture` object.

The exact integrated Short Test parser snapshot is therefore no longer retained in the current runtime.

The later cancelled run still provided useful independent repair evidence for both completed frames:

- frame source: `true3k-phase-feed`;
- native tile size: 768;
- grid: 4x4;
- expected phases: 16;
- supplied phases: 16;
- unique phases: 16;
- source renders: 1;
- source size: 3072;
- Effects restored: true.

After cancellation:

- frames rendered: 2;
- frames encoded: 2;
- figure starting rotation restored: true;
- error: expected `Capture cancelled.`

## Acceptance conclusion

The maintained v0.3.0 implementation has passed its integrated TRUE-3K Short Test gate.

Confirmed:

- consolidated v0.3.0 capture engine is active;
- 3072 uses the repaired frame-source key;
- Short Test completed successfully;
- native-size visual fidelity is true-3K quality;
- Short Test timing can seed per-frame ETA for the full run without inheriting the rejected native-3072 timing path;
- repaired per-frame Effects restoration remains functional in the same integrated engine.

## Remaining gate

This validation does **not** yet close the complete 3072 production profile.

Required next:

1. full repaired 3072 Standard / 250-frame capture;
2. parser: 3072x3072 / 250 frames / 10,000 ms / 40 ms x250 / loop 0;
3. complete per-frame repair diagnostics;
4. Effects and figure rotation restoration;
5. native-size visual fidelity;
6. output size, elapsed time, ETA accuracy and resource-behavior record;
7. lower-resolution regression smoke before Witch Dock integration.

## Runtime behavior changed

No. This file records validation only.
