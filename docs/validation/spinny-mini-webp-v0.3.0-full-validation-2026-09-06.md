# Validation — Spinny Mini WebP v0.3.0 full standalone production paths

Date: 2026-09-06
Feature: `media.spinny-mini-webp`
HeroForge build: `heroforge07.1.9.98`
Implementation: `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`
Version: `0.3.0`
Build: `0.3.0-integrated-true3k-short-test`

## Result

**PASS — standalone v0.3.0 validated for the tested production profiles.**

This record closes the resolution/consolidation stage and advances the feature to Pause + interaction-guard development before Witch Dock Dev integration.

## Validated TRUE-3K full captures

### 3072 Standard / 250 frames

User full-run validation:

- capture completed;
- output looked genuinely 3K at native size;
- movement was clear;
- ETA was quite accurate.

Status: PASS.

### 3072 Slower / 500 frames

User full-run validation:

- capture completed;
- output looked fantastic;
- resolution was correct;
- movement was clear.

HF-Chat-Bridge issue #491 retained the post-validation timing-history record:

- timing key: `3072:true3k-phase-feed`;
- mode: `full`;
- frames: 500;
- frame source: `true3k-phase-feed`;
- average frame time: 3032.4224000008107 ms;
- tail: 373.69999998807907 ms;
- updated at: `2026-09-06T12:06:28.050Z`.

The maintained v0.3.0 implementation writes timing history only after animated-WebP mux, parser validation and download succeed. Therefore this runtime record confirms the 500-frame full capture completed the successful maintained path.

Status: PASS.

## Post-consolidation lower-resolution regression

Profile:

- 1024 Standard;
- 250 frames;
- 40 ms/frame;
- 10,000 ms animation duration;
- native frame source.

HF-Chat-Bridge issue #491:

- mode: `full`;
- status: `downloaded`;
- frames rendered: 250;
- frames encoded: 250;
- encoded frame bytes: 12,152,482;
- output bytes: 12,035,026;
- parser width: 1024;
- parser height: 1024;
- parser frame count: 250;
- parser total duration: 10,000 ms;
- parser durations: `{40:250}`;
- loop count: 0;
- elapsed: 272,058.2 ms;
- rotation restored: true;
- error: null.

Status: PASS.

## Prior integrated Short Test gate

The same maintained v0.3.0 engine previously passed the integrated 3072 Standard / 16-frame Short Test:

- native-size fidelity: PASS;
- frame source: `true3k-phase-feed`;
- successful 16-frame post-validation history entry;
- average measured frame time ~2123.48 ms.

The underlying repair companion had already mechanically established the current 768 / 4x4 / 16-phase topology, one real 3072 source render per frame, Effects restoration and rotation restoration.

## Final tested profile matrix

- 1024 Standard / 250f — PASS
- 2048 Standard / 250f — PASS
- 1024 Very Slow / 750f — PASS
- 2048 Slower / 500f — PASS
- 3072 Standard / 250f TRUE-3K — PASS
- 3072 Slower / 500f TRUE-3K — PASS
- 3072 Standard Short Test / 16f TRUE-3K — PASS

## Known unsupported/deferred paths

- Native un-repaired HeroForge 3072: rejected because source fidelity is degraded despite structural 3072 output.
- 4096/8192 Spinny: deferred because current Witch Dock TRUE-resolution still provider owns square 4096/8192 screenshot routing.

## Remaining safety work before Witch Dock Dev

Pause + interaction guards are required before integration because accidental camera-wheel input during an earlier long capture produced visible animation jumps.

Required next gates include:

- Pause/Resume at complete-frame boundaries;
- no partial TRUE-3K wrapper while paused;
- paused-duration-aware ETA;
- camera/canvas input guard;
- Booth exit guard;
- Booth state-change guard;
- safe Stay/Cancel warning behavior;
- semantic/layout-independent classification;
- diagnostic pause/cancellation metadata;
- 1024 native and 3072 TRUE-3K standalone validation after guard implementation.

## Promotion status

Standalone production-path validation: **PASS**.

Witch Dock Dev integration: **not yet started for Spinny**.

Public Witch Dock Stable: **not approved / unchanged**.
