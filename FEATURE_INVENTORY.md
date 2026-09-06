# Feature Inventory

This is the canonical feature-ID inventory. Historical/provisional inventory detail remains preserved in Git history; this file tracks currently active and near-term features.

| Feature ID | Purpose | Risk | Status |
|---|---|---|---|
| `media.screenshot-resolution` | Restore genuine 4K/8K Photo Booth still-image rendering | Medium | **Standalone validated; Witch Dock Stable validated on `heroforge07.1.9.98`**. 4K = one 4096 source; 8K = four shifted 4096 sources. Public promotion `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`; clean public smoke passed perfectly. |
| `media.spinny-mini-webp` | Higher-resolution / configurable-speed animated Spinny Mini WebP export | High | **Active standalone reconstruction on `heroforge07.1.9.98`**. Native baseline confirmed 512x512 / 386 frames / 17 ms; Lob HQ historical parity target confirmed 1024x1024 / 250 frames / 10 s / 25 FPS. Supersedes provisional `media.spin-gif-quality`. |
| `decals.gizmo.bound-correction` | Correct bound/Project-OFF decal transform gizmo | High | Witch Dock Stable; validated Move/Rotate/Scale, undo/redo, Project state/artwork transform preservation, fresh-slot bad-default normalization. |
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

Maintained 8K does not use a one-shot 8192 Effects target. Four shifted 4096 sources cover the native 8x8/64-phase lattice. Current Lob/ADP may remain installed and supply the HeroForge-native 4096/8192 UI choices; Witch Dock repairs those downstream requests. Lob-absent native-UI injection remains a separate adapter task.

## Spinny Mini WebP note

The native animated WebP exporter is now the maintained reconstruction target rather than GIF. First acceptance target intentionally matches the historical Lob HQ output's observable cadence and resolution (1024x1024, 250 frames, 10 seconds / 25 FPS) before higher-resolution and slower-speed presets are introduced. Rotation speed is intended to remain independent of resolution.
