# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Historical detail remains available in Git history; this file tracks the current active state.

## Current Phase

**`media.spinny-mini-webp` standalone v0.2.1 is now live-validated across resolution scaling, high frame-count scaling, a combined 2048/500 high-load profile, repeated capture, progress-bar UX, and device-relative ETA. Public Witch Dock remains untouched.**

`media.screenshot-resolution` and the corrected bound decal gizmo remain Witch Dock Stable. Character JSON and projected-decal work remain separate reconstruction tracks.

## Repository Roles

- Compatibility / reconstruction: `Knight-Witch/HeroForge.Compatibility`
- Public Witch Dock consumer: `Knight-Witch/KnightWitch.Heroforge`
- Development-only live transport: private `Knight-Witch/HF-Chat-Bridge`
- Public Witch Dock runtime dependency on Compatibility `main`: **none**
- Validated Spinny parity reference: `entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js` v0.1.0
- Active validated configurable Spinny test: `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js` v0.2.1 on `spinny-webp-hq-wip`

## Photo Booth True Resolution

Feature ID: `media.screenshot-resolution`.

Validated on HeroForge `heroforge07.1.9.98`:

- TRUE 4K uses one genuine 4096 Effects source through the native Booth compositor.
- TRUE 8K uses four shifted 4096 Effects sources covering all 64 native 8K phase classes without an 8192 Effects target.
- Standalone, Witch Dock Dev and public Witch Dock Stable have passed their existing acceptance gates.

## Spinny Mini animated WebP

Feature ID: `media.spinny-mini-webp`.

Confirmed baselines:

- native HeroForge: 512x512 / 386 frames / 17 ms / 6562 ms / 58.82 FPS / infinite loop;
- historical Lob HQ GIF: 1024x1024 / 250 frames / 10.0 s / 25 FPS / approximately 145 MB;
- validated v0.1.0 WebP parity output: 1024x1024 / 250 frames / 10.0 s / 25 FPS / infinite loop / retained UI 12.9 MiB.

Accepted maintained architecture:

```text
HeroForge runtime character rotation + refresh sequencing
→ BT.maker.takeScreenshot
→ per-frame browser static WebP encoding
→ deterministic project-owned RIFF animated-WebP mux
```

The closure-local HeroForge animation encoder and Lob's compiled-string GIF patch are not required.

### Configurable profile validation

All current speed profiles remain 40 ms/frame / 25 FPS, with resolution and rotation duration independent.

Live user validation on `heroforge07.1.9.98`:

- **1024 Standard / 250 frames: PASS / perfect**;
- **2048 Standard / 250 frames: PASS / perfect**;
- **1024 Very Slow / 750 frames: PASS / perfect**;
- **2048 Slower / 500 frames: PASS / perfect**;
- 1024 Very Slow file size observed at approximately **34 MiB**;
- multiple captures succeeded in one session;
- testing used a high-complexity figure with many kitbash parts, effects, special paints and decals, and resource behavior remained acceptable by user report.

The 2048 Slower / 500-frame pass represents an **8x pixel-sample workload** relative to 1024 Standard and demonstrates combined high-resolution + increased-frame-count scaling.

### v0.2.1 progress/ETA validation

v0.2.1 adds only UI/diagnostic behavior on top of the validated capture core:

- progress bar beneath the percentage/status readout: **PASS**;
- elapsed / remaining / total timing display: **PASS**;
- first-run ETA approximately **3m 7s**, reported accurate and stable throughout;
- same-session second-run estimate approximately **2m 57s**: **PASS**;
- no persistent cross-reload timing history.

Bridge-confirmed second 1024 Standard run:

- 250/250 rendered and encoded;
- final output **13,565,278 bytes**;
- parser confirmed 1024x1024 / 250 frames / 10,000 ms / 40 ms x 250 / loop 0;
- actual wall-clock **177.101 s**;
- final estimated total **175.614 s**;
- total-time error **1.49 s / 0.84%**;
- rotation restored: **true**;
- error: **null**.

## Current Gates

- `media.screenshot-resolution` Witch Dock Stable: **validated**.
- `media.spinny-mini-webp` v0.1.0 Lob parity: **validated**.
- Spinny v0.2.1 configurable standalone behavior: **validated on tested profiles**.
- Spinny progress/ETA UX: **validated**.
- Spinny repeated 1024 Standard capture: **validated**.
- Spinny full-run parser and rotation restoration on v0.2.1: **validated**.
- Optional 2048 Very Slow / 750-frame 12x stress case: **not yet tested**.
- Dedicated expensive-profile cancel/failure regression: **pending**.
- Practical high-cost warning/guardrail policy: **pending decision**.
- Witch Dock Spinny integration: **not started**.
- Feature primary-maintainer assignment remains TBD.

## Migration Queue

| Area | Current state | Next gate |
|---|---|---|
| Photo Booth high-resolution still capture | Standalone + Witch Dock Stable validated | Revalidate only on trigger |
| Spinny Mini animated WebP | v0.2.1 standalone validated across 1x/3x/4x/8x tested workloads plus ETA/repeat-use | Decide practical guardrails and run dedicated cancel/failure regression before Witch Dock Dev |
| Character local JSON | Core Save/Load passed live | Finish lifecycle/repeated-use acceptance |
| Projected decal state/control | Runtime path confirmed | Complete renderer dependency audit |
| Corrected bound decal gizmo | Witch Dock Stable | Keep regression coverage current |
| Shared compatibility bridge/Foundation | Planned | Extract repeated named-runtime access from validated features |

## Public Integration Rule

Standalone validation remains the laboratory. Public Witch Dock must not consume this WIP branch directly; Spinny integration begins in Witch Dock Dev only after the remaining standalone safety/guardrail gate is explicitly closed.
