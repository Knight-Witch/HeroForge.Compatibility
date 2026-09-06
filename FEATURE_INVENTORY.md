# Feature Inventory

This is the canonical feature-ID inventory. Historical/provisional detail remains preserved in Git history; this file tracks currently active and near-term features.

| Feature ID | Purpose | Risk | Status |
|---|---|---|---|
| `media.screenshot-resolution` | Restore genuine 4K/8K Photo Booth still-image rendering | Medium | Standalone + Witch Dock Stable validated on `heroforge07.1.9.98`. |
| `media.spinny-mini-webp` | Higher-resolution / configurable-speed animated Spinny Mini WebP export | High | Lower-resolution profiles validated. Native 3072 rejected. TRUE-3K repair validated by Short Test. **v0.3.0 integrated standalone candidate pending live integrated Short Test + full repaired 3072 confirmation.** 4K deferred. Public Witch Dock unchanged. |
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

Current maintained candidate:

- file: `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`
- version: `0.3.0`
- build: `0.3.0-integrated-true3k-short-test`

Validated lower-resolution behavior:

- 1024 Standard / 250f: PASS
- 2048 Standard / 250f: PASS
- 1024 Very Slow / 750f: PASS
- 2048 Slower / 500f: PASS
- repeat use / parser / progress / ETA / rotation restore: PASS
- general cancel path: PASS by user report

Native 3072 status:

- full native 3072 Standard completed structurally;
- native-size visual fidelity FAIL;
- runtime trace: 3072 capture camera + 768px Effects phase renders;
- native 3072 remains unsupported.

TRUE-3K repair status:

- standalone 16-frame repaired Short Test: PASS mechanically and visually;
- one real 3072 Effects source per frame;
- 4x4 / 16-phase native topology fully supplied;
- Effects and figure rotation restored;
- no repair/Short Test error.

v0.3.0 integration:

- 1024/2048 native frame source retained;
- 3072 TRUE-3K phase-feed integrated;
- integrated 16-frame Short Test retained in same capture engine;
- standalone harness exposes Short Test directly;
- future Witch Dock host will expose Short Test only when Developer Mode is enabled;
- integrated live validation pending.

Interaction protection remains required because two accidental mouse-wheel camera changes during a long 3072 capture produced visible animation jumps.

4K Spinny remains explicitly deferred because square 4096/8192 screenshot requests collide with the Witch Dock TRUE-resolution still-provider ownership boundary.
