# Feature Inventory

This is the canonical feature-ID inventory. Historical/provisional detail remains preserved in Git history; this file tracks currently active and near-term features.

| Feature ID | Purpose | Risk | Status |
|---|---|---|---|
| `media.screenshot-resolution` | Restore genuine 4K/8K Photo Booth still-image rendering | Medium | Standalone + Witch Dock Stable validated on `heroforge07.1.9.98`. |
| `media.spinny-mini-webp` | Higher-resolution / configurable-speed animated Spinny Mini WebP export | High | **1024/2048 tested profiles validated. Native 3072 rejected; TRUE-3K frame-source repair validated by repaired 16-frame Short Test. Full repaired 3072 Standard still pending.** 4K deferred. Public Witch Dock unchanged. |
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

- 1024 Standard / 250f: PASS
- 2048 Standard / 250f: PASS
- 1024 Very Slow / 750f: PASS
- 2048 Slower / 500f: PASS
- progress/ETA, repeat use, parser, rotation restore: PASS
- general Cancel path: PASS by user report

Native 3072 result:

- full Standard / 250f completed in ~25 minutes;
- container/frame payload dimensions are structurally 3072;
- user native-size inspection found the output blurry/upscaled;
- live trace confirmed native 3072 capture camera receives 768x768 Effects phase renders;
- native 3072 is therefore rejected for true-resolution fidelity.

Short Test diagnostic:

- 16-frame partial-spin helper: LIVE PASS as diagnostic infrastructure;
- baseline 3072 Short Test reproduced the blur quickly.

TRUE-3K repair:

- companion build `0.1.0-3072-effects-source-phase-feed`;
- repaired 16-frame Short Test: **PASS mechanically and visually**;
- every frame used native 768 tile / 4x4 topology with complete 16/16 phase delivery;
- one real 3072 Effects source render per animation frame;
- 16 frames / 4,589,972 bytes / parsed 3072x3072 / 640 ms / 40 ms x16 / loop 0;
- rotation restored true;
- Effects method restored true;
- errors null;
- user native-size inspection: genuine 3K detail PASS.

Disposition:

- validated repair should be integrated into the maintained standalone Spinny implementation;
- one full repaired 3072 Standard run remains required before 3072 production-profile validation closes;
- camera/Booth interaction guards remain required before Witch Dock integration;
- 4K Spinny remains deferred because square 4096 requests collide with the Witch Dock TRUE-resolution still provider.
