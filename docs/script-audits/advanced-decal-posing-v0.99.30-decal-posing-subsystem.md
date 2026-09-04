# Advanced Decal Posing v0.99.30 — Decal Posing Subsystem Audit

**Audit date:** 2026-09-04  
**Canonical source for this audit:** `Advanced_Decal_Posing_KW_9-3-26_TEST_PATCH.js`  
**Userscript name:** `Advanced Decal Posing - Witch's 9-3-26 PATCH`  
**Version:** `0.99.30`  
**Authors credited by source:** Lob / Knight Witch  
**Source SHA-256:** `659a84d1a4b01db4143d713618a216dd46dcc5dbed7bd6e668fe61290276170d`  
**Source size:** 71,315 bytes / 1,913 lines  
**Runtime role:** current patched ADP copy reported as the version Lob is using

## Scope

This audit intentionally covers only the **decal posing subsystem** that Amanda wants reconstructed as an independent Witch Dock feature family:

- selected decal/slot resolution;
- broader decal catalog / Full List behavior;
- Project ON/OFF state and renderer dependency;
- transform ranges for move/rotation/scale workflows;
- Unequal Scaling state only to the extent required to understand current behavior;
- corrected bound-decal gizmo integration requirements;
- coexistence with the current Lob v0.99.30 script.

This audit does **not** adopt or redesign the unrelated JSON, material, paint, face-search, Photo Booth, screenshot, spin-GIF, or other utility patches that happen to share the ADP file.

## Executive conclusion

The current ADP file should remain a **legacy/external reference**, not the production architecture for Witch Dock decal posing.

The decal posing behavior is recoverable with a substantially smaller unstable integration surface:

1. Current selected decal resolution and state mutation can use named/runtime-accessible state rather than minified React closure locals.
2. The Project UI/state path already has a newer Knight Witch compatibility implementation using `UIState`, `CK.character.display.modded.orderedDecals`, and `CK.activeTweak`.
3. Full List still depends on a `heroforgeui.js` source transform in v0.99.30, but the user-facing feature can instead be owned by Witch Dock UI/catalog services.
4. Transform range expansion is currently implemented as exact `heroforgeui.js` string replacement. The underlying transform data is runtime-writable; native slider-range patching should not be preserved unless parity testing proves it is still required.
5. Project and Unequal Scaling are not self-contained in ADP. Their visible renderer behavior depends on separate Full Res `creationkit.js` support.
6. The corrected bound decal gizmo is **not present in ADP v0.99.30**. The validated v0.4.1 gizmo is a new Knight Witch reconstruction and should become a maintained component of the new posing family.
7. The exact v0.99.30 source contains both the newer runtime/DOM Project compatibility control and the older compiled React Project injection. This duplicate ownership is a conflict hazard and should not be copied.

Recommended production direction:

```text
Witch Dock Advanced Decal Posing host
    ↓
Decal posing feature service
    ↓
Shared HeroForge compatibility capabilities
    ├─ selected decal resolver
    ├─ decal state read/write
    ├─ projection state / renderer capability
    ├─ transform adapter
    ├─ projector/gizmo adapter
    └─ catalog service
    ↓
HeroForge
```

## Confirmed findings from v0.99.30

### 1. Full List control

The source creates a separate DOM-hosted Full List button and stores state in:

- `window.enabledScriptFullDecalList`
- `#kw-adp-full-list-toggle`
- `#kw-adp-full-list-row`

Toggling the control writes the global and calls `CK.activeTweak({})` as a refresh trigger.

The UI host uses broad DOM heuristics to locate the decal editor/search row and a `MutationObserver` plus resize, scroll, and focus listeners to reposition the control.

**Lifecycle defect:** this Full List IIFE has no exposed `dispose()` path. Its observer, listeners, DOM, and global survive until page reload.

### 2. Full List catalog behavior still depends on bundle transformation

The actual catalog expansion is injected into `heroforgeui.js`:

- when `window.enabledScriptFullDecalList` is true, the candidate list becomes `Object.values(CK.Options.decals)`;
- a replacement filter then excludes selected asset groups/IDs.

