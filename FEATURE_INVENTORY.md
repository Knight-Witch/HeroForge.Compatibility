# Feature Inventory

This is the canonical feature-ID inventory. Historical/provisional inventory detail remains preserved in Git history; this file tracks currently active and near-term features.

| Feature ID | Purpose | Risk | Status |
|---|---|---|---|
| `media.screenshot-resolution` | Restore genuine 4K/8K Photo Booth still-image rendering | Medium | **Standalone validated; Witch Dock Stable validated on `heroforge07.1.9.98`**. |
| `media.spinny-mini-webp` | Higher-resolution / configurable-speed animated Spinny Mini WebP export | High | **Standalone configurable core live-validated on `heroforge07.1.9.98` at 1024 Standard/250f, 2048 Standard/250f, and 1024 Very Slow/750f.** v0.2.1 adds progress bar plus device-relative elapsed/remaining/total ETA; UX validation pending. 1024 Very Slow observed ~34 MiB. Public Witch Dock unchanged. Supersedes provisional `media.spin-gif-quality`. |
| `decals.gizmo.bound-correction` | Correct bound/Project-OFF decal transform gizmo | High | Witch Dock Stable; validated Move/Rotate/Scale, undo/redo, transform-state preservation and fresh-slot normalization. |
| `character.local-export` | Export character JSON locally | Medium | Standalone reconstruction committed; core Save passed live. |
| `character.local-import` | Import character JSON locally | Medium | Standalone reconstruction committed; core Load passed live. |
| `decals.transform.projected` | Project state/control plus required renderer behavior | Critical while renderer dependency external | Runtime state/control confirmed; renderer audit pending. |
| `decals.advanced-posing` | Coherent reconstructed posing family | High | Planned host/family; dependency audits pending. |
| `photo-booth.settings-export` | Export Photo Booth settings | High | Provisional. |
| `photo-booth.settings-import` | Import Photo Booth settings | High | Provisional. |
| `camera.extended-bounds` | Extend camera control bounds | Low/Medium | Standalone reconstruction candidate. |
| `kitbash.capacity` | Raise kitbash capacity policy | High | Provisional. |
| `slots.extra-minis` | Additional mini slots | Medium | Standalone reconstruction candidate. |

## Photo Booth note

Maintained 8K still capture remains the validated grouped four-shifted-4096 implementation. Spinny work is a separate media feature and does not reopen that gate.

## Spinny Mini WebP note

The maintained target is animated WebP, not GIF. v0.1.0 established Lob parity at 1024x1024 / 250 frames / 10 s / 25 FPS / infinite loop. The configurable core has now also passed 2048 Standard and 1024 Very Slow (750 frames), demonstrating both resolution scaling and increased angular-sample scaling while retaining 40 ms/frame.

v0.2.1 changes only standalone UI/diagnostics by adding a progress bar and device-relative ETA. A 2048 / 500-frame run was still active at the latest user report and is not yet recorded as passed.
