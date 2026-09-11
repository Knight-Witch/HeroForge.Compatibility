# Protected Texture Quality

**Feature ID:** `rendering.texture-quality`  
**Title:** Protected 2048 body/head texture quality  
**Status:** runtime mechanism and 8192x6144 protected layout visually validated on Blood Moon; standalone v0.1.5 rectangular-atlas candidate pending lifecycle acceptance  
**Risk:** High  
**Primary maintainer:** TBD  
**Reviewer:** Amanda  
**Last verified HeroForge build:** current `1.9.98` bundle family / 2026-09-11

## Purpose

Prevent HeroForge's texture-atlas pressure policy from reducing body, face, and decal bake regions to visibly low resolutions on complex figures, while preserving correct paints/material channels and leaving unrelated atlas slots no worse than the allocation HeroForge was actually displaying before the feature was enabled.

The maintained quality target is deliberately limited to **2048px bodyLower/bodyUpper/face allocations**. Atlas area may be increased only as required to satisfy that target without lowering unrelated pre-enable allocations. Standalone v0.1.5 tests bounded rectangular candidates in ascending area order: **8192x4096, 8192x5120, 8192x6144, then 8192x7168**, selecting the first candidate that reaches all protected targets with zero unrelated allocation regressions. An 8192x8192 maintained fallback is no longer justified because 8192x6144 already passed the full structural and visual contract on Blood Moon. A detached 4096-body experiment remains outside this feature target.

## Confirmed runtime behavior

- Blood Moon has been observed under severe native atlas pressure with bodyLower/bodyUpper and face reduced far below the maintained quality target.
- D4 and Blood Moon both accepted manually constructed protected atlas states with bodyLower/bodyUpper/face at 2048x2048.
- Body mask source textures must remain on valid supported assets. On the tested human body family the valid inputs are 1024px masks; attempted 2048 body-mask URLs do not exist and can fall back incorrectly.
- Pinning valid 1024 body masks via `masksMapOverride`, holding body source `_usedTextureSize` at 1024, and rebaking through the narrow color-bake path preserves correct skin/body paint and decal color.
- Broad `CK.character.instantSettingsChange()` reconstruction is rejected because experimental use correlated with derived renderer/material corruption. The maintained path uses protected atlas construction plus `colorBake.invalidateCache()` and `colorBake.refresh(true)` only.
- Standalone v0.1.2 proved that 8192x4096 can be insufficient under the exact no-unrelated-regression cap map: bodyLower/bodyUpper remained 1024 while face reached 2048.
- Standalone v0.1.3 reached all three 2048 targets using 8192x8192, but Booth lifecycle later replaced renderer ownership and produced an incompatible display/resource atlas split. v0.1.4 therefore added strict renderer/wrapper/atlas ownership checks, full UV-location verification, stale-session invalidation, and bounded fresh-session recovery.
- A first 2026-09-11 rectangular sweep performed after v0.1.4 had been disabled was invalid for candidate selection because disable had already restored body/head `bakeSize` ceilings to 1024. `CK.Atlas.getTargetTextureSize()` therefore could not test the intended 2048 protected ceiling in that sweep.
- The corrected detached sweep reproduced the standalone's real pre-build metadata (`bakeSize=2048`, `_usedTextureSize=1024`) and restored it transactionally. Results on the current Blood Moon state were:
  - 8192x4096 -> bodyLower/bodyUpper/face `1024/1024/2048`, 116 unrelated regressions;
  - 8192x5120 -> `1024/1024/2048`, 116 unrelated regressions;
  - 8192x6144 -> `2048/2048/2048`, zero unrelated regressions;
  - 8192x7168 -> `2048/2048/2048`, zero unrelated regressions;
  - 8192x8192 -> `2048/2048/2048`, zero unrelated regressions.
- 8192x6144 is therefore the smallest currently validated safe candidate for this Blood Moon allocation budget.
- A reversible live 8192x6144 test then passed all structural postconditions: exact 2048 target allocations, valid 1024 body masks, zero unrelated regressions, exact shared display/resource atlas object identity, and full display/color/decal UV binding coherence.
- Amanda visually accepted the live 8192x6144 state: body/skin/material colors correct, glyphs/paint correct, no blocked/corrupted body or face textures, body seams correct, and decals sharp/high-resolution.
- The temporary Power-only live test was rolled back to its captured coherent 8192x4096 baseline after acceptance.

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
11. Build detached candidate atlases in bounded ascending order: `8192x4096`, `8192x5120`, `8192x6144`, `8192x7168`.
12. For each candidate, use the cap map and a cloned `atlasScale` with only bodyLower/bodyUpper/face forced to priority/scale 4. `character.data.atlasScale` itself is not persistently modified.
13. Reject a candidate before display assignment if bodyLower/bodyUpper/face do not each reach 2048 or if any non-target slot would receive a smaller allocation than the pre-enable displayed baseline.
14. Select only the smallest candidate that passes. If none pass, fail closed and restore the coherent pre-enable state where the original renderer session is still current.
15. Install a reversible own-property `modded.buildAtlas` override and retain the exact wrapper reference on the active session. Wrapper ownership is a required postcondition.
16. Assign the validated protected atlas as both `display.atlas` and `modded.resourceAtlas`, then run only `colorBake.invalidateCache()` plus `colorBake.refresh(true)`.
17. Verify current `display` identity, current `display.modded` identity, exact protected `buildAtlas` wrapper ownership, and exact protected atlas object identity on both `display.atlas` and `modded.resourceAtlas`.
18. Verify selected atlas dimensions, body/head allocations, body-mask override identity, no unrelated allocation regression, and full X/Y/Z/W UV equality for target display materials plus available color/decal bake materials.
19. While enabled, renderer/`modded` replacement, wrapper replacement, display/resource atlas divergence, protected atlas loss, or part-set replacement invalidates the old session. Do not blindly reapply a stale protected session.
20. For lifecycle recovery, release stale feature-owned metadata/wrapper state, wait for the current HeroForge renderer identity/atlas pair/part signature to remain stable, align the visible display to the current HeroForge `resourceAtlas` using only the narrow color-bake path if they differ, wait for stability again, then create a fresh protected session against that coherent current renderer.
21. Bound repeated lifecycle recovery. v0.1.5 retains the v0.1.4 limit of at most two recovery cycles in a 30-second burst; further replacement auto-disables/fails closed rather than fighting HeroForge indefinitely.
22. On ordinary manual disable, restore the exact captured pre-enable atlas objects only if the same protected session still owns the current renderer/wrapper/atlases. If HeroForge has already replaced lifecycle ownership, release stale feature ownership and return the current renderer to its current coherent HeroForge resource atlas instead of forcing stale pre-transition atlas objects back onto it.
23. Keep the last user-visible error latched until another explicit enable attempt, explicit diagnostic clear, or page reload. Store bounded `diagnostics`, `lastError`, `lastVerification`, `attemptHistory`, and state-change `timeline` as plain data on `window.HFProtectedTextureQualityTest` for bridge-readable inspection.

