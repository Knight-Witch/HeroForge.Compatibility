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
| `decals.gizmo.bound-correction` | TBD | Amanda | — | Witch Dock Stable | 2026-09-05 |

## Explicit Photo Booth ownership note

Amanda explicitly requested public Witch Dock promotion after Dev validation. That approval authorizes the consumer integration; it does **not** silently make Amanda the primary maintainer of the imported/reconstructed Lob feature. A long-term maintainer remains to be assigned before Foundation ownership/support policy is considered settled.
