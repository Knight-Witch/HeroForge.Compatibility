# HeroForge.Compatibility Master

This is the canonical high-level source for current project state. Keep it current when the active phase, architecture, feature status, blockers, ownership, or migration state changes.

## Current Phase

**Legacy feature decomposition plus current-runtime compatibility reconstruction, with targeted Photo Booth media repair.**

The private `Knight-Witch/HF-Chat-Bridge` diagnostic/workbench transport is live-validated and has been used to complete the bound-decal gizmo investigation on current HeroForge. The corrected bound gizmo has progressed through standalone validation, Witch Dock Dev testing, and explicit Witch Dock Stable promotion/repair. Character JSON and projected-decal standalone tests remain separate reconstruction work in this repository. Amanda has prioritized the broken 4K/8K Photo Booth still-image capture before returning to the remaining Advanced Decal Posing dependency/provider work. The current 4K color choke point is confirmed as HeroForge's low-resolution Effects phase reconstruction. A named-runtime adaptive true-4096 phase-feed repair has now passed mechanical proof, adaptive topology validation, packaged 4096 download, whole-image human visual acceptance, repeat-use, native-after, restoration, and dispose lifecycle checks through the native Booth compositor. The 4K standalone stage is validated; 8K is the next separate gate.

## Current Repository Role

- Repository: `Knight-Witch/HeroForge.Compatibility`
- Production Witch Dock repository: `Knight-Witch/KnightWitch.Heroforge`
- External diagnostic transport repository: `Knight-Witch/HF-Chat-Bridge` (private; workbench transport live-validated)
- Public runtime dependency from Witch Dock Stable on this repository: **none**
- Current committed standalone code:
  - `entries/tampermonkey-standalone/character-local-json.user.js`
  - `entries/tampermonkey-standalone/projected-decal-toggle.user.js`
  - `entries/tampermonkey-standalone/photo-booth-true-resolution.user.js`
- Corrected bound decal gizmo: promoted into Witch Dock Stable as `decals.gizmo.bound-correction`; current stable repair derives from user-validated WITCH_DEV v0.4.2 behavior
- Maintained shared compatibility bridge / patch engine: **not yet implemented**

## Confirmed Project Direction

1. Preserve legacy originals unchanged under `/legacy/`.
2. Audit legacy behavior and dependencies before reconstruction.
3. Organize by coherent feature/domain boundaries rather than legacy filenames.
4. Reconstruct isolated Tampermonkey modules first.
5. Extract repeated HeroForge access into a shared compatibility bridge.
6. Centralize unavoidable bundle patching in one validated patch system.
7. Test disable/unload behavior and feature interactions.
8. Integrate only validated modules into Witch Dock Dev.
9. Promote to Witch Dock Stable only through a separate review.

## Diagnostic Transport Boundary

`HF-Chat-Bridge` is a separate development diagnostic/control-plane service, not the shared feature compatibility bridge defined by this repository.

The transport has been used for bounded read/write runtime validation during the current decal and Photo Booth investigations. Public Witch Dock and reconstructed modules must never depend on the GitHub mailbox/local relay at runtime.

## Current Canonical ADP Reference

Amanda supplied `Advanced_Decal_Posing_KW_9-3-26_TEST_PATCH.js` v0.99.30 and confirmed that Lob is running this patched version.

For the current reconstruction, v0.99.30 supersedes v0.99.23 as the ADP-side reference for decal posing behavior and is also the current reference for Lob's 4K/8K screenshot menu extension.

The source has been audited for the **decal posing subsystem only** in:

`docs/script-audits/advanced-decal-posing-v0.99.30-decal-posing-subsystem.md`

The exact file is not yet archived under `/legacy/`; archive/provenance import remains required before final maintained reconstruction claims derived from that file.

## Current Decal Posing Findings

### Confirmed

- Current selected splatter decal resolution can use `UIState.editorMenu_color_decals_decals` plus `CK.character.display.modded.orderedDecals.splatter` and the entry mapping.
- Project state can be written through `CK.activeTweak({ decals: ... })` without relying on minified React closure state.
- `forceProjectedScript` remains the ADP/Full Res projection override field.
- ADP v0.99.30 still depends on Full Res v0.80 for actual projected-decal renderer semantics.
- ADP v0.99.30 still contains brittle `heroforgeui.js` source replacement for Project, Unequal Scaling, transform ranges, and Full List catalog behavior.
- v0.99.30 contains both a newer runtime/DOM Project compatibility service and the older compiled Project injection, creating duplicate ownership risk.
- The exact v0.99.30 file does not contain the corrected bound gizmo.
- True decal slot-schema expansion is not confirmed in v0.99.30 and requires a targeted HF Core Tweaks audit.

