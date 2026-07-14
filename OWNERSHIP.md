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
- Ownership must be recorded before stable promotion.
- Last verified HeroForge build should be tracked for maintained features and patches.

## Feature Ownership Table

Populate after legacy import and feature-boundary confirmation.

| Feature ID | Primary maintainer | Reviewer | Backup | Maintenance status | Last verified HF build |
|---|---|---|---|---|---|
| _pending_ | — | — | — | Unassigned | — |