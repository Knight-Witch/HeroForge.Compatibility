# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Historical detail remains available in Git history; this file tracks the current active state.

## Current Phase

**`media.spinny-mini-webp` is at standalone v0.3.0 with integrated TRUE-3K Short Test validated.**

- Tested 1024/2048 behavior remains the validated lower-resolution target.
- Native HeroForge 3072 remains rejected because it produces structurally 3072 output from 768px Effects phase renders and looks blurred/upscaled.
- The TRUE-3K phase-feed frame-source repair is validated.
- v0.3.0 integrates that repaired frame source directly into the maintained standalone Spinny profile script.
- The integrated v0.3.0 3072 Standard Short Test passed native-size visual validation.
- One full repaired 3072 Standard / 250-frame run is still required before the complete 3K production profile is considered validated.
- Public Witch Dock remains untouched by Spinny runtime work.

`media.screenshot-resolution` and `decals.gizmo.bound-correction` remain Witch Dock Stable.

## Repository Roles

- Compatibility / reconstruction: `Knight-Witch/HeroForge.Compatibility`
- Public Witch Dock consumer: `Knight-Witch/KnightWitch.Heroforge`
- Development-only live transport: private `Knight-Witch/HF-Chat-Bridge`
- Public Witch Dock runtime dependency on Compatibility `main`: **none**

## Spinny Mini WebP

Feature ID: `media.spinny-mini-webp`.

Current maintained standalone candidate:

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

Version: `0.3.0`
Build: `0.3.0-integrated-true3k-short-test`

Validated lower-resolution behavior on `heroforge07.1.9.98`:

- 1024 Standard / 250 frames: PASS
- 2048 Standard / 250 frames: PASS
- 1024 Very Slow / 750 frames: PASS
- 2048 Slower / 500 frames: PASS
- repeated captures: PASS
- progress / ETA: PASS
- parser and rotation restoration: PASS
- general cancel / restore: PASS by user report

## TRUE-3K Frame Source

Confirmed native defect:

- 3072 capture camera;
- native `CK.Effects.renderToCanvas` phase requests at 768x768;
- structurally 3072 output but degraded source fidelity.

Validated repair architecture:

```text
BT.maker.takeScreenshot(3072,3072)
→ native Booth requests 768px Effects phases
→ temporary CK.Effects.renderToCanvas adapter
→ one genuine 3072x3072 Effects source for the frame
→ derive and feed native 4x4 phases
→ native Booth compositor finishes the frame
→ restore exact Effects method
```

The standalone repair companion first proved the technique. v0.3.0 now contains the same repair inside the maintained frame-source path.

## Integrated v0.3.0 Short Test — PASS

The 3072 Standard Short Test completed successfully and the downloaded WebP passed native-size visual inspection.

HF-Chat-Bridge issue #490 confirmed:

- active version/build: `0.3.0` / `0.3.0-integrated-true3k-short-test`;
- repaired timing key: `3072:true3k-phase-feed`;
- successful Short Test timing history: 16 frames, mode `short-test`, frame source `true3k-phase-feed`;
- measured average frame time: approximately 2123.48 ms.

A later full 3072 capture was started and cancelled after two frames, overwriting `lastCapture`. Both completed frames still showed 768px tile / 4x4 grid / 16 complete phases / one 3072 source render / Effects restoration true, and starting rotation restored after cancellation.

The Short Test timing-history record is only written after mux/parser validation and download succeed, so it confirms the integrated Short Test reached the successful post-validation path even though the later cancelled run replaced the detailed `lastCapture` snapshot.

## v0.3.0 Integration Contract

- 1024/2048 use the existing native frame source.
- 3072 alone uses the TRUE-3K phase-feed frame source.
- `BT.maker.takeScreenshot` ownership is never replaced.
- `CK.Effects.renderToCanvas` is wrapped only for one explicit repaired frame and restored immediately afterward.
- Short Test uses the same frame-source path, encoder, mux, parser, refresh sequence and rotation lifecycle as full capture.
- Short Test captures 16 contiguous frames at the selected full profile's real angular spacing.
- Full and Short Test timing history is isolated by frame-source key; native 3072 timing cannot seed repaired TRUE-3K ETA.
- Short Test may seed per-frame timing for a later full run, but its small mux tail is not reused as a full-capture tail estimate.

## Short Test Product Policy

Standalone Tampermonkey testing is itself a development harness, so v0.3.0 exposes `Short Test` directly.

For future Witch Dock integration:

- the Spinny service owns `captureShortTest()`;
- normal users do not see the Short Test button;
- Witch Dock Developer Mode controls whether the Short Test UI is visible;
- Developer Mode must not own or duplicate the media-capture implementation;
- enabling Developer Mode should expose Short Test and relevant diagnostics immediately through the existing `KWDeveloperMode.enabled` / `onChange()` contract.

## Interaction Guard Evidence

Two accidental mouse-wheel camera interactions during the original full native-3072 capture produced visible animation jumps. Active-capture protection remains required before Witch Dock integration.

Planned guard coverage:

- camera/canvas manipulation;
- leaving Photo Booth;
- Booth view/backdrop/overlay/light/effect changes;
- other state changes that invalidate frame continuity.

## 4K Spinny

4K Spinny remains **deferred**. Square 4096/8192 screenshot requests are owned by the Witch Dock TRUE-resolution still provider. Do not route animation frames through that public still-provider surface without a separately validated explicit frame capability.

## Current Gates

- Spinny lower-resolution validated profiles: PASS
- Native 3072 fidelity: FAIL / unsupported
- TRUE-3K frame-source repair: PASS
- v0.3.0 syntax / static invariants: PASS
- v0.3.0 integrated TRUE-3K Short Test: **PASS**
- v0.3.0 full repaired 3072 Standard / 250f: pending live
- lower-resolution regression smoke after v0.3.0 consolidation: pending
- Pause / interaction guards: pending after resolution integration closes
- Witch Dock Dev Spinny host / popout / Developer-Mode Short Test: not started
- Public Witch Dock Spinny integration: not started

## Next Gate

1. Run one full repaired **3072 + Standard / 250 frames** using v0.3.0.
2. Inspect output, parser, timing, rotation restoration, per-frame repair diagnostics, resource behavior and native-size fidelity.
3. If PASS, mark the complete 3072 Standard profile validated.
4. Run one lower-resolution regression smoke, preferably 1024 Standard or a quick Short Test first if appropriate.
5. Proceed to Pause / interaction guards.
6. Then build the Witch Dock Dev host, including Developer-Mode-only Short Test and the previously approved popout behavior.

## Public Integration Rule

Standalone validation remains the laboratory. Public Witch Dock must not consume the unstable Compatibility branch directly.
