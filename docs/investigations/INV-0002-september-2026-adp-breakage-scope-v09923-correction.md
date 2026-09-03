# INV-0002 correction — canonical September 2026 source

**Date:** 2026-09-03
**Runtime impact:** none; documentation-only correction.

Amanda supplied the current Tampermonkey export `tampermonkey_scripts (9-2-26)(1).zip` after the initial investigation note was written. The previous note identified an older File Library copy (`Advanced Decal Posing v0.99.20`) as the provisional canonical reference. That assumption is superseded.

## Correct canonical source for this investigation

- `Advanced Decal Posing.user.js` — v0.99.23
- `Full Res Decals-Textures (+ Other Tweaks).user.js` — v0.80
- `HF Core Tweaks.user.js` — v0.3.4.2
- `Shader Fix for Photo Booth.user.js` — 2025-06-18
- export batch date/name: `tampermonkey_scripts (9-2-26)(1).zip`

The current repair investigation must use the supplied 9/2/26 export, not earlier File Library copies.

## Confirmed v0.99.23 mechanisms relevant to the reported breakage

- Local `Save Locally` / `Load from File` controls are injected into `heroforgeui.js` via compiled-source replacement.
- Local load calls named `CK.tryLoadCharacter` after parsing the JSON file.
- Character-browser `Import from JSON` is a separate injection/action-list path.
- The `Project` decal toggle is injected by replacing the compiled native Mirror control and mutates `forceProjectedScript` through the captured `CK.activeTweak` expression.
- Projected renderer semantics remain a separate `creationkit.js` patch in Full Res Decals/Textures v0.80.
- Photo Booth high-quality spin UI is injected by patching `boothui.js`.
- v0.99.23 initializes `CK.Settings.screenshotSize` to 2048 and patches booth capture limits to expose larger output choices.

This correction does not itself assert which current HeroForge anchors or runtime APIs remain valid; those are being probed separately before repair code is written.
