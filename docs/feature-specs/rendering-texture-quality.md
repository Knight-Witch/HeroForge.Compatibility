# Protected Texture Quality

**Feature ID:** `rendering.texture-quality`  
**Title:** Protected 2048 body/head texture quality  
**Status:** runtime behavior validated manually on D4 and Blood Moon; standalone v0.1.3 reached the target but failed Booth lifecycle coherence; v0.1.4 pending human acceptance  
**Risk:** High  
**Primary maintainer:** TBD  
**Reviewer:** Amanda  
**Last verified HeroForge build:** current `1.9.98` bundle family / 2026-09-10

## Purpose

Prevent HeroForge's texture-atlas pressure policy from reducing body, face, and decal bake regions to visibly low resolutions on complex figures, while preserving correct paints/material channels and leaving unrelated atlas slots no worse than the allocation HeroForge was actually displaying before the feature was enabled.

The maintained quality target is deliberately limited to **2048px bodyLower/bodyUpper/face allocations**. Atlas area may be increased only as required to satisfy that target without lowering unrelated pre-enable allocations: the standalone tests **8192x4096 first, then 8192x8192 only as fallback**. A detached 4096-body experiment proved technically packable on Blood Moon, but it is not part of this feature target.

## Confirmed runtime behavior

- Blood Moon loaded natively at 4096x4096 with bodyLower/bodyUpper at 256x256 and face at 512x512 under atlas pressure.
- D4 and Blood Moon both accepted manually constructed protected atlas states with bodyLower/bodyUpper/face at 2048x2048.
- Body mask source textures must remain on valid supported assets. On the tested human body family the valid inputs are 1024px masks; attempted 2048 body mask URLs do not exist and fall back incorrectly.
- Pinning valid 1024 body masks via `masksMapOverride`, holding body source `_usedTextureSize` at 1024, and rebaking through the narrow color-bake path preserved correct skin/body paint and decal color.
- Blood Moon final manual visual acceptance before standalone packaging: body texture correct, seams correct, paints/material channels correct, decals judged at approximately 95% confidence to match expected high-resolution appearance.
- D4 previously passed the same protected-2048 manual path with correct skin/glyph color and improved detail.
- Standalone v0.1.0 failed closed because it omitted the `CK.Atlas` per-slot maximum allocation map, allowing the packer to globally reduce target sizes.
- Standalone v0.1.1 also failed because it generated a fresh native-reference atlas before allocation. On Blood Moon that supposedly neutral reference/rollback changed the atlas state to 8192x4096 even though body/head metadata restored to 1024. A recomputed native atlas is therefore not a safe baseline.
- Standalone v0.1.2 preserved the exact displayed baseline but its protected 8192x4096 attempt resolved bodyLower/bodyUpper to 1024 while face reached 2048 under the exact no-unrelated-regression cap map.
- A detached cloned-scale versus temporary live-scale A/B produced the same 8192x4096 result (`1024/1024/2048`), ruling out scale-object identity as the missing requirement.
- v0.1.2 retained its failure diagnostics internally, but its disabled-state watcher immediately overwrote the visible error with the normal Ready status. v0.1.3 therefore added a persistent error latch and bounded plain-data attempt/state telemetry.
- Standalone v0.1.3 successfully selected the 8192x8192 fallback and produced bodyLower/bodyUpper/face at 2048. The user observed visibly improved decals and did not observe paint/material-channel corruption.
- v0.1.3 failed Booth renderer lifecycle coherence. In the live corrupted state, `display.atlas` remained the protected 8192x8192 atlas, `modded.resourceAtlas` had become a different 8192x4096 atlas, and `modded.buildAtlas` had reverted to HeroForge's native implementation while the feature still reported active.
- The two live atlases had incompatible target packing: protected/display bodyLower/bodyUpper/face X positions were `0/2048/4096`, while the current resource atlas used `512/1024/1536`.
- Visible display/color-bake material UVs matched the protected display atlas, proving that checking only the UV rectangle's resulting width/height is insufficient; full atlas offset/scale plus renderer ownership must remain coherent.
- Toggling Booth off temporarily returned the user to a sane but low-resolution body/seam state; the old v0.1.3 watcher then reintroduced the stale protected side and the body/face corruption returned. The maintained lifecycle must therefore invalidate stale protected sessions rather than blindly reapply them.

## Maintained standalone design