## Lifecycle

- Default state: **disabled** in the standalone test.
- `enable`: wait for the current HeroForge renderer to settle; normalize a pre-existing display/resource atlas split to the current resource atlas if necessary; then transactionally apply a fresh protected session using detached adaptive candidate selection.
- `watch`: continuously require renderer identity, wrapper ownership, protected atlas object identity, full target UV coherence, valid masks, target allocations, and no unrelated regression.
- `recover`: an ownership/coherence loss kills the old session. Release stale ownership, wait for HeroForge to settle, align to its current resource atlas through a narrow rebake when needed, then establish a fresh protected session.
- `disable`: exact pre-enable restore when the original session still owns the current renderer; otherwise restore current-HeroForge coherence rather than stale atlas objects.
- `dispose`: disable/restore, stop polling, remove standalone UI and globals.
- Character/display/modded/part-set replacement while enabled: treat as a lifecycle boundary and independently initialize against the current figure after renderer stability.
- Reload requirement: none expected for normal enable/disable. A clean page refresh remains appropriate before acceptance testing when a previous experimental version contaminated renderer state.

## Failure policy

The feature must fail closed. It does not maintain a protected session when:

- required named runtime capabilities are unavailable;
- native texture-atlas mode is off;
- GPU max texture size is below 8192;
- valid 1024 body masks cannot be resolved/loaded;
- none of the bounded atlas candidates can produce target 2048 allocations with zero unrelated allocation regression;
- any other atlas slot would be allocated below its pre-enable displayed size;
- the current display/modded renderer changes without a fresh session;
- the protected `buildAtlas` wrapper is replaced;
- `display.atlas`, `modded.resourceAtlas`, and the protected atlas cease to be the same owned object;
- target full UV vectors do not match their protected atlas slots;
- or repeated lifecycle replacement exceeds the bounded recovery budget.

## Explicitly rejected paths

- `CK.character.instantSettingsChange()` or broad character/display reconstruction for this feature.
- Persisting D4/Blood Moon-specific mask paths or texture objects.
- Requesting nonexistent 2048 body mask assets.
- Disabling atlas mode as the maintained solution.
- Treating a freshly recomputed native atlas as equivalent to the atlas HeroForge was displaying before enable.
- Treating fixed 8192x4096 dimensions as more important than the actual 2048 body/head quality target when the no-regression contract proves more area is required.
- Retaining an 8192x8192 maintained fallback merely because earlier versions used it. The current scene already passes at 8192x6144, so 8192x8192 adds area without a demonstrated need.
- Treating matching atlas dimensions or 2048 material rectangle size as sufficient proof of atlas coherence.
- Blindly reapplying a protected session after HeroForge has replaced `display.modded`, `buildAtlas` ownership, or the resource atlas.
- Restoring stale pre-transition atlas objects onto a renderer that HeroForge has already replaced.
- Treating `hiRezNormalMaps`, `seamFin`, or `maxTextures` as the body-seam/quality fix; runtime probes did not support them.
- Shipping the detached 4096-body experiment before separate performance, correctness, and lifecycle validation.
- Bundle modification when the current named-runtime path is sufficient.

## Known limitations / open gates

- The manual live 8192x6144 protected state is structurally and visually validated, but the actual standalone v0.1.5 still requires clean activation and lifecycle acceptance.
- Booth off/on recovery, disable/re-enable, figure change, and ordinary atlas-refresh behavior remain pending for the committed v0.1.5 standalone.
- Non-power-of-two atlas height 6144 is validated in the current runtime, but must be revalidated if `CK.Atlas`, render-target behavior, or relevant HeroForge renderer assumptions change.
- Long-session memory/performance behavior is not yet characterized.
- Some decal source assets are intrinsically 512px while others are 2048px; this feature can protect bake destination resolution but cannot create source detail that does not exist.
- A dedicated `CK.Resources` owner-release API has not yet been confirmed. Explicitly loaded mask resources may remain in HeroForge's resource cache until normal page/resource cleanup.
- Witch Dock Dev integration remains blocked until standalone lifecycle testing passes.
