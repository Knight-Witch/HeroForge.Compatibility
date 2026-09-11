# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Historical detail remains available in Git history; this file tracks the current active state.

## Current Phase

**Legacy feature decomposition plus current-runtime compatibility reconstruction, with `media.screenshot-resolution` and the corrected bound decal gizmo already Witch Dock Stable, while `rendering.texture-quality` remains in standalone experimental validation after live D4/Blood Moon runtime proof and a validated 8192x6144 protected layout.**

Character JSON and projected-decal work remain separate reconstruction tracks.

## Repository Roles

- Compatibility / reconstruction: `Knight-Witch/HeroForge.Compatibility`
- Public Witch Dock consumer: `Knight-Witch/KnightWitch.Heroforge`
- Development-only live transport: private `Knight-Witch/HF-Chat-Bridge`
- Public Witch Dock runtime dependency on Compatibility `main`: **none**
- Maintained standalone Photo Booth baseline: `entries/tampermonkey-standalone/photo-booth-true-resolution.user.js` v0.6
- Experimental texture-quality standalone: `entries/tampermonkey-standalone/rendering-texture-quality.user.js` v0.1.5 on `feature/rendering-texture-quality`, pending lifecycle acceptance

## Photo Booth True Resolution

Feature ID: `media.screenshot-resolution`.

Validated on HeroForge `heroforge07.1.9.98`:

- TRUE 4K uses one genuine 4096 Effects source through the native Booth compositor.
- TRUE 8K uses four shifted 4096 Effects sources covering all 64 native 8K phase classes without an 8192 Effects target.
- One-shot 8192, sandbox/page-context changes, minimal packaging, and export-stage workarounds are rejected maintained paths.
- Standalone v0.6 passed both 4K and 8K visual acceptance.
- WITCH_DEV_PHOTO provider build `0.7.0-witch-dock-dev-provider` passed Lob-present integration.
- Public Witch Dock commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95` promoted the exact Dev-tested provider plus a narrow readiness adapter.
- Clean public Stable smoke passed HeroForge/Lob 4K/8K and Witch Dock direct TRUE 4K/8K.
- Public Stable remains self-contained on `Witch_Scripts`; it does not load Compatibility `main` or HF-Chat-Bridge.

## Protected Texture Quality

Feature ID: `rendering.texture-quality`.

Runtime investigation through 2026-09-11 confirmed:

- extreme atlas pressure can reduce body/head texture allocations sharply enough to create visible body seams, soft texture detail, and downsampled decals;
- manually constructed protected atlas states can hold bodyLower/bodyUpper/face at 2048px while preserving correct paints/material channels when valid 1024 body masks are pinned;
- nonexistent 2048 human body-mask requests are unsafe; maintained body-mask inputs remain 1024;
- broad `instantSettingsChange()` reconstruction is rejected; the narrow atlas + color-bake refresh path is the maintained mechanism;
- standalone v0.1.2 proved the current Blood Moon no-regression budget cannot fit all three 2048 targets in 8192x4096;
- standalone v0.1.3 reached 2048 using 8192x8192 but failed Booth renderer ownership/coherence, leaving incompatible display/resource atlas layouts;
- v0.1.4 repaired lifecycle ownership/coherence rules by requiring exact wrapper/renderer/atlas ownership and fresh-session recovery rather than blind stale-session reapply;
- a first post-disable rectangular sweep was invalid because target `bakeSize` had already been restored to 1024;
- a corrected detached sweep using the actual protected pre-build metadata found 8192x4096 and 8192x5120 insufficient, while **8192x6144** was the first candidate to produce BL/BU/face 2048 with zero unrelated allocation regressions;
- a reversible live 8192x6144 test passed valid 1024 mask checks, exact atlas ownership, full target UV coherence, and zero unrelated regressions;
- Amanda visually accepted the 8192x6144 result: correct body/skin/material colors, correct glyphs/paint, no blocked/corrupted body/face textures, good seams, and sharp high-resolution decals;
- the temporary live test was restored to coherent 8192x4096 native state afterward;
- v0.1.5 therefore replaces the unnecessary 8192x8192 fallback with a bounded rectangular ladder: 8192x4096 -> 8192x5120 -> 8192x6144 -> 8192x7168, selecting the smallest safe candidate;
- the separate 4096-body experiment remains out of scope.

The next gate is the actual standalone v0.1.5 clean activation on Blood Moon, followed by Booth off/on lifecycle, disable/re-enable, and figure-change tests. Witch Dock remains untouched.

## Current Gates

- `media.screenshot-resolution` standalone: **validated**.
- `media.screenshot-resolution` Witch Dock Dev: **validated with Lob present**.
- `media.screenshot-resolution` Witch Dock Stable: **validated**.
- Lob-absent injection of 4096/8192 into HeroForge's own resolution selector: **separate future UI-adapter gate**.
- Feature primary-maintainer assignment: **unresolved**. Stable validation does not silently assign Amanda primary maintenance of Lob-derived features.
- `decals.gizmo.bound-correction`: **Witch Dock Stable**.
- `rendering.texture-quality` runtime mechanism: **validated manually on D4/Blood Moon**.
- `rendering.texture-quality` rectangular 8192x6144 live layout: **structurally + visually validated**.
- `rendering.texture-quality` standalone: **v0.1.5 candidate; clean lifecycle acceptance pending**.
- `rendering.texture-quality` Witch Dock Dev: **not approved yet**.

## Migration Queue

| Area | Current state | Next gate |
|---|---|---|
| Protected texture quality | Runtime mechanism + 8192x6144 live layout validated; standalone v0.1.5 rectangular-atlas candidate | Install v0.1.5; clean activation, Booth lifecycle, disable/re-enable, figure-change acceptance |
| Photo Booth high-resolution still capture | Standalone + Witch Dock Stable validated | Later Lob-absent HF UI adapter; future Foundation extraction; build regression only when triggered |
| Character local JSON | Standalone reconstruction committed; core Save/Load passed live | Finish lifecycle/repeated-use acceptance |
| Projected decal state/control | Runtime state/control path confirmed | Complete renderer dependency audit then consolidate |
| Corrected bound decal gizmo | Witch Dock Stable | Keep regression coverage current |
| Shared compatibility bridge/Foundation | Planned | Extract repeated named-runtime access from validated features into versioned stable infrastructure |

## Public Integration Rule

Current Stable consumer code is copied/promoted from validated feature behavior. When Foundation exists, public Witch Dock should consume a pinned/versioned stable Foundation release rather than an unstable development head. New features still require standalone testing, Witch Dock Dev validation, and separate Stable review.
