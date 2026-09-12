# Feature Lifecycle, Testing, Ownership, and Release Policy

Load this policy when creating/reconstructing a feature, changing lifecycle behavior, planning tests, assigning ownership, versioning userscripts, or promoting into Witch Dock.

## Feature boundaries and metadata

Organize maintained code by actual feature/domain boundaries, not legacy filenames. Do not keep unrelated behavior coupled because the legacy source did.

Each maintained/reconstructed feature should document, as relevant:

- stable feature ID, title, purpose, and legacy source(s);
- risk level and disposition;
- required/optional capabilities and feature dependencies;
- current implementation and intended implementation;
- default enabled state;
- initialize/enable/disable/dispose or restore behavior;
- reload requirements;
- persistence expectations;
- compatibility status and last verified HeroForge build;
- primary maintainer, reviewer, and backup maintainer where applicable.

Valid dispositions include standalone, Witch Dock Dev candidate, Stable candidate, experimental only, external dependency, deprecated, and rejected.

## Lifecycle ownership

Where technically possible, features should support initialize, enable, disable, and dispose/restore.

Disable/dispose should remove or restore owned:

- listeners and subscriptions;
- mutation observers;
- timers/intervals;
- injected DOM/styles;
- wrappers/temporary globals;
- runtime overrides and owned patches.

A checkbox that merely hides UI does not count as disabling a feature.

If a feature cannot safely unload in-session, document what remains active, why, and whether refresh is required.

Avoid permanent `configurable:false` overrides unless a proven unavoidable requirement exists and the limitation is documented.

## Enablement / kill-switch layers

Where practical, separate:

1. user control — enable/disable optional features;
2. automatic compatibility gate — block a feature when required capabilities fail;
3. maintainer emergency disable — future data-only manifest for registered optional features/groups.

Boot-time modifications must state when reload is required to enable/disable.

## Standalone-first testing

Development progression:

1. audit canonical/legacy behavior;
2. define feature boundary/spec;
3. reconstruct isolated standalone module;
4. verify behavior parity and failure behavior;
5. extract repeated HeroForge access into maintained adapters/capabilities where justified;
6. test disable/unload/repeated use and relevant persistence;
7. test interaction with other maintained modules;
8. integrate into Witch Dock Dev;
9. perform integration regression;
10. promote to Stable only after explicit review/acceptance.

Do not use public Witch Dock as the primary experimental environment. Working standalone behavior remains canonical until a replacement is tested and confirmed.

## Test dimensions

Consider only those relevant to the feature, but do not silently skip material dimensions:

- basic function and repeated use;
- undo/redo and state history where applicable;
- save/reload/import/export persistence;
- page reload;
- enable/disable/dispose;
- required-refresh behavior;
- interaction with related features and Witch Dock Dev;
- compatibility with current HeroForge build/capabilities;
- graceful failure when dependencies are unavailable;
- performance/resource behavior when the feature materially affects them;
- human visual acceptance when appearance is part of the requirement.

Runtime structural checks cannot substitute for human visual validation of appearance.

## Patch/fixture testing

Where bundle transforms exist, retain legal/practical fixtures and verify expected match count, parsing before/after transform where applicable, postconditions, duplicate insertion, idempotency where expected, and retained-build compatibility.

Fixture success does not replace live runtime testing.

Build fingerprints are diagnostic triggers, not automatic proof that every feature is incompatible. Revalidate the affected capability/patch when the relevant HeroForge surface changes.

## Witch Dock boundary

`Knight-Witch/KnightWitch.Heroforge` is production/public Witch Dock. `HeroForge.Compatibility` is upstream development/reconstruction.

Promotion path:

```text
standalone validated module
→ Witch Dock Dev adapter/host
→ integration testing
→ explicit Stable promotion
```

Public Witch Dock should consume reviewed/pinned/versioned/vendored validated behavior, not an unstable Compatibility branch or HF-Chat-Bridge.

Do not assume every reconstructed feature belongs in Witch Dock. Imported optional modules must not become hard dependencies of existing core tools without an explicit architecture decision.

## Ownership

Do not silently make Amanda responsible for every imported feature. Track primary maintainer/reviewer/backup where applicable, risk, maintenance status, and Stable eligibility.

A feature without a maintainer may remain standalone/experimental/disabled/deprecated/rejected rather than becoming a Stable obligation.

## Versioning

When userscript/runtime behavior changes:

- increment `@version` or relevant internal build/version;
- keep filename/metadata/displayed/internal versions consistent where the workflow depends on them;
- use unique versioned filenames when the test/install workflow requires it.

Documentation-only changes do not require runtime version bumps.

Public Witch Dock version changes belong to the Witch Dock repo during explicit integration/release work.

Generated build artifacts must not become the hand-edited canonical source.

## Backups

Git history is the default rollback system. Create manual backups only for major refactors, broad rewrites, repository restructuring, patch-engine restructuring, large file moves, or other changes where an additional snapshot is materially useful.

Do not create backup clutter for routine surgical edits, and never delete existing backups without explicit approval.
