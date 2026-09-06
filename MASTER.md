# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Historical detail remains available in Git history; this file tracks the current active state.

## Current Phase

**`media.spinny-mini-webp` standalone v0.2.1 remains the validated behavior target; v0.2.2 is a narrowly-scoped standalone candidate adding 3072px and a high-workload warning. Public Witch Dock remains untouched.**

`media.screenshot-resolution` and the corrected bound decal gizmo remain Witch Dock Stable. Character JSON and projected-decal work remain separate reconstruction tracks.

## Repository Roles

- Compatibility / reconstruction: `Knight-Witch/HeroForge.Compatibility`
- Public Witch Dock consumer: `Knight-Witch/KnightWitch.Heroforge`
- Development-only live transport: private `Knight-Witch/HF-Chat-Bridge`
- Public Witch Dock runtime dependency on Compatibility `main`: **none**
- Validated Spinny parity reference: `entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js` v0.1.0
- Active Spinny candidate: `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js` v0.2.2 on `spinny-webp-hq-wip`

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

### Validated configurable behavior

All speed profiles remain 40 ms/frame / 25 FPS, with resolution and rotation duration independent.

Live user validation on `heroforge07.1.9.98`:

- **1024 Standard / 250 frames: PASS / perfect**;
- **2048 Standard / 250 frames: PASS / perfect**;
- **1024 Very Slow / 750 frames: PASS / perfect**;
- **2048 Slower / 500 frames: PASS / perfect**;
- 1024 Very Slow file size approximately **34 MiB**;
- multiple captures in one session: PASS;
- progress/ETA UX: PASS;
- current-build parser validation and rotation restoration: PASS.

Bridge-confirmed repeated 1024 Standard run:

- output: **13,565,278 bytes**;
- parser: 1024x1024 / 250 frames / 10,000 ms / 40 ms x 250 / loop 0;
- actual wall-clock: **177.101 s**;
- final estimated total: **175.614 s**;
- ETA error: **1.49 s / 0.84%**;
- rotation restored: true;
- error: null.

User also independently exercised Cancel and reported that it stopped cleanly, restored the figure to its starting orientation, and caused no follow-on issues. The exact cancelled profile was not recorded.

### v0.2.2 3072 candidate

v0.2.2 preserves the validated capture/mux/ETA core and adds:

- `3072px — 3K experimental`;
- red `LONG CAPTURE` text beneath the timing line for profiles with resolution >=2048 or frame count >=500;
- workload multiplier shown in the warning;
- no 4096/8192 Spinny options.

Workload relative to 1024 Standard:

- 3072 Standard / 250f: **9x**;
- 3072 Slow / 375f: **13.5x**;
- 3072 Slower / 500f: **18x**;
- 3072 Very Slow / 750f: **27x**.

3072 does not match the Witch Dock TRUE-resolution provider's 4096/8192 interception sizes, so it follows the same direct `BT.maker.takeScreenshot(size,size)` path as 1024/2048.

### 4K Spinny decision

4K Spinny is **deferred**. The current Witch Dock TRUE-resolution provider intentionally intercepts square 4096 screenshot requests and routes them through the repaired still-capture engine. A naive 4096 Spinny option would therefore invoke the still-capture repair once per animation frame. Revisit only with an explicit native-frame bypass/capability.

### Pause stage

Pause/resume plus protective interaction guards remain approved design work, but they are intentionally separated from the first 3072 test so resolution scaling and lifecycle/input changes are not debugged simultaneously.

## Current Gates

- `media.screenshot-resolution` Witch Dock Stable: **validated**.
- `media.spinny-mini-webp` v0.1.0 Lob parity: **validated**.
- Spinny v0.2.1 tested configurable behavior: **validated**.
- Spinny progress/ETA: **validated**.
- Spinny repeat use: **validated**.
- Spinny general cancel/rotation restore: **validated by user report**.
- Spinny v0.2.2 3072 Standard: **pending live validation**.
- 4K Spinny: **deferred due provider collision**.
- Pause/input guards: **next isolated standalone stage**.
- Witch Dock Spinny integration: **not started**.
- Feature primary-maintainer assignment remains TBD.

## Migration Queue

| Area | Current state | Next gate |
|---|---|---|
| Photo Booth high-resolution still capture | Standalone + Witch Dock Stable validated | Revalidate only on trigger |
| Spinny Mini animated WebP | v0.2.1 validated; v0.2.2 adds experimental 3072 + warning | Validate 3072 Standard, then implement/test Pause and interaction guards separately before Witch Dock Dev |
| Character local JSON | Core Save/Load passed live | Finish lifecycle/repeated-use acceptance |
| Projected decal state/control | Runtime path confirmed | Complete renderer dependency audit |
| Corrected bound decal gizmo | Witch Dock Stable | Keep regression coverage current |
| Shared compatibility bridge/Foundation | Planned | Extract repeated named-runtime access from validated features |

## Public Integration Rule

Standalone validation remains the laboratory. Public Witch Dock must not consume this WIP branch directly; Spinny integration begins in Witch Dock Dev only after the standalone gate is explicitly closed.
