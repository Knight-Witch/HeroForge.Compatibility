# Feature Inventory

This is the canonical feature-ID inventory. Historical/provisional detail remains preserved in Git history; this file tracks currently active and near-term features.

| Feature ID | Purpose | Risk | Status |
|---|---|---|---|
| `media.screenshot-resolution` | Restore genuine 4K/8K Photo Booth still-image rendering | Medium | Standalone + Witch Dock Stable validated on `heroforge07.1.9.98`. |
| `media.spinny-mini-webp` | Higher-resolution / configurable-speed animated Spinny Mini WebP export | High | **v0.2.1 validated on tested 1024/2048 profiles. v0.2.2 3072 structural capture completed but true-resolution visual fidelity FAILED.** Short Test diagnostic companion v0.1.0 added for rapid partial-spin iteration. 4K deferred. Public Witch Dock unchanged. |
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

## Spinny Mini WebP current status

Validated lower-resolution behavior:

- 1024 Standard / 250f: PASS;
- 2048 Standard / 250f: PASS;
- 1024 Very Slow / 750f: PASS;
- 2048 Slower / 500f: PASS;
- progress/ETA, repeat use, parser, rotation restore: PASS;
- general Cancel path: PASS by user report.

3072 result:

- full Standard / 250f completed in ~25 minutes;
- container/frame payload dimensions are structurally 3072;
- user visual inspection found native-size detail blurry and consistent with a lower-resolution render enlarged to 3072;
- **true 3K fidelity is therefore rejected/unsupported pending render-path repair**;
- follow-up 1024 control visually passed.

Diagnostic helper:

- `entries/tampermonkey-standalone/spinny-mini-webp-short-test.user.js` v0.1.0;
- 16 contiguous frames using selected profile's real angular spacing and frame duration;
- designed to validate candidate resolution fixes in roughly minutes rather than a full long spin;
- live validation pending.

Two mouse-wheel camera changes during the full 3072 run produced visible output jumps, confirming the need for planned active-capture interaction guards.

4K Spinny remains explicitly deferred because square 4096 capture requests collide with the Witch Dock TRUE-resolution still provider.
