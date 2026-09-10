# Protected Texture Quality

**Feature ID:** `rendering.texture-quality`  
**Title:** Protected 2048 body/head texture quality  
**Status:** runtime behavior validated on D4 and Blood Moon; standalone test implementation pending human acceptance  
**Risk:** High  
**Primary maintainer:** TBD  
**Reviewer:** Amanda  
**Last verified HeroForge build:** current `1.9.98` bundle family / 2026-09-10

## Purpose

Prevent HeroForge's texture-atlas pressure policy from reducing body, face, and decal bake regions to visibly low resolutions on complex figures, while preserving correct paints/material channels and leaving unrelated atlas slots no worse than HeroForge native allocation.

The maintained first target is deliberately limited to **2048px bodyLower/bodyUpper/face allocations in an 8192x4096 atlas**. A detached 4096-body experiment proved technically packable on Blood Moon, but it is not part of this feature target.

## Confirmed runtime behavior

- Blood Moon loaded natively at 4096x4096 with bodyLower/bodyUpper at 256x256 and face at 512x512 under atlas pressure.
- D4 and Blood Moon both accepted an 8192x4096 atlas with bodyLower/bodyUpper/face at 2048x2048.
- Body mask source textures must remain on valid supported assets. On the tested human body family the valid inputs are 1024px masks; attempted 2048 body mask URLs do not exist and fall back incorrectly.
- Pinning valid 1024 body masks via `masksMapOverride`, holding body source `_usedTextureSize` at 1024, and rebaking through the narrow color-bake path preserved correct skin/body paint and decal color.
- Blood Moon final visual acceptance: body texture correct, seams correct, paints/material channels correct, decals judged at approximately 95% confidence to match expected high-resolution appearance.
- D4 previously passed the same protected-2048 visual path with correct skin/glyph color and improved detail.

## Maintained standalone design

1. Require named runtime capabilities only: `CK.Atlas`, `CK.Resources`, current character/display/modded parts, and color-bake refresh methods.
2. Require HeroForge's normal texture-atlas mode and a GPU max texture size of at least 8192.
3. Snapshot all runtime fields owned by the feature before mutation.
4. Build a detached native-reference atlas before changing body/head bake ceilings.
5. Resolve each current figure's own bodyLower/bodyUpper 1024 mask path through that part's `getMaskPath(currentHiRezMode, 1024)`.
6. Load and validate the 1024 resources; fail closed if either is unavailable or not actually 1024px.
7. Pin the validated body masks through runtime `masksMapOverride`; do not reuse mask objects from another figure.
8. Set current bodyLower/bodyUpper/face runtime bake ceilings to 2048 and source `_usedTextureSize` to 1024.
9. Install a reversible own-property `modded.buildAtlas` override that constructs an 8192x4096 atlas using a cloned `atlasScale` with only bodyLower/bodyUpper/face forced to priority/scale 4. `character.data.atlasScale` itself is not modified by the standalone implementation.
10. Reject the protected atlas before display assignment if any non-target slot would receive a smaller allocation than the detached native reference.
11. Assign the validated protected atlas and run only `colorBake.invalidateCache()` plus `colorBake.refresh(true)`; do not call `instantSettingsChange()` or `data.change()`.
12. Verify atlas dimensions, body/head allocations, display UV binding, base color-bake UV binding, and decal-bake UV binding where a decal pass exists.
13. While enabled, watch for character/display replacement or protected-atlas loss and reapply with debounce/cooldown. Repeated failures auto-disable and restore native behavior.

## Lifecycle

- Default state: **disabled** in the standalone test.
- `enable`: transactional apply after capability/resource/allocation validation.
- `disable`: restore original part fields, mask overrides, and `buildAtlas` ownership, then rebuild/rebake through HeroForge's native narrow atlas path.
- `dispose`: disable/restore, stop polling, remove standalone UI and globals.
- Character/display replacement while enabled: restore owned metadata on the obsolete session and apply independently to the new current figure.
- Reload requirement: none expected for normal enable/disable; refresh remains the fallback if HeroForge is already in a corrupted renderer state.

## Failure policy

The feature must fail closed. It does not initialize a protected atlas when:

- required named runtime capabilities are unavailable;
- native texture-atlas mode is off;
- GPU max texture size is below 8192;
- valid 1024 body masks cannot be resolved/loaded;
- target 2048 allocations cannot be produced;
- any other atlas slot would be allocated below its detached native-reference size;
- or post-bake UV/binding verification fails.

On apply failure, owned runtime fields are restored and the prior/native atlas is rebound where possible.

## Explicitly rejected paths

- `CK.character.instantSettingsChange()` or broad character/display reconstruction for this feature.
- Persisting D4/Blood Moon-specific mask paths or texture objects.
- Requesting nonexistent 2048 body mask assets.
- Disabling atlas mode as the maintained solution.
- Treating `hiRezNormalMaps`, `seamFin`, or `maxTextures` as the body-seam/quality fix; runtime probes did not support them.
- Shipping the detached 4096-body experiment before separate performance, correctness, and lifecycle validation.
- Bundle modification when the current named-runtime path is sufficient.

## Known limitations / open gates

- Standalone enable/disable/reload lifecycle still requires human acceptance testing from a clean HeroForge load.
- Long-session memory/performance behavior is not yet characterized.
- HeroForge/WebP spin-capture speed is a separate Photo Booth/media investigation and is not part of this feature.
- Some HeroForge decal source assets are intrinsically 512px while others are 2048px; this feature can protect bake destination resolution but cannot create source detail that does not exist.
- A dedicated `CK.Resources` owner-release API has not yet been confirmed. The test restores all renderer bindings it owns, but explicitly loaded mask resources may remain in HeroForge's resource cache until normal page/resource cleanup.
- Witch Dock Dev integration is not approved until standalone lifecycle testing passes.
