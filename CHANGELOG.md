# Changelog

## HFC-2026-09-06-026 — Validate TRUE-3K repaired Short Test

Date: 2026-09-06

### Summary

Recorded the first successful TRUE-3K repaired Spinny Short Test. The prior native 3072 path was already diagnosed as structurally 3072 but source-fidelity degraded because HeroForge requested 768x768 `CK.Effects.renderToCanvas` phases under a 3072 capture camera.

The standalone TRUE-3K repair companion fed those native phases from one genuine 3072x3072 Effects source per animation frame. Both runtime diagnostics and native-size user inspection passed.

### Live validation result

Build: `0.1.0-3072-effects-source-phase-feed`.

- status: PASS;
- elapsed: ~30.448 s;
- 16 animation frames;
- native tile size: 768;
- native grid: 4x4;
- 16 expected / 16 supplied / 16 unique phases per frame;
- one 3072x3072 Effects source render per frame;
- 256 total supplied phases;
- output: 4,589,972 bytes;
- parser: 3072x3072 / 16 frames / 640 ms / 40 ms x16 / loop 0;
- figure rotation restored: true;
- `CK.Effects.renderToCanvas` restored: true;
- repair error: null;
- Short Test error: null;
- user visual inspection at native size: **PASS — genuinely sharper 3K detail, no longer the blurry/upscaled baseline**.

### Decision

The TRUE-3K **frame-source repair is validated** on `heroforge07.1.9.98`.

The maintained Spinny implementation should now absorb this repair rather than require the stacked diagnostic companion. Native HeroForge 3072 without the repair remains rejected.

A full repaired 3072 Standard / 250-frame revolution is still required before the complete 3072 production profile is considered validated.

### Touched files

Documentation only:

- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `TESTING.md`
- `docs/feature-specs/spinny-mini-webp.md`
- `docs/investigations/INV-0004-spinny-mini-webp-2026-09-05.md`
- `docs/validation/spinny-mini-webp-true3k-repair-2026-09-06.md` (new)

**Runtime behavior changed:** no. Documentation-only validation checkpoint.

---

## HFC-2026-09-06-025 — Diagnose 3072 render-source loss and add TRUE-3K repair companion

Confirmed native 3072 uses 768px Effects phase renders and added the standalone TRUE-3K phase-feed candidate. That candidate has now passed the live Short Test gate in HFC-2026-09-06-026.

---

## HFC-2026-09-06-024 — Add Spinny Short Test companion and reject current 3072 fidelity

Recorded the structurally correct but visually blurry native 3072 full run and added the 16-frame partial-spin diagnostic.

---

Historical changelog entries through HFC-2026-09-05-023 remain preserved in Git history.
