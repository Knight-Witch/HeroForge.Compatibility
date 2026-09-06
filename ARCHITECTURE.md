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

It is not the shared HeroForge Compatibility Bridge used by production feature architecture.

Public Witch Dock and maintained feature modules must not depend on the GitHub mailbox or local diagnostic relay at runtime.

## Core Boundaries

### Feature modules

Own feature-specific behavior and state transitions.

### Feature services

Expose domain-level operations to UI hosts and test entrypoints.

Examples include:

- set decal transform;
- export/import character data;
- capture a full Spinny profile;
- capture a Spinny Short Test diagnostic.

### Compatibility bridge / adapters

Own normalized access to HeroForge runtime capabilities. HeroForge internal changes should ideally require one adapter repair rather than multiple feature rewrites.

### Patch engine

Own unavoidable pre-execution bundle modification. Runtime-accessible named APIs remain preferred where practical.

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

Media features separate HeroForge frame production from file serialization.

Current Spinny direction:

```text
media.spinny-mini-webp feature/service
    ↓
rotation + display refresh sequencing
    ↓
frame-source adapter
    ├── 1024/2048: native BT.maker.takeScreenshot
    └── 3072: TRUE-3K Effects phase-feed adapter
    ↓
browser-native static WebP frame encoder
    ↓
project-owned animated-WebP RIFF mux
    ↓
downloaded .webp
```

Rules:

- Prefer compressed frame payloads over retaining raw RGBA frames.
- Restore temporary model/camera/runtime state in `finally` or equivalent bounded cleanup.
- Block concurrent long-running captures.
- Validate generated container dimensions/frame count/timing before download.
- Do not depend on HeroForge's closure-local animation encoder.
- Do not treat returned canvas dimensions alone as evidence of true source-render resolution.

## Spinny Frame-Source Adapter

### Native lower-resolution path

Validated 1024/2048 profiles use:

```text
BT.maker.takeScreenshot(size,size)
```

### TRUE-3K path

Native HeroForge 3072 output is source-fidelity degraded because current capture uses 768x768 `CK.Effects.renderToCanvas` phases under a 3072 capture camera.

The validated repair architecture is:

```text
explicit 3072 frame capture
→ temporarily intercept matching CK.Effects.renderToCanvas phase requests
→ render one genuine 3072x3072 Effects source
→ classify/validate native tile/grid/phase topology
→ derive requested phase canvases from that source
→ native Booth compositor finishes the 3072 frame
→ restore the exact Effects method immediately
```

Important ownership rule:

- Do not replace `BT.maker.takeScreenshot` for 3072 repair.
- Witch Dock TRUE-resolution still capture owns its 4096/8192 wrapper and must not be displaced by Spinny.
- The 3072 adapter operates below that ownership boundary at the named Effects seam.

The adapter must fail on ambiguous or changed topology rather than guessing.

## Short Test Diagnostic Boundary

Short Test is a feature-service operation, not a separate media implementation.

```text
captureShortTest(selected profile)
→ same frame-source adapter
→ same refresh sequencing
→ same WebP encoder/mux/parser
→ same cancellation/restoration lifecycle
```

Short Test changes only:

- frame count: 16;
- angular extent: contiguous partial arc using the selected full profile's normal angular step;
- filename/status metadata indicating diagnostic output.

### UI ownership

Standalone Tampermonkey validation is itself a development harness, so Short Test may be directly visible there.

Future Witch Dock:

- Spinny UI owns the Short Test control;
- `KWDeveloperMode` controls only whether developer-only controls are visible;
- Developer Mode does not implement or duplicate capture logic;
- normal public presentation hides Short Test unless Developer Mode is enabled.

## Memory Behavior

- Do not retain raw RGBA for all animation frames.
- Encode each frame immediately to static WebP.
- Retain compressed frame payloads until final mux.
- Release source canvas backing stores after extraction.
- TRUE-3K may transiently hold one ~36 MiB 3072 RGBA Effects source for the current frame only.

## UI Hosts

The same underlying feature/service should be reusable by:

- standalone Tampermonkey test UI;
- Witch Dock Dev UI;
- developer-only diagnostic presentation.

HeroForge native React UI should not be required merely for presentation parity.

## Feature Lifecycle

Where technically possible, features should support initialize, enable, disable and dispose/restore.

Temporary runtime wrappers must be bounded and restorable. One optional feature failure must not intentionally take down unrelated HeroForge or Witch Dock behavior.

## Witch Dock Boundary

Witch Dock is an external consumer, not the laboratory.

Integration path:

```text
standalone validated module
→ Witch Dock Dev adapter/host
→ integration testing
→ explicit stable promotion
```

Public Witch Dock must not load the unstable Compatibility development head or depend on HF-Chat-Bridge at runtime.
