# Compatibility

Human-readable current HeroForge compatibility status. Historical detail remains available in Git history.

Current media validation target: `heroforge07.1.9.98` / 2026-09-05.

| Component | Current status | Last verified build/date | Notes |
|---|---|---|---|
| `media.screenshot-resolution` | **Standalone validated; Witch Dock Stable validated** | `heroforge07.1.9.98` / 2026-09-05 | Stable still-capture provider remains closed/validated. |
| `media.spinny-mini-webp` | **Configurable standalone core validated; v0.2.1 UX candidate pending** | `heroforge07.1.9.98` / 2026-09-05 | v0.2.0 passes reported at 1024 Standard/250f, 2048 Standard/250f and 1024 Very Slow/750f. 1024 Very Slow ~34 MiB. v0.2.1 adds progress/ETA only. Public Witch Dock unchanged. |
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
- v0.2.0 1024 Standard / 250 frames: PASS by user report;
- v0.2.0 2048 Standard / 250 frames: PASS by user report;
- v0.2.0 1024 Very Slow / 750 frames: PASS by user report;
- 1024 Very Slow output approximately 34 MiB;
- multiple successful captures in one session provide basic repeat-use evidence;
- high-complexity figure test remained practical by user report.

The latest reported 2048 / 500-frame capture was still in progress and is not considered validated yet.

## v0.2.1 progress/ETA capability

The ETA is intentionally device/session relative rather than based on animation playback duration. It measures actual wall-clock render+encode time per completed frame, warms up for five frames, then uses a continuously adapting smoothed current-capture estimate. Successful same-session timing is retained by resolution to seed subsequent estimates, but no timing state persists across reloads.

This UI/diagnostic layer does not alter HeroForge frame production, animation timing or WebP mux semantics.

## Revalidation triggers

Photo Booth stills: re-run on relevant HeroForge capture/render topology changes.

Spinny Mini WebP: re-run when HeroForge character-display rotation/refresh behavior changes, `BT.maker.takeScreenshot` semantics change, browser WebP encoding support changes, generated RIFF validation fails, or higher-profile resource limits are observed.
