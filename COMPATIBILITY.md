# Compatibility

Human-readable current HeroForge compatibility status. Historical detail remains available in Git history.

Current media validation target: `heroforge07.1.9.98` / 2026-09-05.

| Component | Current status | Last verified build/date | Notes |
|---|---|---|---|
| `media.screenshot-resolution` | **Standalone validated; Witch Dock Stable validated** | `heroforge07.1.9.98` / 2026-09-05 | v0.6 baseline; Stable provider promoted at Witch Dock commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`; clean public smoke passed perfectly. |
| `media.spinny-mini-webp` | **Standalone implementation/testing** | `heroforge07.1.9.98` / 2026-09-05 | Native baseline measured; 128x128 live animated-WebP mux proof passed; 1024x1024 / 250-frame parity package ready for human test. Public Witch Dock unchanged. |
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

## Spinny Mini WebP capability contract — current standalone prototype

Confirmed current capabilities used by the prototype:

- `CK.character.display.rotation.y` is writable from the live page runtime and historically matches HeroForge's own Spinny rotation strategy.
- Display refresh behavior uses the established `CK.allDisplays` animation/occlusion refresh sequence plus shadow/matrix updates.
- `BT.maker.takeScreenshot(1024,1024)` supplies each frame and coexists with the Stable still-resolution provider because that provider only owns square 4096/8192 requests.
- Browser `canvas.toBlob('image/webp', quality)` supplies compressed still-WebP image payloads.
- Project-owned RIFF/VP8X/ANIM/ANMF assembly creates the animated container without relying on a HeroForge closure-local animation encoder.

Low-resolution live proof on `heroforge07.1.9.98` successfully produced and browser-decoded a 128x128, four-frame animated WebP and restored the original character rotation.

Current 1024 parity target remains **pending human acceptance** and must not be treated as validated until a full capture succeeds visually and mechanically.

## Dev/public still integration

- With current Lob/ADP present, its existing HeroForge 4096 and 8192 UI choices successfully routed through the Witch Dock Dev provider and produced correct outputs.
- Public Stable reuses that provider behavior and adds a narrow direct-button readiness adapter.
- Clean public Stable validation passed both HeroForge/Lob high-resolution routes and both Witch Dock direct capture routes; readiness worked without cycling the repair toggle.
- Lob/ADP itself is not modified.
- Lob-absent users can use Witch Dock direct still-capture buttons; injection into HeroForge's native resolution selector remains future work.

## Revalidation triggers

Photo Booth stills: re-run when HeroForge build changes, named capture/Effects methods change, tile geometry becomes incoherent, Photo Booth effect profiles materially change, or native true-resolution rendering appears.

Spinny Mini WebP: re-run when HeroForge character-display rotation/refresh behavior changes, `BT.maker.takeScreenshot` semantics change, browser WebP encoding support changes, or animated-WebP mux validation fails on a supported browser.
