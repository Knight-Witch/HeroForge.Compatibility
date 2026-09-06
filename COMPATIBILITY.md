# Compatibility

Human-readable current HeroForge compatibility status. Historical detail remains available in Git history.

Current media validation target: `heroforge07.1.9.98` / 2026-09-05.

| Component | Current status | Last verified build/date | Notes |
|---|---|---|---|
| `media.screenshot-resolution` | **Standalone validated; Witch Dock Stable validated** | `heroforge07.1.9.98` / 2026-09-05 | Stable still-capture provider remains closed/validated. |
| `media.spinny-mini-webp` | **v0.2.1 configurable standalone validated on tested profiles** | `heroforge07.1.9.98` / 2026-09-05 | PASS at 1024 Standard/250f, 2048 Standard/250f, 1024 Very Slow/750f, and 2048 Slower/500f. Progress/ETA, repeat-use, parser verification and rotation restoration also passed. Public Witch Dock unchanged. |
| `decals.gizmo.bound-correction` | Witch Dock Stable | 2026-09-05 | Validated separately. |
| Character local JSON | Core Save/Load passed live | 2026-09-03 | Lifecycle/repeated-use pending. |
| Projected decal state/control | Runtime path confirmed | September 2026 | Renderer dependency audit pending. |
| HF-Chat-Bridge | Live validated | September 2026 | Development-only; not a production dependency. |
| Shared maintained compatibility bridge/Foundation | Not implemented | — | Planned extraction target. |

## Spinny Mini WebP capability contract

Confirmed current capabilities:

- writable `CK.character.display.rotation.y`;
- established `CK.allDisplays` animation/occlusion refresh sequence plus shadow/matrix updates;
- `BT.maker.takeScreenshot(width,height)` frame capture;
- browser `canvas.toBlob('image/webp', quality)` still-WebP encoding;
- project-owned RIFF/VP8X/ANIM/ANMF animated container assembly.

Validated results on `heroforge07.1.9.98`:

- v0.1.0 1024/250 Lob-parity capture: PASS;
- v0.2/v0.2.1 1024 Standard / 250 frames: PASS;
- 2048 Standard / 250 frames: PASS;
- 1024 Very Slow / 750 frames: PASS;
- 2048 Slower / 500 frames: PASS;
- 1024 Very Slow output approximately 34 MiB;
- multiple successful captures in one session: PASS;
- high-complexity figure test remained practical by user report.

The 2048 Slower / 500-frame result is an **8x pixel-sample workload** relative to 1024 Standard and confirms combined resolution + frame-count scaling.

## v0.2.1 progress/ETA capability

The ETA is device/session relative rather than based on animation playback duration. It measures actual wall-clock render+encode time per completed frame, warms up for five frames when no history exists, then uses a continuously adapting smoothed current-capture estimate. Successful same-session timing is retained by resolution to seed subsequent estimates; no timing state persists across reloads.

Live validation:

- progress bar: PASS;
- first-run ETA approximately 3m 7s, reported accurate throughout;
- second same-session 1024 Standard estimate approximately 2m 57s: PASS;
- bridge-confirmed second-run actual total: 177.101 s;
- bridge-confirmed final estimated total: 175.614 s;
- total-time error: 1.49 s / 0.84%;
- parser: 1024x1024 / 250 frames / 10,000 ms / 40 ms x 250 / loop 0;
- output: 13,565,278 bytes;
- rotation restored: true;
- error: null.

This UI/diagnostic layer does not alter HeroForge frame production, animation timing or WebP mux semantics.

## Remaining compatibility work before Dev integration

- dedicated cancel/failure-path regression under an expensive profile;
- decide practical warnings/guardrails for expensive combinations;
- optional 2048 Very Slow / 750-frame 12x stress case if needed to define limits.

## Revalidation triggers

Photo Booth stills: re-run on relevant HeroForge capture/render topology changes.

Spinny Mini WebP: re-run when HeroForge character-display rotation/refresh behavior changes, `BT.maker.takeScreenshot` semantics change, browser WebP encoding support changes, generated RIFF validation fails, or higher-profile resource limits are observed.
