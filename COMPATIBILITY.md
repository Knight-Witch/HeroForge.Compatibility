# Compatibility

Human-readable HeroForge compatibility status.

## Current State

The repository contains early standalone reconstructions and current-runtime capability evidence. The corrected bound decal gizmo has completed standalone validation, Witch Dock Dev testing, and Witch Dock Stable promotion; it is no longer an external experiment awaiting extraction. The current Photo Booth investigation on `heroforge07.1.9.98` has now isolated the visible-color quality ceiling to HeroForge's private 1024-pixel model-phase tile cap. A named-runtime adaptive true-4096 Effects phase-feed repair has passed mechanical proof, adaptive topology validation, packaged 4096 download, whole-image human visual acceptance, repeat-use, native-after, restoration, and dispose lifecycle validation through the native compositor. 4K is standalone validated on the current build; 8K remains a separate gate.

Current live investigation evidence spans the September 2026 HeroForge builds used during the v0.4.1 gizmo investigation, subsequent Witch Dock v0.4.2 repair validation, and Photo Booth build `heroforge07.1.9.98`. Exact cross-build stability still requires normal revalidation after HeroForge updates.

The private `Knight-Witch/HF-Chat-Bridge` workbench transport is development infrastructure only. It is not a production dependency or the maintained compatibility bridge.

| Component | Current status | Last verified HeroForge build / date | Notes |
|---|---|---|---|
| HF-Chat-Bridge diagnostic/workbench transport | Live validated for current bounded read/write workflow | September 2026 current-runtime investigation | Development-only external transport; not a Witch Dock dependency. |
| Shared maintained compatibility bridge | Not implemented | — | Current findings define candidate capabilities but are not yet normalized into bridge modules. |
| Shared patch engine | Not implemented | — | Required before adopting unavoidable Full Res/creationkit renderer patches. |
| Character local JSON standalone | Core Save/Load passed live | Current live page 2026-09-03 | Repeated-use/lifecycle acceptance still pending. |
| Projected decal state/control | Runtime path confirmed; maintained consolidation pending | September 2026 | `CK.activeTweak` state path works; exact Full Res v0.80 renderer dependency still requires audit. |
| `decals.gizmo.bound-correction` | Witch Dock Stable; runtime-validated | 2026-09-05 | WITCH_DEV v0.4.2 repair passed Move/Rotate/Scale undo-redo, sane Project state preservation, bound artwork-swap transform preservation, and fresh-slot bad-default normalization. |
| `media.screenshot-resolution` | 4K standalone validated | `heroforge07.1.9.98` / 2026-09-05 | Adaptive phase-feed passed live topology/download/visual/repeat/native-after/restoration/dispose; native 4K uses 16x1024 Effects phases on this build; 8K gated for separate design. |
| Witch Dock Dev integration | Bound gizmo completed; broader features not integrated | 2026-09-05 | Screenshot repair and remaining posing features require standalone validation first. |
| Witch Dock Stable | Bound gizmo promoted; no dependency on Compatibility repo head | 2026-09-05 | Stable delivery remains insulated from this repository's unstable development head. |

## Confirmed Current Decal Evidence

On the tested current runtime:

- selected splatter decal metadata is available through `CK.character.display.modded.orderedDecals.splatter`;
- current ADP compatibility can resolve selection using `UIState.editorMenu_color_decals_decals` plus ordered mapping metadata;
- decal records are writable through `CK.activeTweak({ decals: ... })`;
- `forceProjectedScript` remains the projection override field used by the current Lob patch ecosystem;
- ADP v0.99.30 explicitly relies on Full Res v0.80 for renderer consumption of that field;
- native HeroForge's bound decal Transformer follows `decalLocator`, whose raw position is not the rendered projector center;
- the validated corrected gizmo uses the projector-volume center in the shared character frame and a separate corrected transform service rather than mutating the native locator's transform basis;
- Move requires direct H/V/D state adaptation because the native transform listener did not preserve the required arbitrary camera-plane depth component in testing;
- native rotation and logarithmic scale semantics can be reused through the validated adapter path;
- corrected Move must avoid `CK.activeTweak()` on every pointer movement because that current path records repeated intermediate history snapshots; the validated stable repair performs live data/refresh updates and uses the final passive-change commit once per completed drag;
- `CK.Events.on/off('characterEnterChange', ...)` can be lifecycle-managed to preserve genuine Project-OFF transform state across relevant pending decal changes;
- HeroForge's observed fresh Project-OFF bad initializer is approximately `v=1.503942117`, `s=1.768586891`, `sy=1.768586891`; the stable feature only normalizes those three values to zero when no genuine prior bound state exists and the known signature is present;
- Project-OFF unequal visible scaling is not fully supported by the current renderer path and is intentionally deferred.

