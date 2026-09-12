# Feature Inventory

Canonical compact feature-ID registry. Detailed behavior/history belongs in feature specs, investigations, and `MASTER.md`/`ACTIVE_CONTEXT.md` pointers.

| Feature ID | Purpose | Risk | Status / disposition |
|---|---|---|---|
| `rendering.texture-quality` | Protect body/head/decal detail from atlas-pressure downgrade | High | Experimental standalone v0.1.5 candidate on `feature/rendering-texture-quality`; active paint/material coherence investigation; not approved for Witch Dock Dev |
| `media.screenshot-resolution` | Genuine 4K/8K Photo Booth still rendering | Medium | Standalone validated; Witch Dock Stable validated |
| `decals.gizmo.bound-correction` | Correct bound/Project-OFF decal transform gizmo | High | Witch Dock Stable |
| `character.local-export` | Export character JSON locally | Medium | Standalone reconstruction; core Save passed live |
| `character.local-import` | Import character JSON locally | Medium | Standalone reconstruction; core Load passed live |
| `decals.transform.projected` | Project state/control plus required renderer behavior | Critical while renderer dependency external | Runtime state/control confirmed; renderer audit pending |
| `decals.advanced-posing` | Reconstructed decal posing family | High | Planned; dependency audits pending |
| `photo-booth.settings-export` | Export Photo Booth settings | High | Provisional |
| `photo-booth.settings-import` | Import Photo Booth settings | High | Provisional |
| `media.spin-gif-quality` | Higher-quality spin/media export | High | Provisional; separate from still capture/texture quality |
| `camera.extended-bounds` | Extend camera control bounds | Low/Medium | Standalone reconstruction candidate |
| `kitbash.capacity` | Raise kitbash capacity policy | High | Provisional |
| `slots.extra-minis` | Additional mini slots | Medium | Standalone reconstruction candidate |

## Detail routing

For `rendering.texture-quality`, read branch `ACTIVE_CONTEXT.md` and the INV-0004 current-state/evidence files rather than growing this registry with investigation history.

For `media.screenshot-resolution` and other features, use their feature spec/investigation/changelog entries when detailed history is needed.
