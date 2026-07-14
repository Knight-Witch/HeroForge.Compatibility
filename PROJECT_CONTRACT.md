# HeroForge.Compatibility Project Contract

**Status:** Binding development contract  
**Project:** `HeroForge.Compatibility`  
**Purpose:** Durable rules for auditing, stabilizing, reconstructing, testing, and maintaining unofficial HeroForge utilities and compatibility infrastructure.

This document supplements the ChatGPT project instructions and is binding for material work performed in this repository. It must be read before code, architecture, migration, compatibility, or committed documentation work.

When instructions conflict, use this precedence:

1. An explicit instruction from Amanda in the current conversation.
2. The active ChatGPT project instructions.
3. This `PROJECT_CONTRACT.md`.
4. Other repository documentation.

Do not silently ignore a conflict. Report material conflicts before proceeding.

---

# 1. Project Purpose and Boundaries

`HeroForge.Compatibility` is a development, reverse-engineering, stabilization, compatibility, and testing project for unofficial HeroForge utilities and scripts.

Primary goals:

- Audit and preserve existing script behavior.
- Extract coherent features from legacy scripts that combine unrelated functionality.
- Replace brittle HeroForge integration methods where practical.
- Reduce breakage caused by monthly and quiet HeroForge updates.
- Centralize repeated HeroForge access and patching logic.
- Build capability-aware failure isolation and diagnostics.
- Reconstruct features as independently testable Tampermonkey modules.
- Establish clear ownership so imported functionality does not silently become Amanda's permanent maintenance responsibility.
- Produce validated modules that may later be promoted into Witch Dock Dev and, after separate review, Witch Dock Stable.

This repository is **not** the public Witch Dock production repository.

Nothing in this repository is automatically approved for:

- public distribution,
- Witch Dock integration,
- default enablement,
- long-term support,
- or maintenance by Amanda.

The public Witch Dock repository remains `KnightWitch.Heroforge`.

The intended integration path is:

`HeroForge.Compatibility`
→ standalone validated module
→ Witch Dock Dev
→ integration testing
→ explicit promotion
→ Witch Dock Stable

Public Witch Dock must not depend on the unstable development head of this repository.

---

# 2. Core Development Principles

## 2.1 Diagnose Before Editing

Before changing code:

1. Identify the canonical reference.
2. Determine what the current code actually does.
3. Identify its HeroForge dependencies.
4. Identify cross-script dependencies.
5. Identify concrete failure modes.
6. Distinguish required behavior from accidental implementation details.
7. Define the intended replacement or repair.
8. Report material findings before making a major refactor.

Do not guess about undocumented HeroForge behavior when it can be inspected or tested.

Clearly distinguish:

- **Confirmed:** directly observed or verified in source/runtime.
- **Supported inference:** strongly suggested by evidence but not directly proven.
- **Unproven hypothesis:** plausible but not verified.

Do not promote inference to confirmed behavior without evidence.

## 2.2 Preserve Behavior, Not Bad Architecture

Known working behavior is canonical until intentionally superseded.

Do not:

- casually simplify working logic,
- remove retries or timing behavior because they look ugly,
- modernize code merely for style,
- reinterpret existing behavior without approval,
- or restructure a working feature before behavior parity is understood.

However, do **not** preserve bad architecture merely because legacy code used it.

Major rewrites and refactors are allowed when the project goal requires them, but only after:

- existing behavior has been audited,
- dependencies and failure modes are documented,
- the target behavior is defined,
- and the migration strategy is understood.

Use surgical edits for confirmed working reconstructed code unless a broader refactor is explicitly justified.

## 2.3 Feature Boundaries Override Legacy File Boundaries

Legacy scripts may contain unrelated functionality.

Organize the new codebase by actual feature and domain boundaries, not by old filenames.

Do not:

- keep unrelated functions together because Lob placed them in one script,
- split tightly coupled behavior merely to create more files,
- or preserve accidental cross-script coupling.

Every extracted feature should have a stable feature ID.

Examples:

- `decals.transform.projected`
- `decals.slots.expand`
- `kitbash.capacity`
- `photo-booth.shader-pass-policy`
- `character.local-export`

