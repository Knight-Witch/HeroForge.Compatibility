# HeroForge.Compatibility Master

Canonical **high-level** project status/navigation. Detailed histories belong in feature specs, investigations, evidence ledgers, and Git history.

## Repository roles

- Compatibility / reconstruction: `Knight-Witch/HeroForge.Compatibility`
- Public Witch Dock production consumer: `Knight-Witch/KnightWitch.Heroforge`
- Development-only live diagnostic transport: private `Knight-Witch/HF-Chat-Bridge`
- Public Witch Dock runtime dependency on Compatibility development head or HF-Chat-Bridge: **none**

## Current phase

Legacy feature decomposition plus current-runtime compatibility reconstruction.

Current active experimental track: `rendering.texture-quality` on branch `feature/rendering-texture-quality`.

For active work, read `ACTIVE_CONTEXT.md` on the target branch instead of deriving current state from this file or historical changelog entries.

## Feature gates

| Feature | Current state | Next gate |
|---|---|---|
| `rendering.texture-quality` | Manual high-resolution mechanism proven; active Blood Moon accessory paint/material coherence investigation; standalone v0.1.5 remains experimental | Resolve exact visible patch/generation-coherence issue, then lifecycle acceptance before Witch Dock Dev |
| `media.screenshot-resolution` | Standalone + Witch Dock Stable validated on HeroForge `heroforge07.1.9.98` | Regression only when relevant HeroForge capture topology changes; Lob-absent native UI adapter remains separate |
| `decals.gizmo.bound-correction` | Witch Dock Stable | Keep regression coverage current |
| `character.local-export` / `character.local-import` | Core standalone Save/Load passed live | Finish repeated-use/lifecycle acceptance |
| `decals.transform.projected` | Runtime state/control path confirmed | Complete renderer dependency audit/consolidation |
| shared maintained Compatibility bridge/Foundation | Planned | Extract repeated stable named-runtime access only after feature behavior is validated |

See `FEATURE_INVENTORY.md` for the full compact registry.

## Active texture investigation

Do not use this file for detailed texture findings. On `feature/rendering-texture-quality` use:

- `ACTIVE_CONTEXT.md`
- `docs/investigations/INV-0004-current-state-2026-09-12.md`
- `docs/investigations/INV-0004-evidence-ledger.md`

These files contain the protected live state, DO-NOT-REPEAT results, current exact mappings, and next diagnostic step.

## Stable milestones

- `media.screenshot-resolution`: genuine 4K/8K behavior validated standalone and in Witch Dock Stable.
- `decals.gizmo.bound-correction`: Move/Rotate/Scale + undo/redo + Project-state/artwork-transform behavior validated and promoted Stable.

## Promotion rule

`standalone/reference` → `standalone validated module` → `Witch Dock Dev` → `integration validation` → `explicit Stable promotion`.

Stable validation does not silently assign Amanda long-term maintenance of every Lob-derived/imported feature; ownership remains explicit in `OWNERSHIP.md`.
