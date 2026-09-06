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
| `media.screenshot-resolution` | **TBD — Lob-derived feature maintenance agreement not assigned** | Amanda | — | Standalone validated; Witch Dock Stable consumer promoted by explicit current-chat instruction; ownership exception remains open | `heroforge07.1.9.98` |
| `media.spinny-mini-webp` | **TBD — reconstructed from Lob behavior/current HeroForge media capabilities; maintenance agreement not assigned** | Amanda | — | Experimental standalone implementation; low-resolution mux proof passed; 1024 parity acceptance pending | `heroforge07.1.9.98` |
| `decals.gizmo.bound-correction` | TBD | Amanda | — | Witch Dock Stable | 2026-09-05 |

## Explicit Photo Booth ownership note

Amanda explicitly requested public Witch Dock promotion after Dev validation. That approval authorizes the consumer integration; it does **not** silently make Amanda the primary maintainer of the imported/reconstructed Lob feature. A long-term maintainer remains to be assigned before Foundation ownership/support policy is considered settled.

## Spinny Mini ownership note

The current Spinny Mini work reconstructs the user-visible capability rather than preserving Lob's broken bundle-patching implementation. Historical Lob behavior defines the initial parity target, but neither that provenance nor Amanda's testing role assigns long-term primary maintenance automatically.
