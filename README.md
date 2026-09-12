# HeroForge.Compatibility

Compatibility, stabilization, reverse-engineering, and reconstruction project for unofficial HeroForge scripts/utilities.

This repository is the development laboratory, **not** public Witch Dock production.

## Development path

`legacy/reference` → `standalone reconstructed/experimental module` → `standalone validation` → `Witch Dock Dev` → `integration validation` → `explicit Stable promotion`

## Start here — context-efficient bootstrap

For material work:

1. Read [`PROJECT_CONTRACT.md`](./PROJECT_CONTRACT.md).
2. Read [`ACTIVE_CONTEXT.md`](./ACTIVE_CONTEXT.md) on the branch being worked.
3. Follow the routes in `ACTIVE_CONTEXT.md` to only the relevant policy/spec/investigation/source files.
4. Inspect the target file and directly connected modules before editing.

Do **not** automatically read every root tracking file, the full changelog, or historical preflight logs.

## Durable memory layers

- `PROJECT_CONTRACT.md` — compact binding rules.
- `ACTIVE_CONTEXT.md` — branch/task router and protected current state.
- `MASTER.md` — compact repo-wide status/navigation.
- `FEATURE_INVENTORY.md` — compact canonical feature registry.
- `docs/policies/` — detailed rules loaded only when relevant.
- `docs/feature-specs/` — feature behavior/architecture/acceptance.
- `docs/investigations/` — technical investigations and evidence ledgers.
- `CHANGELOG.md` — committed change history; search/fetch relevant entries rather than rereading all history.
- `PRE_FLIGHT_Check.md` — compact current operational preflight log; historical detail remains in Git history.
- `ARCHITECTURE.md` — repo-wide architecture boundaries only.
- `COMPATIBILITY.md`, `OWNERSHIP.md`, `MIGRATION_PLAN.md`, `TESTING.md` — domain tracking, read when the task affects that domain.
- `legacy/` — immutable source/reference material.

## Current active work

Texture-quality work currently lives on `feature/rendering-texture-quality`. On that branch, `ACTIVE_CONTEXT.md` routes to the current INV-0004 checkpoint/evidence ledger and records the live Blood Moon state that must be preserved.

## Repository boundaries

- `Knight-Witch/HeroForge.Compatibility` — maintained compatibility/reconstruction work and feature investigations.
- private `Knight-Witch/HF-Chat-Bridge` — development diagnostic/control transport only.
- `Knight-Witch/KnightWitch.Heroforge` — public Witch Dock production code/releases.

Public Witch Dock and maintained feature modules must not depend at runtime on HF-Chat-Bridge or an unstable Compatibility development branch.

## ChatGPT Project instructions

A compact paste-ready Project-instructions template lives at [`docs/policies/CHATGPT_PROJECT_INSTRUCTIONS.md`](./docs/policies/CHATGPT_PROJECT_INSTRUCTIONS.md). Repository changes do not modify ChatGPT Project settings automatically.
