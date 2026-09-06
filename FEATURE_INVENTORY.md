# Feature Inventory

This is the canonical feature-ID inventory. Historical/provisional detail remains preserved in Git history; this file tracks currently active and near-term features.

| Feature ID | Purpose | Risk | Status |
|---|---|---|---|
| `media.screenshot-resolution` | Restore genuine 4K/8K Photo Booth still-image rendering | Medium | Standalone + Witch Dock Stable validated on `heroforge07.1.9.98`. |
| `media.spinny-mini-webp` | Higher-resolution / configurable-speed animated Spinny Mini WebP export | High | Committed maintained runtime v0.3.0 validated for tested production profiles. Local v0.4.0 Pause/Resume candidate live PASS; source promotion pending. Interaction-guard discovery active. 4K deferred. Public Witch Dock unchanged. |
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

## `media.spinny-mini-webp`

Committed maintained implementation:

- file: `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`
- version: `0.3.0`
- build: `0.3.0-integrated-true3k-short-test`

Validated profiles / behaviors:

- 1024 Standard / 250f: PASS
- 2048 Standard / 250f: PASS
- 1024 Very Slow / 750f: PASS
- 2048 Slower / 500f: PASS
- 3072 Standard / 250f TRUE-3K: PASS
- 3072 Slower / 500f TRUE-3K: PASS
- 3072 integrated Short Test / 16f: PASS
- repeat use / parser / progress / ETA / rotation restore: PASS on tested runs
- general cancel path: PASS

Local v0.4.0 candidate:

- build `0.4.0-frame-boundary-pause-resume`;
- Pause/Resume live tests PASS at 1024 and TRUE-3K 3072 Short Test levels;
- cancel while paused / restoration / ETA pause accounting reported successful;
- not yet promoted into committed maintained runtime source.

Interaction protection is now the active investigation target because accidental mouse-wheel input during an earlier long capture caused visible animation jumps.

4K Spinny remains deferred because square 4096/8192 screenshot requests collide with Witch Dock TRUE-resolution still-provider ownership.
