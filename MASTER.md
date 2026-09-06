# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Historical detail remains available in Git history; this file tracks the current active state.

## Current Phase

**`media.spinny-mini-webp` is now at standalone v0.3.0 candidate integration.**

- Tested 1024/2048 behavior remains the validated lower-resolution target.
- Native HeroForge 3072 remains rejected because it produces structurally 3072 output from 768px Effects phase renders and looks blurred/upscaled.
- The TRUE-3K phase-feed frame-source repair passed the 16-frame visual/mechanical gate.
- v0.3.0 integrates that repaired frame source directly into the maintained standalone Spinny profile script.
- v0.3.0 also integrates a reusable 16-frame Short Test operation into the same capture engine.
- Integrated v0.3.0 Short Test and full repaired 3072 Standard remain pending live validation.
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

Validated repair principle:

```text
BT.maker.takeScreenshot(3072,3072)
→ native Booth requests 768px Effects phases
→ temporary CK.Effects.renderToCanvas adapter
→ one genuine 3072x3072 Effects source for the frame
→ derive and feed native 4x4 phases
→ native Booth compositor finishes the frame
→ restore exact Effects method
```

The standalone repair companion produced a 16-frame repaired Short Test with:

- 16/16 frames complete;
- 16/16 expected/supplied/unique phases per frame;
- one 3072 source render per frame;
- 3072x3072 parser output;
- rotation restored;
- Effects method restored;
- no errors;
- user native-size visual fidelity PASS.

## v0.3.0 Integration Contract

v0.3.0 absorbs the validated repair into the maintained profile script.

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
- normal users do not need the Short Test button;
- Witch Dock Developer Mode controls whether the Short Test UI is visible;
- Developer Mode must not own or duplicate the media-capture implementation;
- enabling Developer Mode should expose Short Test and relevant diagnostics immediately through the existing `KWDeveloperMode.enabled` / `onChange()` contract.

This keeps one capture engine while allowing Amanda or a troubleshooting user to expose diagnostic controls temporarily.

## Interaction Guard Evidence

Two accidental mouse-wheel camera interactions during the original full 3072 capture produced visible animation jumps. Active-capture protection remains required before Witch Dock integration.

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
- TRUE-3K standalone repair Short Test: PASS
- v0.3.0 syntax / static invariants: PASS
- v0.3.0 integrated TRUE-3K Short Test: pending live
- v0.3.0 full repaired 3072 Standard / 250f: pending live
- Pause / interaction guards: pending after resolution integration closes
- Witch Dock Dev Spinny host / popout / Developer-Mode Short Test: not started
- Public Witch Dock Spinny integration: not started

## Next Gate

1. Install v0.3.0 as the only maintained Spinny profile test; disable the older Short Test and TRUE-3K companion scripts for this test.
2. Run **3072 + Standard → Short Test** and confirm true 3K visual detail plus integrated diagnostics.
3. If integrated Short Test passes, run one full repaired **3072 + Standard / 250 frames**.
4. Inspect output, parser, timing, rotation restoration, per-frame repair diagnostics and resource behavior.
5. Only then mark the complete 3072 profile validated.
6. Proceed to Pause / interaction guards.
7. Then build the Witch Dock Dev host, including Developer-Mode-only Short Test and the previously approved popout behavior.

## Public Integration Rule

Standalone validation remains the laboratory. Public Witch Dock must not consume the unstable Compatibility branch directly.
