# ADR-0002 — Immutable Legacy Sources

**Status:** Accepted  
**Date:** 2026-07-13

## Decision

All original legacy and third-party source references are preserved unchanged under `/legacy/`.

## Context

The project must compare reconstructed behavior against original working scripts and preserve forensic evidence of brittle or unsafe implementation choices.

## Reason

Editing originals destroys the ability to distinguish legacy behavior from later interpretation or repair.

## Consequences

- Never edit files under `/legacy/`.
- Corrections and rewrites live in maintained source directories.
- Provenance must be recorded where known.
- Third-party sources remain clearly separated from Lob- and Knight Witch-authored material.