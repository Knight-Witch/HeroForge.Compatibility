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
| `media.screenshot-resolution` | **TBD — Lob-derived feature maintenance agreement not assigned** | Amanda | — | Standalone validated; Witch Dock Stable consumer promoted and validated by explicit approval; ownership exception remains open | `heroforge07.1.9.98` |
| `media.spinny-mini-webp` | **TBD — reconstructed from Lob behavior/current HeroForge media capabilities; maintenance agreement not assigned** | Amanda | — | Standalone v0.5.0 validated; Witch Dock Dev validated; public Witch Dock v1.2.0 promoted with unchanged Stable Spinny source; clean public smoke pending | `heroforge07.1.9.98` |
| `decals.gizmo.bound-correction` | TBD | Amanda | — | Witch Dock Stable; controls hosted by Utilities, feature runtime unchanged | 2026-09-06 |

## Spinny Mini ownership note

The current Spinny Mini work reconstructs user-visible capability rather than preserving Lob's broken bundle-patching implementation. Historical Lob behavior defines the initial parity target, but neither that provenance nor Amanda's testing/integration role assigns long-term primary maintenance automatically.

Full capture, Short Test, Pause/Resume, interaction guards, TRUE-3K repair and animated-WebP serialization are one maintained feature family, not separately owned utilities.

Ownership implications:

- the Spinny service owns full capture and `captureShortTest()`;
- Witch Dock UI owns presentation only;
- Developer Mode, now present in public Witch Dock v1.2.0 as an optional About toggle, controls Short Test visibility/diagnostics only and does not own media behavior;
- old standalone Short Test / TRUE-3K companion files remain historical validation scaffolding/reference;
- public Stable promotion does not by itself assign Amanda permanent primary-maintainer responsibility;
- public Witch Dock v1.2.0 remains a consumer copy/host of the validated feature; its UI/diagnostic promotion does not transfer long-term feature ownership away from this compatibility project;
- future breakage should first be classified as feature behavior, HeroForge compatibility, public-host integration, or download-host integration before maintenance responsibility is assigned.

## Current Spinny disposition

- standalone maintained implementation: validated;
- Witch Dock Dev consumer: validated;
- original public Spinny promotion: `8d96dd803f452c3c7b623c6963b4fdb3ef762f59`;
- current public Witch Dock v1.2.0 host/UI/module release: `9fa5c52fdbe2de220457a961be05e633d4b89349`;
- clean public v1.2.0 smoke: pending;
- long-term primary maintainer: still TBD.
