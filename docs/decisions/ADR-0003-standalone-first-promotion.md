# ADR-0003 — Standalone-First Reconstruction and Promotion

**Status:** Accepted  
**Date:** 2026-07-13

## Decision

Reconstructed features are tested as isolated Tampermonkey modules before Witch Dock integration.

## Context

Direct experimentation inside public Witch Dock would make failures harder to isolate and could create conflicts with established tools.

## Reason

Standalone tests provide:

- clear failure isolation,
- direct parity comparison,
- easier enable/disable testing,
- and a safer environment for compatibility work.

## Consequences

The integration path is:

`legacy reference` → `standalone reconstructed module` → `standalone validated` → `Witch Dock Dev` → `explicit stable promotion`

Public Witch Dock is not the primary experimental environment.