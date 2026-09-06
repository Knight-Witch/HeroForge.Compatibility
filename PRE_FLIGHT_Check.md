# Pre-Flight Check Log

## PFC-2026-09-06-021 — Add TRUE-3K Effects-source repair companion

Date: 2026-09-06

### Target files

- `entries/tampermonkey-standalone/spinny-mini-webp-3k-repair-companion.user.js` (new)
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `TESTING.md`
- `docs/feature-specs/spinny-mini-webp.md`
- `docs/investigations/INV-0004-spinny-mini-webp-2026-09-05.md`

### Required material reviewed

- binding `PROJECT_CONTRACT.md`;
- branch head before this stage: `6ea2c5ce3188994016362c8f84abb78c1c17bc44`;
- `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`;
- current Spinny feature spec/investigation;
- v0.2.2 profile source and v0.1.0 Short Test source;
- validated standalone/Witch Dock TRUE-resolution still-capture implementation;
- live user result that the 16-frame 3072 baseline Short Test works correctly as a diagnostic but remains visually blurry;
- HF-Chat-Bridge runtime source read and asynchronous 1024/2048/3072 render-path trace after a clean page reload.

### Newly confirmed render-path findings

- The Short Test diagnostic itself is live-validated and reproduces the same 3072 blur in a small partial spin.
- `CK.Effects.renderToCanvas` is the relevant named render seam: it sizes its Effects render target from the width/height passed by the Booth capture path.
- Live trace confirms a 1024 screenshot calls `CK.Effects.renderToCanvas(1024, 1024, camera1024)`.
- Live trace confirms a 2048 screenshot uses repeated `renderToCanvas(1024, 1024, camera2048)` phase/tile renders rather than one native 2048 Effects source.
- Live trace confirms the 3072 screenshot path drops those Effects renders to **768x768** while the capture camera remains 3072x3072.
- Therefore the current 3072 file can be structurally 3072 while its Effects/model source fidelity is materially lower. This directly explains why canvas/WebP dimension validation passed while visual detail failed.
- The existing validated TRUE-resolution still provider already repairs this class of tiled/phase capture by feeding native compositor phases from a real high-resolution Effects source.

Supported topology inference:

- 3072 / 768 = 4, matching a 4x4 native phase grid under the existing validated `classifyModelRender` contract;
- the repair candidate does not hard-code 16 phases: it derives and validates the live grid/tile relationship per run and fails on topology mismatch.

### Runtime change intent

Add a standalone diagnostic repair companion that:

- requires the existing v0.2.2 profile test and v0.1.0 Short Test companion;
- adds a separate `TRUE 3K Test` action to the existing panel;
- invokes the already-working 16-frame Short Test capture/mux path rather than duplicating it;
- temporarily wraps only `CK.Effects.renderToCanvas` for the duration of that explicit test;
- when native Booth requests a tiled 3072 frame, renders **one real 3072x3072 Effects source for that animation frame**;
- derives the native phase canvases by interleaving pixels from that real 3072 source using the same validated phase-feed principle as TRUE 4K;
- leaves `BT.maker.takeScreenshot` ownership untouched, avoiding collision with the public Witch Dock 4096/8192 provider;
- restores the exact original `CK.Effects.renderToCanvas` in `finally`;
- records per-frame tile/grid/phase/source diagnostics under `HFSpinnyMiniWebP3KRepair`;
- routes cancellation through the already-validated Short Test cancel path.

### Preserved behavior

- main Spinny v0.2.2 source remains unchanged;
- baseline Short Test v0.1.0 source remains unchanged;
- validated 1024/2048 profile behavior remains unchanged;
- existing Short Test rotation, refresh/occlusion, WebP encode/mux, parser, download and cancel mechanics remain the execution path;
- public Witch Dock 4K/8K provider remains unchanged and retains ownership of `BT.maker.takeScreenshot` for 4096/8192;
- 4K Spinny remains deferred;
- no bundle patching or minified/private encoder dependency is introduced.

### Material risks

- `CK.Effects.renderToCanvas` is temporarily wrapped across the 16-frame test; unrelated render calls are passed through unless they match a 3072 capture-camera topology.
- One real 3072 Effects source is approximately 36 MiB RGBA before phase extraction; only one frame source is retained at a time and it is released after its phase feed completes.
- Native Booth topology can change. The candidate validates tile size, grid, phase coordinates, duplicate phases and complete phase delivery and fails rather than guessing.
- Camera/Booth interaction guards are not implemented yet; the user must still avoid camera/Booth changes during the diagnostic.
- A visual TRUE-3K PASS is still required. This commit does not claim repaired 3072 support before live testing.

### Test status before commit

- `spinny-mini-webp-3k-repair-companion.user.js`: local `node --check` **PASS**.
- baseline 3072 Short Test: **PASS as diagnostic / fidelity still FAIL** by user report.
- TRUE 3K repaired Short Test: pending live validation.
- Public Witch Dock: untouched.

### Recommended action

Install the TRUE-3K repair companion alongside the existing profile + Short Test scripts, select **3072px + Standard**, and run **TRUE 3K Test**. Accept the repair only if the downloaded partial WebP shows genuinely improved native-size detail and diagnostics confirm complete per-frame phase feeds with Effects restoration. Do not run another full 3072 spin until this short gate passes.

**Runtime behavior changed:** yes, standalone diagnostic repair companion only. Existing profile/Short Test code and public Witch Dock are unchanged.

---

## PFC-2026-09-06-020 — Add short partial-spin diagnostic companion after 3072 fidelity failure

Recorded the 3072 fidelity failure and added the 16-frame Short Test diagnostic companion. That helper has since passed live as a rapid diagnostic and reproduced the expected 3072 blur.

**Runtime behavior changed:** standalone diagnostic companion only.

---

Historical pre-flight records through PFC-2026-09-05-019 remain preserved in Git history.
