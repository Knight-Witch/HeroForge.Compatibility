# Testing

Standalone-first validation precedes Witch Dock integration and public promotion.

## `media.screenshot-resolution`

HeroForge build: `heroforge07.1.9.98`.

Standalone, Witch Dock Dev and public Witch Dock Stable still-capture gates remain validated. Current Spinny work does not reopen them.

## `media.spinny-mini-webp`

HeroForge build: `heroforge07.1.9.98`.

Maintained standalone implementation:

- file: `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`
- version: `0.5.0`
- build: `0.5.0-integrated-pause-interaction-guards`

## Validated standalone profile matrix

- 1024 Standard / 250 frames: PASS
- 2048 Standard / 250 frames: PASS
- 1024 Very Slow / 750 frames: PASS
- 2048 Slower / 500 frames: PASS
- repaired 3072 Standard / 250 frames via TRUE-3K: PASS
- repaired 3072 Slower / 500 frames via TRUE-3K: PASS
- repaired 3072 integrated Short Test / 16 frames: PASS

Other validated standalone behavior:

- repeat use: PASS
- parser validation: PASS
- animated-WebP mux/timing: PASS
- rotation restoration: PASS
- progress/readout: PASS
- ETA usefulness: PASS on tested long TRUE-3K runs
- general cancel / starting-rotation restoration: PASS
- frame-boundary Pause/Resume at native 1024: PASS
- frame-boundary Pause/Resume at repaired TRUE-3K 3072: PASS
- cancel while paused: PASS
- paused-time ETA behavior: PASS
- camera wheel/drag guard: PASS
- Booth-control guard: PASS
- Keep Capture: PASS
- guard-triggered cancel requiring repeat intended action: PASS
- guard protection while paused: PASS

## Native 3072 failure reference

Native unrepaired 3072 is rejected. Runtime trace confirmed a 3072 capture camera paired with repeated 768px Effects phase renders; structural dimensions pass while source fidelity fails.

## TRUE-3K repair

TRUE-3K is validated through Short Test, 250-frame full and 500-frame full capture. The maintained adapter feeds the native compositor from one genuine 3072 Effects source per animation frame and restores `CK.Effects.renderToCanvas` after each repaired frame.

## Witch Dock Dev integration gate — PASS

Final integrated Dev service:

- v0.5.1
- build `0.5.1-witch-dock-dev-download-scroll-guard`

Final integrated Dev UI:

- v0.1.1
- build `0.1.1-dev-download-ux`

Final Dev hardening commit:

`fa75a9c1790009b4b4ae1a1162d419982e20545e`

Integrated user testing passed:

1. Spinny placement under High Res Image Capture.
2. Docked controls and shared-state draggable popout.
3. Popout movement and return-to-dock behavior.
4. Pause/Resume.
5. Cancel.
6. ETA/progress.
7. Camera/Booth interaction guards.
8. Guard behavior while paused.
9. Silent wheel/scroll suppression after final UX adjustment.
10. Privileged userscript WebP download after final download-boundary repair.
11. Dark dropdown options / plain resolution labels / popout icon presentation were accepted as part of the final integrated UI.

User conclusion after final re-smoke: integrated behavior works perfectly; explicit public rollout approval received.

The optional transient in-panel download-complete flash was not observed. User explicitly treated it as non-problematic because the browser's download UI visibly confirms the save. It is not a functional gate.

## Witch Dock Stable promotion gate — PROMOTED / PUBLIC SMOKE PENDING

Public Witch Dock v1.1.0 promotion commit:

`8d96dd803f452c3c7b623c6963b4fdb3ef762f59`

Static promotion gate passed before `Witch_Scripts` advanced. Coverage included:

- `Witch_Dock.user.js` JavaScript syntax;
- Stable Spinny service JavaScript syntax;
- Stable Spinny UI JavaScript syntax;
- `manifest.json` parse;
- public userscript version/`GM_download` host assertions;
- Spinny version/build and resolution-label assertions;
- silent wheel-guard assertion;
- awaited privileged download-boundary assertion;
- dark-option / icon-tooltip assertions;
- public manifest URLs point to `Witch_Scripts`, not Dev;
- exactly one Spinny service/UI entry;
- Developer Mode and compact High Res Dev UI excluded;
- Spinny does not assign ownership of `BT.maker.takeScreenshot`;
- diff whitespace/static gate.

### Required clean public smoke

Do not repeat expensive TRUE-3K production runs absent a regression. Minimum public Stable smoke:

1. Update/install public Witch Dock v1.1.0 and approve `GM_download` permission if prompted.
2. Disable the Dev loader and temporary/standalone Spinny scripts.
3. Reload HeroForge.
4. Open Photo Booth and confirm public Spinny renders under the existing High Resolution Capture section.
5. Run 1024px Standard / 250 frames, the cheapest public full profile because Short Test is hidden in Stable.
6. Confirm WebP download succeeds.
7. During capture, confirm wheel over the HeroForge canvas has no effect and shows no modal.
8. Confirm one non-wheel guarded camera/Booth action still shows Keep Capture / Cancel Capture.

If this passes, mark public Stable validated with documentation-only checkpoints in Witch Dock and HeroForge.Compatibility.

## Short Test Witch Dock policy

Standalone development harness exposes Short Test.

Witch Dock service retains `captureShortTest()`, but normal public UI hides it. Dev Developer Mode may reveal it through the Spinny host; Developer Mode does not duplicate media capture logic.

## 4K Spinny

Deferred. Current Witch Dock TRUE-resolution still provider owns square 4096/8192 screenshot requests.
