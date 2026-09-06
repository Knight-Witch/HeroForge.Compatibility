# Ownership

This project must not silently make Amanda responsible for every imported feature.

## Roles

- Primary maintainer: first responder for feature-specific breakage.
- Reviewer: architecture/integration review.
- Backup maintainer: optional secondary maintainer.
- External owner: source remains externally maintained/reference-only.

## Project-level ownership

| Area | Primary maintainer | Reviewer | Status |
|---|---|---|---|
| Repository contract/architecture | Amanda | Amanda | Active |
| HF-Chat-Bridge diagnostic transport | TBD | Amanda | External development infrastructure |
| Shared compatibility bridge/Foundation | TBD | Amanda | Not implemented |
| Lob-derived reconstructed features | TBD; expected collaboration with Lob | Amanda | Ownership not automatically assigned |
| Witch Dock production integration | Amanda | Amanda | External consumer integration |

## Feature ownership

| Feature ID | Primary maintainer | Reviewer | Backup | Maintenance status | Last verified HF build |
|---|---|---|---|---|---|
| `media.screenshot-resolution` | **TBD — Lob-derived feature maintenance agreement not assigned** | Amanda | — | Standalone validated; Witch Dock Stable consumer promoted by explicit approval; ownership exception remains open | `heroforge07.1.9.98` |
| `media.spinny-mini-webp` | **TBD — reconstructed from Lob behavior/current HeroForge media capabilities; maintenance agreement not assigned** | Amanda | — | Tested 1024/2048 standalone profiles validated; current 3072 true-resolution fidelity failed; Short Test diagnostic companion pending live validation; no Witch Dock integration yet | `heroforge07.1.9.98` |
| `decals.gizmo.bound-correction` | TBD | Amanda | — | Witch Dock Stable | 2026-09-05 |

## Spinny Mini ownership note

The current Spinny Mini work reconstructs user-visible capability rather than preserving Lob's broken bundle-patching implementation. Historical Lob behavior defines the initial parity target, but neither that provenance nor Amanda's testing role assigns long-term primary maintenance automatically.

The new Short Test companion is **diagnostic scaffolding**, not a separately owned production feature. Its existence does not create an additional maintenance obligation and it should be retired or folded back into maintained testing infrastructure once the high-resolution render path is understood.

Successful lower-resolution standalone validation does not itself approve Witch Dock integration or assign long-term support. The failed 3072 fidelity gate must be resolved or explicitly deferred before integration scope is finalized.