---

# 3. Legacy and Reference Source Rules

## 3.1 Legacy Originals Are Immutable

All original Lob, external, historical, and third-party source files must be preserved unchanged under `/legacy/`.

Never edit a file under `/legacy/`.

If a corrected or reconstructed version is required:

- create a new maintained source file elsewhere,
- preserve the original file untouched,
- document the relationship between them.

## 3.2 Provenance

Where known, preserve:

- original filename,
- author,
- version,
- source,
- date imported,
- whether it came from Tampermonkey export,
- whether it is Lob-authored, Knight Witch-authored, or third-party,
- and whether it was already modified before import.

Tampermonkey `.options.json` and `.storage.json` exports belong under a clearly separated legacy metadata area.

## 3.3 Third-Party Code

Third-party code must remain clearly separated from Lob-authored and Knight Witch-authored code.

Do not silently absorb external source into maintained project code.

Before adopting external logic:

- identify the source and author,
- identify licensing or redistribution constraints where relevant,
- determine whether the project should depend on it, wrap it, reference it, or leave it external.

## 3.4 Required Legacy Audit Categories

For each significant legacy script, identify and document:

- actual features,
- unrelated feature mixing,
- dead code,
- unfinished code,
- commented-out experiments,
- duplicate functionality,
- hidden cross-script dependencies,
- globals created or modified,
- runtime functions replaced,
- permanent or non-configurable overrides,
- DOM dependencies,
- React dependencies,
- Webpack/module dependencies,
- compiled bundle interception,
- exact-string replacements,
- regex replacements,
- load-order dependencies,
- initialization races,
- settings and storage keys,
- hard-coded part IDs or asset IDs,
- account-specific behavior,
- trust-sensitive or destructive behavior,
- failure modes,
- and recommended disposition.

Unknown behavior must be investigated, quarantined, or explicitly marked unresolved. Do not silently carry unknown hacks into maintained architecture.

---

# 4. HeroForge Integration Strategy

HeroForge is undocumented, unstable, and subject to monthly and quiet updates.

Prefer integration strategies in this order where practical:

1. Independent UI using runtime-accessible state and functions.
2. Shared compatibility bridge using named runtime APIs.
3. Runtime capability discovery or object-shape discovery.
4. Webpack/module discovery.
5. Semantic or AST-based bundle transformation.
6. Contextual regex transformation with captured identifiers.
7. Exact compiled-string replacement only as a last resort.

This ordering is a preference, not an absolute prohibition. Use the least brittle method that reliably provides the required behavior.

## 4.1 Minified Names Are Not APIs

Do not treat identifiers such as:

- `je.Z`
- `Ze.Z`
- `Rn.Z`
- `kn.Z`
- `wn`
- `En`
- closure-local variables such as `fe`, `re`, `ne`, or similar

as stable integration points.

When unavoidable compiled-code transforms depend on local identifiers:

- discover or capture them from surrounding structure,
- validate the match context,
- and do not hard-code them merely because they work in the current build.

## 4.2 Avoid Native React Dependencies When Possible

If Witch Dock or a standalone utility can render its own control, do not depend on HeroForge's internal React component alias merely to match native presentation.

Prefer:

`Independent UI`
→ `Feature service`
→ `Compatibility bridge`
→ `HeroForge state`

over:

`Injected native React component`
→ `minified component alias`
→ `private closure state`

Native UI injection may still be used when it provides unique functional value, but it must be treated as a higher-fragility integration.

## 4.3 Preserve Timing and State Behavior

HeroForge frequently depends on timing and state sequencing.

Preserve known-good:

- `pointerup` behavior,
- delayed snapshots,
- retry loops,
- polling,
- mutation observers,
- readiness checks,
- staged timeouts,
- state baselines,
- diffing,
- scene-graph probing,
- load-order handling,
- and tolerant path probing

unless testing proves a safer replacement.

Do not replace state-timed or `pointerup` behavior with click-only handling without evidence.

Initialize baselines and snapshots before user interaction when required.

Advance stored state consistently to avoid stale comparisons.

