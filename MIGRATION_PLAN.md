# Migration Plan

This file tracks the intended disposition of reconstructed features.

## Integration Principle

Nothing is automatically migrated into Witch Dock.

Required path:

`legacy reference` → `standalone reconstructed module` → `standalone validated` → `Witch Dock Dev candidate` → `Witch Dock Dev testing` → `explicit stable promotion review`

## Valid Dispositions

- Remain standalone
- Witch Dock Dev candidate
- Witch Dock Stable candidate
- Experimental only
- External dependency/reference
- Deprecated
- Rejected

## Current Migration State

| Area | Current disposition | Reason / next gate |
|---|---|---|
| ADP v0.99.30 decal posing subsystem | Reconstruction target | ADP-side audit complete; archive source, audit Full Res v0.80 renderer dependency, audit HF Core Tweaks slots if included |
| `decals.advanced-posing` Witch Dock host | Planned Witch Dock Dev candidate | Must first exist as maintained production-style standalone module and pass Lob coexistence testing |
| Corrected bound decal gizmo | Standalone validated experiment | Extract v0.4.1 behavior into maintained module, suppress/restore native floor gizmo, then retest |
| Projected decal state/control | Consolidate into Advanced Decal Posing | Named runtime path confirmed; renderer capability still depends on current Full Res audit |
| Unequal bound scaling | Deferred | Product decision: useful later perk, not required for initial Advanced Decal Posing release |
| Decal Full List/filtering | Consolidate into Advanced Decal Posing | Current behavior confirmed; target should avoid native React/bundle dependency where practical |
| Decal slot/schema expansion | Pending dependency audit | Current v0.99.30 does not confirm schema expansion; audit HF Core Tweaks before inclusion |
| Camera bounds | Standalone reconstruction candidate | Lower-risk runtime feature suitable for later lifecycle testing |
| Extra mini slots | Standalone reconstruction candidate | Named runtime surface; must preserve original behavior while making override reversible where possible |
| Character local I/O | Standalone reconstruction committed | Core Save/Load passed live; finish lifecycle/repeated-use acceptance before promotion |
| Photo Booth settings I/O | Standalone reconstruction candidate | Requires current runtime capability validation |
| Texture atlas/render overrides | Experimental only pending audit | High-risk creationkit bundle behavior |
| ReCK for Hero Forge | External reference | Not Lob-authored; do not silently absorb |
| Public Witch Dock | No dependency | Stable repository remains isolated until explicit promotion |

## Coexistence Gate for Advanced Decal Posing

Before Witch Dock Dev integration, test two environments:

1. Witch Dock/standalone posing provider with Lob ADP absent.
2. The same provider with exact Lob v0.99.30 present.

Initial coexistence policy should allow the external Lob provider to win for overlapping Project/Full List controls while allowing the corrected gizmo to run only when proven non-conflicting. Do not allow two controllers to write the same posing feature simultaneously.

A later explicit provider handshake may allow Witch Dock to become preferred owner while Lob remains installed for unrelated features.

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
