# Compatibility

Human-readable current HeroForge compatibility status. Historical detail remains available in Git history.

Current media validation target: `heroforge07.1.9.98` / 2026-09-06.

| Component | Current status | Last verified build/date | Notes |
|---|---|---|---|
| `media.screenshot-resolution` | Standalone validated; Witch Dock Stable validated | `heroforge07.1.9.98` / 2026-09-05 | Stable still-capture provider remains closed/validated. |
| `media.spinny-mini-webp` | **v0.2.1 validated at tested 1024/2048 profiles; native 3072 fidelity FAILED; TRUE-3K repair candidate pending** | `heroforge07.1.9.98` / 2026-09-06 | Baseline 3072 output is structurally 3072 but internally uses 768px Effects tiles. Short Test diagnostic is live-validated. TRUE-3K phase-feed companion awaits visual validation. |
| `decals.gizmo.bound-correction` | Witch Dock Stable | 2026-09-05 | Validated separately. |
| Character local JSON | Core Save/Load passed live | 2026-09-03 | Lifecycle/repeated-use pending. |
| Projected decal state/control | Runtime path confirmed | September 2026 | Renderer dependency audit pending. |
| HF-Chat-Bridge | Live validated development transport | September 2026 | Development-only; not a production dependency. |
| Shared maintained compatibility bridge/Foundation | Not implemented | — | Planned extraction target. |

## Spinny Mini WebP capability contract

Confirmed current capabilities:

- writable `CK.character.display.rotation.y`;
- established `CK.allDisplays` animation/occlusion refresh sequence plus shadow/matrix updates;
- `BT.maker.takeScreenshot(width,height)` frame capture;
- named `CK.Effects.renderToCanvas(width,height,camera,aa)` render seam;
- browser `canvas.toBlob('image/webp', quality)` static-WebP encoding;
- project-owned RIFF/VP8X/ANIM/ANMF animated container assembly.

Validated lower-resolution results on `heroforge07.1.9.98`:

- 1024 Standard / 250 frames: PASS;
- 2048 Standard / 250 frames: PASS;
- 1024 Very Slow / 750 frames: PASS;
- 2048 Slower / 500 frames: PASS;
- multiple same-session captures: PASS;
- progress/ETA and rotation restoration: PASS;
- general Cancel path: PASS by user report.

## 3072 native capability — fidelity failure diagnosed

The first 3072 Standard / 250-frame capture completed successfully at the file-structure level in approximately 25 minutes.

Confirmed file result:

- final animation dimensions: 3072x3072;
- 250 animated frames;
- individual encoded frame payloads are also 3072-sized;
- no evidence that the custom mux is relabeling lower-sized frame payloads.

Failed requirement:

- user inspection at native size found the result blurry and visually consistent with lower-resolution content enlarged to 3072.

A 1024 Standard control capture was visually correct.

The 16-frame baseline Short Test was then exercised live and worked correctly as a rapid diagnostic while reproducing the same 3072 blur.

### Live render-path trace

After a clean page reload, HF-Chat-Bridge Power tracing confirmed:

- 1024 screenshot: `CK.Effects.renderToCanvas(1024,1024,camera1024)`;
- 2048 screenshot: repeated `renderToCanvas(1024,1024,camera2048)` phase/tile renders;
- 3072 screenshot: the capture camera remains 3072x3072 while Effects is requested as **768x768** phase/tile renders.

`CK.Effects.renderToCanvas` sizes its render target from the width/height supplied to it. Therefore a returned/final 3072 canvas does not prove a 3072 scene/Effects source.

This closes the primary fidelity fault boundary: current native 3072 is structurally high-resolution but does not use a full-resolution Effects/model source.

3072 / 768 = 4 per axis under the existing validated tiled-phase classification model. The repair candidate derives and validates the live tile/grid relationship instead of assuming a fixed phase count.

## Short Test diagnostic capability — live validated

`entries/tampermonkey-standalone/spinny-mini-webp-short-test.user.js`

Build: `0.1.0-short-test-16f-partial-arc`.

- requires the v0.2.2 profile test;
- captures 16 contiguous samples using the selected profile's normal angular spacing and frame duration;
- uses the same per-frame HeroForge screenshot path and WebP serialization mechanics;
- downloads a valid partial animated WebP;
- restores starting rotation;
- reproduced the baseline 3072 blur quickly;
- refuses >3072 / 4096 / 8192 sizes.

Result: **PASS as diagnostic infrastructure**. It is not itself evidence of repaired true-3K fidelity.

## TRUE-3K repair candidate

`entries/tampermonkey-standalone/spinny-mini-webp-3k-repair-companion.user.js`

Build: `0.1.0-3072-effects-source-phase-feed`.

Candidate contract:

- requires the existing profile + Short Test scripts;
- reuses the live-validated Short Test rotation/capture/encode/mux/download/cancel path;
- temporarily wraps only `CK.Effects.renderToCanvas` during an explicit TRUE-3K test;
- for each native 3072 animation frame, renders one genuine 3072x3072 Effects source;
- derives the native phase canvases from that source using the already-validated TRUE-resolution phase-feed principle;
- validates tile/grid/phase topology and fails on ambiguity or incomplete feeds;
- releases the raw source after each frame's phase feed;
- restores the original Effects method in `finally`;
- does not replace `BT.maker.takeScreenshot`.

The last constraint is important: the public Witch Dock TRUE-resolution provider retains ownership of square 4096/8192 screenshot routing, so the TRUE-3K candidate avoids provider ownership collision entirely.

Status: syntax PASS; live visual fidelity pending.

## Interaction protection trigger

Two accidental mouse-wheel camera changes during the full 3072 capture produced visible animation jumps. Active-capture protection is therefore a demonstrated requirement for later integration.

## 4K Spinny incompatibility note

Do not add 4096 Spinny through the current public `BT.maker.takeScreenshot` surface while Witch Dock TRUE-resolution repair is enabled. The provider intentionally owns square 4096/8192 requests.

4K Spinny remains deferred until a separately designed explicit frame-capture capability/bypass is validated.

## Revalidation triggers

Spinny Mini WebP should be re-run when:

- a candidate fix claims true 3072 source fidelity;
- HeroForge screenshot/render tile topology changes;
- `CK.Effects.renderToCanvas` behavior changes;
- character-display rotation/refresh behavior changes;
- browser WebP support/container validation changes;
- capture interaction guards are added;
- high-cost resource limits are observed.

Use the 16-frame Short Test first for resolution-path iteration. Run a full 3072 revolution only after TRUE-3K Short Test visual fidelity passes.
