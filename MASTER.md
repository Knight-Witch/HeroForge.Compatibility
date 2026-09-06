# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Historical detail remains available in Git history; this file tracks the current active state.

## Current Phase

**`media.spinny-mini-webp` now has live standalone validation across both resolution scaling and high frame-count scaling. v0.2.1 adds progress/ETA UX on top of the validated configurable capture core. Public Witch Dock remains untouched.**

`media.screenshot-resolution` and the corrected bound decal gizmo remain Witch Dock Stable. Character JSON and projected-decal work remain separate reconstruction tracks.

## Repository Roles

- Compatibility / reconstruction: `Knight-Witch/HeroForge.Compatibility`
- Public Witch Dock consumer: `Knight-Witch/KnightWitch.Heroforge`
- Development-only live transport: private `Knight-Witch/HF-Chat-Bridge`
- Public Witch Dock runtime dependency on Compatibility `main`: **none**
- Validated Spinny parity reference: `entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js` v0.1.0
- Active configurable Spinny test: `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js` v0.2.1 on `spinny-webp-hq-wip`

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

v0.2.0 preserved the validated capture/mux core and added independent resolution and rotation-duration profiles at constant 40 ms/frame / 25 FPS.

Live user validation on `heroforge07.1.9.98`:

- **1024 Standard / 250 frames: PASS / works perfectly**;
- **2048 Standard / 250 frames: PASS / works perfectly**;
- **1024 Very Slow / 750 frames: PASS / works perfectly**;
- 1024 Very Slow file size observed at approximately **34 MiB**;
- multiple captures succeeded in one session;
- existing percentage, Rendering/Encoding phase and px/frame/FPS/workload UI were explicitly reported useful;
- testing used a high-complexity figure with many kitbash parts, effects, special paints and decals, and resource behavior remained acceptable by user report.

A 2048 / 500-frame capture was active at the most recent report and remains pending until the user reports completion. HF-Chat-Bridge is intentionally not queried while that capture is active.

### v0.2.1 UX stage

v0.2.1 adds only UI/diagnostic behavior:

- progress bar beneath the percentage/status readout;
- elapsed time;
- estimated time remaining;
- estimated total capture time;
- prediction derived from measured render+encode wall time on the current device/figure;
- five-frame live warm-up and continuously adapting smoothed prediction;
- same-session per-resolution timing history for faster estimates on subsequent captures;
- no persistent cross-reload timing history.

Capture cadence, frame count, WebP encoding, muxing, validation and rotation behavior remain unchanged from the live-validated v0.2.0 core.

## Current Gates

- `media.screenshot-resolution` Witch Dock Stable: **validated**.
- `media.spinny-mini-webp` v0.1.0 Lob parity: **validated**.
- Spinny v0.2 configurable core: **validated at 1024 Standard, 2048 Standard and 1024 Very Slow**.
- Spinny v0.2.1 progress/ETA UX: **implemented; live UX validation pending**.
- 2048 / 500-frame result: **pending user completion report**.
- Witch Dock Spinny integration: **not started**.
- Feature primary-maintainer assignment remains TBD.

## Migration Queue

| Area | Current state | Next gate |
|---|---|---|
| Photo Booth high-resolution still capture | Standalone + Witch Dock Stable validated | Revalidate only on trigger |
| Spinny Mini animated WebP | Configurable core validated across 1024/2048 and 250/750-frame endpoints; v0.2.1 adds progress/ETA | Validate v0.2.1 UX/ETA, record active 2048/500 result, then decide remaining standalone matrix/guardrails before Witch Dock Dev |
| Character local JSON | Core Save/Load passed live | Finish lifecycle/repeated-use acceptance |
| Projected decal state/control | Runtime path confirmed | Complete renderer dependency audit |
| Corrected bound decal gizmo | Witch Dock Stable | Keep regression coverage current |
| Shared compatibility bridge/Foundation | Planned | Extract repeated named-runtime access from validated features |

## Public Integration Rule

Standalone validation remains the laboratory. Public Witch Dock must not consume this WIP branch directly; Spinny integration begins in Witch Dock Dev only after the standalone gate is explicitly closed.
