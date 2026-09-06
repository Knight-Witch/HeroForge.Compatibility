# Testing

Standalone-first validation precedes Witch Dock integration.

## `media.screenshot-resolution`

HeroForge build: `heroforge07.1.9.98`.

Standalone, Witch Dock Dev and public Witch Dock Stable still-capture gates remain validated. Current Spinny work does not reopen them.

## `media.spinny-mini-webp`

HeroForge build: `heroforge07.1.9.98`.

Committed maintained implementation:

- file: `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`
- version: `0.3.0`
- build: `0.3.0-integrated-true3k-short-test`

## Validated profile matrix

- 1024 Standard / 250 frames: PASS
- 2048 Standard / 250 frames: PASS
- 1024 Very Slow / 750 frames: PASS
- 2048 Slower / 500 frames: PASS
- 3072 Standard / 250 frames via TRUE-3K: PASS
- 3072 Slower / 500 frames via TRUE-3K: PASS
- 3072 Standard integrated Short Test / 16 frames: PASS

Other validated behavior:

- repeat use: PASS
- parser validation: PASS
- rotation restoration: PASS
- progress/readout: PASS
- ETA usefulness: PASS on tested long TRUE-3K run
- general cancel / starting-rotation restoration: PASS

## Native 3072 failure reference

Native un-repaired 3072 is rejected. Runtime trace confirmed a 3072 capture camera paired with repeated 768px Effects phase renders; structural dimensions pass while source fidelity fails.

## TRUE-3K repair

TRUE-3K is validated through Short Test, 250-frame full and 500-frame full capture. The maintained v0.3.0 adapter feeds the native compositor from one genuine 3072 Effects source per animation frame and restores `CK.Effects.renderToCanvas` after each repaired frame.

## Local v0.4.0 Pause/Resume candidate — LIVE PASS

Candidate build: `0.4.0-frame-boundary-pause-resume`.

Requested live tests and user result:

1. 1024 Standard Short Test — pause/resume: PASS.
2. Pause request waits for current frame completion: PASS.
3. Frame count remains stopped while paused: PASS.
4. Resume continues normally and output completes: PASS.
5. 3072 TRUE-3K Standard Short Test pause/resume: PASS.
6. Cancel while paused: PASS.
7. Starting-state restoration after pause/cancel path: PASS.
8. ETA/pause-time behavior: PASS by user observation.

Prior static/mock checks for the same candidate had already passed:

- syntax;
- frame-boundary pause sequencing;
- TRUE-3K Effects restoration before entering paused state;
- cancel-while-paused deadlock avoidance;
- paused-time exclusion from active timing;
- API/state exposure for `pause`, `resume`, and diagnostics.

Conclusion: Pause/Resume behavior is validated at standalone test level on the current HeroForge build.

Important source-status distinction: the committed maintained runtime file is still v0.3.0 until the tested v0.4.0 source is promoted atomically with its docs.

## Interaction-guard investigation — ACTIVE

An earlier long 3072 run demonstrated a real failure mode: accidental mouse-wheel camera changes caused visible jumps in the animation.

Required guard tests after implementation:

1. Camera wheel attempt during active capture warns before camera mutation.
2. Pointer/camera drag attempt during active capture warns before camera mutation.
3. Same camera guards work while paused.
4. Photo Booth exit attempt warns before exit.
5. Booth backdrop/view/overlay/light/effect changes warn before mutation.
6. Choosing stay blocks the invalidating action without cancelling.
7. Choosing cancel cancels safely first; original pointer sequence is not blindly replayed.
8. Spinny Pause/Resume/Cancel remain usable while guards are installed.
9. Left/right/mobile HeroForge layouts pass without coordinate assumptions.
10. Diagnostics record cancellation cause / guarded action.

Broad read-only DOM probe #492 completed but exceeded the bridge result limit and returned only a truncation summary. Follow-up discovery must use narrower selectors/queries.

## Short Test Witch Dock policy

Standalone exposes Short Test because it is a development harness.

Future Witch Dock:

- Spinny service retains `captureShortTest()`;
- normal UI hides Short Test;
- Developer Mode exposes it through the Spinny host;
- Developer Mode must not duplicate media capture logic.

## 4K Spinny

Deferred. Current Witch Dock TRUE-resolution still provider owns square 4096/8192 screenshot requests.
