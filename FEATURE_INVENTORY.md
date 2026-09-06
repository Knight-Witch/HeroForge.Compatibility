# Feature Inventory

This is the canonical feature-ID inventory. Historical/provisional detail remains preserved in Git history; this file tracks currently active and near-term features.

| Feature ID | Purpose | Risk | Status |
|---|---|---|---|
| `media.screenshot-resolution` | Restore genuine 4K/8K Photo Booth still-image rendering | Medium | Standalone + Witch Dock Stable validated on `heroforge07.1.9.98`. |
| `media.spinny-mini-webp` | Higher-resolution / configurable-speed animated Spinny Mini WebP export | High | **Standalone v0.3.0 validated for tested production profiles.** 1024/2048 validated; native 3072 rejected; repaired TRUE-3K 3072 validated at Short Test, 250-frame full and 500-frame full. Pause/interaction guards are next. 4K deferred. Public Witch Dock unchanged. |
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

Maintained standalone implementation:

- file: `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`
- version: `0.3.0`
- build: `0.3.0-integrated-true3k-short-test`

Validated profiles / behaviors:

- 1024 Standard / 250f: PASS, including post-v0.3.0 regression
- 2048 Standard / 250f: PASS
- 1024 Very Slow / 750f: PASS
- 2048 Slower / 500f: PASS
- 3072 Standard / 250f TRUE-3K: PASS by full-run user validation
- 3072 Slower / 500f TRUE-3K: PASS by full-run user validation + post-validation timing record
- 3072 integrated Short Test / 16f: PASS
- repeat use / parser / progress / ETA / rotation restore: PASS on tested runs
- general cancel path: PASS by user report

Native HeroForge 3072 without the repair remains unsupported because it uses 768px Effects phase renders and visibly loses source detail.

Interaction protection is the active next requirement because accidental mouse-wheel camera input during an earlier long capture produced visible animation jumps.

4K Spinny remains deferred because square 4096/8192 screenshot requests collide with Witch Dock TRUE-resolution still-provider ownership.