### Bound gizmo milestone

The corrected bound decal gizmo is now a **Witch Dock Stable feature**, not an external experiment.

Validated behavior carried into Stable includes:

- stable projector-volume center anchor;
- correct native-style Move/Rotate/Scale orientation and behavior;
- native floor/origin Transformer visualization suppression with native locator/state preserved;
- Move/Rotate/Scale Ctrl+Z and Ctrl+Shift+Z behavior;
- corrected Move history reduced to one final undo transaction per completed drag rather than microscopic pointer-move history entries;
- sane Project ON/OFF state preservation after a real bound transform has been established;
- transform preservation when changing decal artwork while Project OFF;
- first-ever Project-OFF normalization of HeroForge's confirmed bad fresh-slot initializer (`v≈1.50394`, `s≈1.76859`, `sy≈1.76859`) to zero only when no genuine prior bound state exists;
- disable/re-enable and cleanup behavior retained from the validated base.

The stable Witch Dock repair commit is `1712b0ba24c8303d8d446d88cdf66199978045e7` in `Knight-Witch/KnightWitch.Heroforge`.

Unequal Project-OFF visual scale, exact visible-artwork-center alignment, and corrected projector wireframe remain deferred and are not release blockers.

## Current Photo Booth Screenshot Findings

### Confirmed

- Lob/ADP v0.99.30 still exposes 4096px and 8192px choices by expanding the Photo Booth resolution-loop ceiling while keeping `CK.Settings.screenshotSize = 2048`.
- Literal 4096/8192 output dimensions are not evidence of corresponding visible rendered detail; Amanda's 100%-view comparisons show the current outputs are soft, with 8K softer still.
- The previously observed 2048x2048 `CK.Capture.renderTarget` belongs to the native frame/auxiliary path in the tested capture, not the main visible model/color render.
- Current private Booth source on `heroforge07.1.9.98` shows the visible high-resolution model path using a tiled helper with `maxTile = 1024` normally, or 512 in the identified Painterly special case.
- A normal 4096 model capture is therefore reconstructed from sixteen shifted 1024x1024 `CK.Effects.renderToCanvas` phases.
- Browser-side same-scene comparison found native 4096 only about 7.2% higher in measured edge information than an upscaled native 2048 reference in the tested central region.
- `CK.Effects.renderToCanvas` is available by name, has no 1024 hard clamp, and can render a genuine 4096x4096 visible-color frame while HeroForge's native Booth temporary camera/state is staged.
- That direct staged true-4096 Effects render measured about 27.4% more edge information than the untouched native 4096 result in the tested central region.
- A temporary runtime phase-feed proof split the true 4096 source into HeroForge's expected sixteen 1024 phases and let the untouched native helper perform its normal mask/frame/final compositing. The repaired final matched the true source pixel-for-pixel in the tested central region (MAE 0, RMSE 0, identical edge metric).
- Current WebGL capability on the tested machine/browser reports `maxTextureSize = 16384`.

### Current repair experiment

`media.screenshot-resolution` now uses the lower-fragility adaptive named-runtime phase-feed design rather than the superseded `CK.Capture.renderToImage` interception:

1. keep `BT.maker.takeScreenshot(4096,4096)` as the owning native Booth capture;
2. temporarily wrap only `CK.Effects.renderToCanvas` during that explicit action;
3. render one true 4096x4096 Effects source through the original named method after native Booth state/camera staging is active;
4. validate the native tile/grid/order and provide matching phase canvases to the existing native compositor;
5. derive the native phase coordinates from the live temporary-camera offsets instead of assuming fixed call order;
6. restore the named method and release the large temporary pixel buffer in `finally` cleanup.

If HeroForge later exposes an already-native 4096 Effects model path, v0.4 detects it and passes it through without injecting the tiled repair. The adaptive bridge proof on the current build detected 1024px tiles, a 4x4 grid, 16/16 unique phases, returned 4096x4096, and produced a 9,823,790-byte PNG that Amanda opened and reported looked great.

The maintained standalone does not call the private tiled helper by minified name, does not patch `booth.js`/`boothui.js`, does not mutate `CK.Settings.screenshotSize`, and leaves 8K disabled pending a separate resource-safe design.

## Active Work

