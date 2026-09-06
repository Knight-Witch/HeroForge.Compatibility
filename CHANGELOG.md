# Changelog

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
