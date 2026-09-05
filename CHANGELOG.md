# Changelog

## HFC-2026-09-05-015 — Record Photo Booth Witch Dock Stable promotion

Date: 2026-09-05

### Summary

Documentation-only status update recording promotion of validated `media.screenshot-resolution` into public Witch Dock Stable after WITCH_DEV_PHOTO integration testing.

### Confirmed integration result

- Current Lob/ADP remained installed unchanged.
- Lob's existing 4096 and 8192 choices in HeroForge's own Photo Booth UI both routed through the Witch Dock Dev provider and produced correct repaired captures.
- Amanda reported both native-HeroForge-UI paths worked perfectly.
- Witch Dock direct TRUE 4K/8K capture also worked after cycling the provider toggle.
- The direct-button initial disabled state was diagnosed as UI readiness after pre-Booth provider installation; capture math/provider behavior remained valid.
- Public Witch Dock commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95` promotes the exact Dev-tested provider plus a narrow public readiness adapter.

### Status

- standalone: validated;
- Witch Dock Dev: validated with Lob present;
- Witch Dock Stable: promoted; clean public refresh smoke pending;
- Lob-absent native HeroForge resolution-menu adapter: pending separately;
- primary feature maintainer: unresolved; Amanda is not silently assigned feature maintenance by this promotion.

### Runtime impact

**No Compatibility runtime behavior changed.** `entries/tampermonkey-standalone/photo-booth-true-resolution.user.js` remains the validated v0.6 regression baseline. This commit updates durable documentation only.

### Touched files

- `MASTER.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- `TESTING.md`
- `docs/feature-specs/photo-booth-screenshot-resolution.md`
- `docs/investigations/INV-0003-photo-booth-high-res-capture-2026-09-05.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

---

Historical changelog entries through HFC-2026-09-05-014 remain preserved in Git history at/before `dfd1b7cca5a9c8a281b6a61216a7173918448360`.