Do not hard-code one DOM, scene-graph, runtime, or object path where working code successfully probes multiple candidates.

---

# 5. Target Architecture

The target direction is:

`Feature Module`
→ `Feature Service`
→ `Shared HeroForge Compatibility Bridge`
→ `Capability Detection / Adapters / Patch Engine`
→ `HeroForge`

Keep these concerns separated:

- feature behavior,
- HeroForge integration,
- UI host,
- patching,
- diagnostics,
- settings,
- persistence,
- testing,
- release/build entrypoints.

Standalone Tampermonkey testing and later Witch Dock integration should reuse the same underlying feature modules where practical.

Do not maintain separate implementations of the same feature solely because one runs standalone and one runs in Witch Dock.

Expected major source areas may include:

- `/src/bridge/`
- `/src/patch-engine/`
- `/src/features/`
- `/src/shared/`
- `/entries/tampermonkey-standalone/`
- `/entries/witch-dock-dev/`
- `/tests/`
- `/docs/`
- `/legacy/`

Directory structure may evolve, but the architectural boundaries must remain explicit.

---

# 6. Shared Compatibility Bridge

The project should centralize HeroForge access rather than allowing every feature to independently rediscover and patch the same internals.

The bridge should expose capabilities or adapters such as:

- `decals.readState`
- `decals.writeState`
- `decals.listCatalog`
- `decals.setProjection`
- `character.export`
- `character.import`
- `photoBooth.readState`
- `photoBooth.writeState`
- `camera.read`
- `camera.write`
- `undo.commit`

Exact API names may change as the architecture is designed.

Feature modules should depend on capabilities, not raw minified implementation details.

The bridge may internally use:

- named `CK` APIs,
- named `TN` APIs,
- runtime object discovery,
- Webpack export discovery,
- validated hooks,
- or patch-engine-provided capabilities.

A HeroForge internal change should ideally require repair in one adapter or patch definition rather than in every feature.

---

# 7. Capability Detection and Failure Isolation

Each capability should report a meaningful status such as:

- `available`
- `unavailable`
- `degraded`
- `untested`

Features must declare required capabilities.

A feature must not initialize when a required capability is unavailable.

User-facing failure should identify the affected feature or capability rather than only exposing a raw minified exception.

Example:

`Projected Decal Controls disabled: decals.renderer.projectedTransform unavailable.`

Diagnostic output may include the technical exception separately.

One optional feature failure must not intentionally take down:

- unrelated features,
- the shared bridge,
- Witch Dock core,
- or unmodified HeroForge.

Features should initialize transactionally where practical:

1. Probe dependencies.
2. Validate required capabilities.
3. Prepare changes.
4. Apply changes.
5. Verify expected state.
6. Mark active.

On failure:

- roll back partial changes where possible,
- do not mount dependent UI,
- report the failure,
- and preserve unrelated behavior.

---

# 8. Feature Metadata and Lifecycle

Every reconstructed feature should document:

- stable feature ID,
- title,
- purpose,
- legacy source(s),
- primary maintainer,
- reviewer,
- backup maintainer where applicable,
- risk level,
- required capabilities,
- optional capabilities,
- feature dependencies,
- default enabled state,
- initialization behavior,
- enable behavior,
- disable behavior,
- unload/dispose behavior,
- reload requirements,
- compatibility status,
- last verified HeroForge build,
- intended disposition.

Valid dispositions include:

- standalone,
- Witch Dock Dev candidate,
- Witch Dock Stable candidate,
- experimental only,
- external dependency,
- deprecated,
- rejected.

Where technically possible, features should support:

- `initialize`
- `enable`
- `disable`
- `dispose` or `restore`

Disabling should remove or restore owned:

- event listeners,
- mutation observers,
- timers,
- intervals,
- injected DOM,
- styles,
- subscriptions,
- wrappers,
- temporary globals,
- and patched runtime functions.

A UI checkbox that merely hides controls does not count as disabling a feature.

If a feature cannot safely unload during the current session, document:

- that refresh is required,
- what remains active until refresh,
- and why.

Do not use `configurable: false` permanent overrides unless there is a proven unavoidable requirement and the limitation is documented.