The current hard-coded filter policy excludes:

- IDs `722, 724, 725, 726, 727, 728, 729, 730, 731, 732, 733, 747, 878, 879, 880, 881, 882, 883, 1790, 1791`;
- groups `releases` and `environment`;
- `tokenBg` labels containing `Temple`;
- `tokenBg` labels containing `Backdrop` unless the label also contains `Tech`;
- assets with `keywords.unselectable`.

This means the button and the actual catalog behavior are split. A failed source replacement can leave an apparently working ON control without the intended expanded catalog.

### 3. Current selected decal resolver is substantially safer than the legacy compiled injection

The newer `KWADPProjectedCompat` service resolves the selected splatter decal through:

1. `UIState.editorMenu_color_decals_decals` for the selected slot label;
2. `CK.character.display.modded.orderedDecals.splatter` for current ordered metadata;
3. matching `sourceSlot === 'splatter'` and `decalSlotData.label/name`;
4. `entry.mapping` to locate the actual active splatter record;
5. `CK.activeData.decals` with fallback to `CK.character.data.decals` for state.

This eliminates the old manual alphabetic-slot assumption and should be preserved conceptually behind one shared selected-decal capability.

### 4. Project state mutation has a current runtime path

`KWADPProjectedCompat` writes `forceProjectedScript` by cloning the selected record/bucket and calling:

`CK.activeTweak({ decals: nextDecals })`

It also attempts a renderer refresh through currently named objects:

- `CK.character.display.modded.needsBake.splatter`
- `CK.character.display.colorBake.requestRefreshRegular()`
- `CK.GameLoop.requestRenderRefresh()`
- `CK.Events.emit('sliderChanged')` when available.

The service exposes `projectOn`, `projectOff`, `projectNative`, and `toggleSelected` and has an actual `dispose()` path for its observer/timers/DOM/global.

### 5. Project semantics remain tri-state in data

The current compatibility code preserves the existing field:

- `forceProjectedScript === true` — force projected;
- `forceProjectedScript === false` — force bound/unprojected;
- absent/`undefined` — native/default behavior.

The checkbox UI does not expose the three states directly, but the service API still exposes a Native operation.

### 6. Project renderer support is an external dependency

v0.99.30 explicitly documents Full Res v0.80 as the renderer consumer for `forceProjectedScript`.

The ADP file itself owns UI/state but does not contain the renderer implementation that makes the override visually meaningful. Older verified Full Res copies implement this through `creationkit.js` transformation.

**Required follow-up before maintained implementation:** audit the exact current Full Res v0.80 projected-decals renderer patch and determine whether the renderer capability can be replaced by runtime access or must enter the shared patch engine.

### 7. v0.99.30 still contains the old compiled Project/Unequal Scaling injection

Despite the newer `KWADPProjectedCompat` runtime/DOM control, the `heroforgeui.js` interceptor still attempts to replace the native Mirror React expression with injected Project and Unequal Scaling controls.

That old path depends on:

- exact compiled source text;
- minified React alias `Qr.Z`;
- closure locals `fe`, `re`, `ne`;
- a captured `decalPrefix` taken from a regex over compiled source.

The regex result is destructured without a null check:

`const [, decalPrefix] = scriptContent.match(decalRegex);`

If it does not match, the transformation throws **after the original HeroForge UI script has already been removed**.

This old path must not be migrated.

### 8. Transform range expansion is exact-string UI bundle patching

Two exact `heroforgeui.js` replacements expand current transform bounds:

- one path expands H/V/D from `±1/de` to `±6/de` and S/SY/SZ to `-6..6`;
- another path expands H/V/D and S/SY/SZ to `-6..6` from a different native range object.

A nearby patch changes `o=S[0],i=S[1]` to `o=-3,i=3`, but its exact user-visible purpose is **not proven by this audit** and must remain quarantined.

The current bound-gizmo investigation proves runtime transform writes work for the tested ranges, but does not yet prove every legacy ±6 extreme should be accepted without clamping or side effects. Production reconstruction should therefore treat range extension as a runtime/UI capability to test, not as a reason to preserve the compiled patch.

