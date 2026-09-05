# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Historical detail remains available in Git history; this file tracks the current active state.

## Current Phase

**Legacy feature decomposition plus current-runtime compatibility reconstruction, with Photo Booth high-resolution still capture now standalone validated at both 4K and 8K.**

The corrected bound decal gizmo is already promoted through Witch Dock Dev into Witch Dock Stable. Character JSON and projected-decal standalone work remain separate reconstruction tracks. The current Photo Booth investigation on `heroforge07.1.9.98` has now completed its standalone repair stage for genuine 4096px and 8192px still capture.

## Current Repository Role

- Repository: `Knight-Witch/HeroForge.Compatibility`
- Production Witch Dock repository: `Knight-Witch/KnightWitch.Heroforge`
- External diagnostic transport: private `Knight-Witch/HF-Chat-Bridge`; development-only, never a production dependency
- Public Witch Dock runtime dependency on this repository: **none**
- Maintained standalone Photo Booth entry: `entries/tampermonkey-standalone/photo-booth-true-resolution.user.js`
- Maintained shared compatibility bridge / patch engine: **not yet implemented**

## Confirmed Photo Booth Findings

On HeroForge `heroforge07.1.9.98`:

- Lob/ADP still exposes nominal 4096px and 8192px choices, but current native visible-color detail is constrained by a private tiled Effects path.
- The normal high-resolution visible model path uses named `CK.Effects.renderToCanvas` through a private helper capped at 1024px phases in the tested normal case; 4096 therefore uses 4x4 / 16 phases and 8192 uses 8x8 / 64 phases.
- The previously observed 2048 `CK.Capture.renderTarget` belongs to a separate frame/auxiliary path in the tested scene and is not the principal visible-color source.
- `CK.Effects.renderToCanvas` itself can render a genuine 4096x4096 staged Booth color source and does not contain the 1024 cap.
- A true 4096 staged source measured materially more real edge information than untouched native/Lob 4096 and passed whole-image user visual acceptance.
- One-shot true 8192 Effects rendering can produce a correct result when it survives, but repeated packaged tests pushed the renderer into the familiar white/reset failure mode on the tested machine.
- Export method, Tampermonkey sandbox/page-context choice, minimal packaging, and custom streaming PNG export did not eliminate that 8192 renderer-reset cliff.
- The accepted 8K architecture uses **four shifted 4096 Effects sources**. Each source supplies one parity group of the native 8x8 phase lattice, covering all 64 final phase classes without creating an 8192 WebGL Effects target.
- Amanda reported the grouped 8K result worked perfectly and was dramatically easier on the GPU. The final combined v0.6 package then passed both 4K and 8K visual acceptance.

## Maintained Repair

Feature ID: `media.screenshot-resolution`

Current standalone v0.6 behavior:

- **TRUE 4K:** one genuine 4096 Effects source is phase-fed through HeroForge's untouched native Booth compositor.
- **TRUE 8K:** four shifted 4096 Effects sources are phase-fed through the native 8192 compositor; no 8192 Effects target is allocated.
- Native square-divisor tile/grid topology is detected from live named Effects calls and temporary capture-camera offsets.
- If HeroForge later exposes an already-native full-resolution Effects path, the compatibility repair passes it through unchanged.
- `BT.maker.takeScreenshot(...)` remains the owning native Booth capture path.
- No `booth.js` / `boothui.js` patch, no `CK.Settings.screenshotSize` mutation, and no `CK.Capture.renderToImage` replacement.
- The temporary `CK.Effects.renderToCanvas` wrapper and large source buffers are restored/released after capture.

## Active Work

1. Keep `media.screenshot-resolution` v0.6 as the validated standalone regression baseline.
2. Decide separately whether it should become a Witch Dock Dev candidate; do not modify Witch Dock Stable merely because standalone validation passed.
3. Archive exact canonical ADP v0.99.30 under immutable `/legacy/` with provenance.
4. Resume Full Res v0.80 projected-renderer dependency audit.
5. Resume HF Core Tweaks decal slot/schema audit if extra slots remain first-pass scope.
6. Define the remaining `decals.advanced-posing` feature/capability contract and test Lob-present/Lob-absent coexistence.

## Current Gates / Blockers

- Photo Booth 4K/8K standalone: **validated on `heroforge07.1.9.98`**.
- Witch Dock integration for Photo Booth: **not yet approved/tested**.
- Exact ADP v0.99.30 archive/provenance import: pending.
- Exact Full Res v0.80 renderer audit: pending.
- HF Core Tweaks slot/schema audit: pending if in scope.
- Shared compatibility bridge / patch engine: not implemented.

## Migration Queue

| Area | Current State | Next Gate |
|---|---|---|
| Photo Booth high-resolution still capture | 4K + 8K standalone validated in v0.6; 8K uses grouped 4x4096 source design | Decide standalone vs Witch Dock Dev candidacy; integration testing before any Stable promotion |
| Character local JSON | Standalone reconstruction committed; core Save/Load passed live | Finish lifecycle/repeated-use acceptance |
| Projected decal state/control | Runtime state/control path confirmed | Complete Full Res renderer audit then consolidate |
| Corrected bound decal gizmo | Witch Dock Stable | Keep regression coverage current |
| HF-Chat-Bridge diagnostic transport | Workbench transport validated | Remains development-only external infrastructure |
| Shared compatibility bridge | Planned | Extract repeated named-runtime access from validated features |