---

# 9. Feature Enablement and Kill-Switch Layers

The architecture should support three independent control layers where practical.

## 9.1 User Control

Users should be able to enable or disable optional feature modules.

Support may include:

- individual feature toggles,
- domain-level toggles,
- an all-experimental toggle,
- an all-bundle-patches toggle,
- and later an all-Lob-derived-features toggle if useful.

A feature requiring boot-time modification must clearly state when reload is required to enable or disable it.

## 9.2 Automatic Compatibility Gate

A feature should be blocked automatically when required capabilities fail.

Automatic incompatibility must not be represented as a generic successful load.

## 9.3 Maintainer Emergency Disable

The system may later support a data-only remote compatibility manifest for optional features.

Such a manifest must:

- contain no executable JavaScript,
- control only registered optional features or groups,
- expose the disable reason,
- be cached where appropriate,
- fail safely,
- and never disable Witch Dock core merely because the manifest cannot be fetched.

Potential emergency groups may include:

- all experimental bundle patches,
- all decal experiments,
- all kitbash experiments,
- or all Lob-derived optional features.

The exact implementation must be separately designed and reviewed before public use.

---

# 10. Bundle Patching Rules

Bundle patching is allowed when runtime access cannot reasonably provide the required behavior.

All unavoidable HeroForge bundle modification must eventually use one shared patch infrastructure.

Once shared patch infrastructure exists, feature modules must not independently implement ad hoc interception of the same core bundles.

## 10.1 Patch Contract

Each patch should define:

- stable patch ID,
- owner,
- target bundle,
- dependent feature(s),
- purpose,
- search or discovery strategy,
- expected match count,
- required captures,
- transformation,
- validation or postconditions,
- failure severity,
- known compatible fixtures/builds,
- and last verified status.

## 10.2 Match Rules

A patch must not treat "something matched" as sufficient.

- Zero matches must be reported.
- Unexpected multiple matches must be treated as ambiguous.
- Required context must be validated.
- First-match-only behavior must not be assumed safe without proof.

## 10.3 Dependency Rules

Patch failure must disable dependent features.

A feature must not partially initialize when a required patch fails.

Optional patches may fail without blocking unrelated features.

## 10.4 Transactional Loading

For intercepted HeroForge bundles, the desired model is:

1. Intercept the original bundle.
2. Obtain untouched source.
3. Apply registered patches in memory.
4. Validate required matches.
5. Validate transformed syntax where practical.
6. Validate required postconditions.
7. Execute the modified bundle.

If validation fails:

- execute the untouched original bundle whenever technically possible,
- disable only affected optional features,
- report the incompatibility.

The patch system must not intentionally leave HeroForge without either a valid modified bundle or the untouched original.

## 10.5 Boot Coordination

There must eventually be one coordinated boot/interception system for shared core bundles.

Individual features must not independently:

- race to remove the same initialization script,
- suppress `HF.init()`,
- reissue global initialization,
- or execute modified copies of already-executed core bundles.

Do not execute a second copy of a core HeroForge bundle after the original has already initialized unless a separately documented investigation proves that behavior is intentionally safe.

---

# 11. Testing Workflow

Development order:

1. Audit legacy behavior.
2. Define feature boundaries.
3. Create or update feature specifications.
4. Reconstruct isolated Tampermonkey test modules.
5. Verify behavior parity against canonical references.
6. Extract repeated HeroForge access into the shared bridge.
7. Test disable and unload behavior.
8. Test interactions with other reconstructed modules.
9. Add compatibility and fixture testing where applicable.
10. Integrate validated modules into Witch Dock Dev.
11. Promote to public Witch Dock only after separate review.

Do not use public Witch Dock as the primary experimental test environment.

Working standalone Tampermonkey scripts remain canonical until their replacement is tested and confirmed.

## 11.1 Test Requirements

Feature tests should consider, where relevant:

- basic function,
- repeated use,
- undo/redo,
- save/reload persistence,
- import/export persistence,
- page reload,
- feature enable,
- feature disable,
- live unload,
- required-refresh behavior,
- interaction with other reconstructed features,
- interaction with Witch Dock Dev,
- compatibility with current HeroForge build,
- graceful failure when a capability is missing.

