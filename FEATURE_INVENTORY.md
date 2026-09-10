# Feature Inventory

This is the canonical feature-ID inventory. Historical/provisional inventory detail remains preserved in Git history; this file tracks currently active and near-term features.

| Feature ID | Purpose | Risk | Status |
|---|---|---|---|
| `rendering.texture-quality` | Protect body/head/decal bake detail from atlas-pressure downgrade | High | **Runtime mechanism validated manually on D4 + Blood Moon; standalone v0.1.4 lifecycle-repair candidate pending human acceptance.** v0.1.3 reached BL/BU/face 2048 but lost renderer ownership during Booth lifecycle, leaving incompatible display/resource atlas states. Target remains bodyLower/bodyUpper/face 2048px with valid 1024 body-mask pinning and no unrelated pre-enable allocation regression. |
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

The maintained first target is **2048 body/head allocation protection**, not the detached 4096-body experiment. Standalone v0.1.4 retains adaptive 8192x4096 -> 8192x8192 candidate selection, but now treats renderer lifecycle ownership and atlas coherence as hard postconditions.

The v0.1.3 Blood Moon activation proved the larger candidate can allocate BL/BU/face at 2048 and visibly improve decals. It also proved size-only verification is insufficient: Booth lifecycle replaced the owned `buildAtlas` path and left `display.atlas` on the protected 8192x8192 packing while `modded.resourceAtlas` moved to a different 8192x4096 packing. v0.1.4 must detect that immediately and rebuild only after HeroForge returns to a coherent current resource/display state.

## Photo Booth note

Maintained 8K does not use a one-shot 8192 Effects target. Four shifted 4096 sources cover the native 8x8/64-phase lattice. Current Lob/ADP may remain installed and supply the HeroForge-native 4096/8192 UI choices; Witch Dock repairs those downstream requests. Lob-absent native-UI injection remains a separate adapter task.