### 9. Unequal Scaling is state/UI here, renderer behavior elsewhere

ADP writes `enableUnequalScaling` through the old compiled UI path. Renderer support is external to this file.

Current live gizmo testing additionally confirmed that all scale axes can mutate HeroForge's stored/native scale values, while Project-OFF rendering visibly honors only the ordinary supported scale behavior. Amanda explicitly deferred unequal bound scaling as a later enhancement.

Disposition for initial production feature: **deferred/degraded optional capability; must not block Advanced Decal Posing.**

### 10. v0.99.30 does not contain the corrected bound gizmo

Static inspection of the exact source finds no maintained `decalLocator`/Transformer correction or equivalent projector-centered gizmo implementation.

The corrected bound gizmo validated on 2026-09-04 is a new reconstruction, not behavior copied from this file.

That distinction matters for provenance and maintenance: it belongs in the new feature family as Knight Witch compatibility behavior.

### 11. Explicit slot-schema expansion is not confirmed in this v0.99.30 file

The current source handles existing splatter mappings and expands the decal **catalog**, but this audit does not find an explicit named-runtime body/face/splatter slot-schema expansion implementation.

The repository's older provisional inventory attributed some slot expansion to Advanced Decal Posing based on earlier script versions/bulk audit. That attribution must not be treated as confirmed for v0.99.30.

True extra decal-slot/schema behavior should be audited primarily against the current HF Core Tweaks source before it is included in the production parity target.

### 12. Three short compiled replacements remain unresolved

The posing-adjacent area still contains:

- `if(ce)` → `if(false)`;
- `(!se&&!ce)` → `(false)`;
- insertion of `ge=true` after a short compiled fragment.

Their exact user-visible purpose is not established from the current source alone. They must remain unresolved/quarantined and must not enter maintained code merely because they are near the decal patches.

## Critical implementation defects in the current file

### Original `heroforgeui.js` removed before validation

The interceptor removes the original script node before fetch, match validation, transformation validation, or execution validation.

If fetch or transformation fails, HeroForge can be left without the original UI bundle.

### No transactional patch group

`replaceWithLog` reports zero-match failures but continues with a partially transformed bundle. It does not enforce:

- expected match count;
- ambiguous multi-match rejection;
- required patch groups;
- syntax validation;
- feature postconditions;
- untouched-source fallback.

### Duplicate feature ownership inside one userscript

Project currently exists in both:

- the newer runtime/DOM `KWADPProjectedCompat` service; and
- the older compiled React injection.

If the old anchor begins matching again, duplicate Project controls/handlers can coexist.

### Mixed unrelated domains

The same `heroforgeui.js` patch group also modifies character I/O, face search, catalog labels, paint policy, eye/material controls, and other unrelated behavior. One posing failure can therefore affect unrelated utilities and vice versa.

## Recommended maintained feature boundary

### User-facing family

**Proposed host feature:** `decals.advanced-posing`

This is a Witch Dock-facing grouping, not a license to collapse all implementation into one file.

### Internal components

| Component | Purpose | Initial disposition |
|---|---|---|
| selected decal capability | Resolve current slot/record/mapping | Preserve concept; move into shared bridge/service |
| `decals.catalog.full-list` | Broader decal catalog | Reconstruct without HeroForge React dependency where practical |
| `decals.catalog.filter-policy` | Explicit exclusions/blacklist | Preserve current policy initially; make data/policy separate from UI |
| `decals.transform.projected` | Project ON/OFF/Native state | Runtime service is viable; renderer capability still needs Full Res v0.80 audit |
| `decals.transform.range` | Expanded move/scale working range | Reconstruct as Witch Dock/runtime controls; do not preserve exact UI bundle patch by default |
| `decals.gizmo.bound-correction` | Replace incorrect floor gizmo for bound decals | Standalone v0.4.1 behavior validated; extract into maintained module |
| `decals.transform.unequal-scale` | Per-axis bound scaling | Deferred; does not block initial feature |
| decal slot/schema expansion | More actual decal slots/mappings | Separate follow-up audit of HF Core Tweaks; not confirmed as v0.99.30 behavior |

