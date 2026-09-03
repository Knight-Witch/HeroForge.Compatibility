# Compatibility

Human-readable HeroForge compatibility status.

## Current State

No reconstructed feature has been validated by this repository yet.

The initial legacy audit identified likely compatibility hazards, but that audit does not constitute current HeroForge build certification.

The separate private `Knight-Witch/HF-Chat-Bridge` v0.1 diagnostic transport is live-validated for the tested read-only request path. The first bounded capability probe is complete, but diagnostic observations have not yet been promoted into maintained compatibility capability contracts.

| Component | Current status | Last verified HeroForge build | Notes |
|---|---|---|---|
| HF-Chat-Bridge diagnostic transport | Read-only transport validated | Current live page on 2026-09-03; build ID not yet captured | `bridge.ping`, duplicate-request regression, `runtime.listScripts`, and first `runtime.capabilityProbe` passed. |
| Shared compatibility bridge | Not implemented | — | Named `HF` / `CK` runtime surfaces are promising diagnostic candidates, but semantics/stability remain unproven. |
| Shared patch engine | Not implemented | — | Required before maintained bundle patching. |
| Reconstructed standalone features | None yet | — | Legacy behavior audit precedes reconstruction. |
| Witch Dock Dev integration | Not started | — | Requires standalone validation first. |
| Witch Dock Stable dependency | None | — | Public Witch Dock must remain insulated from unstable development head and diagnostic transport. |

## Current Diagnostic Evidence

Confirmed through the live read-only bridge on 2026-09-03:

- HeroForge page context is accessible.
- Top-level `HF` is available as a function object with named properties including `settings`, `loadedData`, `finishedLoading`, `Data`, `ThreeCharacters`, and `CustomFace`.
- Top-level `CK` is available as a function object with a large bounded named surface including `toJson`, `fromJson`, `addUndoPoint`, `undo`, `redo`, `freeCamera`, `display`, `data`, `tweak`, and related operations.
- `TN`, `BT`, and `THREE` were unavailable as top-level globals in the tested page state.
- `React` and `ReactDOM` were available.
- `CK.display` is an accessor/getter; generic `runtime.describePath` correctly blocked traversal rather than invoking it.
- Current external HeroForge resources include `ckvendor.js`, `renderkit.js`, `shaderkit.js`, `hfuivendor.js`, `extras.js`, `materialui.js`, `accounts.js`, `community.js`, and `gated/advimport.js`.

Detailed evidence: `docs/investigations/INV-0001-live-runtime-capability-probe-2026-09-03.md`.

## Not Yet Confirmed

- Stability of the observed `HF` / `CK` names across builds.
- Semantics and side effects of the observed methods/accessors.
- Readiness timing for maintained capability use.
- A durable HeroForge build identifier/fingerprint.
- Whether specific legacy bundle patches can be replaced by runtime access without behavior loss.

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
