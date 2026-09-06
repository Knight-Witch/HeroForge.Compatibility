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
| `media.spinny-mini-webp` | **TBD — reconstructed from Lob behavior/current HeroForge media capabilities; maintenance agreement not assigned** | Amanda | — | **Standalone v0.3.0 validated for tested production profiles; Pause/interaction guards next; no Witch Dock Spinny integration yet** | `heroforge07.1.9.98` |
| `decals.gizmo.bound-correction` | TBD | Amanda | — | Witch Dock Stable | 2026-09-05 |

## Spinny Mini ownership note

The current Spinny Mini work reconstructs user-visible capability rather than preserving Lob's broken bundle-patching implementation. Historical Lob behavior defines the initial parity target, but neither that provenance nor Amanda's testing role assigns long-term primary maintenance automatically.

Short Test is a maintained **diagnostic operation of the Spinny feature**, not a separately owned production feature.

Ownership implications:

- the Spinny service owns both full capture and `captureShortTest()`;
- future Witch Dock Developer Mode may expose/hide the Short Test control, but Developer Mode does not own the media behavior;
- the old standalone Short Test and TRUE-3K companion files remain historical validation scaffolding/reference and do not create separate long-term maintenance obligations;
- successful standalone validation does not itself approve Witch Dock Stable integration or assign permanent maintenance responsibility;
- Pause/interaction guards remain part of the Spinny feature safety/lifecycle responsibility, not a separate user-facing feature.
