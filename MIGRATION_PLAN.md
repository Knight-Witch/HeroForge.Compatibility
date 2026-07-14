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
| All Lob-derived legacy features | Audit/reconstruction pool | Must be split into coherent features and tested independently. |
| Camera bounds | Standalone reconstruction candidate | Lower-risk runtime feature suitable for early lifecycle testing. |
| Extra mini slots | Standalone reconstruction candidate | Named runtime surface; must preserve original behavior while making override reversible where possible. |
| Character local I/O | Standalone reconstruction candidate | Good candidate for independent UI rather than native React injection. |
| Photo Booth settings I/O | Standalone reconstruction candidate | Requires current runtime capability validation. |
| Projected/unequal decals | Experimental reconstruction candidate | Cross-bundle dependency and renderer behavior require deeper investigation. |
| Texture atlas/render overrides | Experimental only pending audit | High-risk creationkit bundle behavior. |
| ReCK for Hero Forge | External reference | Not Lob-authored; do not silently absorb. |
| Public Witch Dock | No dependency | Stable repository remains isolated. |

## Promotion Requirements

Before Witch Dock Dev:

- behavior parity documented,
- required capabilities known,
- standalone tests passed,
- disable/unload behavior tested,
- owner assigned or maintenance status explicitly accepted.

Before Witch Dock Stable:

- Witch Dock Dev interaction tests passed,
- no unresolved core conflicts,
- compatibility status current,
- failure behavior acceptable,
- explicit promotion decision recorded.