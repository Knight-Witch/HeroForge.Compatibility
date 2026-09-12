# Testing

Shared test framework and current acceptance pointers. Detailed per-feature test history belongs in feature specs/investigations/evidence ledgers; do not use this file as a duplicate narrative log.

## Default progression

`standalone/reference` → `standalone acceptance` → `Witch Dock Dev` → `integration regression` → `explicit Stable promotion`.

Public Witch Dock is not the primary experimental environment.

## Common acceptance dimensions

Use only those relevant to the feature, but explicitly account for material dimensions:

- basic function and repeated use;
- undo/redo/history where applicable;
- persistence/save/reload/import/export where applicable;
- enable/disable/dispose/required-refresh behavior;
- dependency/capability failure behavior;
- related-feature interaction;
- Witch Dock Dev integration behavior before Stable;
- current HeroForge build/capability compatibility;
- performance/resource behavior if materially affected;
- human visual validation when appearance is part of the requirement.

Runtime structural checks cannot substitute for human visual acceptance of appearance.

## Active feature pointers

### `rendering.texture-quality`

Current acceptance state and DO-NOT-REPEAT results live in:

- `ACTIVE_CONTEXT.md` on `feature/rendering-texture-quality`;
- `docs/investigations/INV-0004-current-state-2026-09-12.md`;
- `docs/investigations/INV-0004-evidence-ledger.md`;
- `docs/investigations/INV-0004-texture-atlas-quality-2026-09-10.md` for full historical mechanism proof.

Current broad gate: resolve accessory paint/material-channel coherence and native renderer-generation reconciliation before rewriting/promoting the standalone; then run clean activation, Booth lifecycle, disable/re-enable, figure-change, and performance acceptance before Witch Dock Dev.

Do not re-run generic physical/physical2/emissive rebakes, prior candidate color-cache invalidation, accessory skinMask sync, or other ledger DO-NOT-REPEAT paths without new evidence.

### `media.screenshot-resolution`

Standalone and Witch Dock Stable are validated on the current recorded HeroForge `heroforge07.1.9.98` family. Re-run only when relevant Photo Booth/Effects/tile/capture topology materially changes or a native replacement path appears.

### `decals.gizmo.bound-correction`

Witch Dock Stable. Keep Move/Rotate/Scale undo/redo and Project/artwork-transform regressions covered when relevant decal internals change.

### character JSON / projected decals

Core local Save/Load passed live; repeated-use/lifecycle remains pending. Projected decal state/control is confirmed; renderer dependency audit remains pending.

## Bundle/fixture tests

For bundle transforms, validate expected match count/context, parsing before/after where applicable, required postconditions, duplicate insertion/idempotency where expected, and retained fixtures/builds. Fixture success does not replace live runtime testing.

## Regression triggers

Re-run a feature only when its relevant HeroForge surface changes, its active investigation identifies a new necessary discriminator, or a regression is observed. A global build/fingerprint change is a trigger to inspect affected capabilities, not proof every feature must be fully retested.

Detailed testing/release policy: `docs/policies/FEATURE_LIFECYCLE_TESTING_RELEASE.md`.
