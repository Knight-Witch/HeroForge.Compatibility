# Compatibility

Human-readable HeroForge compatibility status.

## Current State

No reconstructed feature has been validated by this repository yet.

The initial legacy audit identified likely compatibility hazards, but that audit does not constitute current HeroForge build certification.

The separate private `Knight-Witch/HF-Chat-Bridge` v0.1 diagnostic transport is now live-validated for the tested read-only request path. Current-build runtime capability probing is active, but no diagnostic observation has yet been promoted into a maintained compatibility capability contract.

| Component | Current status | Last verified HeroForge build | Notes |
|---|---|---|---|
| HF-Chat-Bridge diagnostic transport | Read-only transport validated | Current live page on 2026-09-03; build ID not yet captured | `bridge.ping` and `runtime.listScripts` passed; relay v0.1.2 duplicate guard passed retest. |
| Shared compatibility bridge | Not implemented | — | Maintained runtime abstraction remains separate; live capability evidence will inform its first implementation. |
| Shared patch engine | Not implemented | — | Required before maintained bundle patching. |
| Reconstructed standalone features | None yet | — | Legacy behavior audit precedes reconstruction. |
| Witch Dock Dev integration | Not started | — | Requires standalone validation first. |
| Witch Dock Stable dependency | None | — | Public Witch Dock must remain insulated from unstable development head and diagnostic transport. |

## Current Diagnostic Evidence

Confirmed through the live read-only bridge on 2026-09-03:

- HeroForge page context is accessible.
- Current external HeroForge resources include `ckvendor.js`, `renderkit.js`, `shaderkit.js`, `hfuivendor.js`, `extras.js`, `materialui.js`, `accounts.js`, and `community.js`.
- `runtime.listScripts` returned 27 external script URLs without truncation.

Not yet confirmed:

- stable named runtime API surfaces suitable for the maintained bridge;
- readiness timing for those capabilities;
- a HeroForge build identifier/fingerprint suitable for durable compatibility tracking.

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
