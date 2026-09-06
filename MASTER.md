# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Historical detail remains available in Git history; this file tracks the current active state.

## Current Phase

**Legacy feature decomposition plus current-runtime compatibility reconstruction, with `media.screenshot-resolution` Witch Dock Stable validated and `media.spinny-mini-webp` 1024/Lob-parity validated standalone.**

The corrected bound decal gizmo is also Witch Dock Stable. Character JSON and projected-decal work remain separate reconstruction tracks.

## Repository Roles

- Compatibility / reconstruction: `Knight-Witch/HeroForge.Compatibility`
- Public Witch Dock consumer: `Knight-Witch/KnightWitch.Heroforge`
- Development-only live transport: private `Knight-Witch/HF-Chat-Bridge`
- Public Witch Dock runtime dependency on Compatibility `main`: **none**
- Maintained standalone Photo Booth still baseline: `entries/tampermonkey-standalone/photo-booth-true-resolution.user.js` v0.6
- Validated Spinny Mini WebP parity entry: `entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js` v0.1.0 on `spinny-webp-hq-wip`

## Photo Booth True Resolution

Feature ID: `media.screenshot-resolution`.

Validated on HeroForge `heroforge07.1.9.98`:

- TRUE 4K uses one genuine 4096 Effects source through the native Booth compositor.
- TRUE 8K uses four shifted 4096 Effects sources covering all 64 native 8K phase classes without an 8192 Effects target.
- One-shot 8192, sandbox/page-context changes, minimal packaging, and export-stage workarounds are rejected maintained paths.
- Standalone v0.6 passed both 4K and 8K visual acceptance.
- WITCH_DEV_PHOTO provider build `0.7.0-witch-dock-dev-provider` passed Lob-present integration.
- Public Witch Dock commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95` promoted the exact Dev-tested provider plus a narrow readiness adapter.
- Clean public Stable smoke passed HeroForge/Lob 4K, HeroForge/Lob 8K, Witch Dock direct TRUE 4K, Witch Dock direct TRUE 8K, and readiness-without-toggle-cycle.
- Public Stable remains self-contained on `Witch_Scripts`; it does not load Compatibility `main` or HF-Chat-Bridge.

## Spinny Mini animated WebP

Feature ID: `media.spinny-mini-webp`.

Confirmed on HeroForge `heroforge07.1.9.98`:

- native HeroForge Spinny Mini WebP is actually 512x512, 386 frames, 17 ms/frame, 6562 ms total / 58.82 FPS, infinite loop;
- historical Lob Higher Quality Spinny Mini GIF output is 1024x1024, 250 frames, 10.0 seconds / 25 FPS;
- the first standalone parity implementation uses runtime rotation/capture plus browser static-WebP encoding and project-owned RIFF animation muxing;
- low-resolution live mux proof validated the architecture and restored rotation;
- the full standalone v0.1.0 1024/250 capture **worked live** and downloaded successfully;
- v0.1.0 mechanically gates download on 1024x1024 dimensions, exactly 250 frames, and 10,000 ms total duration;
- every frame is muxed at 40 ms and loop count 0/infinite, matching the intended 25 FPS / 10-second Lob parity cadence;
- retained live UI status reported an output size of **12.9 MiB** (rounded display value);
- the first 1024/250 Lob-parity milestone is therefore closed/validated;
- rotation speed remains a separate setting from resolution; slower presets should add angular samples/frame count rather than merely stretch sparse frames.

Accepted architecture:

```text
HeroForge named/runtime-accessible rotation + screenshot capture
→ per-frame browser static WebP encoding
→ deterministic project-owned animated-WebP mux
```

The closure-local HeroForge animated-WebP encoder is not required for this maintained path.

## Current Gates

- `media.screenshot-resolution` standalone: **validated**.
- `media.screenshot-resolution` Witch Dock Dev: **validated with Lob present**.
- `media.screenshot-resolution` Witch Dock Stable: **validated**.
- `media.spinny-mini-webp` low-resolution live mux proof: **validated**.
- `media.spinny-mini-webp` 1024/250 Lob-parity capture: **validated**.
- Spinny 2048 profile: **next standalone test stage**.
- Spinny slower speed presets: **next standalone test stage**; preserve smooth motion by scaling frame count with duration.
- Spinny repeat-use/resource behavior: **pending during next standalone stage**.
- Witch Dock Spinny integration: **not started**.
- Lob-absent injection of 4096/8192 into HeroForge's own still resolution selector: **separate future UI-adapter gate**.
- Feature primary-maintainer assignments remain unresolved where marked TBD.

## Migration Queue

| Area | Current state | Next gate |
|---|---|---|
| Photo Booth high-resolution still capture | Standalone + Witch Dock Stable validated | Later Lob-absent HF UI adapter; future Foundation extraction; build regression only when triggered |
| Spinny Mini animated WebP | 1024/250 standalone Lob parity validated; observed output 12.9 MiB | Standalone 2048 + configurable-speed profiles, then repeat/resource testing before Witch Dock Dev |
| Character local JSON | Standalone reconstruction committed; core Save/Load passed live | Finish lifecycle/repeated-use acceptance |
| Projected decal state/control | Runtime state/control path confirmed | Complete renderer dependency audit then consolidate |
| Corrected bound decal gizmo | Witch Dock Stable | Keep regression coverage current |
| Shared compatibility bridge/Foundation | Planned | Extract repeated named-runtime access from validated features into versioned stable infrastructure |

## Public Integration Rule

Current Stable consumer code is copied/promoted from validated feature behavior. When Foundation exists, public Witch Dock should consume a pinned/versioned stable Foundation release rather than an unstable development head.
