# HeroForge.Compatibility Project Contract

**Status:** Binding development contract  
**Scope:** `Knight-Witch/HeroForge.Compatibility` on every branch  
**Purpose:** Keep HeroForge reverse-engineering, stabilization, reconstruction, testing, and Witch Dock promotion safe without forcing every chat to reload the entire project history.

This contract is intentionally compact. Detailed policy lives under `docs/policies/` and is loaded only when relevant.

## Instruction precedence

1. Amanda's explicit instruction in the current conversation.
2. Active ChatGPT Project instructions.
3. This contract.
4. Relevant repository policy/spec/investigation documents.

Report material conflicts instead of silently choosing one.

## Required bootstrap

Before **material** code, architecture, migration, compatibility, or committed documentation work:

1. Read this `PROJECT_CONTRACT.md`.
2. Read `ACTIVE_CONTEXT.md` on the branch being worked.
3. Read only the policy/spec/investigation/source files routed by `ACTIVE_CONTEXT.md` or directly relevant to the target change.
4. Inspect the target file and directly connected modules before editing.

Do **not** reread the full `CHANGELOG.md`, historical `PRE_FLIGHT_Check.md`, unrelated architecture sections, archived investigations, or unrelated feature docs merely to satisfy process. Search or fetch the relevant entry/section when needed.

If `ACTIVE_CONTEXT.md` is missing or materially stale for the task, update it before the next material stage.

## Non-negotiable development rules

### Diagnose before editing

Determine what the current code/runtime actually does before changing it. Do not guess HeroForge internals when source/runtime inspection can answer the question.

Classify technical claims as:

- **Confirmed** — directly observed in source/runtime or validated by test.
- **Supported inference** — strongly supported but not directly proven.
- **Hypothesis** — plausible and still unverified.

Do not promote inference to fact.

### Preserve known working behavior

Known working behavior is canonical until intentionally superseded. Preserve timing, retries, polling, readiness checks, delayed snapshots, baselines, state sequencing, tolerant path probing, and mutation handling unless testing proves a safer replacement.

Do not modernize or simplify working logic merely for style. Broader refactors are allowed only after behavior/dependencies/failure modes and the target replacement are understood.

### Legacy is immutable

`/legacy/` is reference material. Never edit it. Reconstructed/corrected code belongs elsewhere with provenance preserved.

### Use the least brittle HeroForge integration that works

Preferred order:

`runtime/named state or independent UI` → `shared compatibility capability/adapter` → `object-shape/capability discovery` → `webpack/module discovery` → `semantic/AST transform` → `contextual regex` → `exact compiled string`.

Minified identifiers are observations, not APIs. Detailed rules: `docs/policies/INTEGRATION_AND_PATCHING.md`.

### Failure isolation

Optional feature failure must not intentionally break unrelated features, Witch Dock core, or unmodified HeroForge. Apply risky changes transactionally where practical and fail closed when correctness cannot be established.

### External diagnostic bridge

`Knight-Witch/HF-Chat-Bridge` is development control-plane infrastructure, **not** the maintained Compatibility runtime bridge and not a production dependency.

Use it autonomously for live reads, diagnostics, reversible experiments, and bounded runtime work so Amanda is not the probe middleman. Human interaction should be reserved for actions only she can perform or subjective visual validation.

Mutation-capable bridge work is at-most-once. If execution times out or result state is uncertain, read state back before considering any retry. Never blindly replay an uncertain mutation.

Normal feature investigations do not require loading HF-Chat-Bridge repository documentation while the bridge is healthy. Read Bridge docs only when modifying/debugging Bridge itself or when a protocol capability is genuinely relevant.

### Promotion boundary

Development progression is:

`legacy/reference` → `standalone reconstructed/experimental module` → `standalone validation` → `Witch Dock Dev` → `integration validation` → `explicit Stable promotion`.

Public Witch Dock is not the experimental environment. Working standalone behavior remains canonical until its replacement is validated.

`Knight-Witch/KnightWitch.Heroforge` must not depend at runtime on an unstable Compatibility branch or HF-Chat-Bridge.

### Visual/runtime distinction

Runtime coherence is not proof of visual correctness. When appearance is part of acceptance, Amanda's visual confirmation is required before calling that visual result passed.

## Documentation is durable memory

Chat history is not the sole source of truth. Maintain compact current-state documentation so a fresh chat does not repeat completed work.

- `ACTIVE_CONTEXT.md` — small branch/task router: current goal, protected state, next step, required docs.
- `MASTER.md` — compact repo-wide status/navigation index.
- `FEATURE_INVENTORY.md` — compact feature registry.
- feature specs/investigations — detailed domain history and architecture.
- evidence ledgers — probe/result/disposition index used to prevent duplicate testing.
- `CHANGELOG.md` — committed change history.
- `PRE_FLIGHT_Check.md` — compact current preflight checklist/log; old detail belongs in Git history/archive, not mandatory startup context.

Every committed repository update must update `CHANGELOG.md` and add a concise `PRE_FLIGHT_Check.md` record. Documentation-only changes must explicitly state that no JavaScript/runtime/public Witch Dock behavior changed.

After a meaningful investigation milestone, persist the conclusion/disposition before moving on. Raw bridge output is evidence, not working memory; record the useful conclusion and reference the request/issue rather than repeatedly reloading giant payloads.

Detailed governance: `docs/policies/DOCUMENTATION_AND_CONTEXT.md`.

## Context-efficient diagnostics

Prefer narrow probes that return primitive values, IDs, selected fields, hashes/signatures, or compact summaries. Bound deep snapshots aggressively. Do not stringify whole functions or large object graphs unless that exact source/object is the subject of investigation.

Once a probe establishes a durable conclusion, update the evidence/current-state documentation and stop carrying the raw result forward.

## Commit / change rules

Before editing, provide a concise gameplan, target files, and material conflict risks; ask Amanda only when a critical decision or human action is genuinely required.

For code/runtime changes:

- increment relevant userscript/runtime versions when behavior changes;
- validate syntax/static structure where applicable;
- run the narrowest meaningful live regression;
- preserve rollback/recovery behavior;
- do not claim success from parsing alone.

For GitHub-based userscripts, provide update/install links rather than downloaded replacement files unless Amanda explicitly asks for a file.

After material edits, report what changed, why, touched files, tests, risks, and unresolved issues.

## Policy index

Read only the policy relevant to the task:

- `docs/policies/LEGACY_AND_PROVENANCE.md` — legacy audit, provenance, third-party boundaries.
- `docs/policies/INTEGRATION_AND_PATCHING.md` — HeroForge integration priority, capability/adapters, bundle patching, timing/state rules.
- `docs/policies/FEATURE_LIFECYCLE_TESTING_RELEASE.md` — feature lifecycle, testing, ownership, versioning, Witch Dock promotion.
- `docs/policies/DOCUMENTATION_AND_CONTEXT.md` — selective preflight, tracking files, evidence ledgers, archives, context-efficiency.
- `docs/policies/CHATGPT_PROJECT_INSTRUCTIONS.md` — paste-ready compact ChatGPT Project instruction template; repository copy only, not an automatic change to ChatGPT settings.

## Final operating principle

Minimize unstable integration surface, diagnose before mutating, preserve proven behavior, isolate failures, keep current truth easy to retrieve, and do not spend context repeatedly re-reading historical material that is not relevant to the current decision.