1. Require named runtime capabilities only: `CK.Atlas`, `CK.Resources`, current character/display/modded parts, and color-bake refresh methods.
2. Require HeroForge's normal texture-atlas mode and a GPU max texture size of at least 8192.
3. Before any feature mutation, snapshot owned runtime fields and the exact current `display.atlas` / `modded.resourceAtlas` objects.
4. Treat the atlas HeroForge is actually displaying at enable time as the initial safety/allocation baseline. Do not call native `buildAtlas()` merely to synthesize a reference atlas.
5. Capture each current part slot's allocation from that displayed baseline and fingerprint the current part set.
6. Resolve each current figure's own bodyLower/bodyUpper 1024 mask path through that part's `getMaskPath(currentHiRezMode, 1024)`.
7. Load and validate the 1024 resources; fail closed if either is unavailable or not actually 1024px.
8. Pin the validated body masks through runtime `masksMapOverride`; do not reuse mask objects from another figure.
9. Set current bodyLower/bodyUpper/face runtime bake ceilings to 2048 and source `_usedTextureSize` to 1024.
10. Build a per-slot maximum allocation map from the exact pre-enable displayed atlas. Unrelated slots retain their pre-enable allocation caps; bodyLower/bodyUpper/face are permitted up to 2048.
11. Build detached candidate atlases in bounded order: `8192x4096`, then `8192x8192` only if the first candidate cannot satisfy all target and unrelated-slot postconditions.
12. For each candidate, use the cap map and a cloned `atlasScale` with only bodyLower/bodyUpper/face forced to priority/scale 4. `character.data.atlasScale` itself is not persistently modified by the standalone implementation.
13. Reject a candidate before display assignment if bodyLower/bodyUpper/face do not each reach 2048 or if any non-target slot would receive a smaller allocation than the pre-enable displayed baseline.
14. Select only the smallest candidate that passes. If neither passes, fail closed and restore the coherent pre-enable state where the original renderer session is still current.
15. Install a reversible own-property `modded.buildAtlas` override and retain the exact wrapper reference on the active session. Wrapper ownership is a required postcondition, not merely an implementation detail.
16. Assign the validated protected atlas as both `display.atlas` and `modded.resourceAtlas`, then run only `colorBake.invalidateCache()` plus `colorBake.refresh(true)`; do not call `instantSettingsChange()` or `data.change()`.
17. Verify current `display` identity, current `display.modded` identity, exact protected `buildAtlas` wrapper ownership, and exact protected atlas object identity on both `display.atlas` and `modded.resourceAtlas`.
18. Verify selected atlas dimensions, body/head allocations, body-mask override identity, no unrelated allocation regression, and full X/Y/Z/W UV equality for target display materials plus available color/decal bake materials. A 2048-sized rectangle at the wrong atlas offset must fail verification.
19. While enabled, renderer/`modded` replacement, wrapper replacement, display/resource atlas divergence, protected atlas loss, or part-set replacement invalidates the old session. Do not run the v0.1.3-style blind stale-session reapply path.
20. For lifecycle recovery, release stale feature-owned metadata/wrapper state, wait for the current HeroForge renderer identity/atlas pair/part signature to remain stable, align the visible display to the current HeroForge `resourceAtlas` using only the narrow color-bake path if they differ, wait for stability again, then create a **fresh** protected session against that coherent current renderer.
21. Bound repeated lifecycle recovery. v0.1.4 permits at most two recovery cycles in a 30-second burst; further replacement auto-disables/fails closed instead of fighting HeroForge indefinitely.
22. On ordinary manual disable, restore the exact captured pre-enable atlas objects only if the same protected session still owns the current renderer/wrapper/atlases. If HeroForge has already replaced lifecycle ownership, release stale feature ownership and return the current renderer to its current coherent HeroForge resource atlas instead of forcing stale pre-transition atlas objects back onto it.
23. Keep the last user-visible error latched until another explicit enable attempt, explicit diagnostic clear, or page reload. Store bounded `diagnostics`, `lastError`, `lastVerification`, `attemptHistory`, and state-change `timeline` as plain data on `window.HFProtectedTextureQualityTest` for bridge-readable test inspection.

## Lifecycle