## Confirmed Current Photo Booth Screenshot Evidence

On `heroforge07.1.9.98` with Photo Booth open:

- `BT.maker.takeScreenshot(width, height)` receives the selected resolution and enters the current private Booth capture/compositing path;
- the private helper clones the orbit camera, applies the Booth token view offset, and owns model/background staging, masks, frame handling, visibility, and final compositing;
- authenticated current-page source retrieval of `gated/booth.js` identified the private tiled model path; its current phase cap is 1024 normally, or 512 for the identified Painterly special case;
- the visible model/color phase renderer defaults to named `CK.Effects.renderToCanvas`;
- a normal 4096 capture therefore reconstructs the model/color image from sixteen shifted 1024x1024 phase renders;
- a separate later frame/auxiliary path uses tiled `CK.Capture.renderToImage`; the previously observed 2048x2048 `CK.Capture.renderTarget` belongs to that path in the tested capture rather than the main visible-color source;
- `CK.Settings.screenshotSize = 4096` does not repair the visible-color phase cap and was restored to 2048 after the bounded test;
- current renderer capability reports `maxTextureSize = 16384` on the tested machine/browser;
- untouched native 4096 measured only about 7.2% more edge information than an upscaled native 2048 reference in the tested central region;
- named `CK.Effects.renderToCanvas(4096,4096,nativeTempCamera,1)` succeeded while native Booth state was staged and measured about 27.4% more edge information than untouched native 4096;
- a runtime phase-feed proof supplied the true-4096 source through all 16 expected native model phases and the native compositor reproduced that source exactly in the tested central region (MAE 0, RMSE 0, identical edge metric);
- the later adaptive bridge proof derived the 1024 / 4x4 topology from live camera/Effects calls, supplied 16/16 unique phases, returned 4096x4096, encoded a 9,823,790-byte PNG, and Amanda reported the opened result looked great;
- the rejected in-place 2x render-target resize experiment produced lower edge detail than baseline and is not a candidate repair.

Current private helper names/offsets are build-specific diagnostic evidence only. Maintained code must not treat them as stable APIs.

The selected lower-fragility repair keeps `BT.maker.takeScreenshot` as the owning native capture and temporarily wraps only named `CK.Effects.renderToCanvas` during one explicit action. One genuine 4096 Effects frame is phase-split into the native helper's detected square-divisor topology, with phase X/Y derived from live temporary-camera offsets rather than fixed call order; the untouched helper then performs normal mask/frame/final compositing. A future already-native 4096 Effects model path is passed through untouched. The named method is restored in `finally` cleanup.

## Current ADP Compatibility Hazards

The exact v0.99.30 ADP reference still:

- removes/intercepts `heroforgeui.js` before transactional validation;
- uses many exact compiled-source replacements;
- has no untouched-original fallback for that bundle path;
- contains duplicate Project ownership (new runtime/DOM compatibility plus old compiled Project injection);
- depends on external Full Res renderer behavior;
- mixes unrelated features in the same bundle transform;
- separately intercepts Photo Booth UI code for screenshot/spin/other unrelated adjustments.

These are reasons to reconstruct coherent features independently, not to port the monolithic script.

## Not Yet Confirmed / Required Follow-up

- Painterly/other effect-profile regression coverage for the packaged adaptive repair.
- True 8192 capture stability/performance; intentionally gated on the packaged 4096 result.
- Exact current Full Res v0.80 projected/unequal renderer patch behavior and best maintained replacement strategy.
- Whether every legacy ±6 transform extreme is safe through runtime-only controls.
- True extra decal slot/schema expansion behavior in current HF Core Tweaks.
- Production coexistence/provider behavior with Lob v0.99.30 when Witch Dock owns additional posing functions.
- Cross-build stability of current runtime capability paths after future HeroForge updates.

## Capability Status Terms

- `available` — confirmed usable in the tested build.
- `unavailable` — required capability was not found or failed validation.
- `degraded` — partially usable with known limitations.
- `untested` — no current verification.

## Build Tracking Rules

For maintained feature compatibility, record:

- HeroForge build identifier or fingerprint where available;
- test date;
- capability status;
- affected feature IDs;
- failure reason;
- whether fallback preserved unmodified HeroForge behavior.

A changed build fingerprint is a revalidation trigger, not automatic proof of incompatibility.
