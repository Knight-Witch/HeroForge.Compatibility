# Validation Record — Spinny Mini WebP v0.2.2 3072 fidelity

Date: 2026-09-06
HeroForge build: `heroforge07.1.9.98`
Feature: `media.spinny-mini-webp`
Candidate: `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js` v0.2.2 / `0.2.2-3k-warning-runtime-rotation-webp-mux`

## Test profile

- resolution: 3072x3072;
- speed: Standard;
- frames: 250;
- frame duration: 40 ms;
- intended animation duration: 10.0 s;
- approximate wall-clock processing time: 25 minutes.

## User result

Capture completed and downloaded.

At native/full display size, the output was visibly blurry. User assessment: it appears like the 2048 result enlarged rather than a true newly rendered 3072 image.

Result for true-resolution fidelity: **FAIL**.

## Structural file findings

Inspection of the uploaded completed WebP confirmed:

- animation container dimensions: 3072x3072;
- frame count: 250;
- individual encoded frame payloads are also 3072-sized.

Therefore the failure is not explained by the project-owned mux simply declaring a 3072 canvas around 2048 encoded frame payloads.

The current script's structural validation did what it was designed to do, but that gate is insufficient to prove internal HeroForge scene-raster fidelity.

## Control

After the 3072 run, user performed a new 1024 Standard capture as a baseline control.

Result: visual/native-resolution detail **PASS by user report**.

This narrows the current failure away from a universal browser WebP/mux blur and toward the higher-resolution HeroForge screenshot/render path.

## Interaction-continuity finding

During the 3072 run, the user accidentally moved the mouse wheel twice while hovering over the HeroForge canvas. Camera interaction remained active during capture and the two camera changes produced visible jumps in the final animation.

This directly validates the planned requirement to block/warn on frame-invalidating camera and Booth interactions while capture is active or paused.

## Status impact

- 1024 validated profiles: remain accepted.
- 2048 validated profiles: remain accepted.
- 3072 structural output: completed.
- 3072 true-resolution fidelity: **rejected / unsupported pending diagnosis and repair**.
- 3072 Slow/Slower/Very Slow: do not test; no value until base 3072 fidelity is repaired.
- 4K: remains deferred due TRUE-resolution still-provider collision.

## Next diagnostic tool

A separate Short Test companion was added:

`entries/tampermonkey-standalone/spinny-mini-webp-short-test.user.js`

Build: `0.1.0-short-test-16f-partial-arc`.

It produces a 16-frame contiguous partial spin at the currently selected resolution/speed while preserving normal angular spacing and frame timing. It exists to validate future high-resolution changes in roughly minutes rather than repeating a full ~25-minute spin.

## Runtime probe status

HF-Chat-Bridge issue #478 was queued read-only to inspect the screenshot/effects render path and provider state. It had not been picked up at the time of this record. No result is claimed.

## Acceptance rule going forward

A higher-resolution profile is not accepted merely because:

- `BT.maker.takeScreenshot` returns a canvas with the requested dimensions; or
- the final WebP parser reports the requested dimensions.

The acceptance gate must also demonstrate additional native image detail consistent with the requested source resolution. Short Test should be used first; a full revolution should only be repeated after that visual fidelity gate passes.