## 11.2 Patch and Fixture Tests

Preserve HeroForge bundle/build fixtures where legally and practically appropriate for compatibility testing.

Patch tests should verify:

- expected match count,
- successful parsing before transform where applicable,
- successful parsing after transform,
- required postconditions,
- no duplicate insertion,
- idempotency where expected,
- compatibility across retained fixtures.

Fixture success does not replace live runtime testing.

## 11.3 Quiet Update Detection

Build fingerprints may be used for diagnostics and compatibility tracking.

A changed fingerprint should trigger capability or patch revalidation rather than automatically declaring the entire build incompatible.

---

# 12. Witch Dock Integration Rules

`KnightWitch.Heroforge` is the production Witch Dock repository.

This repository is a separate compatibility and stabilization project.

Do not modify public Witch Dock merely because a reconstructed feature works standalone.

Do not assume every feature belongs in Witch Dock.

Promotion into Witch Dock must be explicit and documented.

Public Witch Dock should consume reviewed, versioned, pinned, or vendored validated output rather than the unstable development head of this repository.

The preferred progression is:

`Standalone reference`
→ `Standalone reconstructed module`
→ `Shared compatibility integration`
→ `Witch Dock Dev`
→ `Witch Dock integration testing`
→ `Explicit stable promotion`

Witch Dock core tools must remain insulated from optional compatibility modules.

Imported optional modules must not become hard dependencies of existing core tools unless an explicit architecture decision approves that dependency.

---

# 13. Ownership and Collaboration

This project must not silently make Amanda responsible for maintaining every imported script or feature.

Track for each maintained feature or patch:

- primary maintainer,
- reviewer,
- backup maintainer where applicable,
- maintenance status,
- risk tier,
- last verified HeroForge build.

Features without a maintainer may remain:

- standalone,
- experimental,
- disabled,
- deprecated,
- or rejected.

Lob may maintain feature modules or patch definitions without requiring unrestricted authority over Witch Dock production code.

Recommended collaboration boundaries may include:

- protected production branches,
- pull-request review,
- required checks,
- `CODEOWNERS`,
- separate ownership for compatibility features and Witch Dock core.

The exact repository permissions and branch strategy should be documented when collaboration begins.

---

# 14. Repository Documentation as Durable Memory

Chat context is not the sole source of truth.

Repository documentation is the durable project memory for:

- current architecture,
- feature inventory,
- validated HeroForge findings,
- compatibility status,
- failed paths,
- corrections,
- ownership,
- decisions,
- migrations,
- blockers,
- and testing results.

Create documentation checkpoints after meaningful:

- validated findings,
- corrections,
- status changes,
- architecture decisions,
- blockers,
- feature milestones,
- probe milestones,
- compatibility changes.

Do not create commits for every trivial observation, but do not begin the next material development stage while current documentation is knowingly stale.

When evidence disproves an earlier claim:

- correct or remove the outdated active claim,
- do not leave contradictory active statements scattered through the docs.

Historical notes may retain the old path when clearly marked historical.

---

# 15. Required Tracking Files

Maintain the following.

## `MASTER.md`

Canonical high-level current project state.

Track:

- architecture summary,
- current phase,
- active work,
- feature status,
- blockers,
- migration queue,
- integration status,
- major removals,
- rejected ideas.

Do not infer current status from historical notes when `MASTER.md` says otherwise.

## `PRE_FLIGHT_Check.md`

Required pre-commit/pre-update review log.

Each committed update entry should include:

- target files,
- relevant history checked,
- connected modules reviewed,
- conflict risks,
- recommended action.

Documentation-only entries must state that no JavaScript or runtime behavior changed.

## `CHANGELOG.md`

Required for every committed repository update.

Each entry should include, where practical:

- change ID,
- date,
- timestamp,
- summary,
- touched files,
- rollback notes,
- test notes.

## `ARCHITECTURE.md`

Canonical intended system architecture and boundaries.

Document:

