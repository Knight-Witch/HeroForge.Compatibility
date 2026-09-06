# Architecture

This document defines the intended technical direction for HeroForge.Compatibility. It describes target boundaries, not completed implementation.

## System Goal

Reduce the number of places that directly depend on unstable HeroForge internals.

Target direction:

```text
Feature Module
    ↓
Feature Service
    ↓
Shared HeroForge Compatibility Bridge
    ↓
Capability Detection / Adapters / Patch Engine
    ↓
HeroForge
```

## External Live Diagnostic Transport

`Knight-Witch/HF-Chat-Bridge` is a separate private diagnostic/control-plane repository used during development to request bounded live observations from Amanda's authenticated HeroForge browser session.

It is **not** the shared HeroForge Compatibility Bridge in the feature architecture above.

Relationship:

```text
Authorized ChatGPT chat/project
    ↓
HF-Chat-Bridge diagnostic transport
    ↓
live HeroForge observation
    ↓
validated compatibility finding
    ↓
HeroForge.Compatibility capability/adapter design
```

Rules:

- HF-Chat-Bridge must remain chat/project independent.
- Diagnostic observations do not become stable capability contracts automatically.
- Public Witch Dock and reconstructed feature modules must not depend on the GitHub mailbox or local diagnostic relay at runtime.
- A future transport change such as MCP should not require rewriting HeroForge probe semantics or maintained feature modules.

## Core Boundaries

### Feature modules

Own feature-specific behavior and state transitions.

They should not directly know about minified HeroForge identifiers or independently intercept core bundles.

### Feature services

Expose domain-level operations to UI hosts and test entrypoints.

Examples:

- set decal transform,
- export character data,
- apply camera profile,
- change kitbash capacity policy,
- capture an animated Spinny Mini profile.

### Compatibility bridge

Owns normalized access to HeroForge runtime capabilities.

Feature code should depend on bridge capabilities instead of raw `CK`, `TN`, minified React aliases, or compiled closure-local identifiers wherever practical.

### Capability detection

Reports whether required behavior is:

- available,
- unavailable,
- degraded,
- untested.

A feature must not initialize when a required capability is unavailable.

### Adapters

Translate stable project-facing operations into current HeroForge runtime operations.

A HeroForge internal rename or shape change should ideally require one adapter repair rather than multiple feature rewrites.

### Patch engine

Owns unavoidable pre-execution bundle modification.

The patch engine must eventually centralize interception, patch registration, expected match counts, validation, postconditions, failure severity, untouched-bundle fallback, boot coordination, and diagnostics.

## HeroForge Integration Priority

Prefer, where practical:

1. Independent UI using runtime-accessible state/functions.
2. Shared bridge using named runtime APIs.
3. Runtime object-shape or capability discovery.
4. Webpack/module discovery.
5. Semantic/AST bundle transformation.
6. Contextual regex transformation with captured identifiers.
7. Exact compiled-string replacement only as a last resort.

## Media Capture / Serialization Boundary

Media features should separate **HeroForge frame production** from **file serialization** when that removes unnecessary dependencies on HeroForge-private encoders.

Current accepted Spinny Mini WebP prototype:

```text
media.spinny-mini-webp feature/service
    ↓
HeroForge runtime adapter
    ├── character display rotation
    ├── display/occlusion refresh sequencing
    └── BT.maker.takeScreenshot
    ↓
browser-native static WebP frame encoder
    ↓
project-owned animated-WebP RIFF mux
    ↓
downloaded .webp
```

Rules for this boundary:

- Prefer compressed frame payloads over retaining raw RGBA frames.
- Restore temporary model/camera state in `finally`.
- Block concurrent long-running captures.
- Validate generated container dimensions/frame count/timing before download when practical.
- Do not depend on a closure-local HeroForge animation encoder merely because the native UI uses one.
- If a future named/native encoder provides a clearly superior stable capability, it can be adapted behind the same feature service rather than changing the UI contract.

## UI Hosts

The same underlying feature module should be reusable by different hosts where practical.

Planned hosts:

- standalone Tampermonkey test UI,
- Witch Dock Dev UI,
- possibly no UI for background compatibility utilities.

HeroForge native React UI should not be a dependency merely for presentation parity.

## Expected Source Layout

```text
src/
  bridge/
    capabilities/
    adapters/
    discovery/
    readiness/
  patch-engine/
    interceptors/
    validators/
    patches/
    fallback/
  features/
    decals/
    kitbash/
    character-io/
    photo-booth/
    materials/
    camera/
    rendering/
    slots/
  shared/

entries/
  tampermonkey-standalone/
  witch-dock-dev/

tests/
  fixtures/
  compatibility/
  reports/

docs/
  script-audits/
  feature-specs/
  investigations/
  decisions/

legacy/
  lob-originals/
  third-party/
  tampermonkey-metadata/
```

The exact directories may evolve. The separation of concerns is the binding requirement.

## Feature Lifecycle

Where technically possible, features should support:

- initialize,
- enable,
- disable,
- dispose/restore.

Disabling should remove or restore owned listeners, observers, timers, DOM, styles, subscriptions, wrappers, and runtime overrides.

Boot-time patch features must explicitly state when reload is required.

## Failure Isolation

One optional feature failure must not intentionally take down unrelated features, Witch Dock core, or unmodified HeroForge.

Preferred initialization flow:

1. Probe dependencies.
2. Validate capabilities.
3. Prepare changes.
4. Apply changes.
5. Verify postconditions.
6. Mark active.

On failure, roll back where possible and report the affected capability/feature.

## Bundle Patching Model

Unavoidable patches should be declarative definitions with patch ID, owner, target bundle, dependent feature, discovery strategy, expected match count, required captures, transformation, validation/postconditions, failure severity, and compatibility status.

The desired boot path is:

```text
intercept original
→ obtain untouched source
→ apply registered patches in memory
→ validate
→ execute modified source

on failure
→ execute untouched source when technically possible
→ disable affected optional feature
→ report incompatibility
```

## Witch Dock Boundary

Witch Dock is an external consumer, not the laboratory.

Integration path:

```text
standalone validated module
→ Witch Dock Dev adapter/host
→ integration testing
→ explicit stable promotion
```

Public Witch Dock must not load the unstable development head of this repository or depend on HF-Chat-Bridge at runtime.
