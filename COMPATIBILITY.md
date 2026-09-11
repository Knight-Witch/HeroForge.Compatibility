# Compatibility

Human-readable current HeroForge compatibility status. Historical detail remains available in Git history.

Current Photo Booth validation target: `heroforge07.1.9.98` / 2026-09-05. Current texture-quality runtime validation occurred on the live `1.9.98` bundle family through 2026-09-11.

| Component | Current status | Last verified build/date | Notes |
|---|---|---|---|
| `rendering.texture-quality` | **Runtime mechanism + live 8192x6144 layout validated; standalone v0.1.5 lifecycle candidate pending** | `1.9.98` bundle family / 2026-09-11 | D4 + Blood Moon protected-2048 path. Corrected rectangular sweep found 8192x6144 is the smallest current Blood Moon candidate that reaches BL/BU/face 2048 with zero unrelated regressions. Live 6144 masks/ownership/UVs and human visual output passed. Actual standalone lifecycle acceptance still pending. No Witch Dock integration yet. |
| `media.screenshot-resolution` | **Standalone validated; Witch Dock Stable validated** | `heroforge07.1.9.98` / 2026-09-05 | v0.6 baseline; Stable provider promoted at Witch Dock commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`; clean public smoke passed perfectly. |
| `decals.gizmo.bound-correction` | Witch Dock Stable | 2026-09-05 | Validated separately. |
| Character local JSON | Core Save/Load passed live | 2026-09-03 | Lifecycle/repeated-use pending. |
| Projected decal state/control | Runtime path confirmed | September 2026 | Renderer dependency audit pending. |
| HF-Chat-Bridge | Live validated | 2026-09-11 | Development-only diagnostic transport; not a production dependency. |
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

- selected active atlas is the **smallest safe candidate** from `8192x4096`, `8192x5120`, `8192x6144`, `8192x7168`;
- bodyLower/bodyUpper/face each resolve to 2048x2048;
- valid figure-specific 1024 body mask inputs remain pinned;
- current `display` and `display.modded` remain the objects owned by the active session;
- `modded.buildAtlas` remains the exact reversible wrapper installed by the active session;
- `display.atlas` and `modded.resourceAtlas` both reference the exact protected atlas object owned by the session;
- full X/Y/Z/W display, color-bake, and available decal-bake UV vectors match the protected atlas slot locations, not merely the 2048 width/height;
- no unrelated slot is allocated below the exact pre-enable displayed allocation;
- a larger candidate is not selected when a smaller candidate already satisfies the contract.

### Current Blood Moon candidate evidence

A first rectangular sweep after v0.1.4 disable was invalid because disable had already restored target `bakeSize` ceilings to 1024. The corrected sweep reproduced the feature's real pre-build metadata (`bakeSize=2048`, `_usedTextureSize=1024`) and restored it within the same bounded probe.

Corrected results:

- 8192x4096 -> BL/BU/face `1024/1024/2048`, 116 unrelated regressions;
- 8192x5120 -> `1024/1024/2048`, 116 unrelated regressions;
- 8192x6144 -> `2048/2048/2048`, zero unrelated regressions;
- 8192x7168 -> `2048/2048/2048`, zero unrelated regressions;
- 8192x8192 also passed detached, but is not retained as a maintained candidate because 8192x6144 already satisfies the contract with less atlas area.

A live reversible 8192x6144 test then confirmed:

- exact 2048 target allocations;
- valid 1024 masks;
- zero unrelated allocation regressions;
- exact display/resource atlas object identity;
- coherent display/color/decal UV bindings;
- correct human-visible body/skin/material colors, glyphs/paint, seams, body/face sampling, and sharp decals.

The temporary live state was restored to coherent 8192x4096 display/resource state after validation.

### Renderer lifecycle contract

Standalone v0.1.3 proved why exact coherence checks are required: it reached 2048 targets at 8192x8192, but Booth lifecycle later left `display.atlas` protected while `modded.resourceAtlas` and `modded.buildAtlas` returned to a different native lifecycle. The resulting incompatible packing correlated with severe coherent-but-wrong body/face blocks.

v0.1.5 retains v0.1.4's repair: renderer ownership replacement or atlas divergence is a lifecycle boundary, not a normal reapply condition. The feature releases stale ownership, waits for HeroForge to settle, uses the current HeroForge `resourceAtlas` as the coherent hand-off point for a narrow rebake when necessary, then creates a fresh protected session. Repeated rapid replacement auto-disables instead of looping.

If any requirement fails, the standalone must refuse/recover/auto-disable and restore a coherent HeroForge state where possible. Failure details remain visible and available as bounded plain-data telemetry for bridge inspection.

Rejected compatibility dependencies:

- no bundle patch;
- no minified-name dependency;
- no `instantSettingsChange()`;
- no hard-coded character-specific mask paths;
- no 4096-body target in the maintained candidate;
- no maintained 8192x8192 fallback unless a future separately validated scene proves the bounded rectangular ladder insufficient and a new decision explicitly adds it;
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
- Clean public Stable validation passed both HeroForge/Lob high-resolution routes and both Witch Dock direct capture routes.
- Lob/ADP itself is not modified.
- Lob-absent users can use Witch Dock direct capture buttons; injection into HeroForge's native resolution selector remains future work.

## Revalidation triggers

Re-run texture-quality validation when `CK.Atlas`, part mask path/resource behavior, color-bake ownership, atlas allocation semantics, `display.modded`/`buildAtlas` lifecycle behavior, GPU max texture capability, body part metadata, WebGL/render-target dimension behavior, or relevant HeroForge build topology changes. In particular, revalidate the current non-power-of-two 6144 height if HeroForge changes atlas packing or render-target assumptions.

Re-run the Photo Booth suite when HeroForge build changes, the named capture/Effects methods change, tile geometry becomes incoherent, Photo Booth effect profiles materially change, or native true-resolution rendering appears.
