# Documentation, Preflight, and Context Policy

Load this policy when changing project governance/documentation, creating investigations/evidence ledgers, performing committed preflight, or reorganizing tracking files.

## Goal

Repository documentation is durable project memory; chat context is not. The documentation system must preserve rigor **without requiring every chat to reload cumulative history**.

The rule is: **small current-state files are mandatory; detailed history is retrieved on demand.**

## Canonical current-state files

### `PROJECT_CONTRACT.md`

Compact binding constitution. Keep only rules that apply broadly across the repository. Detailed domain policy belongs under `docs/policies/`.

### `ACTIVE_CONTEXT.md`

Small branch/task router. It should answer:

- what branch/task is active;
- what runtime/user state must be preserved;
- what is confirmed/open;
- what not to repeat;
- the exact next investigation/development step;
- which additional docs/files are required for the current task.

Do not turn `ACTIVE_CONTEXT.md` into a narrative history. Point to investigations/evidence instead.

### `MASTER.md`

Compact repo-wide status/navigation index. Track current phase, repo roles, active feature status, major gates, and pointers. Do not duplicate full feature histories.

### `FEATURE_INVENTORY.md`

Compact canonical feature-ID registry. Detailed feature notes belong in feature specs/investigations.

## Detailed durable sources

Use these only when relevant:

- `docs/script-audits/` — forensic legacy audits;
- `docs/feature-specs/` — feature behavior/architecture/acceptance;
- `docs/investigations/` — unresolved/technical investigations;
- `docs/decisions/` — durable architecture decisions;
- evidence ledgers — compact probe/result/disposition indices;
- `ARCHITECTURE.md` — repo-wide architecture only;
- `COMPATIBILITY.md` — human-readable build/feature compatibility;
- `OWNERSHIP.md` — maintenance ownership;
- `MIGRATION_PLAN.md` — feature disposition/promotion;
- `TESTING.md` — shared test framework and current acceptance pointers;
- `/legacy/` — immutable references;
- Git history — complete historical versions and superseded long-form logs.

## Evidence ledgers

Long investigations should maintain a compact evidence ledger so a fresh chat can answer “have we already tested this?” without opening raw bridge results.

Each meaningful record should include, where available:

- stable probe/test ID;
- date or sequence;
- subject/hypothesis;
- exact target(s);
- result;
- disposition: confirmed / supported / ruled out / not causal / unresolved / do-not-repeat;
- evidence pointer such as bridge issue/request ID, commit, screenshot/human acceptance, or investigation section.

A result marked **DO NOT REPEAT** may be reopened only when new evidence is explicitly identified.

Raw bridge comments and giant serialized payloads are evidence of last resort, not the normal continuation mechanism.

## Selective preflight

Before material work, read `PROJECT_CONTRACT.md` and `ACTIVE_CONTEXT.md`, then only relevant policy/spec/investigation/source material.

Do not require full reads of cumulative files when a targeted fetch/search is sufficient:

- `CHANGELOG.md`: read/search the latest or affected-feature entries, not the whole history.
- `PRE_FLIGHT_Check.md`: read the current checklist/latest relevant records, not archived historical entries.
- `ARCHITECTURE.md`: read only when global architecture or an architectural boundary is affected.
- `FEATURE_INVENTORY.md`: read when adding/renaming/changing feature status, not for every probe.
- `COMPATIBILITY.md`, `OWNERSHIP.md`, `MIGRATION_PLAN.md`, `TESTING.md`: read when the change affects those domains.
- feature specs/investigations: read the target feature's current files only.

Target source and directly connected modules must still be reviewed before code edits.

## Preflight record format

Every committed update gets one concise record in `PRE_FLIGHT_Check.md` with:

- ID/date;
- scope and target files;
- relevant material reviewed;
- material conflict risks;
- intended validation;
- runtime/public-Witch-Dock impact.

Do not restate the investigation history inside preflight. Link/reference the durable investigation/evidence instead.

When the root preflight log becomes large, compact/archive older records or rely on Git history. The root file is an operational checklist, not a second changelog.

## Changelog

Every committed repository update must update `CHANGELOG.md`.

A changelog entry should record:

- change ID/date;
- concise summary;
- runtime/behavior impact;
- touched files or scope;
- test/validation status;
- important rollback/compatibility notes where relevant.

Do not duplicate entire investigations in the changelog. Link to them.

## Investigation/current-state checkpoints

After meaningful validated findings, corrections, blockers, architecture decisions, or probe milestones, update the current-state/evidence documentation before beginning the next materially different stage.

When evidence disproves an active claim, correct/remove the active claim; historical notes may retain the old path only when clearly marked superseded/disproven.

## Context-efficient diagnostic policy

During live HeroForge work:

- ask the narrowest question that can discriminate the current hypotheses;
- prefer primitive values, IDs, selected fields, counts, hashes/signatures, and compact booleans;
- aggressively bound deep snapshots (`depth`, keys, arrays, string sizes);
- avoid serializing full object graphs;
- avoid stringifying full function source unless that function is the actual subject;
- avoid re-fetching giant issue comments once their useful conclusion is recorded;
- separate several small read-only probes from one huge payload when that reduces result size/ambiguity;
- preserve uncertain mutation safety: read back before retrying;
- after a probe group establishes a conclusion, write the conclusion/disposition to the evidence ledger/current-state and stop carrying raw results forward.

A probe that is technically valid but floods the conversation with irrelevant output is considered poorly scoped and should be redesigned.

## Cross-repository ownership

- `HeroForge.Compatibility` owns feature investigations, interpretations, maintained feature behavior, compatibility decisions, and promotion state.
- `HF-Chat-Bridge` owns transport/protocol/security/relay/browser-client behavior.
- `KnightWitch.Heroforge` owns public Witch Dock production code/releases.

If a Compatibility investigation exposes a Bridge bug, document the Bridge repair in Bridge and record only the relevant feature impact/conclusion in Compatibility. Do not duplicate entire transport histories into the feature investigation.

Healthy routine Bridge use does not require reading Bridge architecture/changelog/preflight. Read Bridge docs only when Bridge itself is the subject.

## Documentation-only commits

Documentation-only commits must explicitly state:

- no JavaScript/runtime code changed;
- no HeroForge runtime behavior changed;
- no public Witch Dock behavior changed.

## After-edit report

After material edits, report:

- what changed and why;
- files/repositories touched;
- tests/static validation actually performed;
- risks/unresolved items;
- whether user action/update/install is required.

Do not claim tests that were not run.
