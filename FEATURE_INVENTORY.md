# Feature Inventory

This is the canonical feature-ID inventory. Historical/provisional inventory detail remains preserved in Git history; this file tracks currently active and near-term features.

| Feature ID | Purpose | Risk | Status |
|---|---|---|---|
| `rendering.texture-quality` | Protect body/head/decal bake detail from atlas-pressure downgrade | High | **Runtime mechanism + live 8192x6144 layout validated on Blood Moon; standalone v0.1.5 rectangular-atlas candidate pending lifecycle acceptance.** Target remains bodyLower/bodyUpper/face 2048px with valid 1024 body-mask pinning, exact renderer/atlas ownership coherence, and no unrelated pre-enable allocation regression. |
| `media.screenshot-resolution` | Restore genuine 4K/8K Photo Booth still-image rendering | Medium | **Standalone validated; Witch Dock Stable validated on `heroforge07.1.9.98`**. 4K = one 4096 source; 8K = four shifted 4096 sources. Public promotion `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`; clean public smoke passed perfectly. |
| `decals.gizmo.bound-correction` | Correct bound/Project-OFF decal transform gizmo | High | Witch Dock Stable; validated Move/Rotate/Scale, undo/redo, Project state/artwork transform preservation, fresh-slot bad-default normalization. |
| `character.local-export` | Export character JSON locally | Medium | Standalone reconstruction committed; core Save passed live. |
| `character.local-import` | Import character JSON locally | Medium | Standalone reconstruction committed; core Load passed live. |
| `decals.transform.projected` | Project state/control plus required renderer behavior | Critical while renderer dependency external | Runtime state/control confirmed; renderer audit pending. |
| `decals.advanced-posing` | Coherent reconstructed posing family | High | Planned host/family; dependency audits pending. |
| `photo-booth.settings-export` | Export Photo Booth settings | High | Provisional. |
| `photo-booth.settings-import` | Import Photo Booth settings | High | Provisional. |
| `media.spin-gif-quality` | Higher-quality spin/media export | High | Provisional; separate from still capture and texture atlas quality. |
| `camera.extended-bounds` | Extend camera control bounds | Low/Medium | Standalone reconstruction candidate. |
| `kitbash.capacity` | Raise kitbash capacity policy | High | Provisional. |
| `slots.extra-minis` | Additional mini slots | Medium | Standalone reconstruction candidate. |

## Texture-quality note

The maintained first target is **2048 body/head allocation protection**, not the detached 4096-body experiment.

Standalone v0.1.3 proved that more atlas area can reach the target but also exposed that size-only verification is insufficient: Booth lifecycle replaced the owned `buildAtlas` path and left incompatible protected-display/native-resource atlas layouts. v0.1.4 repaired that lifecycle contract with exact renderer/wrapper/atlas ownership and full UV-location verification.

On 2026-09-11 a corrected detached rectangular sweep reproduced the actual protected pre-build metadata and found:

- 8192x4096 -> `1024/1024/2048`, 116 unrelated regressions;
- 8192x5120 -> `1024/1024/2048`, 116 unrelated regressions;
- 8192x6144 -> `2048/2048/2048`, zero unrelated regressions;
- 8192x7168 -> `2048/2048/2048`, zero unrelated regressions.

A reversible live 8192x6144 test then passed masks, ownership, UV coherence, no-regression checks, and full human visual acceptance. v0.1.5 therefore uses the bounded rectangular candidate ladder `4096 -> 5120 -> 6144 -> 7168` and no longer carries the unnecessary maintained 8192x8192 fallback.

The actual standalone v0.1.5 still must pass clean activation, Booth off/on recovery, disable/re-enable, and figure-change tests before Witch Dock Dev consideration.

## Photo Booth note

Maintained 8K does not use a one-shot 8192 Effects target. Four shifted 4096 sources cover the native 8x8/64-phase lattice. Current Lob/ADP may remain installed and supply the HeroForge-native 4096/8192 UI choices; Witch Dock repairs those downstream requests. Lob-absent native-UI injection remains a separate adapter task.
