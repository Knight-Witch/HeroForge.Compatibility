# Changelog

## HFC-2026-09-05-016 — Record Photo Booth Stable acceptance

Date: 2026-09-05

### Summary

Documentation-only status update recording final public Witch Dock Stable acceptance of `media.screenshot-resolution`.

### Confirmed public result

- Temporary standalone v0.6 and WITCH_DEV_PHOTO test scripts were disabled for the clean public test.
- Public readiness adapter worked without requiring the repair toggle to be cycled.
- Public HeroForge/Lob 4096 capture routed through Witch Dock and passed perfectly.
- Public HeroForge/Lob 8192 grouped capture routed through Witch Dock and passed perfectly.
- Public Witch Dock direct TRUE 4K capture passed perfectly.
- Public Witch Dock direct TRUE 8K capture passed perfectly.
- Amanda reported the public integration works perfectly.

### Status

- standalone: validated;
- Witch Dock Dev: validated with Lob present;
- Witch Dock Stable: **validated**;
- Lob-absent native HeroForge resolution-menu adapter: pending separately;
- primary feature maintainer: unresolved; Amanda is not silently assigned feature maintenance by this validation.

### Runtime impact

**No Compatibility runtime behavior changed.** `entries/tampermonkey-standalone/photo-booth-true-resolution.user.js` remains the validated v0.6 regression baseline. This commit updates durable documentation only.

### Touched files

- `MASTER.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `TESTING.md`
- `docs/feature-specs/photo-booth-screenshot-resolution.md`
- `docs/investigations/INV-0003-photo-booth-high-res-capture-2026-09-05.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

---

Historical changelog entries through HFC-2026-09-05-015 remain preserved in Git history at/before `94289f9dcb8364fb94cd19e8c8a9838c9c616d95`.