## Corrected bound gizmo production requirements

The validated standalone behavior should be preserved as follows:

- activate only when required runtime capabilities exist;
- for Project-OFF/bound decals, anchor to the stable projector-volume center in the shared `Character0` frame;
- use the validated screen-space Move adapter for H/V/D;
- preserve HeroForge-native rotation/scale semantics where they already work;
- keep the native `decalLocator` and its state/callback infrastructure alive;
- suppress only the incorrect native Transformer visualization while the corrected gizmo owns the view;
- remove the corrected Transformer and restore the native visualization on disable/dispose/unsupported state/appropriate projection-mode change;
- do not leave both gizmos visible;
- do not make unequal bound scaling a release blocker.

## Coexistence with Lob v0.99.30

### Confirmed current external-provider signals

v0.99.30 provides concrete detection signals:

- global `KWADPProjectedCompat`;
- DOM marker `[data-kw-adp-project-control]`;
- global `enabledScriptFullDecalList`;
- DOM IDs `kw-adp-full-list-toggle` / `kw-adp-full-list-row`.

These are useful fingerprints, but production code should not treat any single one as an eternal API contract.

### Initial arbitration recommendation

For the first independent Witch Dock implementation:

1. Witch Dock must work fully when Lob ADP is absent.
2. If current Lob posing ownership is confidently detected, **external provider wins for overlapping controls** in the first coexistence release:
   - do not mount a second Project controller;
   - do not mount a second Full List controller;
   - do not double-drive the same transform/selection state.
3. The corrected bound gizmo may operate additively in coexistence mode because v0.99.30 does not itself implement that correction, but this must be explicitly tested with Lob enabled.
4. Witch Dock must never independently patch `heroforgeui.js` while Lob's interceptor is already owning that bundle.
5. A future explicit provider handshake can allow Witch Dock to become preferred owner while a Lob script remains installed for unrelated features. That requires Lob to deliberately yield its overlapping posing subsystem; it should not be attempted through hostile runtime suppression.

## Out of scope / leave in Lob for this stage

Do not migrate in the posing pass:

- JSON Save/Load/Import;
- screenshot size/capture changes;
- Photo Booth settings or spin media;
- iris distance / roughness controls;
- paint save-count behavior;
- face-search gate changes;
- heat labels / generic catalog labels unrelated to decal selection UX;
- unexplained short compiled patches until separately investigated.

## Failure modes to test in the reconstructed feature

- required selected-decal mapping unavailable;
- Project renderer capability absent while state write remains possible;
- native gizmo off/on transitions;
- Project ON/OFF transitions while corrected gizmo is active;
- selected decal changes while gizmo is active;
- empty/deleted slot;
- page/menu remounts;
- Undo/Redo around Move/Rotate/Scale/Project;
- disable/dispose restores native gizmo visibility and removes owned listeners/DOM;
- Lob v0.99.30 enabled vs absent;
- Full Res renderer patch present vs absent;
- quiet HeroForge build change.

## Required follow-up before implementation

1. Archive this exact v0.99.30 source under immutable `/legacy/` with the provenance/hash above.
2. Audit only the current Full Res v0.80 projected/unequal renderer patches.
3. Audit current HF Core Tweaks decal slot/schema behavior if true extra decal slots are included in the first production pass.
4. Write the consolidated `decals.advanced-posing` feature specification.
5. Extract the validated bound gizmo v0.4.1 logic into maintained source/service boundaries.
6. Build one production-style standalone entrypoint from the same maintained modules intended for Witch Dock.
7. Validate without Lob.
8. Validate coexistence with this exact v0.99.30 Lob source.
9. Only then integrate into Witch Dock Dev.
10. Promote to Stable only after separate integration review.

## Audit disposition

**Recommended disposition:** decompose and reconstruct the decal posing subsystem. Do not port the v0.99.30 `heroforgeui.js` interceptor wholesale.

**Current readiness:** audit complete for the v0.99.30 ADP-side posing behavior. Two dependency audits remain before the production feature specification is complete: Full Res v0.80 renderer support and HF Core Tweaks slot/schema behavior if slots are in first-pass scope.
