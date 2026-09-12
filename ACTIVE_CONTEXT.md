# Active Context — `main`

**Updated:** 2026-09-12  
**Branch role:** stable/project-level baseline and navigation  
**Current active experimental investigation:** `rendering.texture-quality` on branch `feature/rendering-texture-quality`

## Minimum bootstrap on main

For material work on `main`:

1. read `PROJECT_CONTRACT.md`;
2. read this file;
3. identify the target feature/task;
4. load only the policy/spec/source/tracking files relevant to that target.

Do not automatically reread full changelog/preflight/history/root docs.

## Route active feature work to its branch

If the task is the current texture-quality/Blood Moon investigation, do **not** work from `main` documentation. Switch/read branch `feature/rendering-texture-quality` and begin with that branch's `ACTIVE_CONTEXT.md`.

That branch contains the current protected runtime state, INV-0004 current-state checkpoint, evidence ledger, and DO-NOT-REPEAT results.

## Main stable/current project state

Use `MASTER.md` and `FEATURE_INVENTORY.md` when repo-wide current status or feature IDs are actually needed. Current Stable milestones include Photo Booth true-resolution capture and the corrected bound decal gizmo; experimental/in-progress reconstruction remains branch/feature-specific.

## Repository boundaries

- `HeroForge.Compatibility` owns maintained feature reconstruction/investigation.
- private `HF-Chat-Bridge` is development diagnostic/control infrastructure only.
- `KnightWitch.Heroforge` owns public Witch Dock production/releases.

Healthy routine Bridge use does not require loading Bridge repository docs. Read them only when the transport itself is being modified/debugged.

## Context rule

This file is a router, not a history. When another feature becomes the primary active branch, update the route/pointers here rather than appending its full investigation narrative.