- Default state: **disabled** in the standalone test.
- `enable`: wait for the current HeroForge renderer to settle; normalize a pre-existing display/resource atlas split to the current resource atlas if necessary; then transactionally apply a fresh protected session using detached adaptive candidate selection.
- `watch`: continuously require renderer identity, wrapper ownership, protected atlas object identity, full target UV coherence, valid masks, target allocations, and no unrelated regression.
- `recover`: an ownership/coherence loss kills the old session. Release stale ownership, wait for HeroForge to settle, align to its current resource atlas through a narrow rebake when needed, then establish a fresh protected session.
- `disable`: exact pre-enable restore when the original session still owns the current renderer; otherwise restore current-HeroForge coherence rather than stale atlas objects.
- `dispose`: disable/restore, stop polling, remove standalone UI and globals.
- Character/display/modded/part-set replacement while enabled: treat as a lifecycle boundary and independently initialize against the current figure after renderer stability.
- Reload requirement: none expected for normal enable/disable. A clean page refresh is required before acceptance testing when a previous experimental version already left a contaminated split atlas state.

## Failure policy

The feature must fail closed. It does not maintain a protected session when:

- required named runtime capabilities are unavailable;
- native texture-atlas mode is off;
- GPU max texture size is below 8192;
- valid 1024 body masks cannot be resolved/loaded;
- neither allowed atlas-area candidate can produce target 2048 allocations;
- any other atlas slot would be allocated below its pre-enable displayed size;
- the current display/modded renderer changes without a fresh session;
- the protected `buildAtlas` wrapper is replaced;
- `display.atlas`, `modded.resourceAtlas`, and the protected atlas cease to be the same owned object;
- target full UV vectors do not match their protected atlas slots;
- or repeated lifecycle replacement exceeds the bounded recovery budget.

On initial apply failure while the original renderer is still current, owned runtime fields and the exact pre-enable atlas objects are restored where possible. After HeroForge has replaced renderer ownership, stale atlas objects are not forced back; the feature instead returns the current renderer to its current resource/display coherence where possible. Failures and lifecycle transitions remain bridge-readable through bounded telemetry.

## Explicitly rejected paths

- `CK.character.instantSettingsChange()` or broad character/display reconstruction for this feature.
- Persisting D4/Blood Moon-specific mask paths or texture objects.
- Requesting nonexistent 2048 body mask assets.
- Disabling atlas mode as the maintained solution.
- Treating a freshly recomputed native atlas as equivalent to the atlas HeroForge was displaying before enable.
- Treating fixed 8192x4096 atlas dimensions as more important than the actual 2048 body/head quality target when the no-regression safety contract proves more area is required.
- Treating 8192x8192 fallback area as approval for 4096 body/head textures.
- Treating matching atlas dimensions or 2048 material rectangle size as sufficient proof of atlas coherence.
- Blindly reapplying a protected session after HeroForge has replaced `display.modded`, `buildAtlas` ownership, or the resource atlas.
- Restoring stale pre-transition atlas objects onto a renderer that HeroForge has already replaced.
- Treating `hiRezNormalMaps`, `seamFin`, or `maxTextures` as the body-seam/quality fix; runtime probes did not support them.
- Shipping the detached 4096-body experiment before separate performance, correctness, and lifecycle validation.
- Bundle modification when the current named-runtime path is sufficient.

## Known limitations / open gates

- Standalone v0.1.4 clean activation, Booth off/on recovery, disable/re-enable, and figure-change lifecycle still require human acceptance testing.
- 8192x8192 atlas area may materially increase GPU/VRAM cost relative to 8192x4096; it is used only when the smaller candidate cannot pass and performance still requires human observation.
- v0.1.4's bounded recovery strategy is intentionally conservative. If HeroForge legitimately replaces renderer ownership repeatedly in normal Booth use, the feature may auto-disable rather than attempt an unbounded fight; that behavior must be evaluated during acceptance.
- Long-session memory/performance behavior is not yet characterized.
- HeroForge/WebP spin-capture speed is a separate Photo Booth/media investigation and is not part of this feature.
- Some HeroForge decal source assets are intrinsically 512px while others are 2048px; this feature can protect bake destination resolution but cannot create source detail that does not exist.
- A dedicated `CK.Resources` owner-release API has not yet been confirmed. The test restores renderer bindings it owns, but explicitly loaded mask resources may remain in HeroForge's resource cache until normal page/resource cleanup.
- Witch Dock Dev integration is not approved until standalone lifecycle testing passes.
