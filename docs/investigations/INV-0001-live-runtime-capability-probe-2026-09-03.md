# INV-0001 — Live Runtime Capability Probe (2026-09-03)

**Status:** Active investigation  
**Source:** Private `Knight-Witch/HF-Chat-Bridge` read-only diagnostic transport  
**HeroForge page:** authenticated `https://www.heroforge.com` session  
**Mutation:** none

## Purpose

Establish which named HeroForge runtime surfaces are actually reachable from the current live page before implementing the maintained compatibility bridge or reconstructing features against assumed internals.

This investigation records diagnostic evidence only. Presence in the runtime does not make a property or method a stable supported API.

## Probe sequence

- Issue #8 — `runtime.capabilityProbe`
- Issue #9 — `runtime.describePath` for `CK.display`
- Issues #10-#15 — additional bounded follow-up probes queued; results pending at the time of this record.

## Confirmed findings

### Top-level `HF`

`HF` is present as an own top-level page property and is a function object.

The bounded own-key inspection reported:

- `init`
- `initForge`
- `settings`
- `loadedData`
- `finishedLoading`
- `JointLimits`
- `released`
- `productGrayedOut`
- `UserPaints`
- `Sizing`
- `settingsData`
- `slidersByMonsterGroup`
- `slidersByDynamicMenu`
- `sliders`
- `Data`
- `ThreeCharacters`
- `CustomFace`
- `VaultCheck`
- `summonCircle`

This list was produced by the current bounded diagnostic serializer. It is evidence of current property names, not a stability guarantee.

### Top-level `CK`

`CK` is present as an own top-level page property and is a function object.

The bounded own-key inspection includes named operations/surfaces such as:

- initialization: `initSettings`, `checkCompatibility`, `main`, `initCharacter`, `init`, `initExternal`, `initData`, `initCanvas`, `initDisplay`
- display/camera: `getDomElement`, `changeBackground`, `resetCharacterRotation`, `setCharacterRotation`, `rotateCharacter`, `refresh`, `_updateScene`, `_resize`, `_cameraMoved`, `freeCamera`
- character loading/state: `loadInitialCharacter`, `tryLoadCharacterShare`, `tryLoadCharacter`, `cacheCharacter`, `uncacheCharacter`, `loadDefaultCharacter`
- undo/data I/O: `addUndoPoint`, `undo`, `redo`, `canUndo`, `canRedo`, `toJson`, `fromJson`, `toClipboard`, `fromClipboard`
- state-facing names: `display`, `allDisplays`, `data`, `modded`, `tweak`, `tweakWithUndo`, `tweakSettings`, `modifiedTweak`, `change`, `activeTweak`, `activeTweakWithUndo`, `activeData`, `activeDisplay`, `activeModded`

The diagnostic key list is capped and may not be exhaustive.

### Other top-level candidates

At the time of the probe:

- `TN` — unavailable as a top-level global.
- `BT` — unavailable as a top-level global.
- `THREE` — unavailable as a top-level global.
- `React` — available as a top-level object.
- `ReactDOM` — available as a top-level object.

Do not treat the absence of `TN`, `BT`, or `THREE` from `window` as proof that equivalent functionality does not exist elsewhere in modules/closures.

### Current script resources

The live page included current HeroForge resources such as:

- `static/js/ckvendor.js`
- `static/js/renderkit.js`
- `static/js/shaderkit.js`
- `static/js/hfuivendor.js`
- `static/js/extras.js`
- `static/js/materialui.js`
- `static/js/cart.js`
- `static/js/accounts.js`
- `static/js/community.js`
- `gated/advimport.js`

The resource probe deliberately strips URL query strings/fragments, so this evidence does not yet provide a reliable HeroForge build fingerprint.

### `CK.display` safety boundary

Issue #9 confirmed that `CK.display` is exposed through an accessor/getter rather than a plain data property.

The v0.1 `runtime.describePath` probe correctly returned `getter_blocked` and did not execute the getter.

This is important because apparently simple property traversal can invoke HeroForge code. Future diagnostic or maintained runtime access must distinguish safe data-property reads from deliberate getter invocation.

## Supported inference

- `HF` and `CK` are promising current entry points for the maintained compatibility bridge because they expose substantial named runtime surfaces without first requiring minified webpack identifiers.
- A meaningful portion of useful `CK` state may be exposed via accessors rather than plain fields; a future adapter may need narrowly reviewed getter access instead of generic object traversal.
- Several legacy features that currently patch bundles may have runtime-access alternatives worth testing before any patch-engine migration.

These are supported directions, not confirmed feature implementations.

## Unproven / unresolved

- Which `HF` / `CK` names remain stable across HeroForge builds.
- Semantics, side effects, and lifecycle requirements of any named method.
- Whether `CK.data`, `HF.settings`, `HF.Data`, and other queued paths are plain data properties or accessors.
- The actual value/readiness semantics of `HF.finishedLoading`.
- A durable current-build fingerprint.
- Whether Photo Booth-specific named globals exist.
- Whether any named runtime surface can replace a specific legacy bundle patch without behavior loss.

## Next actions

1. Collect the already queued bounded follow-up probe results.
2. Record which candidate paths are plain data properties versus accessors.
3. Do not invoke getters/functions through the generic v0.1 path.
4. If a getter must be inspected, define a narrowly allowlisted read-only probe with documented reason and side-effect analysis rather than weakening `runtime.describePath` globally.
5. Identify a safe build/fingerprint source before marking capability compatibility against a specific HeroForge build.
6. Use confirmed runtime evidence to choose the first maintained compatibility bridge capability; do not promote raw `HF`/`CK` names directly into feature modules.
