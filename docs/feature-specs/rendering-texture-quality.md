# Protected Texture Quality

**Feature ID:** `rendering.texture-quality`  
**Title:** Protected 2048 body/head texture quality  
**Status:** runtime behavior validated manually on D4 and Blood Moon; standalone v0.1.2 pending human acceptance  
**Risk:** High  
**Primary maintainer:** TBD  
**Reviewer:** Amanda  
**Last verified HeroForge build:** current `1.9.98` bundle family / 2026-09-10

## Purpose

Prevent HeroForge's texture-atlas pressure policy from reducing body, face, and decal bake regions to visibly low resolutions on complex figures, while preserving correct paints/material channels and leaving unrelated atlas slots no worse than the allocation HeroForge was actually displaying before the feature was enabled.

The maintained first target is deliberately limited to **2048px bodyLower/bodyUpper/face allocations in an 8192x4096 atlas**. A detached 4096-body experiment proved technically packable on Blood Moon, but it is not part of this feature target.

## Confirmed runtime behavior

- Blood Moon loaded natively at 4096x4096 with bodyLower/bodyUpper at 256x256 and face at 512x512 under atlas pressure.
- D4 and Blood Moon both accepted a manually constructed 8192x4096 atlas with bodyLower/bodyUpper/face at 2048x2048.
- Body mask source textures must remain on valid supported assets. On the tested human body family the valid inputs are 1024px masks; attempted 2048 body mask URLs do not exist and fall back incorrectly.
- Pinning valid 1024 body masks via `masksMapOverride`, holding body source `_usedTextureSize` at 1024, and rebaking through the narrow color-bake path preserved correct skin/body paint and decal color.
- Blood Moon final manual visual acceptance: body texture correct, seams correct, paints/material channels correct, decals judged at approximately 95% confidence to match expected high-resolution appearance.
- D4 previously passed the same protected-2048 manual path with correct skin/glyph color and improved detail.
- Standalone v0.1.0 failed closed because it omitted the `CK.Atlas` per-slot maximum allocation map, allowing the packer to globally reduce target sizes.
- Standalone v0.1.1 also failed because it generated a fresh native-reference atlas before allocation. On Blood Moon that supposedly neutral reference/rollback changed the atlas state to 8192x4096 even though body/head metadata restored to 1024. A recomputed native atlas is therefore not a safe baseline.

## Maintained standalone design

1. Require named runtime capabilities only: `CK.Atlas`, `CK.Resources`, current character/display/modded parts, and color-bake refresh methods.
2. Require HeroForge's normal texture-atlas mode and a GPU max texture size of at least 8192.
3. Before any feature mutation, snapshot all owned runtime fields **and the exact current `display.atlas` / `modded.resourceAtlas` objects**.
4. Treat the atlas HeroForge is actually displaying at enable time as the safety baseline. Do not call native `buildAtlas()` to synthesize an initial reference atlas.
5. Capture each current part slot's allocation from that displayed baseline and fingerprint the current part set.
6. Resolve each current figure's own bodyLower/bodyUpper 1024 mask path through that part's `getMaskPath(currentHiRezMode, 1024)`.
7. Load and validate the 1024 resources; fail closed if either is unavailable or not actually 1024px.
8. Pin the validated body masks through runtime `masksMapOverride`; do not reuse mask objects from another figure.
9. Set current bodyLower/bodyUpper/face runtime bake ceilings to 2048 and source `_usedTextureSize` to 1024.
10. Build a per-slot maximum allocation map from the exact pre-enable displayed atlas. Unrelated slots retain their pre-enable allocation caps; bodyLower/bodyUpper/face are permitted up to 2048.
11. Install a reversible own-property `modded.buildAtlas` override that constructs an 8192x4096 atlas using that cap map and a cloned `atlasScale` with only bodyLower/bodyUpper/face forced to priority/scale 4. `character.data.atlasScale` itself is not modified by the standalone implementation.
12. Reject the protected atlas before display assignment if bodyLower/bodyUpper/face do not reach 2048 or if any non-target slot would receive a smaller allocation than the pre-enable displayed baseline.
13. Assign the validated protected atlas and run only `colorBake.invalidateCache()` plus `colorBake.refresh(true)`; do not call `instantSettingsChange()` or `data.change()`.
14. Verify atlas dimensions, body/head allocations, display UV binding, base color-bake UV binding, decal-bake UV binding where a decal pass exists, and body-mask override identity.
15. While enabled, watch for character/display/part-set replacement or protected-atlas loss. Part-set changes reinitialize from the current figure's new displayed state rather than reusing stale allocation caps. Repeated failures auto-disable.
16. On failed initial enable or manual disable, restore original metadata, mask overrides, `buildAtlas` ownership, and the **exact captured pre-enable atlas objects**; do not generate a replacement native atlas as part of rollback.

## Lifecycle

- Default state: **disabled** in the standalone test.
- `enable`: transactional apply using the exact currently displayed atlas as the pre-mutation baseline.
- `disable`: restore original part fields, mask overrides, `buildAtlas` ownership, active atlas, and resource atlas captured before enable, then run only the narrow rebake needed to rebind those restored objects.
- `dispose`: disable/restore, stop polling, remove standalone UI and globals.
- Character/display or part-set replacement while enabled: stop using the obsolete allocation budget and initialize independently against the current figure.
- Reload requirement: none expected for normal enable/disable; a clean page refresh is required before acceptance testing if a previous experimental version already changed atlas state.

## Failure policy

The feature must fail closed. It does not initialize a protected atlas when:

- required named runtime capabilities are unavailable;
- native texture-atlas mode is off;
- GPU max texture size is below 8192;
- valid 1024 body masks cannot be resolved/loaded;
- target 2048 allocations cannot be produced;
- any other atlas slot would be allocated below its pre-enable displayed size;
- the part set changes during the transaction;
- or post-bake UV/binding verification fails.

On apply failure, owned runtime fields and the exact pre-enable atlas objects are restored where possible. The script records baseline and attempted target allocations so an allocator refusal can be diagnosed without another speculative mutation.

## Explicitly rejected paths

- `CK.character.instantSettingsChange()` or broad character/display reconstruction for this feature.
- Persisting D4/Blood Moon-specific mask paths or texture objects.
- Requesting nonexistent 2048 body mask assets.
- Disabling atlas mode as the maintained solution.
- Treating a freshly recomputed native atlas as equivalent to the atlas HeroForge was displaying before enable.
- Treating `hiRezNormalMaps`, `seamFin`, or `maxTextures` as the body-seam/quality fix; runtime probes did not support them.
- Shipping the detached 4096-body experiment before separate performance, correctness, and lifecycle validation.
- Bundle modification when the current named-runtime path is sufficient.

## Known limitations / open gates

- Standalone v0.1.2 enable/disable/reload lifecycle still requires human acceptance testing from a clean HeroForge load.
- Long-session memory/performance behavior is not yet characterized.
- HeroForge/WebP spin-capture speed is a separate Photo Booth/media investigation and is not part of this feature.
- Some HeroForge decal source assets are intrinsically 512px while others are 2048px; this feature can protect bake destination resolution but cannot create source detail that does not exist.
- A dedicated `CK.Resources` owner-release API has not yet been confirmed. The test restores all renderer bindings it owns, but explicitly loaded mask resources may remain in HeroForge's resource cache until normal page/resource cleanup.
- Witch Dock Dev integration is not approved until standalone lifecycle testing passes.
