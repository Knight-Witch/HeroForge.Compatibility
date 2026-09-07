# Feature Inventory

This is the canonical feature-ID inventory. Historical/provisional detail remains preserved in Git history; this file tracks currently active and near-term features.

| Feature ID | Purpose | Risk | Status |
|---|---|---|---|
| `media.screenshot-resolution` | Restore genuine 4K/8K Photo Booth still-image rendering | Medium | Standalone + Witch Dock Stable validated on `heroforge07.1.9.98`. |
| `media.spinny-mini-webp` | Higher-resolution / configurable-speed animated Spinny Mini WebP export | High | Standalone v0.5.0 validated; Witch Dock Dev v0.5.1/v0.1.1 validated; public Witch Dock v1.2.0 at `b5e366e3f6c06d661e8bc1d59f8cb190ad7401f6` carries the unchanged Stable Spinny service/UI plus public Developer Mode; clean v1.2.0 smoke pending. 4096 expansion is not an active roadmap item. |
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
- version: `0.5.0`
- build: `0.5.0-integrated-pause-interaction-guards`
- compatibility target: `heroforge07.1.9.98`

Validated profiles / behaviors:

- 1024 Standard / 250f: PASS
- 2048 Standard / 250f: PASS
- 1024 Very Slow / 750f: PASS
- 2048 Slower / 500f: PASS
- repaired 3072 Standard / 250f TRUE-3K: PASS
- repaired 3072 Slower / 500f TRUE-3K: PASS
- integrated 3072 Short Test / 16f: PASS
- repeat use / parser / progress / ETA / rotation restore: PASS on tested runs
- cancel path: PASS
- frame-boundary Pause/Resume: PASS at native 1024 and repaired 3072
- cancel while paused / restoration / paused-time ETA accounting: PASS
- camera/Booth continuity guards: PASS

Native unrepaired 3072 remains rejected because current HeroForge uses repeated 768px Effects phase renders beneath a structurally 3072 final output.

### Witch Dock consumer status

Final Dev integration:

- service v0.5.1 / build `0.5.1-witch-dock-dev-download-scroll-guard`;
- UI v0.1.1 / build `0.1.1-dev-download-ux`;
- commit `fa75a9c1790009b4b4ae1a1162d419982e20545e`;
- placement/popout/Pause/guards PASS;
- privileged WebP download PASS;
- silent wheel/scroll suppression PASS;
- user approved public rollout.

Public Witch Dock:

- original Spinny v1.1.0 promotion: `8d96dd803f452c3c7b623c6963b4fdb3ef762f59`;
- current public v1.2.0 host/UI release: `b5e366e3f6c06d661e8bc1d59f8cb190ad7401f6`;
- Stable Spinny service/UI source remains unchanged from v1.1.0;
- public userscript retains the tested `GM_download` host;
- public Developer Mode v0.3.0 is optional/default-OFF and reveals the existing Short Test only when enabled;
- compact High Res and tab cleanup were separately validated before v1.2.0 promotion;
- clean public v1.2.0 smoke remains pending.

4096 Spinny remains technically incompatible with the current square 4096/8192 still-provider ownership surface, but **4096 animated-WebP expansion is not an active roadmap item**.
