# Ownership

This project must not silently make Amanda responsible for every imported feature.

## Ownership Roles

- **Primary maintainer** — expected first responder for feature-specific breakage.
- **Reviewer** — approves architecture-sensitive or integration-sensitive changes.
- **Backup maintainer** — optional secondary maintainer.
- **External owner** — source remains externally maintained; this project may reference or integrate without claiming ownership.

## Current Project-Level Ownership

| Area | Primary maintainer | Reviewer | Status |
|---|---|---|---|
| Repository contract and architecture | Amanda | Amanda | Active |
| Shared compatibility bridge | TBD | Amanda | Not implemented |
| Shared patch engine | TBD | Amanda | Not implemented |
| Lob-derived feature modules | TBD; expected collaboration with Lob | Amanda | Ownership not assigned |
| Witch Dock production integration | Amanda | Amanda | External to this repository |
| ReCK for Hero Forge | arm32x / external | N/A | External reference only |

## Rules

- A feature without a maintainer is not automatically eligible for stable integration.
- Lob may maintain feature modules or patch definitions without receiving unrestricted authority over Witch Dock production code.
- Clover's compatibility work may be used as evidence or reviewed contribution without silently assigning long-term maintenance responsibility.
- Ownership must be recorded before stable promotion.
- Last verified HeroForge build should be tracked for maintained features and patches.
- Amanda acting as reviewer or test operator does not automatically make Amanda the primary maintainer.

## Feature Ownership Table

| Feature ID | Primary maintainer | Reviewer | Backup | Maintenance status | Last checked HF build |
|---|---|---|---|---|---|
| `character.local-file-io` | TBD | Amanda | — | Standalone test; unassigned | `heroforge08.1.9.74` |
| `photo-booth.settings-file-io` | TBD | Amanda | — | Standalone test; unassigned | `heroforge08.1.9.74` |
| `decals.transform.projected` | TBD; expected Lob/Clover collaboration where applicable | Amanda | — | Critical experimental standalone; unassigned | `heroforge08.1.9.74` |
| `decals.transform.unequal-scale` | Same owner as projected transform | Amanda | — | Coupled critical experimental feature | `heroforge08.1.9.74` |
| Shared patch engine | TBD | Amanda | — | Required before broader maintained patching | — |

## Promotion Constraint

The three Stage 1 modules may remain standalone and experimental while ownership is unresolved. Passing technical tests alone does not assign maintenance responsibility or authorize Witch Dock integration.
