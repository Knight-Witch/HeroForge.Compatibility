# Pre-Flight Check

This is the **compact operational preflight log**, not a second investigation history.

Before material committed work:

1. Read `PROJECT_CONTRACT.md` and branch `ACTIVE_CONTEXT.md`.
2. Read only the relevant policy/spec/investigation/source files routed by the task.
3. Inspect target files and directly connected modules.
4. Identify material conflict/rollback risks.
5. Define the narrow validation required for the change.

Do not reread the entire changelog, old preflight history, unrelated root docs, or archived investigations merely for process. Historical verbose preflight records remain durable in Git history.

## PFC-2026-09-12-024 — Native Kitbash reconciliation checkpoint

**Scope:** documentation-only checkpoint after Amanda triggered a decisive native HeroForge reconciliation by entering Kitbash and clicking the figure.

**Targets:** `ACTIVE_CONTEXT.md`, `docs/investigations/INV-0004-current-state-2026-09-12.md`, `docs/investigations/INV-0004-evidence-ledger.md`, `CHANGELOG.md`, `PRE_FLIGHT_Check.md`.

**Reviewed:** compact `PROJECT_CONTRACT.md`; texture branch `ACTIVE_CONTEXT.md`; current INV-0004 state/ledger; broken-generation evidence; corrected scratch/final AtlasBaker pipeline; Bridge #1664/#1666/#1668/#1670/#1671/#1672; Amanda's exact part names and post-Kitbash visual confirmation.

**Confirmed before documentation edit:**

- wrong state was high-res/no-poop but accessory channels wrong in an `8192x4096` generation;
- Kitbash + figure click repaired all visible channels without poop;
- body/decal visual quality remained accepted;
- native rebuilt state is `4096x4096` with scale `4/4/4` and BL/BU/face each `1024x1024`;
- body/head part state remains `bakeSize=2048`, `_usedTextureSize=1024`;
- accessory resource-size/binding state changed during the native generation rebuild;
- all 16 Discus instances are now free of 1x1 AAID/mask fallbacks on color/emissive.

**Material risks:** preserving the stale assumption that the correct state requires a giant protected atlas; overclaiming that one particular resource caused the repair; disturbing the uniquely valuable current correct figure while investigating the event chain.

**Mitigation:** rewrite active/current-state docs around the post-reconcile generation; classify the architecture conclusion as supported rather than final proof; preserve direct-fix failures as DO-NOT-REPEAT evidence; make the next stage read-only source/lifecycle inspection first.

**Validation:** documentation content cross-checked against runtime snapshots and Amanda's visual report. Repository diff must contain documentation files only.

**Runtime/public impact:** none from this commit. The native runtime transition was user-triggered before the documentation update. No JavaScript, HF-Chat-Bridge runtime, or public Witch Dock source changes.

---

## PFC-2026-09-12-023 — Bake-input execution boundary checkpoint

**Scope:** documentation checkpoint after bounded diagnostics narrowed the then-current accessory paint-channel defect.

The later native reconciliation result in PFC-2026-09-12-024 supersedes the old “uniform upload is next” direction and corrects the early scratch/final atlas interpretation. Preserve the underlying observations, but use the newer lifecycle direction for future work.

**Runtime/public impact:** none from the documentation commit.

---

## PFC-2026-09-12-022 — Prior-chat texture evidence audit

**Scope:** documentation-only audit of recoverable prior HF texture investigation context against the canonical evidence ledger.

**Result:** backfilled historical baseline/recipe/dead-end/provenance facts and resolved old mutation-readback ambiguity without reopening completed probes.

**Runtime/public impact:** none.

---

## PFC-2026-09-12-021 — Context/documentation architecture refactor

**Scope:** documentation/governance only.

Created the compact contract/current-context/policy/evidence architecture and selective preflight model.

**Runtime/public impact:** none.

---

## PFC-2026-09-12-020 — Canonical texture investigation checkpoint

**Scope:** documentation-only cross-chat checkpoint.

Established the first durable current-state / DO-NOT-REPEAT handoff for INV-0004.

**Runtime/public impact:** none.

---

## Historical records

Verbose preflight history through 2026-09-11 remains in Git history at and before commit `19234039cd4993f4a17b47123a9150d1c5a4fd83` and earlier branch history. Fetch/search a historical record only when that specific change is relevant.

Future entries should stay concise and reference the feature investigation/evidence record rather than restating it.
