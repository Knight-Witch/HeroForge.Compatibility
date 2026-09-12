# HeroForge Integration and Patching Policy

Load this policy when changing how maintained code talks to HeroForge, when introducing runtime adapters/capabilities, or when touching bundle interception/transforms. It is not required for unrelated documentation/status work.

## Integration priority

HeroForge is undocumented and can change quietly. Prefer the least brittle method that reliably provides the required behavior:

1. independent UI plus runtime-accessible named state/functions;
2. maintained compatibility capability/adapter using named runtime APIs;
3. capability or object-shape discovery;
4. Webpack/module discovery;
5. semantic/AST bundle transformation;
6. contextual regex with captured identifiers and validated context;
7. exact compiled-string replacement only as a last resort.

This is a preference order, not an absolute ban. Evidence can justify a lower-level method.

## Minified names are observations, not APIs

Do not treat build-local identifiers such as `je.Z`, `Ze.Z`, `Rn.Z`, `kn.Z`, `wn`, `En`, or closure locals such as `fe/re/ne` as stable contracts.

When a compiled transform must interact with local identifiers, discover/capture them from surrounding structure and validate the context instead of hard-coding one build's names.

## Native UI dependencies

Do not depend on HeroForge's private React aliases merely for presentation parity when a standalone/Witch Dock control can provide the same behavior. Native UI injection is acceptable only when it provides unique functional value and should be treated as a higher-fragility integration.

## Timing and state sequencing

Preserve known-good state/timing behavior unless a replacement is proven safer. This includes, where relevant:

- `pointerup` behavior;
- delayed snapshots and readiness checks;
- retry loops and polling;
- mutation observers;
- staged timeouts;
- initialized state baselines and diffing;
- scene-graph/runtime path probing;
- load-order handling;
- tolerant candidate-path discovery.

Do not replace state-timed behavior with click-only or one-path shortcuts without evidence.

## Target architecture

Preferred maintained boundary:

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

Keep feature behavior, HeroForge integration, UI host, patching, diagnostics, settings/persistence, testing, and release entrypoints separated where practical.

`HF-Chat-Bridge` is not the Compatibility Bridge shown above. It is external development transport used to inspect/test the live page.

## Capability behavior

Capabilities should expose meaningful availability such as `available`, `unavailable`, `degraded`, or `untested`. A feature must not initialize when a required capability is unavailable.

Optional feature failure must not intentionally take down unrelated features, Witch Dock core, or unmodified HeroForge.

Preferred transactional initialization:

1. probe dependencies;
2. validate required capabilities;
3. prepare changes;
4. apply changes;
5. verify postconditions;
6. mark active.

On failure, roll back partial ownership where practical and report the affected feature/capability.

## Bundle patching boundary

Bundle patching is allowed when runtime access cannot reasonably provide the behavior. Unavoidable core-bundle modification should use shared patch infrastructure rather than independent feature interceptors racing the same bundle.

Each maintained patch should define:

- stable patch ID and owner;
- target bundle and dependent feature(s);
- purpose;
- discovery/search strategy;
- expected match count;
- required captures/context;
- transformation;
- validation/postconditions;
- failure severity;
- known-compatible fixtures/builds and last verified status.

### Match rules

A patch must not treat “something matched” as sufficient:

- zero matches are a failure/status condition;
- unexpected multiple matches are ambiguous;
- required context must be validated;
- first-match-only assumptions require evidence.

Patch failure must disable dependent optional features rather than allowing partial initialization.

### Transactional bundle loading

Preferred intercepted-bundle flow:

```text
intercept original
→ obtain untouched source
→ apply registered transforms in memory
→ validate match counts/context
→ validate transformed syntax where practical
→ validate required postconditions
→ execute transformed bundle

if validation fails
→ execute untouched original when technically possible
→ disable affected optional feature
→ report incompatibility
```

Do not intentionally leave HeroForge without either valid modified code or the untouched original.

### Boot coordination

There should be one coordinated boot/interception owner for shared core bundles. Individual features must not independently race to remove the same initialization script, suppress/reissue `HF.init()`, or execute a second copy of an already-running core HeroForge bundle unless a specific investigation proves that behavior intentionally safe.

## Remote controls and trust

Do not add remote executable-code control as a compatibility mechanism. Any future emergency compatibility manifest should be data-only, constrained to registered optional features/groups, expose the disable reason, fail safely, and never disable Witch Dock core merely because the manifest cannot be fetched.
