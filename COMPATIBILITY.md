# Compatibility

Human-readable HeroForge compatibility status.

## Current State

No reconstructed feature has been validated by this repository yet.

The initial legacy audit identified likely compatibility hazards, but that audit does not constitute current HeroForge build certification.

The separate private `Knight-Witch/HF-Chat-Bridge` diagnostic transport now has a v0.1 read-only scaffold. Static checks have been performed on its userscript, but no live HeroForge round-trip or current-build capability probe has been completed yet.

| Component | Current status | Last verified HeroForge build | Notes |
|---|---|---|---|
| HF-Chat-Bridge diagnostic transport | Scaffolded; unvalidated | — | External private diagnostic/control-plane repo; next gate is local setup + `bridge.ping`. |
| Shared compatibility bridge | Not implemented | — | Maintained runtime abstraction remains separate; current runtime evidence will inform its first implementation. |
| Shared patch engine | Not implemented | — | Required before maintained bundle patching. |
| Reconstructed standalone features | None yet | — | Legacy behavior audit precedes reconstruction. |
| Witch Dock Dev integration | Not started | — | Requires standalone validation first. |
| Witch Dock Stable dependency | None | — | Public Witch Dock must remain insulated from unstable development head and diagnostic transport. |

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

Results returned by HF-Chat-Bridge are diagnostic evidence. They become maintained compatibility claims only after they are reviewed and recorded in this repository's active compatibility/investigation documentation.
