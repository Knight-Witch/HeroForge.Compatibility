# Compatibility

Human-readable current HeroForge compatibility status. Historical detail remains available in Git history.

Current media validation target: `heroforge07.1.9.98` / 2026-09-05.

| Component | Current status | Last verified build/date | Notes |
|---|---|---|---|
| `media.screenshot-resolution` | **Standalone validated; Witch Dock Stable validated** | `heroforge07.1.9.98` / 2026-09-05 | Stable still-capture provider remains closed/validated. |
| `media.spinny-mini-webp` | **v0.2.1 validated on tested profiles; v0.2.2 3072 candidate pending** | `heroforge07.1.9.98` / 2026-09-05 | PASS at 1024 Standard/250f, 2048 Standard/250f, 1024 Very Slow/750f and 2048 Slower/500f. Progress/ETA/repeat-use/parser/rotation restore passed. General Cancel path also passed by user report. v0.2.2 adds 3072 + warning only. Public Witch Dock unchanged. |
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
- multiple same-session captures: PASS;
- high-complexity figure test remained practical by user report;
- general Cancel path: PASS by user report, including restoration of starting orientation.

## v0.2.1 progress/ETA capability

The ETA is device/session relative rather than based on animation playback duration. Live validation included a bridge-confirmed repeated 1024 Standard run with actual total 177.101 s versus final estimate 175.614 s, an error of 1.49 s / 0.84%. Parser output was 1024x1024 / 250 frames / 10,000 ms / 40 ms x 250 / loop 0; rotation restored true; error null.

## v0.2.2 3072 capability status

Candidate resolution:

- 3072x3072 / Standard / 250f = **9x** 1024 Standard pixel samples;
- 3072 Slow / 375f = **13.5x**;
- 3072 Slower / 500f = **18x**;
- 3072 Very Slow / 750f = **27x**.

3072 does not match the current Witch Dock `media.screenshot-resolution` provider interception sizes, which are square 4096 and 8192 requests. Therefore v0.2.2 continues to call the same normal `BT.maker.takeScreenshot(3072,3072)` path used by the lower Spinny resolutions.

3072 remains **untested** until a live full capture completes.

## 4K Spinny incompatibility note

Do not add 4096 Spinny through the current public `BT.maker.takeScreenshot` surface while Witch Dock TRUE-resolution repair is enabled. The provider intentionally intercepts square 4096 requests and routes them through the still-image repair engine. 4K Spinny is deferred until an explicit native-frame bypass/capability is designed and validated.

## Revalidation triggers

Photo Booth stills: re-run on relevant HeroForge capture/render topology changes.

Spinny Mini WebP: re-run when HeroForge character-display rotation/refresh behavior changes, `BT.maker.takeScreenshot` semantics change, browser WebP encoding support changes, generated RIFF validation fails, or higher-profile resource limits are observed.
