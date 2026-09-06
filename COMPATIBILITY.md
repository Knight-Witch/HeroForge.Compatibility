# Compatibility

Human-readable current HeroForge compatibility status. Historical detail remains available in Git history.

Current media validation target: `heroforge07.1.9.98` / 2026-09-05.

| Component | Current status | Last verified build/date | Notes |
|---|---|---|---|
| `media.screenshot-resolution` | **Standalone validated; Witch Dock Stable validated** | `heroforge07.1.9.98` / 2026-09-05 | v0.6 baseline; Stable provider promoted at Witch Dock commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`; clean public smoke passed perfectly. |
| `media.spinny-mini-webp` | **v0.1.0 1024 parity validated; v0.2.0 profile candidate unvalidated** | `heroforge07.1.9.98` / 2026-09-05 | v0.1.0 full 1024x1024 / 250-frame / 10 s output worked live and retained UI reported 12.9 MiB. v0.2.0 adds 2048 and slower profiles but must pass 1024 Standard regression first. Public Witch Dock unchanged. |
| `decals.gizmo.bound-correction` | Witch Dock Stable | 2026-09-05 | Validated separately. |
| Character local JSON | Core Save/Load passed live | 2026-09-03 | Lifecycle/repeated-use pending. |
| Projected decal state/control | Runtime path confirmed | September 2026 | Renderer dependency audit pending. |
| HF-Chat-Bridge | Live validated | September 2026 | Development-only; not a production dependency. |
| Shared maintained compatibility bridge/Foundation | Not implemented | — | Planned extraction target. |

## Photo Booth still capability contract

- `BT.maker.takeScreenshot(width,height)` remains the native owning Booth capture/compositor path.
- Visible high-resolution model color is requested through named `CK.Effects.renderToCanvas` inside the native tiled reconstruction path.
- Current normal topology is 1024 phases: 4x4/16 at 4096 and 8x8/64 at 8192.
- TRUE 4K uses one 4096 staged source.
- TRUE 8K uses four shifted 4096 sources; no 8192 Effects target is allocated.
- The provider detects coherent live topology rather than freezing private helper names.
- A future already-native full-resolution Effects path passes through unchanged.
- Only square 4096/8192 provider calls are intercepted in Witch Dock; other captures pass through.

## Spinny Mini WebP capability contract — validated v0.1.0 path

Confirmed current capabilities:

- writable `CK.character.display.rotation.y`;
- established `CK.allDisplays` animation/occlusion refresh sequence plus shadow/matrix updates;
- `BT.maker.takeScreenshot(width,height)` frame capture;
- browser `canvas.toBlob('image/webp', quality)` still-WebP encoding;
- project-owned RIFF/VP8X/ANIM/ANMF animated container assembly.

Validated on `heroforge07.1.9.98`:

- low-resolution 128x128 / four-frame live mux proof: PASS;
- full standalone v0.1.0 1024/250 capture and download: PASS;
- pre-download parser confirmed 1024x1024, 250 frames, and 10,000 ms total duration;
- deterministic mux uses 40 ms on every frame and loop count 0/infinite;
- retained live UI reported 12.9 MiB output size;
- Photo Booth capture capability remained ready afterward.

## v0.2.0 profile candidate

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js` is a separate experimental candidate using the same capability contract. It adds 1024/2048 and four speed profiles while keeping 40 ms/frame. It also verifies loop count and exact duration histogram and exposes bridge-readable plain diagnostics.

No v0.2.0 profile is considered compatible/validated yet. The required first gate is 1024 Standard regression against the validated v0.1.0 behavior; 2048 Standard follows only if that passes.

## Dev/public still integration

- With current Lob/ADP present, its existing HeroForge 4096 and 8192 UI choices successfully routed through the Witch Dock Dev provider and produced correct outputs.
- Public Stable reuses that provider behavior and adds a narrow direct-button readiness adapter.
- Clean public Stable validation passed both HeroForge/Lob high-resolution routes and both Witch Dock direct capture routes.
- Lob/ADP itself is not modified.

## Revalidation triggers

Photo Booth stills: re-run when HeroForge build changes, named capture/Effects methods change, tile geometry becomes incoherent, Photo Booth effect profiles materially change, or native true-resolution rendering appears.

Spinny Mini WebP: re-run when HeroForge character-display rotation/refresh behavior changes, `BT.maker.takeScreenshot` semantics change, browser WebP encoding support changes, generated RIFF animation validation fails, or higher profiles expose new resource limits.
