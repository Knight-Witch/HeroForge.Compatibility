# Pre-Flight Check Log

## PFC-2026-09-06-023 — Integrate TRUE-3K frame source and retained Short Test into Spinny v0.3.0

Date: 2026-09-06

### Target files

- `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `ARCHITECTURE.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- `TESTING.md`
- `docs/feature-specs/spinny-mini-webp.md`
- `docs/investigations/INV-0004-spinny-mini-webp-2026-09-05.md`

### Required material reviewed

- binding `PROJECT_CONTRACT.md`;
- branch head before this stage: `dcbec1149b9e9e200b82794b9e0161c501ab2e5f`;
- `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`;
- current Spinny feature spec and investigation;
- v0.2.2 maintained profile source;
- validated Short Test companion source;
- validated TRUE-3K repair companion source;
- validation record `docs/validation/spinny-mini-webp-true3k-repair-2026-09-06.md`;
- live bridge diagnostics confirming 768px native 3K phase topology and successful repaired 16-frame run;
- user decision that Short Test should remain a maintained diagnostic capability and later be exposed in Witch Dock only through Developer Mode.

### Confirmed findings before edit

- Native 3072 output is structurally correct but source-fidelity degraded.
- Current HeroForge 3072 capture uses a 3072 capture camera with 768x768 Effects phase renders.
- Feeding those phases from one real 3072x3072 Effects source per animation frame produces visibly correct true-3K output.
- The repair companion completed 16 repaired frames with full 4x4 phase coverage, restored figure rotation, restored `CK.Effects.renderToCanvas`, and reported no errors.
- Public Witch Dock TRUE-resolution still capture already owns square 4096/8192 `BT.maker.takeScreenshot` routing.

### Runtime change intent

Promote the validated frame-source repair into the maintained standalone Spinny profile implementation as v0.3.0.

v0.3.0 must:

- preserve 1024/2048 native frame capture;
- activate TRUE-3K repair only for 3072;
- keep the existing Standard / Slow / Slower / Very Slow timing profiles at 40 ms/frame;
- preserve progress, ETA, immediate static-WebP encode, deterministic animated-WebP mux, parser gates, cancel-after-current-frame, and figure rotation restoration;
- add a reusable 16-frame `captureShortTest()` operation to the same engine;
- preserve the selected full profile's angular spacing during Short Test;
- wrap `CK.Effects.renderToCanvas` only for one explicit 3072 frame capture and restore it immediately;
- never replace `BT.maker.takeScreenshot` ownership;
- collect per-frame TRUE-3K topology/restoration diagnostics;
- isolate ETA history by frame-source path so the old native/blurry 3072 timing cannot seed repaired 3K estimates;
- allow Short Test frame timing to help estimate later full runs without reusing the Short Test's small mux-tail estimate.

### Short Test product decision

Short Test is no longer considered disposable functionality.

- The Spinny feature/service owns `captureShortTest()`.
- Standalone test UI exposes Short Test directly because the standalone script is a development harness.
- Future Witch Dock normal UI will hide the Short Test action.
- Witch Dock Developer Mode will control only the visibility of Short Test and developer diagnostics via `KWDeveloperMode.enabled` / `onChange()`.
- Developer Mode must not duplicate capture logic.

### Material risks

- 3072 still depends on undocumented HeroForge tiled-phase topology at `CK.Effects.renderToCanvas`.
- The adapter must fail rather than guess if tile size, grid, phase offsets, duplicate phases, or source size change.
- Each repaired frame temporarily holds one 3072x3072 RGBA Effects source (~36 MiB) plus transient phase canvases; raw repaired frames are not accumulated across the animation.
- v0.3.0 consolidates previously stacked test behavior into one maintained script, so lower-resolution regression smoke is required before promotion.
- Camera/Booth interaction remains unguarded in this checkpoint.
- Full repaired 3072 / 250-frame resource behavior is still unvalidated.

### Static test status before commit

Local candidate `spinny-mini-webp-profiles.user.js` v0.3.0:

- `node --check`: PASS;
- version/build identifiers: PASS;
- all four speed profiles retain 40 ms/frame: PASS;
- 1024/2048/3072 selections present: PASS;
- full capture, Short Test, cancel APIs present: PASS;
- figure rotation restoration path present: PASS;
- per-frame Effects restoration path present: PASS;
- no assignment/replacement of `BT.maker.takeScreenshot`: PASS;
- TRUE-3K timing path isolated from native 3072 timing: PASS;
- Short Test frame count fixed at 16: PASS.

### Live validation required after commit

1. Disable the older standalone Short Test and TRUE-3K repair companion to avoid duplicate controls.
2. Install v0.3.0.
3. Open Photo Booth; select 3072 + Standard.
4. Run integrated **Short Test**.
5. Require sharp native-size 3K output, 3072x3072 / 16 frames / 40 ms x16 parser output, one true source per repaired frame, complete phase feed, Effects restoration and rotation restoration.
6. If PASS, run full repaired 3072 Standard / 250 frames.
7. Recheck 1024 Standard or 2048 Standard before any Witch Dock integration if needed to close consolidation regression risk.

**Runtime behavior changed:** yes — maintained standalone Spinny candidate v0.3.0. Public Witch Dock unchanged.

---

## PFC-2026-09-06-022 — Record TRUE-3K repaired Short Test validation

Recorded the successful TRUE-3K 16-frame mechanical + visual gate. No runtime code changed in that checkpoint.

---

Historical pre-flight records remain preserved in Git history.
