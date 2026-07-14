# HeroForge.Compatibility

Compatibility, stabilization, and reconstruction project for unofficial HeroForge scripts and utilities.

This repository is the development laboratory for:

- auditing legacy HeroForge userscripts,
- splitting mixed legacy scripts into coherent feature modules,
- replacing brittle integration methods where practical,
- building shared HeroForge compatibility infrastructure,
- testing reconstructed features as standalone Tampermonkey scripts,
- and preparing validated modules for possible Witch Dock Dev integration.

This is **not** the public Witch Dock production repository. Nothing in this repository is automatically approved for public distribution or Witch Dock Stable.

## Development path

`legacy reference` → `standalone reconstructed module` → `shared compatibility bridge` → `Witch Dock Dev` → `separate stable promotion review`

## Start here

1. Read [`PROJECT_CONTRACT.md`](./PROJECT_CONTRACT.md).
2. Read [`MASTER.md`](./MASTER.md) for current project state.
3. Read [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the intended technical direction.
4. Check [`FEATURE_INVENTORY.md`](./FEATURE_INVENTORY.md) before creating or renaming a feature.
5. Check [`PRE_FLIGHT_Check.md`](./PRE_FLIGHT_Check.md) and [`CHANGELOG.md`](./CHANGELOG.md) before committed work.

## Canonical tracking

- `PROJECT_CONTRACT.md` — binding development rules.
- `MASTER.md` — current project state, active work, blockers, and migration queue.
- `ARCHITECTURE.md` — intended architecture and system boundaries.
- `FEATURE_INVENTORY.md` — canonical feature IDs and provisional feature map.
- `COMPATIBILITY.md` — HeroForge build and feature compatibility status.
- `OWNERSHIP.md` — maintenance ownership and review responsibilities.
- `MIGRATION_PLAN.md` — disposition and Witch Dock promotion status.
- `TESTING.md` — standalone, compatibility, and integration test requirements.
- `docs/` — audits, feature specifications, investigations, and decisions.
- `legacy/` — immutable source/reference material.
- `tests/` — fixtures, compatibility tests, and reports.

## Relationship to Witch Dock

The public Witch Dock repository is `Knight-Witch/KnightWitch.Heroforge`.

HeroForge.Compatibility is an upstream development and compatibility project. Public Witch Dock must not depend on the unstable head of this repository.