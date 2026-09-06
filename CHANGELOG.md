# Changelog

## HFC-2026-09-06-025 — Diagnose 3072 render-source loss and add TRUE-3K repair companion

Date: 2026-09-06

### Summary

Closed the key 3072 fidelity diagnosis: HeroForge's native 3072 screenshot path does not feed the Effects/model layer from one 3072 render. Live runtime tracing shows the 3072 capture camera is paired with **768x768 `CK.Effects.renderToCanvas` calls**, explaining how the final canvas/WebP can be structurally 3072 while appearing blurred/upscaled.

Added a standalone TRUE-3K repair companion that reuses the already-live-validated 16-frame Short Test and substitutes each native 3K phase from one real 3072 Effects source per animation frame.

### Newly confirmed runtime evidence

HF-Chat-Bridge after clean reload confirmed:

- Power runtime restored/idle and `CK.Effects.renderToCanvas` native after the earlier expired trace attempt;
- 1024 screenshot path: `renderToCanvas(1024,1024,camera1024)`;
- 2048 screenshot path: repeated `renderToCanvas(1024,1024,camera2048)` phase/tile renders;
- 3072 screenshot path: `renderToCanvas(768,768,camera3072)` phase/tile renders;
- `CK.Effects.renderToCanvas` itself sizes its render target from the supplied width/height.

The previously added 16-frame Short Test was also exercised live by the user and worked correctly as a fast diagnostic, while reproducing the same blurry 3072 fidelity failure.

### New standalone candidate

`entries/tampermonkey-standalone/spinny-mini-webp-3k-repair-companion.user.js`

Version: `0.1.0`

Build: `0.1.0-3072-effects-source-phase-feed`

Behavior:

- requires the existing profile test and Short Test companion;
- adds `TRUE 3K Test` to the existing test panel;
- calls the existing 16-frame Short Test capture/encode/mux path rather than duplicating it;
- temporarily wraps `CK.Effects.renderToCanvas` only during the explicit TRUE-3K test;
- detects the live native 3072 tiled/phase topology instead of hard-coding one fixed phase count;
- for each animation frame, renders one genuine 3072x3072 Effects source;
- derives each native phase canvas from that source using the same interleaved phase-feed principle already validated by the TRUE 4K/8K still-capture repair;
- records per-frame tile size, grid, expected/supplied phases, source render count and restoration state;
- delegates cancellation to the existing Short Test cancel path;
- restores the original `CK.Effects.renderToCanvas` in `finally`.

### Collision avoidance

The candidate deliberately does **not** replace or wrap `BT.maker.takeScreenshot`.

That method remains owned by the public Witch Dock TRUE-resolution provider for its 4096/8192 routing. This avoids triggering the provider's ownership-loss/degraded state while still allowing 3072 frames to pass through the provider's normal non-4096/8192 upstream path.

### Validation status

- TRUE-3K repair companion `node --check`: **PASS**.
- baseline 16-frame Short Test: **PASS as diagnostic** by user report.
- baseline 3072 Short Test visual fidelity: **FAIL / blurry**, as expected.
- TRUE-3K repaired Short Test visual fidelity: pending live test.
- main Spinny v0.2.2: unchanged.
- validated 1024/2048 behavior: unchanged.
- public Witch Dock: unchanged.

### Touched files

- `entries/tampermonkey-standalone/spinny-mini-webp-3k-repair-companion.user.js` (new)
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `TESTING.md`
- `docs/feature-specs/spinny-mini-webp.md`
- `docs/investigations/INV-0004-spinny-mini-webp-2026-09-05.md`

**Runtime behavior changed:** yes, standalone diagnostic repair companion only. Existing Spinny scripts and public Witch Dock are unchanged.

---

## HFC-2026-09-06-024 — Add Spinny Short Test companion and reject current 3072 fidelity

Recorded the structurally correct but visually blurry 3072 full run and added the 16-frame partial-spin diagnostic. The Short Test has since passed live as a diagnostic and reproduced the expected 3072 blur.

---

Historical changelog entries through HFC-2026-09-05-023 remain preserved in Git history.
