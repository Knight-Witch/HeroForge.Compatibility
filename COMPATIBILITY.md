# Compatibility

Human-readable HeroForge compatibility status.

## Current State

No reconstructed feature has been validated by this repository yet.

The initial legacy audit identified likely compatibility hazards, but that audit does not constitute current HeroForge build certification.

| Component | Current status | Last verified HeroForge build | Notes |
|---|---|---|---|
| Shared compatibility bridge | Not implemented | — | Read-only capability probe is the planned first implementation stage. |
| Shared patch engine | Not implemented | — | Required before maintained bundle patching. |
| Reconstructed standalone features | None yet | — | Legacy behavior audit precedes reconstruction. |
| Witch Dock Dev integration | Not started | — | Requires standalone validation first. |
| Witch Dock Stable dependency | None | — | Public Witch Dock must remain insulated from unstable development head. |

## Capability Status Terms

- `available` — confirmed usable in the tested build.
- `unavailable` — required capability was not found or failed validation.
- `degraded` — partially usable with known limitations.
- `untested` — no current verification.

## Build Tracking Rules

When compatibility testing begins, record:

- HeroForge build identifier or fingerprint where available,
- test date,
- capability status,
- affected feature IDs,
- failure reason,
- whether fallback preserved unmodified HeroForge behavior.

A changed build fingerprint is a revalidation trigger, not automatic proof of incompatibility.