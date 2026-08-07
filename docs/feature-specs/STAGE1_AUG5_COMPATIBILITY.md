# Stage 1 August 5 Compatibility Feature Specifications

**Status:** Standalone test implementation; live validation pending  
**Target HeroForge build:** `heroforge08.1.9.74`  
**Development branch:** `dev/aug5-compatibility-stage-1`

These modules are isolated Tampermonkey test implementations. They are not Witch Dock Dev or Stable integrations.

## `character.local-file-io`

- **Purpose:** Export and import complete HeroForge character JSON without injecting controls into HeroForge's private React menu.
- **Legacy source:** Advanced Decal Posing local Save/Load behavior.
- **Primary maintainer:** TBD.
- **Reviewer:** Amanda.
- **Risk:** Medium.
- **Required capabilities:**
  - export: `CK.UndoQueue.queue/currentIndex` or `CK.character.data.getJson`
  - import: `CK.tryLoadCharacter`
- **Optional capability:** `CK.Helpers.deepCopy`
- **Default state:** Enabled.
- **Initialization:** Polls for named runtime capabilities and mounts an independent Shadow DOM panel.
- **Disable/unload:** `dispose()` clears polling, removes owned UI, and removes the exported diagnostic global.
- **Reload required:** No.
- **Compatibility status:** Runtime surfaces observed on `heroforge08.1.9.74`; end-to-end round trip untested.
- **Disposition:** Standalone test; possible Witch Dock Dev candidate only after validation.

### Export policy

The module prefers the current UndoQueue entry when it exists and resembles character data, preserving the legacy script's known export source. It falls back to `CK.character.data.getJson()` when no usable queue entry exists.

### Acceptance tests

1. Export a character with decals, paints, kitbash, pose, children, and metadata.
2. Make a visible change.
3. Import the exported file.
4. Confirm all tested domains return.
5. Confirm undo/redo behavior after import.
6. Save and reload HeroForge.
7. Repeat import and export at least twice.
8. Dispose the module and confirm its UI and polling stop.

## `photo-booth.settings-file-io`

- **Purpose:** Export and import Photo Booth settings without patching `boothui.js` or depending on its private React components.
- **Legacy source:** Advanced Decal Posing Photo Booth settings Save/Load.
- **Primary maintainer:** TBD.
- **Reviewer:** Amanda.
- **Risk:** High until live round-trip behavior is verified.
- **Required capability:** `BT.maker.effectState.save/load` after Photo Booth initialization.
- **Legacy fallback capability:** `TN.tokenizer.effectState.toJson/fromJson` for older compatible builds.
- **Default state:** Enabled.
- **Initialization:** Mounts independent UI and polls for a supported Booth adapter.
- **Disable/unload:** `dispose()` clears polling, removes owned UI, and removes the exported diagnostic global.
- **Reload required:** No.
- **Compatibility status:** Current runtime object and methods observed on `heroforge08.1.9.74`; method signatures and round trip untested.
- **Disposition:** Standalone test; possible Witch Dock Dev candidate only after validation.

### Acceptance tests

1. Open Photo Booth and confirm the module reports the `BT.maker.effectState.save/load` adapter.
2. Create a visibly distinctive Booth setup.
3. Export settings.
4. Change camera, background, lighting, effects, and overlays.
5. Import the file.
6. Record which domains return and which do not.
7. Confirm update/render refresh occurs without an exception.
8. Repeat after leaving and re-entering Booth.
9. Dispose the module and confirm its UI and polling stop.

## `decals.transform.projected`

This feature owns both legacy Project and Unequal Scaling behavior because their UI state and renderer interpretation are inseparable.

- **Purpose:** Restore renderer support for existing `forceProjectedScript` and `enableUnequalScaling` decal properties.
- **Legacy sources:** Advanced Decal Posing UI plus Full Res Decals/Textures renderer patches.
- **Primary maintainer:** TBD; expected collaboration with Lob/Clover where applicable.
- **Reviewer:** Amanda.
- **Risk:** Critical.
- **Required capabilities:**
  - validated `creationkit.js` interception before execution
  - exactly one force-projection renderer anchor
  - exactly one unequal-scaling renderer anchor
  - `CK.activeData.decals`
  - `CK.activeTweak`
- **Default state:** Enabled in the standalone experimental script.
- **Initialization:** Intercepts `creationkit.js` at document start, fetches untouched source, validates both patches and postconditions, syntax-checks transformed source, then executes it.
- **Failure behavior:** Before modified execution, any fetch, count, postcondition, or syntax failure loads untouched HeroForge `creationkit.js` and disables the compatibility behavior for that load.
- **Disable/unload:** Enabling/disabling requires reload. UI disposal does not and cannot remove an already executed core-bundle patch.
- **Reload required:** Yes.
- **Compatibility status:** Static fixture validation passed for build `heroforge08.1.9.74`; live renderer behavior untested.
- **Disposition:** Experimental standalone only.

### Patch contract

#### `decals.renderer.force-projected`

- **Target bundle:** `creationkit.js`
- **Expected matches:** 1
- **Current decision:**
  - native: `ke=!pe||y<2`
  - compatibility: `ke=void 0===ve.forceProjectedScript?!pe||y<2:!ve.forceProjectedScript`
- **Purpose:** Preserve native behavior when the custom field is absent and honor the existing custom field when present.

#### `decals.renderer.unequal-scale`

- **Target bundle:** `creationkit.js`
- **Expected matches:** 1
- **Current condition:**
  - native: `pe&&!ke&&(`
  - compatibility: `pe&&(!ke||ve.enableUnequalScaling)&&(`
- **Purpose:** Enable separate `s`, `sy`, and `sz` scaling when the custom field requests it, while preserving native projected behavior.

### Acceptance tests

1. Load with every other `creationkit.js` rewriter disabled.
2. Confirm panel reports the expected build and active patched bundle.
3. Confirm a native projected decal remains projected by default.
4. Toggle Project off and verify renderer change.
5. Toggle Project on and verify renderer change.
6. Enable Unequal Scaling and verify `sy`/`sz` create visibly independent scaling.
7. Test layers below and above index 2.
8. Test native Tiling on and off.
9. Reorder projected and pattern layers.
10. Delete, undo, redo, save, reload, export, and import.
11. Test multiple projected layers.
12. Disable the script through Tampermonkey, reload, and confirm unmodified HeroForge behavior.
13. Force a patch-count failure in a local fixture and verify untouched fallback.

## Explicit exclusions

Stage 1 does not repair:

- Full Decal List or filter policy.
- Invert Selection.
- Pose-only JSON import.
- Booth screenshot-resolution extensions.
- Higher-quality Spinny Mini GIF.
- Witch Dock Persistent Booth View.
- Witch Dock Black Canvas Background.
- Native tiling, which now exists and should not be overwritten by the legacy tiling patch.
