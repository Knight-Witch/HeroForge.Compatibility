# Pre-Flight Check

This is the **compact operational preflight log**, not a second investigation history.

Before material committed work:

1. Read `PROJECT_CONTRACT.md` and branch `ACTIVE_CONTEXT.md`.
2. Read only the relevant policy/spec/investigation/source files routed by the task.
3. Inspect target files and directly connected modules.
4. Identify material conflict/rollback risks.
5. Define the narrow validation required for the change.

Do not reread the entire changelog, old preflight history, unrelated root docs, or archived investigations merely for process. Historical verbose preflight records remain durable in Git history.

## PFC-2026-09-12-021 — Context/documentation architecture refactor

**Scope:** documentation/governance only.

**Targets:** compact contract/current-context architecture, policy split, `MASTER.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `TESTING.md`, README/startup routing, INV-0004 evidence ledger/current-state routing, changelog/preflight.

**Reviewed:** existing binding `PROJECT_CONTRACT.md`; current root tracking docs; current INV-0004 investigation/checkpoint; active feature branch state; HF-Chat-Bridge repository boundary/current transport status.

**Risks:** accidentally dropping a binding rule while slimming; duplicating active-state truth; making Bridge or public Witch Dock part of feature runtime architecture.

**Mitigation:** binding core retained in compact contract; detailed rules moved to targeted policy files; active texture truth routed through `ACTIVE_CONTEXT.md` + current-state/evidence ledger; public Witch Dock/runtime source untouched.

**Validation:** Git tree/diff review after commit; confirm documentation-only paths and no JavaScript/runtime files changed.

**Runtime/public impact:** none. No JavaScript, HeroForge runtime behavior, bridge runtime behavior, or public Witch Dock behavior changes.

---

## PFC-2026-09-12-020 — Canonical texture investigation checkpoint

**Scope:** documentation-only cross-chat checkpoint created after repeated investigation handoff loss/retesting risk.

**Targets:** `docs/investigations/INV-0004-current-state-2026-09-12.md`, `CHANGELOG.md`.

**Reviewed:** current Blood Moon runtime findings and prior handoff exclusions, including generic channel rebakes, color-cache invalidation, skinMask mismatch, `k_107`, meteorHammer mapping, and paint/gradient path findings.

**Risk:** recording inference as fact or accidentally reopening ruled-out paths.

**Result:** checkpoint explicitly separates confirmed/support/hypothesis and binds DO-NOT-REPEAT results pending new evidence.

**Runtime/public impact:** none. Documentation only.

---

## Historical records

Verbose preflight history through 2026-09-11 remains in Git history at and before commit `19234039cd4993f4a17b47123a9150d1c5a4fd83` (and earlier branch history). Fetch/search a historical record only when that specific change is relevant.

Future entries should stay concise and reference the feature investigation/evidence record rather than restating it.
