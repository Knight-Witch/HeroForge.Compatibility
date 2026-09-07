# Pre-Flight Check Log

## PFC-2026-09-06-030 — Record public Decals/Utilities host relocation

Date: 2026-09-06

### Scope

Record the completed public Witch Dock module-only promotion that moves the corrected bound decal gizmo controls from Decals to Utilities and leaves a Decals placeholder for upcoming tools.

### Required material reviewed

- `PROJECT_CONTRACT.md`, `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`;
- current `decals.gizmo.bound-correction` Stable status and ownership boundary;
- validated Witch Dock Dev host-relocation commit `40fa227f13a79c5283f989c23b82485a273a2c53`;
- public Witch Dock promotion commit `9fa5c52fdbe2de220457a961be05e633d4b89349`.

### Confirmed findings

- Dev live validation passed the Decals placeholder, single Utilities gizmo section, persisted checkbox state, toggle OFF/ON, and Move/Rotate/Scale selection;
- public Stable promotion changed only the Decals/Utilities host modules, their canonical registry versions, and Stable tracking docs;
- corrected-gizmo service/runtime and all five source fragments were protected by hash checks and remained unchanged;
- public Witch Dock userscript shell remains v1.2.0 because the change is manifest/module delivered;
- no HeroForge.Compatibility runtime source changed.

### Decision

Record the public host relocation. Keep `decals.gizmo.bound-correction` Stable validated; the only remaining current public gate is the existing cheap v1.2.0 smoke with the latest module refresh.

**Runtime behavior changed:** no in HeroForge.Compatibility. Documentation-only checkpoint recording an external consumer UI-host promotion.

---

## PFC-2026-09-06-029 — Record public Witch Dock v1.2.0 UI/diagnostics promotion

Date: 2026-09-06

### Scope

Record the completed narrow public Witch Dock v1.2.0 promotion after live Dev validation of tab cleanup, compact High Res service/UI ownership, and Developer Mode public-readiness. Spinny runtime source is intentionally unchanged from public v1.1.0.

### Required material reviewed

- `PROJECT_CONTRACT.md`, `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`;
- `docs/feature-specs/spinny-mini-webp.md`;
- public Witch Dock v1.1.0 baseline and v1.2.0 promotion candidate;
- validated `WITCH_DEV_UI` tab presentation, High Res v0.8.0/v0.3.0 split and Developer Mode v0.3.0;
- final public branch `Witch_Scripts` at `b5e366e3f6c06d661e8bc1d59f8cb190ad7401f6`.

### Confirmed findings

- public Witch Dock advanced by fast-forward from v1.1.0 commit `8d96dd803f452c3c7b623c6963b4fdb3ef762f59` to v1.2.0 commit `b5e366e3f6c06d661e8bc1d59f8cb190ad7401f6`;
- promotion remained one narrow commit and did not merge `WITCH_DEV_UI` wholesale;
- protected public Spinny service/UI, Booth, readiness adapter and corrected decal-gizmo hashes remained unchanged during the release gate;
- public v1.2.0 adds validated tab order/cog presentation, High Res service-only/UI-only ownership and About-only Developer Mode v0.3.0;
- Developer Mode reads the active public manifest registry and reveals the existing Spinny Short Test only while enabled;
- all release syntax/manifest/ownership/hash/static gates passed before `Witch_Scripts` advanced;
- user explicitly removed 4096 animated-WebP expansion and Developer Mode hotkey from the active roadmap;
- one clean public v1.2.0 smoke remains before closing the current Stable validation gate.

### Decision

Record the external consumer promotion as complete. Next gate is a cheap public v1.2.0 smoke using Developer Mode + 1024 Short Test; do not repeat expensive full/TRUE-3K production validation absent a regression.

**Runtime behavior changed:** no in HeroForge.Compatibility. Documentation-only checkpoint recording an already-completed external consumer promotion.

---

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
