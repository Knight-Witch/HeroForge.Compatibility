# Feature Inventory

This is the canonical feature-ID inventory. Historical/provisional inventory detail remains preserved in Git history; this file tracks currently active and near-term features.

| Feature ID | Purpose | Risk | Status |
|---|---|---|---|
| `media.screenshot-resolution` | Restore genuine 4K/8K Photo Booth still-image rendering | Medium | **Standalone validated; Witch Dock Stable validated on `heroforge07.1.9.98`**. 4K = one 4096 source; 8K = four shifted 4096 sources. Public promotion `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`; clean public smoke passed perfectly. |
| `media.spinny-mini-webp` | Higher-resolution / configurable-speed animated Spinny Mini WebP export | High | **Standalone v0.1.0 1024/250 Lob parity validated; separate v0.2.0 configurable profile candidate implemented and awaiting live regression.** v0.2.0 adds 1024/2048 and Standard/Slow/Slower/Very Slow while preserving 40 ms/frame. Public Witch Dock unchanged. Supersedes provisional `media.spin-gif-quality`. |
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

The maintained reconstruction target is animated WebP rather than GIF. v0.1.0 remains the validated parity reference: 1024x1024, 250 frames, 10 seconds / 25 FPS / infinite loop, with retained live UI reporting 12.9 MiB.

The separate v0.2.0 candidate keeps the proven frame-production/mux path and parameterizes resolution and speed. Slower profiles scale angular samples at constant 40 ms/frame instead of stretching the original 250 frames. v0.2.0 must pass 1024 Standard regression before it supersedes v0.1.0 as the standalone reference.
