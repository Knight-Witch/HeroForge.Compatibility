# Migration Plan

This file tracks the intended disposition of reconstructed features.

## Integration Principle

Nothing is automatically migrated into Witch Dock.

Required path:

`legacy reference or runtime investigation` → `standalone reconstructed module` → `standalone validated` → `Witch Dock Dev candidate` → `Witch Dock Dev testing` → `explicit stable promotion review`

The corrected bound decal gizmo is the first current decal reconstruction to complete that path. Its production copy lives in `Knight-Witch/KnightWitch.Heroforge`; public Witch Dock does not load runtime code from this repository.

## Valid Dispositions

- Remain standalone
- Witch Dock Dev candidate
- Witch Dock Stable candidate
- Witch Dock Stable
- Experimental only
- External dependency/reference
- Deprecated
- Rejected

## Current Migration State

| Area | Current disposition | Reason / next gate |
|---|---|---|
| `rendering.texture-quality` | **Experimental standalone candidate** | Runtime protected-2048 mechanism validated on D4 + Blood Moon; clean-load standalone enable/disable/figure-change testing required before any Witch Dock Dev consideration |
| ADP v0.99.30 decal posing subsystem | Reconstruction target | ADP-side audit complete; archive source, audit Full Res v0.80 renderer dependency, audit HF Core Tweaks slots if included |
| `decals.advanced-posing` Witch Dock host | Planned Witch Dock Dev candidate | Must first exist as maintained production-style standalone module and pass Lob coexistence testing for remaining overlapping features |
| Corrected bound decal gizmo | **Witch Dock Stable** | WITCH_DEV v0.4.2 behavior validated and promoted; retain regression coverage, defer unequal bound rendering/center-wireframe polish |
| Projected decal state/control | Consolidate into Advanced Decal Posing | Named runtime path confirmed; renderer capability still depends on current Full Res audit |
| Unequal bound scaling | Deferred | Product decision: useful later perk, not required for initial Advanced Decal Posing release |
| Decal Full List/filtering | Consolidate into Advanced Decal Posing | Current behavior confirmed; target should avoid native React/bundle dependency where practical |
| Decal slot/schema expansion | Pending dependency audit | Current v0.99.30 does not confirm schema expansion; audit HF Core Tweaks before inclusion |
| Camera bounds | Standalone reconstruction candidate | Lower-risk runtime feature suitable for later lifecycle testing |
| Extra mini slots | Standalone reconstruction candidate | Named runtime surface; must preserve original behavior while making override reversible where possible |
| Character local I/O | Standalone reconstruction committed | Core Save/Load passed live; finish lifecycle/repeated-use acceptance before promotion |
| Photo Booth settings I/O | Standalone reconstruction candidate | Requires current runtime capability validation |
| Texture atlas/render overrides | Replaced by concrete `rendering.texture-quality` track | Generic bucket decomposed after current-runtime audit; detached 4096-body work remains experimental-only |
| ReCK for Hero Forge | External reference | Not Lob-authored; do not silently absorb |
| Public Witch Dock | Bound gizmo promoted; otherwise no dependency on Compatibility head | Continue explicit per-feature promotion only after Dev validation |

## Protected Texture Quality Gate

The previous generic texture-atlas/render-override investigation has now been decomposed into the concrete feature ID `rendering.texture-quality`.

Promotion requirements before Witch Dock Dev:

- standalone v0.1.0 enable/disable passes from a clean load;
- current-figure mask discovery passes across multiple figures/body families where available;
- no unrelated slot allocation regression is detected;
- body/seams/paints/material channels/decals remain visually correct;
- figure-change and ordinary atlas-refresh lifecycle behavior pass;
- fail-closed/auto-disable behavior is acceptable;
- long-term maintenance disposition is explicitly recorded.

The detached 4096-body experiment remains experimental-only and is not bundled into the first maintained target.

## Corrected Bound Gizmo Promotion Record

The accepted production path is now complete for `decals.gizmo.bound-correction`:

1. current-runtime investigation established the projector-volume anchor and direct H/V/D adaptation;
2. standalone v0.4.1 behavior passed the defined current-build transform/lifecycle tests;
3. Witch Dock Dev native-visual v0.3.1 behavior passed human use after a duplicate Dev script was removed;
4. later WITCH_DEV v0.4.0-v0.4.2 repaired undo transaction behavior and Project-OFF transform initialization/preservation;
5. v0.4.2 passed Move/Rotate/Scale undo-redo, Project memory, bound artwork swap, and fresh-slot initialization tests;
6. the repair was promoted to Witch Dock Stable in commit `1712b0ba24c8303d8d446d88cdf66199978045e7`.

No broader Advanced Decal Posing feature is implicitly approved by this promotion.

## Coexistence Gate for Advanced Decal Posing

Before additional overlapping Witch Dock Dev integration, test two environments:

1. Witch Dock/standalone posing provider with Lob ADP absent.
2. The same provider with exact Lob v0.99.30 present.

Provider ownership for Project/Full List and other overlapping controls still requires explicit arbitration. The already-stable corrected gizmo should not be destabilized merely to force the rest of ADP into the same migration unit.

## Promotion Requirements

Before Witch Dock Dev:

- behavior parity documented;
- required capabilities known;
- standalone tests passed;
- disable/unload behavior tested;
- Lob coexistence behavior tested for overlapping decal posing;
- owner assigned or maintenance status explicitly accepted.

Before Witch Dock Stable:

- Witch Dock Dev interaction tests passed;
- no unresolved core conflicts;
- compatibility status current;
- failure behavior acceptable;
- explicit promotion decision recorded.
