# ADR-0001 — Separate Compatibility Repository

**Status:** Accepted  
**Date:** 2026-07-13

## Decision

Develop HeroForge script stabilization and compatibility infrastructure in `Knight-Witch/HeroForge.Compatibility`, separate from the public Witch Dock repository.

## Context

The work includes legacy source archival, invasive compatibility experiments, standalone Tampermonkey reconstruction, patch-engine development, and features that may never belong in Witch Dock.

The existing Witch Dock repository is a live production/distribution repository.

## Reason

A separate repository provides:

- a safer experimental boundary,
- cleaner documentation and ownership,
- collaboration without broad production access,
- freedom to reject or retain standalone features,
- and an explicit promotion boundary into Witch Dock.

## Consequences

- Witch Dock is an external consumer.
- Public Witch Dock must not depend on the unstable head of this repository.
- Validated features require explicit Witch Dock Dev integration and later stable promotion review.