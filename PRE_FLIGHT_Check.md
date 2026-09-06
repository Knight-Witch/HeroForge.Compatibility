# Pre-Flight Check Log

## PFC-2026-09-06-028 — Record Witch Dock Stable Spinny v1.1.0 promotion

Date: 2026-09-06

### Scope

Record the completed narrow promotion of validated `media.spinny-mini-webp` into public Witch Dock v1.1.0 and set the remaining gate to one clean public Stable smoke.

### Required material reviewed

- `PROJECT_CONTRACT.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `ARCHITECTURE.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- `TESTING.md`
- `docs/feature-specs/spinny-mini-webp.md`
- maintained standalone Spinny v0.5.0 source/status
- final Witch Dock Dev Spinny service/UI and hardening result
- public Witch Dock `Witch_Dock.user.js`, `manifest.json`, true-resolution provider boundary, promotion candidate and final public branch state

### Confirmed findings

- Maintained standalone Spinny v0.5.0 remains validated on `heroforge07.1.9.98`.
- Final Witch Dock Dev service v0.5.1 / UI v0.1.1 passed integrated placement, popout, Pause/Resume, cancel, ETA and guard testing.
- Final Dev hardening re-smoke passed privileged WebP download and silent wheel/scroll suppression.
- The user reported the integrated feature works perfectly and explicitly approved public rollout.
- Public `Witch_Scripts` was advanced to commit `8d96dd803f452c3c7b623c6963b4fdb3ef762f59`, releasing Witch Dock v1.1.0.
- The Stable promotion was a narrow accepted delta, not a wholesale merge of `WITCH_DEV_UI`.
- Public Stable now includes Spinny service/UI plus the userscript-level `GM_download` host.
- Developer Mode, compact High Res UI, Dev module registry, Dev loader and unrelated Dev changes were not promoted.
- Existing 4096/8192 still-provider ownership remains unchanged.
- 4096 animated WebP remains deferred.
- A clean public v1.1.0 smoke has not yet been performed, so Stable status is promoted/pending-smoke rather than fully Stable validated.

### Material risks checked

- No dependency on HF-Chat-Bridge or the unstable HFC head was introduced into public Witch Dock.
- Spinny does not assign/replace `BT.maker.takeScreenshot`; 1024/2048/3072 continue through the public still provider's passthrough boundary.
- Repaired 3072 still uses the bounded temporary `CK.Effects.renderToCanvas` adapter.
- Short Test remains service-owned but hidden in ordinary public Stable because Developer Mode is not part of this release.
- The optional transient download-complete UI flash was not observed in the final Dev smoke and is explicitly non-gating.

### Decision

Record the Stable promotion as complete. Next gate is one clean public v1.1.0 smoke at 1024 Standard; do not reopen expensive standalone/TRUE-3K validation absent a regression.

**Runtime behavior changed:** no in HeroForge.Compatibility. This is a documentation-only checkpoint recording an external consumer promotion already completed in `Knight-Witch/KnightWitch.Heroforge`.

---

Historical pre-flight records through PFC-2026-09-06-027 remain preserved in Git history at and before commit `566ad6b4284faf979c3771895d98da5e267f2345`.
