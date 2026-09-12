# Pre-Flight Check

Compact operational preflight log. Historical verbose records remain in Git history.

Before material committed work:

1. Read `PROJECT_CONTRACT.md` and branch `ACTIVE_CONTEXT.md`.
2. Read only the relevant policy/spec/investigation/source files routed by the task.
3. Inspect target files and directly connected modules.
4. Identify material conflict/rollback risks.
5. Define the narrow validation required.

Do not reread the entire changelog, old preflight history, unrelated root docs, or archived investigations merely for process.

## PFC-2026-09-12-020 — Main governance/context refactor

**Scope:** documentation/governance only.

**Targets:** `PROJECT_CONTRACT.md`, `ACTIVE_CONTEXT.md`, README, `CHANGELOG.md`, `PRE_FLIGHT_Check.md`, targeted policy files under `docs/policies/`.

**Reviewed:** existing binding contract; current main branch role/status; active texture work being isolated on `feature/rendering-texture-quality`; HF-Chat-Bridge/public Witch Dock repository boundaries.

**Risks:** losing binding rules while slimming; falsely presenting feature-branch work as merged main behavior; creating duplicate current-state sources.

**Mitigation:** binding core retained in compact contract; detailed rules moved to targeted policy files; main active context acts only as a router; texture details remain on its feature branch.

**Validation:** final Git tree/diff review confirming documentation-only paths.

**Runtime/public impact:** none. No JavaScript, HeroForge runtime behavior, bridge runtime behavior, or public Witch Dock behavior changed.

---

Historical main-branch preflight detail remains in Git history at/before `732dae09e83d712a26ac383f7b64ce9e27e07a59`. Fetch an old record only when that specific change matters.
