# Compatibility

Human-readable current HeroForge compatibility status. Historical detail remains available in Git history.

Current Photo Booth validation target: `heroforge07.1.9.98` / 2026-09-05. Current texture-quality runtime validation occurred on the live `1.9.98` bundle family through 2026-09-10.

| Component | Current status | Last verified build/date | Notes |
|---|---|---|---|
| `rendering.texture-quality` | **Runtime mechanism validated; standalone candidate unvalidated** | `1.9.98` bundle family / 2026-09-10 | D4 + Blood Moon protected-2048 path. Requires atlas mode, 8192 texture capability, valid 1024 body masks, reversible narrow rebake. No Witch Dock integration yet. |
| `media.screenshot-resolution` | **Standalone validated; Witch Dock Stable validated** | `heroforge07.1.9.98` / 2026-09-05 | v0.6 baseline; Stable provider promoted at Witch Dock commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`; clean public smoke passed perfectly. |
| `decals.gizmo.bound-correction` | Witch Dock Stable | 2026-09-05 | Validated separately. |
| Character local JSON | Core Save/Load passed live | 2026-09-03 | Lifecycle/repeated-use pending. |
| Projected decal state/control | Runtime path confirmed | September 2026 | Renderer dependency audit pending. |
| HF-Chat-Bridge | Live validated | 2026-09-10 | Development-only diagnostic transport; not a production dependency. |
| Shared maintained compatibility bridge/Foundation | Not implemented | — | Planned extraction target. |

## Protected texture-quality capability contract

The current candidate depends on named runtime surfaces:

- `CK.Atlas` construction;
- `CK.Resources.getResource/getNow` plus current part `getMaskPath`;
- `CK.character.display.modded.parts` for current body/head metadata;
- `CK.character.display.modded.buildAtlas` as a reversible per-display lifecycle hook;
- `CK.character.display.colorBake.invalidateCache/refresh` for the narrow rebake;
- `CK.character.data.isUHD()` and current atlas-scale input.

Required postconditions:

- 8192x4096 active atlas;
- bodyLower/bodyUpper/face each 2048x2048;
- valid figure-specific 1024 body mask inputs;
- display and color/decal bake UV bindings target the protected allocation;
- no unrelated slot is allocated below the detached native-reference size.

If any requirement fails, the standalone must refuse/auto-disable and restore native ownership where possible.

Rejected compatibility dependencies:

- no bundle patch;
- no minified-name dependency;
- no `instantSettingsChange()`;
- no hard-coded character-specific mask paths;
- no public Witch Dock dependency on Compatibility or HF-Chat-Bridge.

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
- Clean public Stable validation passed both HeroForge/Lob high-resolution routes and both Witch Dock direct capture routes; readiness worked without cycling the repair toggle.
- Lob/ADP itself is not modified.
- Lob-absent users can use Witch Dock direct capture buttons; injection into HeroForge's native resolution selector remains future work.

## Revalidation triggers

Re-run texture-quality validation when `CK.Atlas`, part mask path/resource behavior, color-bake ownership, atlas allocation semantics, body part metadata, or relevant HeroForge build topology changes. Re-run the Photo Booth suite when HeroForge build changes, the named capture/Effects methods change, tile geometry becomes incoherent, Photo Booth effect profiles materially change, or native true-resolution rendering appears.
