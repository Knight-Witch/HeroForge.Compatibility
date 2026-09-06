# Feature Inventory

This is the canonical feature-ID inventory. Historical/provisional inventory detail remains preserved in Git history; this file tracks currently active and near-term features.

| Feature ID | Purpose | Risk | Status |
|---|---|---|---|
| `media.screenshot-resolution` | Restore genuine 4K/8K Photo Booth still-image rendering | Medium | **Standalone validated; Witch Dock Stable validated on `heroforge07.1.9.98`**. |
| `media.spinny-mini-webp` | Higher-resolution / configurable-speed animated Spinny Mini WebP export | High | **v0.2.1 validated on tested 1024/2048 profiles; v0.2.2 standalone candidate adds experimental 3072px plus high-workload warning.** Cancel/rotation restore also passed by user report. 4K Spinny deferred because 4096 collides with the Witch Dock TRUE-resolution still provider. Public Witch Dock unchanged. Supersedes provisional `media.spin-gif-quality`. |
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

Validated v0.2.1 behavior includes:

- 1024 Standard / 250f: PASS;
- 2048 Standard / 250f: PASS;
- 1024 Very Slow / 750f: PASS;
- 2048 Slower / 500f: PASS;
- progress/ETA and same-session timing seed: PASS;
- repeated 1024 Standard capture: PASS;
- parser validation and rotation restoration: PASS;
- general Cancel path: PASS by user report, with starting orientation restored and no observed issue.

v0.2.2 adds a 3072px experimental resolution. 3072 Standard is a 9x baseline pixel-sample workload and is pending live validation. 3072 does not hit the Witch Dock high-resolution provider's 4096/8192 interception sizes.

4K Spinny is explicitly deferred because square 4096 `BT.maker.takeScreenshot` calls are currently owned by the TRUE-resolution still-capture provider. Pause/resume and interaction guards remain a separate next-stage standalone change.
