# Character Local JSON — Standalone Reconstruction Spec

**Feature IDs:** `character.local-export`, `character.local-import`  
**Status:** Standalone test v0.1.0; live behavior validation pending  
**Risk:** Medium  
**Primary maintainer:** TBD  
**Reviewer:** Amanda  
**Disposition:** Standalone reconstruction; Witch Dock Dev candidacy only after standalone validation

## Purpose

Restore local Hero Forge character JSON save/load behavior that is currently missing from Advanced Decal Posing v0.99.23 without depending on HeroForge native React UI or `heroforgeui.js` compiled-string injection.

## Canonical legacy behavior

Reference: Amanda's 2026-09-02 Tampermonkey export, `Advanced Decal Posing.user.js` v0.99.23, SHA-256 `08dfb5bf7e75c2e4d92b0e0d856d49b04f3ee28a04836fa014a327312573f039`.

Legacy local export:

1. Read `CK.UndoQueue.queue[CK.UndoQueue.currentIndex]`.
2. Serialize that snapshot as formatted JSON.
3. Download it as `<character-name>_<ISO timestamp>.heroforge.json`.

Legacy local import:

1. Choose `.heroforge.json` / JSON file.
2. Parse the file.
3. Call `CK.tryLoadCharacter(jsonData, "Attempting to load from JSON", callback)`.

The separate Character Browser `Import from JSON` action is not part of this first standalone reconstruction; this test restores the direct local save/load behavior first.

## Confirmed current runtime capabilities

Live read-only HF-Chat-Bridge probes on 2026-09-03 confirmed:

- Issue #19: `CK.UndoQueue` exists with `queue` and `currentIndex`.
- Issue #20: `CK.tryLoadCharacter` exists as a named function.
- Issue #21: `CK.character` exists.
- Issue #22: `CK.character.data` exists.
- Issue #26: `CK.toJson` exists.
- Issue #27: `CK.fromJson` exists.
- Issue #30: `CK.UndoQueue.queue` is a live array.
- Issue #31: `CK.UndoQueue.currentIndex` is a live number.

The standalone implementation intentionally uses the same UndoQueue snapshot and `CK.tryLoadCharacter` path as the v0.99.23 legacy feature instead of introducing new serialization semantics.

## Required capabilities

- `CK.UndoQueue.queue`
- `CK.UndoQueue.currentIndex`
- `CK.tryLoadCharacter`

## UI / host

Independent temporary test panel plus Tampermonkey menu commands. No HeroForge native React components are required.

## Initialization

- Runs at `document-idle`.
- Mounts one test panel.
- Polls only until both required runtime capabilities are ready, then stops its readiness interval.
- A prior copy of the same test exposes `dispose()` and is disposed before a replacement instance mounts.

## Enable / disable / unload

Standalone test is active when the userscript is enabled. `dispose()` removes the panel, styles, and readiness interval. No HeroForge function is permanently overridden. Page reload is not required for disposal, though disabling the Tampermonkey script naturally takes effect on reload.

## Failure behavior

- Save remains disabled until the current UndoQueue snapshot is available.
- Load remains disabled until `CK.tryLoadCharacter` is available.
- Invalid/missing capabilities produce local status errors; no fallback bundle patch is attempted.
- Invalid JSON is rejected before calling HeroForge load behavior.

## Acceptance tests

1. On a normal loaded character, panel reports `Ready`.
2. `Save JSON` downloads a valid `.heroforge.json` file.
3. Saved JSON represents the current UndoQueue snapshot and contains the current character state.
4. Make a visible character change, then `Load JSON` the prior file; the character returns to the saved state.
5. Repeat save/load more than once in the same page session.
6. Reload HeroForge and repeat.
7. Confirm the test does not duplicate its panel when re-run.
8. Call `HFCharacterLocalJsonTest.dispose()` and verify owned UI/styles/timer are removed.
9. Confirm Advanced Decal Posing can remain enabled and no `heroforgeui.js` repair is required for this standalone feature.

## Out of scope for v0.1.0

- Character Browser native `Import from JSON` action repair.
- Projected decal controls.
- Photo Booth capture resolution / spin media repair.
- Witch Dock integration.
