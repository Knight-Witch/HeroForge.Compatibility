# Compatibility

Human-readable current HeroForge compatibility status. Historical detail remains available in Git history.

Current Photo Booth validation target: `heroforge07.1.9.98` / 2026-09-05.

| Component | Current status | Last verified build/date | Notes |
|---|---|---|---|
| `media.screenshot-resolution` | **Standalone validated; Witch Dock Stable promoted** | `heroforge07.1.9.98` / 2026-09-05 | v0.6 baseline; Stable provider promoted at Witch Dock commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`. Clean public refresh smoke pending. |
| `decals.gizmo.bound-correction` | Witch Dock Stable | 2026-09-05 | Validated separately. |
| Character local JSON | Core Save/Load passed live | 2026-09-03 | Lifecycle/repeated-use pending. |
| Projected decal state/control | Runtime path confirmed | September 2026 | Renderer dependency audit pending. |
| HF-Chat-Bridge | Live validated | September 2026 | Development-only; not a production dependency. |
| Shared maintained compatibility bridge/Foundation | Not implemented | — | Planned extraction target. |

## Photo Booth capability contract

- `BT.maker.takeScreenshot(width,height)` remains the native owning Booth capture/compositor path.
- Visible high-resolution model color is requested through named `CK.Effects.renderToCanvas` inside the native tiled reconstruction path.
- Current normal topology is 1024 phases: 4x4/16 at 4096 and 8x8/64 at 8192.
- TRUE 4K uses one 4096 staged source.
- TRUE 8K uses four shifted 4096 sources; no 8192 Effects target is allocated.
- The provider detects coherent live topology rather than freezing private helper names.
- A future already-native full-resolution Effects path passes through unchanged.
- Only square 4096/8192 provider calls are intercepted in Witch Dock; other captures pass through.

## Dev/public integration

- With current Lob/ADP present, its existing HeroForge 4096 and 8192 UI choices successfully routed through the Witch Dock Dev provider and produced correct outputs.
- Public Stable reuses that provider behavior and adds a narrow direct-button readiness adapter.
- Lob/ADP itself is not modified.
- Lob-absent users can use Witch Dock direct capture buttons; injection into HeroForge's native resolution selector remains future work.

## Revalidation triggers

Re-run validation when HeroForge build changes, the named capture/Effects methods change, tile geometry becomes incoherent, Photo Booth effect profiles materially change, or native true-resolution rendering appears.
