# Changelog

## HFC-2026-09-06-034 — Record Witch Dock Decals/Utilities host relocation

Date: 2026-09-06

### Summary

Recorded the public Witch Dock module-only promotion that rehomes corrected bound decal gizmo controls under Utilities and leaves a Decals placeholder for upcoming tools.

### External consumer status

- validated Dev host-relocation commit: `40fa227f13a79c5283f989c23b82485a273a2c53`;
- public Witch Dock Stable commit: `9fa5c52fdbe2de220457a961be05e633d4b89349`;
- public `decals-dev`: v1.1.0;
- public `utilities`: v1.1.0;
- corrected bound decal gizmo runtime: unchanged v1.1.0 / build `1.1.0-stable-undo-transform-preserve`;
- public Witch Dock shell: unchanged v1.2.0.

The public gate protected the corrected-gizmo loader/fragments and media runtimes from modification.

### HFC runtime impact

**No HeroForge.Compatibility runtime behavior changed.** This is a documentation-only external-consumer checkpoint.

---

## HFC-2026-09-06-033 — Record Witch Dock v1.2.0 UI/Developer Mode promotion

Date: 2026-09-06

### Summary

Recorded public Witch Dock v1.2.0 after the separately validated tab, High Res ownership and Developer Mode deltas were narrowly promoted to Stable.

### External consumer status

- validated Developer Mode Dev candidate: v0.3.0 / build `0.3.0-public-ready-manifest-source`, Dev head `85f386cf9b7b8a361d2162a0cec8081784a15e66`;
- public Witch Dock v1.2.0 commit: `b5e366e3f6c06d661e8bc1d59f8cb190ad7401f6`;
- public High Res service/UI: v0.8.0 / v0.3.0;
- public Developer Mode: v0.3.0, optional/default-OFF and About-only;
- public canonical module registry now follows the active Stable manifest;
- public Spinny service/UI source remains unchanged from v1.1.0;
- protected Spinny/Booth/readiness/decal-gizmo hashes and release static gates passed;
- public v1.2.0 clean smoke remains pending.

4096 animated-WebP expansion and a Developer Mode hotkey are no longer active roadmap items and require no further work unless explicitly reopened.

### HFC runtime impact

**No HeroForge.Compatibility runtime behavior changed.** Maintained standalone Spinny remains v0.5.0 / build `0.5.0-integrated-pause-interaction-guards`. This commit updates durable project state only.

---

## HFC-2026-09-06-032 — Record Witch Dock Stable Spinny v1.1.0 promotion

Date: 2026-09-06

### Summary

Recorded the completed public Witch Dock Stable promotion of `media.spinny-mini-webp` after standalone and integrated Dev validation.

### External consumer status

- final Witch Dock Dev hardening commit: `fa75a9c1790009b4b4ae1a1162d419982e20545e`;
- final Dev service: v0.5.1 / build `0.5.1-witch-dock-dev-download-scroll-guard`;
- final Dev UI: v0.1.1 / build `0.1.1-dev-download-ux`;
- final Dev re-smoke: privileged WebP download PASS;
- final Dev re-smoke: silent wheel/scroll block PASS;
- user explicitly approved public rollout;
- public Witch Dock promotion commit: `8d96dd803f452c3c7b623c6963b4fdb3ef762f59`;
- public Witch Dock userscript version: `1.1.0`;
- public Stable state: promoted, one clean public smoke pending.

The Stable release is a narrow accepted delta. It does not merge Developer Mode, compact High Res UI, Dev module registry, Dev loader, or unrelated `WITCH_DEV_UI` work.

Existing public 4096/8192 still-capture ownership remains unchanged and 4096 animated WebP remains deferred.

### HFC runtime impact

**No HeroForge.Compatibility runtime behavior changed.** Maintained standalone Spinny remains v0.5.0 / build `0.5.0-integrated-pause-interaction-guards`. This commit updates durable project state only.

### Next gate

Run one clean public Witch Dock v1.1.0 smoke at 1024 Standard with Dev/temporary Spinny scripts disabled. If it passes, close the Stable validation gate with documentation-only checkpoints.

---

Historical changelog records through HFC-2026-09-06-031 remain preserved in Git history at and before commit `566ad6b4284faf979c3771895d98da5e267f2345`.
