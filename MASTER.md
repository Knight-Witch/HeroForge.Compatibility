# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Historical detail remains available in Git history; this file tracks the current active state.

## Current Phase

**Legacy feature decomposition plus current-runtime compatibility reconstruction, with `media.screenshot-resolution` and the corrected bound decal gizmo already Witch Dock Stable, while `rendering.texture-quality` remains in standalone experimental validation after live D4/Blood Moon runtime proof.**

Character JSON and projected-decal work remain separate reconstruction tracks.

## Repository Roles

- Compatibility / reconstruction: `Knight-Witch/HeroForge.Compatibility`
- Public Witch Dock consumer: `Knight-Witch/KnightWitch.Heroforge`
- Development-only live transport: private `Knight-Witch/HF-Chat-Bridge`
- Public Witch Dock runtime dependency on Compatibility `main`: **none**
- Maintained standalone Photo Booth baseline: `entries/tampermonkey-standalone/photo-booth-true-resolution.user.js` v0.6
- Experimental texture-quality standalone: `entries/tampermonkey-standalone/rendering-texture-quality.user.js` v0.1.3 on `feature/rendering-texture-quality`, pending human acceptance

## Photo Booth True Resolution

Feature ID: `media.screenshot-resolution`.

Validated on HeroForge `heroforge07.1.9.98`:

- TRUE 4K uses one genuine 4096 Effects source through the native Booth compositor.
- TRUE 8K uses four shifted 4096 Effects sources covering all 64 native 8K phase classes without an 8192 Effects target.
- One-shot 8192, sandbox/page-context changes, minimal packaging, and export-stage workarounds are rejected maintained paths.
- Standalone v0.6 passed both 4K and 8K visual acceptance.
- WITCH_DEV_PHOTO provider build `0.7.0-witch-dock-dev-provider` passed Lob-present integration: Lob-injected HeroForge 4096 and 8192 choices both produced correct repaired captures.
- Public Witch Dock commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95` promoted the exact Dev-tested provider plus a narrow readiness adapter.
- Clean public Stable smoke then passed: HeroForge/Lob 4K, HeroForge/Lob 8K, Witch Dock direct TRUE 4K, Witch Dock direct TRUE 8K, and readiness-without-toggle-cycle all worked perfectly.
- Public Stable remains self-contained on `Witch_Scripts`; it does not load Compatibility `main` or HF-Chat-Bridge.

## Protected Texture Quality

Feature ID: `rendering.texture-quality`.

Runtime investigation on 2026-09-08 through 2026-09-10 confirmed:

- extreme atlas pressure can reduce Blood Moon to 4096x4096 with 256px bodyLower/bodyUpper and 512px face allocations;
- manually constructed protected atlas states can hold bodyLower/bodyUpper/face at 2048px while preserving correct paints/material channels when valid 1024 body masks are pinned;
- valid 1024 body masks must be pinned to avoid nonexistent 2048 body-mask asset fallbacks;
- broad `instantSettingsChange()` reconstruction is rejected because it produced derived material-channel corruption during experiments;
- the narrow atlas + color-bake refresh path produced correct body, seams, paints/channels, and high-confidence correct decal detail on Blood Moon, and previously passed D4 visually;
- standalone v0.1.2 proved that the current exact pre-enable Blood Moon allocation budget cannot fit protected 2048 body/head in 8192x4096 without reducing unrelated pre-enable slots: the detached protected attempt resolved BL 1024 / BU 1024 / face 2048;
- a detached cloned-scale vs temporary live-scale A/B produced the same 8192x4096 result, ruling out scale-object identity as the missing requirement;
- standalone v0.1.3 therefore keeps 2048 as the quality target but tests 8192x4096 first and 8192x8192 only as a higher-area fallback, rejecting any candidate that lowers an unrelated pre-enable allocation;
- the separate 4096-body experiment remains intentionally out of scope.

The next gate is one clean-load standalone v0.1.3 activation on Blood Moon, followed by bridge inspection of the script's persistent candidate/attempt telemetry and human visual acceptance if activation passes. Witch Dock remains untouched.

## Current Gates

- `media.screenshot-resolution` standalone: **validated**.
- `media.screenshot-resolution` Witch Dock Dev: **validated with Lob present**.
- `media.screenshot-resolution` Witch Dock Stable: **validated**.
- Lob-absent injection of 4096/8192 into HeroForge's own resolution selector: **separate future UI-adapter gate**. Witch Dock direct buttons already provide Lob-free capture.
- Feature primary-maintainer assignment: **unresolved**. Stable validation does not silently assign Amanda primary maintenance of the Lob-derived feature.
- `decals.gizmo.bound-correction`: **Witch Dock Stable**.
- `rendering.texture-quality` runtime mechanism: **validated manually on D4/Blood Moon**.
- `rendering.texture-quality` standalone: **v0.1.3 candidate; initial Blood Moon activation pending after v0.1.0-v0.1.2 failures were recorded/diagnosed**.
- `rendering.texture-quality` Witch Dock Dev: **not approved yet**.

## Migration Queue

| Area | Current state | Next gate |
|---|---|---|
| Protected texture quality | Runtime mechanism validated manually; standalone v0.1.3 candidate | Clean-load Blood Moon activation with adaptive atlas-area selection, telemetry inspection, then enable/disable/figure-change acceptance |
| Photo Booth high-resolution still capture | Standalone + Witch Dock Stable validated | Later Lob-absent HF UI adapter; future Foundation extraction; build regression only when triggered |
| Character local JSON | Standalone reconstruction committed; core Save/Load passed live | Finish lifecycle/repeated-use acceptance |
| Projected decal state/control | Runtime state/control path confirmed | Complete renderer dependency audit then consolidate |
| Corrected bound decal gizmo | Witch Dock Stable | Keep regression coverage current |
| Shared compatibility bridge/Foundation | Planned | Extract repeated named-runtime access from validated features into versioned stable infrastructure |

## Public Integration Rule

Current Stable consumer code is copied/promoted from validated feature behavior. When Foundation exists, public Witch Dock should consume a pinned/versioned stable Foundation release rather than an unstable development head. New features still require standalone testing, Witch Dock Dev validation, and separate Stable review.
