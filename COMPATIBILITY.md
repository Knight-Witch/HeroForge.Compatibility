# Compatibility

Human-readable HeroForge compatibility status. Historical detail remains available in Git history.

## Current State

Current Photo Booth validation target: `heroforge07.1.9.98` / 2026-09-05.

| Component | Current status | Last verified build/date | Notes |
|---|---|---|---|
| `media.screenshot-resolution` | **4K + 8K standalone validated** | `heroforge07.1.9.98` / 2026-09-05 | v0.6 adaptive native-compositor repair. 4K uses one 4096 source; 8K uses four shifted 4096 sources. |
| `decals.gizmo.bound-correction` | Witch Dock Stable | 2026-09-05 | Current stable repair validated separately. |
| Character local JSON standalone | Core Save/Load passed live | 2026-09-03 | Lifecycle/repeated-use acceptance still pending. |
| Projected decal state/control | Runtime path confirmed; consolidation pending | September 2026 | Exact Full Res v0.80 renderer dependency still requires audit. |
| HF-Chat-Bridge diagnostic/workbench transport | Live validated | September 2026 | Development-only external transport; not a production dependency. |
| Shared maintained compatibility bridge | Not implemented | — | Candidate capabilities are emerging from validated features. |
| Shared patch engine | Not implemented | — | Required before adopting unavoidable bundle patches. |

## Confirmed Photo Booth Capability Contract

On the tested build:

- `BT.maker.takeScreenshot(width,height)` remains the correct native owning capture path for Booth staging/compositing.
- Visible high-resolution model color is requested through named `CK.Effects.renderToCanvas` inside a private tiled reconstruction path.
- Current normal tile size is 1024 in the tested scene, producing 4x4/16 phases at 4096 and 8x8/64 phases at 8192.
- `CK.Effects.renderToCanvas` itself can render a true 4096x4096 staged source and has no 1024 clamp.
- The maintained repair detects coherent square-divisor topology from live calls and derives phase coordinates from the temporary screenshot camera offsets.
- A future direct full-resolution native Effects call is passed through unchanged rather than overridden.
- Private helper names/offsets remain diagnostic evidence only and are not stable APIs.

## Accepted 4K Path

- one true 4096 Effects source;
- phase-feed through the untouched native compositor;
- packaged visual acceptance passed;
- repeated use / restoration / native-after / dispose passed in the validated v0.4 baseline;
- combined v0.6 4K regression passed visually after adding grouped 8K support.

## Accepted 8K Path

- native 8192 capture still owns final Booth composition;
- four shifted 4096 Effects sources cover the complete 8x8 native phase lattice;
- no 8192 WebGL Effects target is created;
- grouped v0.5.4 produced correct 8192 output and was reported dramatically easier on the GPU;
- combined v0.6 packaged 8K passed visual acceptance.

## Rejected 8K Paths

- one-shot `CK.Effects.renderToCanvas(8192,8192,...)` for maintained packaged use: correct when it survives, but repeatedly triggered white renderer-reset / blank output behavior on the tested machine;
- Tampermonkey sandbox vs page-context execution as the root cause: rejected by reproduction in both modes;
- generalized packaging overhead as root cause: rejected by minimal 8K-only reproduction;
- PNG `toBlob()` as root cause: rejected by custom streaming PNG reproduction of the same white/blank failure.

## Revalidation Triggers

Re-run compatibility validation when:

- HeroForge build fingerprint changes;
- `BT.maker.takeScreenshot` or `CK.Effects.renderToCanvas` disappears/changes shape;
- native tile topology becomes incoherent or non-square-divisor;
- Photo Booth effect/profile behavior changes materially;
- direct native full-resolution Effects rendering appears.

Failure should restore the named method and leave normal HeroForge capture behavior available.
