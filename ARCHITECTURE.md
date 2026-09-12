# Architecture

This file defines **repo-wide architecture boundaries only**. Feature-specific architecture belongs in feature specs/investigations and should not be duplicated here.

## System goal

Reduce the number of places that directly depend on unstable HeroForge internals.

```text
Feature Module
    ↓
Feature Service
    ↓
HeroForge Compatibility Bridge
    ↓
Capabilities / Adapters / Discovery / Patch Engine
    ↓
HeroForge
```

## External live diagnostic transport

`Knight-Witch/HF-Chat-Bridge` is a separate private development control plane used to inspect/test Amanda's authenticated HeroForge browser session.

It is **not** the maintained Compatibility Bridge above and must never become a public Witch Dock/runtime feature dependency.

```text
Authorized development chat
    ↓
HF-Chat-Bridge transport
    ↓
live HeroForge observation/experiment
    ↓
validated finding
    ↓
HeroForge.Compatibility design/implementation
```

Healthy routine Bridge use does not require loading Bridge architecture/history into a Compatibility investigation. Bridge docs are relevant only when Bridge itself is being modified/debugged or a protocol capability is material.

## Core boundaries

### Feature modules

Own feature-specific behavior/state transitions. They should not independently know minified HeroForge identifiers or intercept shared core bundles when a maintained adapter can own that dependency.

### Feature services

Expose domain-level operations to standalone/Witch Dock/test hosts.

### Compatibility bridge

Own normalized maintained access to HeroForge capabilities. Feature code should prefer capabilities/adapters over raw `CK`, `TN`, private React aliases, or compiled closure-local identifiers where practical.

### Capability detection / adapters

Detect current availability/shape and translate project-facing operations into current HeroForge behavior. A HeroForge internal change should ideally require one adapter repair, not many feature rewrites.

### Patch engine

Own unavoidable pre-execution bundle modification: interception, patch registration, match/context validation, postconditions, failure severity, untouched-source fallback, boot coordination, and diagnostics.

Detailed integration/patch rules: `docs/policies/INTEGRATION_AND_PATCHING.md`.

## UI hosts

Underlying feature behavior should be reusable across hosts where practical:

- standalone Tampermonkey test UI;
- Witch Dock Dev/Stable host after promotion;
- no UI for background compatibility utilities when appropriate.

Do not depend on HeroForge private React internals merely for appearance parity.

## Feature lifecycle / failure isolation

Where practical, features support initialize, enable, disable, and dispose/restore. Owned listeners/observers/timers/DOM/styles/wrappers/runtime overrides should be reversible. A missing required capability blocks that feature rather than destabilizing unrelated behavior.

Detailed lifecycle/testing/release rules: `docs/policies/FEATURE_LIFECYCLE_TESTING_RELEASE.md`.

## Expected source layout

```text
src/
  bridge/
  patch-engine/
  features/
  shared/
entries/
  tampermonkey-standalone/
  witch-dock-dev/
tests/
docs/
  policies/
  script-audits/
  feature-specs/
  investigations/
  decisions/
legacy/
```

Exact directories may evolve; separation of concerns is the requirement.

## Witch Dock boundary

Witch Dock is an external production consumer, not the laboratory.

```text
standalone validated module
→ Witch Dock Dev
→ integration testing
→ explicit Stable promotion
```

Public Witch Dock must not load an unstable Compatibility branch or depend on HF-Chat-Bridge at runtime.

## Active feature architecture

Do not add detailed active-feature state here. For current branch/task architecture and constraints, start with `ACTIVE_CONTEXT.md`, then the routed feature spec/investigation.
