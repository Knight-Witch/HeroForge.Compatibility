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
| `rendering.texture-quality` | **Experimental standalone candidate** | Protected-2048 runtime mechanism and live 8192x6144 Blood Moon layout validated; v0.1.5 must pass actual standalone clean activation, Booth off/on recovery, disable/re-enable, and figure-change testing before any Witch Dock Dev consideration |
| ADP v0.99.30 decal posing subsystem | Reconstruction target | ADP-side audit complete; archive source, audit Full Res v0.80 renderer dependency, audit HF Core Tweaks slots if included |
| `decals.advanced-posing` Witch Dock host | Planned Witch Dock Dev candidate | Must first exist as maintained production-style standalone module and pass Lob coexistence testing for remaining overlapping features |
| Corrected bound decal gizmo | **Witch Dock Stable** | WITCH_DEV v0.4.2 behavior validated and promoted; retain regression coverage, defer unequal bound rendering/center-wireframe polish |
| Projected decal state/control | Consolidate into Advanced Decal Posing | Named runtime path confirmed; renderer capability still depends on current Full Res audit |
| Unequal bound scaling | Deferred | Useful later perk, not required for initial Advanced Decal Posing release |
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

The previous generic texture-atlas/render-override investigation is decomposed into the concrete feature ID `rendering.texture-quality`.

The maintained quality target remains bodyLower/bodyUpper/face at 2048 with valid current-figure 1024 body masks and no unrelated pre-enable allocation regression.

v0.1.3 proved more atlas area can reach the target but exposed a separate lifecycle failure: Booth/HeroForge replaced the feature-owned `buildAtlas` path while the old protected display atlas remained active, leaving incompatible display/resource atlas layouts and corrupt body/face sampling. v0.1.4 repaired that ownership/coherence contract.

On 2026-09-11, a corrected detached rectangular sweep reproduced the actual protected pre-build metadata and established the smallest current Blood Moon safe candidate:

- 8192x4096 -> BL/BU/face `1024/1024/2048`, 116 unrelated regressions;
- 8192x5120 -> `1024/1024/2048`, 116 unrelated regressions;
- **8192x6144 -> `2048/2048/2048`, zero unrelated regressions**;
- 8192x7168 -> `2048/2048/2048`, zero unrelated regressions.

The earlier post-disable rectangular sweep is not valid evidence because target `bakeSize` had already returned to 1024. This is explicitly excluded from migration decisions.

A reversible live 8192x6144 test then passed valid-mask, atlas ownership, full UV coherence, no-regression, and user visual checks. v0.1.5 therefore carries a bounded candidate ladder of 8192x4096 -> 5120 -> 6144 -> 7168 and does not retain 8192x8192 as a maintained fallback. The larger square remains historical experimental evidence, not the current migration target.

Promotion requirements before Witch Dock Dev:

- standalone v0.1.5 clean-load activation succeeds and reports BL/BU/face 2048 with no unrelated allocation regression;
- the standalone selects the smallest passing candidate; on the current Blood Moon baseline that should be 8192x6144 if the scene/baseline remains equivalent;
- a Booth off/on transition does not leave persistent body/face corruption and ends with coherent protected ownership (`display.atlas === modded.resourceAtlas === protectedAtlas`, wrapper still owned) or a bounded fresh-session recovery;
- current-figure mask discovery passes across multiple figures/body families where available;
- body/seams/paints/material channels/decals remain visually correct;
- manual disable returns the current renderer to a coherent HeroForge state, and re-enable works without reload;
- figure-change and ordinary atlas-refresh lifecycle behavior pass without stale-session reuse or recovery loops;
- fail-closed/auto-disable/error-latch behavior is acceptable;
- long-session/performance behavior is acceptable for the selected bounded rectangle;
- long-term maintenance disposition is explicitly recorded.

The detached 4096-body experiment remains experimental-only and is not bundled into the first maintained target.

## Corrected Bound Gizmo Promotion Record

The accepted production path is complete for `decals.gizmo.bound-correction`:

1. current-runtime investigation established the projector-volume anchor and direct H/V/D adaptation;
2. standalone behavior passed the defined current-build transform/lifecycle tests;
3. Witch Dock Dev native-visual behavior passed human use;
4. later WITCH_DEV repaired undo transaction behavior and Project-OFF transform initialization/preservation;
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