- bridge,
- capability registry,
- feature registry,
- patch engine,
- lifecycle,
- diagnostics,
- settings,
- build/test entrypoints,
- Witch Dock integration boundary.

This file should change deliberately, not casually.

## `FEATURE_INVENTORY.md`

Canonical list of actual features regardless of legacy script origin.

Track:

- feature ID,
- name,
- legacy source(s),
- purpose,
- current implementation,
- intended implementation,
- dependencies,
- required capabilities,
- risk,
- owner,
- status,
- disposition.

## `COMPATIBILITY.md`

Human-readable feature/build compatibility status.

Track:

- HeroForge build or fingerprint where known,
- feature status,
- failures,
- affected capabilities,
- last tested date.

Machine-readable compatibility data may later live under `/manifests/`.

## `OWNERSHIP.md`

Track:

- primary maintainer,
- reviewer,
- backup maintainer,
- maintenance status,
- risk,
- eligibility for stable integration.

A feature with no maintainer should not silently become a stable maintenance obligation.

## `MIGRATION_PLAN.md`

Track eventual disposition:

- remain standalone,
- move to Witch Dock Dev,
- stable candidate,
- experimental,
- external dependency,
- deprecated,
- rejected.

## `TESTING.md`

Document:

- test environments,
- required scripts,
- test procedures,
- acceptance criteria,
- persistence tests,
- disable/unload tests,
- compatibility checks.

## `docs/script-audits/`

Forensic audits of original scripts.

Use a consistent structure covering:

- provenance,
- features,
- dependencies,
- globals,
- patches,
- dead/unfinished code,
- failure modes,
- recommended split,
- recommended disposition.

## `docs/feature-specs/`

Specifications for reconstructed features.

Define:

- user-visible behavior,
- legacy behavior,
- required capabilities,
- settings,
- lifecycle,
- persistence,
- dependencies,
- accepted failure behavior,
- test acceptance criteria,
- owner.

## `docs/investigations/`

Unresolved technical investigations.

Each investigation should clearly end in one of:

- confirmed,
- disproven,
- still unknown,
- no longer relevant.

Do not let speculative investigation notes silently become architectural truth.

## `docs/decisions/`

Architecture Decision Records or equivalent durable decisions.

Each should include:

- decision,
- context,
- reason,
- consequences,
- status.

## `/legacy/`

Immutable original source and metadata.

## `/tests/`

Fixtures, automated compatibility tests, reports, and related test material.

## `DIFFS/`

Optional.

Use only when a standalone diff is materially useful for a complex or risky change.

Git history and the normal tracking files remain the default rollback/reference system.

## `ASSETS/`

Repository assets with clear, sensible names.

## `BACKUP_VAULT/`

Major-refactor backups only.

Never delete an existing backup merely to tidy the repository.

---

# 16. Pre-Flight Requirements

Before any committed code or architecture update:

1. Read `PROJECT_CONTRACT.md`.
2. Read `MASTER.md`.
3. Read `PRE_FLIGHT_Check.md`.
4. Read `CHANGELOG.md`.
5. Read `ARCHITECTURE.md`.
6. Read `FEATURE_INVENTORY.md`.
7. Read relevant script audits.
8. Read relevant feature specifications.
9. Read relevant investigations and decisions.
10. Review the target file and directly connected modules.
11. Check dependencies, capabilities, globals, settings, patch targets, load order, ownership, and test references.

If one of these files does not yet exist during initial repository setup, create or explicitly queue it rather than pretending it was reviewed.

Before editing:

- provide a concise gameplan,
- identify target files,
- identify material conflict risks,
- ask only when a critical decision is genuinely required.

Do not use pre-flight documentation as bureaucracy for trivial uncommitted local exploration. It is required before committed repository updates and material architecture changes.

---

# 17. Commit and Change Rules

Every committed repository update must update `CHANGELOG.md`.

Add a concise `PRE_FLIGHT_Check.md` entry for every committed repository update.

Documentation-only commits must explicitly state:

- no JavaScript changed,
- no runtime behavior changed,
- no production Witch Dock behavior changed.

Do not update unrelated documentation merely to create churn.