- Keep packaged standalone `media.screenshot-resolution` v0.4 as the validated 4K regression baseline on `heroforge07.1.9.98`.
- Design/test 8192 separately with explicit memory/performance safeguards; do not assume the 16384 texture limit alone makes a one-shot 8K Effects render safe.
- Re-run the complete v0.4 4K topology/download/visual/native-after/dispose suite after any shared 8K changes.
- Decide after 8K validation whether the high-resolution still feature remains standalone or becomes a Witch Dock Dev candidate.
- Archive current canonical legacy/reference sources with provenance, including exact ADP v0.99.30.
- Audit the exact current Full Res v0.80 projection renderer support after the screenshot repair stage.
- Audit HF Core Tweaks decal slot/schema behavior if extra slots are in the first Advanced Decal Posing production scope.
- Write a consolidated `decals.advanced-posing` feature specification for the remaining posing family.
- Extract repeated validated capability access into maintained shared bridge boundaries when broader feature services are reconstructed.
- Keep the now-stable bound gizmo behavior regression-tested as a separate feature rather than reopening it during unrelated work.

## Next Planned Development Stage

1. Design and validate true 8192 capture with explicit GPU/memory safeguards, using validated v0.4 4K as the regression baseline.
2. Reconfirm v0.4 4K remains unaffected by the 8K experiment.
3. Decide whether the validated high-resolution capture remains standalone or becomes a Witch Dock Dev candidate; do not modify Stable during the experiment.
4. Archive exact v0.99.30 ADP source under immutable `/legacy/`.
5. Complete the Full Res v0.80 projected-renderer dependency audit.
6. Complete the HF Core Tweaks decal-slot audit if slots remain first-pass scope.
7. Define and build the remaining production Advanced Decal Posing feature/capability contract.
8. Test Lob-absent and Lob-present coexistence before any overlapping posing integration.

## Current Blockers / Open Gates

- Packaged standalone adaptive 4K has passed true-4096 mechanical proof, whole-image visual acceptance, repeat-use, native-after, Effects restoration, and dispose cleanup on `heroforge07.1.9.98`.
- True 8192 capture remains a separate unvalidated gate requiring explicit resource-safe design.
- The exact current v0.99.30 source is not yet archived under `/legacy/`.
- Exact current Full Res v0.80 projected/unequal renderer source has not yet been normalized/audited in this repository.
- True extra decal slot/schema behavior still needs current HF Core Tweaks source audit if included in first-pass scope.
- Maintained shared compatibility bridge and patch engine are not yet implemented.
- Feature ownership/provider policy with Lob has not yet been formally assigned for overlapping Project/Full List behavior.
- Unequal bound scaling renderer enhancement is intentionally deferred.

## Migration Queue

| Area | Current State | Next Gate |
|---|---|---|
| Photo Booth high-resolution still capture | 4K standalone validated: adaptive true-4096 Effects phase-feed passed topology/download/visual/repeat/native-after/dispose | Design/test resource-safe 8K; then decide standalone vs Witch Dock Dev candidacy |
| ADP v0.99.30 decal posing | Current source audited; not yet archived | Archive exact source + dependent renderer/slot audits |
| Character local JSON | Standalone reconstruction committed; core Save/Load passed live | Finish lifecycle/repeated-use acceptance before promotion |
| Projected decal state/control | Standalone test committed; newer live compatibility path confirmed | Fold into consolidated posing service after renderer audit |
| Corrected bound decal gizmo | Witch Dock Stable; user-validated repair based on WITCH_DEV v0.4.2 | Keep regression coverage current; broader Foundation/bridge consolidation is future architecture work, not a release gate |
| Unequal bound scaling | Deferred | Separate renderer enhancement later |
| HF-Chat-Bridge diagnostic transport | Workbench transport validated | Remains development-only external infrastructure |
| Maintained compatibility bridge | Planned | Define shared capabilities from validated work during broader service reconstruction |
| Witch Dock Dev integration | Bound gizmo complete; screenshot/remaining posing features not integrated | Standalone validation before each new Dev candidate |
| Witch Dock Stable | Bound gizmo promoted; no dependency on Compatibility repo head | Separate future promotion review for each additional feature |

## Status Terms

- **Legacy reference** — immutable original/reference source used to understand behavior.
- **Provisional inventory** — extracted from audit but not yet confirmed through normalized repo source/runtime testing.
- **Standalone candidate** — coherent feature suitable for independent reconstruction/testing.
- **Standalone validated** — reconstructed module/experiment has passed its defined standalone acceptance tests.
- **Witch Dock Dev candidate** — standalone validated and approved for integration testing.
- **Stable candidate** — passed Witch Dock Dev testing and awaits explicit public promotion review.
- **Witch Dock Stable** — explicitly promoted to the public Witch Dock delivery path after Dev validation/review.
- **Experimental only** — intentionally not eligible for stable integration yet.
- **Blocked** — a concrete dependency or unresolved failure prevents progress.
- **Deprecated** — should not be used as a current implementation.
- **Rejected** — intentionally not being adopted.
