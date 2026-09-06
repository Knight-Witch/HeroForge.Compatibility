# Validation — Spinny Mini WebP TRUE-3K repaired Short Test

Date: 2026-09-06
HeroForge build: `heroforge07.1.9.98`
Feature: `media.spinny-mini-webp`
Repair companion: `spinny-mini-webp-3k-repair-companion.user.js`
Build: `0.1.0-3072-effects-source-phase-feed`

## Purpose

Validate whether the diagnosed native 3072 source-fidelity defect is repaired when HeroForge's native 3072 compositor phases are fed from one genuine 3072x3072 `CK.Effects.renderToCanvas` source per animation frame.

This is a frame-source/Short Test validation. It is not yet the final full-revolution 3072 production-profile validation.

## Baseline defect

Native HeroForge 3072 capture was previously confirmed to:

- return structurally correct 3072x3072 output;
- use a 3072 capture camera;
- request 768x768 Effects/model phase renders;
- appear visibly blurry/upscaled at native size.

The 16-frame baseline Short Test reproduced that visual failure.

## Repair architecture under test

For each 3072 animation frame:

1. call the existing Short Test frame path;
2. allow native `BT.maker.takeScreenshot(3072,3072)` to drive the Booth compositor;
3. temporarily intercept matching `CK.Effects.renderToCanvas` phase requests;
4. render one true 3072x3072 Effects source;
5. derive the native requested phase canvases from that source;
6. complete native Booth composition;
7. encode/mux through the existing Short Test path;
8. release current-frame source pixels;
9. restore the exact Effects method after the run.

`BT.maker.takeScreenshot` ownership is not replaced.

## Live runtime result

HF-Chat-Bridge issue #489 read the completed run after capture ended.

Top-level repair result:

- build: `0.1.0-3072-effects-source-phase-feed`
- status: `passed`
- startedAt: `2026-09-06T09:04:26.293Z`
- completedAt: `2026-09-06T09:04:56.741Z`
- elapsed: approximately 30.448 seconds
- targetSize: 3072
- maxTextureSize: 16384
- maxRenderbufferSize: 16384
- frame count: 16
- totalPhases: 256
- nativeTrueResolutionCalls: 0
- shortTestResult: true
- effectsRestored: true
- error: null

Per-frame result for all 16 frames:

- tileSize: 768
- grid: 4
- expectedPhases: 16
- suppliedPhases: 16
- uniquePhases: 16
- sourceRenders: 1
- sourceSize: 3072

No frame reported an incomplete or duplicate phase feed.

## Short Test output result

- status: `downloaded`
- framesRendered: 16
- framesEncoded: 16
- outputBytes: 4,589,972
- parsed width: 3072
- parsed height: 3072
- loopCount: 0
- frameCount: 16
- totalDurationMs: 640
- duration histogram: 40 ms x16
- rotationRestored: true
- error: null

Selected profile:

- resolution: 3072
- speed: Standard
- full-profile frames: 250
- Short Test frames: 16
- frame duration: 40 ms
- angular step: 1.44 degrees
- first-to-last arc: 21.6 degrees
- WebP quality: 0.95

## Visual acceptance

User inspected the repaired WebP at native/full size and reported that it now **looks like genuine 3K detail**, unlike the known-blurry native 3072 baseline.

Visual fidelity result: **PASS**.

## Acceptance decision

TRUE-3K repaired frame source:

- topology validation: PASS
- complete phase delivery: PASS
- genuine 3072 Effects source per frame: PASS
- WebP parser/output: PASS
- rotation restoration: PASS
- Effects restoration: PASS
- runtime errors: none
- native-size human fidelity check: PASS

Overall result: **PASS — TRUE-3K frame-source repair validated.**

## Remaining gate

Do not yet classify the complete 3072 Spinny production profile as fully validated.

Required next:

1. integrate the validated repair into the maintained standalone Spinny capture/profile path;
2. re-run integrated Short Test;
3. run one full repaired 3072 Standard / 250-frame revolution;
4. confirm full-run output/parser, resource stability, restoration and native-size visual fidelity.

Only after that full run passes should 3072 production-profile status move to fully validated.

## Public integration

Public Witch Dock was not modified by this validation and remains outside the standalone test laboratory.