For complex or risky changes:

- summarize the material diff,
- keep Git history easy to inspect,
- use standalone diff artifacts only when useful.

Do not make manual edits in the user's environment when repository editing or a complete replacement test script can be provided directly.

During direct Tampermonkey development, provide a complete replacement `.user.js` or `.txt` test script rather than asking Amanda to manually splice code unless she explicitly requests patch instructions.

---

# 18. Versioning and Build Rules

When editing a standalone userscript test or release:

- increment `@version` when runtime behavior changes,
- update `@name` when the workflow uses versioned names,
- keep filename, metadata, displayed version, and internal references consistent,
- use a unique filename when the test workflow depends on versioned files.

For internal modules:

- update internal `VERSION` or build identifiers where present and useful,
- keep runtime/debug version values consistent.

Documentation-only changes do not require code or userscript version increments.

Do not bump public Witch Dock versions from this repository.

Public Witch Dock version changes belong to the Witch Dock production repository during explicit integration or release work.

Generated build artifacts must not become the primary hand-edited source.

Source should remain canonical.

---

# 19. Backup Rules

Create backups only for:

- major refactors,
- large file moves,
- architecture changes,
- broad rewrites,
- patch-engine restructuring,
- repository restructuring,
- high-risk migrations where Git history alone is insufficient.

Suggested naming:

`BACKUP_VAULT/REPO_BACKUP_mm-dd-yy_timestamp`

Routine surgical edits do not require manual backups.

Do not create redundant backup clutter for every small change.

Never delete existing backups without explicit approval.

---

# 20. Status and Workflow Rules

Working standalone scripts remain canonical until migrated and confirmed.

Historical diagnostic references are not automatically active tasks.

Do not infer that a feature is:

- live,
- working,
- incomplete,
- unresolved,
- deprecated,
- blocked,
- migrated,
- or experimental

from old notes alone.

Check current status documents.

Preserve behavior first; clean structure second.

After behavior parity is confirmed, cleanup and modularization may continue according to the approved architecture.

Do not add unrelated improvements during a focused compatibility repair.

Do not silently broaden scope.

---

# 21. Security, Trust, and Destructive Behavior

Account-specific kill switches, redirects, page blanking, hidden disabling logic, or similar trust-sensitive behavior must not be carried into maintained code without an explicit approved requirement.

If found in legacy code:

- document it,
- preserve the original only in immutable legacy source,
- do not silently migrate it.

Do not add remote executable-code control as a compatibility mechanism.

Remote emergency controls, if implemented, should be data-only and constrained to registered optional features.

Do not expose or transmit user data merely to determine whether a local feature should work unless explicitly required, disclosed, and approved.

---

# 22. After-Edit Requirements

After material edits:

- summarize what changed,
- explain why,
- list touched files,
- report test status,
- report anything unresolved,
- report compatibility implications,
- update durable documentation before beginning the next material development stage.

Do not add unrelated recommendations.

Do not claim testing that was not actually performed.

Do not claim a feature is fixed merely because code parses.

---

# 23. Initial Repository Setup Exception

During the initial repository bootstrap, many required tracking files may not exist yet.

The setup phase may create the contract and documentation skeleton in a small number of initialization commits.

During that bootstrap:

- `PROJECT_CONTRACT.md` is the first durable ruleset.
- Missing required documents must be created or explicitly queued.
- Legacy files must be archived before reconstruction begins.
- No missing file should be treated as having been reviewed.
- No reconstructed feature should be called stable merely because the repository structure exists.

Once the initial documentation skeleton is established, normal pre-flight and tracking rules apply.

---

# 24. Final Operating Principle

The project exists to make HeroForge utility development **less brittle, less coupled, easier to diagnose, easier to disable, and easier to maintain collaboratively**.

The standard is not "never break."

HeroForge can change fundamentally.

The standard is:

- minimize unstable integration surface,
- detect incompatibility clearly,
- isolate failures,
- preserve unmodified HeroForge behavior when possible,
- repair shared compatibility layers instead of many duplicate hacks,
- document what is known,
- and prevent experimental utilities from destabilizing unrelated tools.
