# Feature Inventory

This is the canonical feature-ID inventory. Historical/provisional inventory detail remains preserved in Git history; this file tracks currently active and near-term features.

| Feature ID | Purpose | Risk | Status |
|---|---|---|---|
| `media.screenshot-resolution` | Restore genuine 4K/8K Photo Booth still-image rendering | Medium | **Standalone validated; Witch Dock Stable validated on `heroforge07.1.9.98`**. |
| `media.spinny-mini-webp` | Higher-resolution / configurable-speed animated Spinny Mini WebP export | High | **Standalone v0.2.1 live-validated on `heroforge07.1.9.98` across 1024 Standard/250f, 2048 Standard/250f, 1024 Very Slow/750f, and 2048 Slower/500f.** Progress bar, device-relative ETA, same-session ETA seeding, repeat capture, parser verification and rotation restoration also validated. 1024 Very Slow observed ~34 MiB. Public Witch Dock unchanged. Supersedes provisional `media.spin-gif-quality`. |
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

The maintained target is animated WebP, not GIF. v0.1.0 established Lob parity at 1024x1024 / 250 frames / 10 s / 25 FPS / infinite loop.

The current v0.2.1 standalone profile script has demonstrated:

- 1024 Standard / 250f: PASS;
- 2048 Standard / 250f: PASS;
- 1024 Very Slow / 750f: PASS;
- 2048 Slower / 500f: PASS;
- progress/ETA UX and same-session timing seed: PASS;
- repeated 1024 Standard capture: PASS;
- current-build parser validation and rotation restoration: PASS.

The 2048/500 pass is an 8x baseline pixel-sample workload. Remaining standalone work is limited to deciding practical high-cost guardrails and dedicated cancel/failure regression; 2048 Very Slow / 750f remains an optional 12x stress case rather than a demonstrated requirement.
