# Compatibility

Human-readable current HeroForge compatibility status. Historical detail remains available in Git history.

Current media validation target: `heroforge07.1.9.98` / 2026-09-06.

| Component | Current status | Last verified build/date | Notes |
|---|---|---|---|
| `media.screenshot-resolution` | Standalone validated; Witch Dock Stable validated | `heroforge07.1.9.98` / 2026-09-05 | Stable still-capture provider remains closed/validated. |
| `media.spinny-mini-webp` | **v0.2.1 validated at tested 1024/2048 profiles; current 3072 true-resolution fidelity FAILED** | `heroforge07.1.9.98` / 2026-09-06 | 3072 container/frame payloads are structurally 3072, but native-size detail is visibly blurred/upscaled. Short Test companion added; render-path diagnosis pending. |
| `decals.gizmo.bound-correction` | Witch Dock Stable | 2026-09-05 | Validated separately. |
| Character local JSON | Core Save/Load passed live | 2026-09-03 | Lifecycle/repeated-use pending. |
| Projected decal state/control | Runtime path confirmed | September 2026 | Renderer dependency audit pending. |
| HF-Chat-Bridge | Live validated transport; current probe #478 pending pickup | September 2026 | Development-only; not a production dependency. |
| Shared maintained compatibility bridge/Foundation | Not implemented | — | Planned extraction target. |

## Spinny Mini WebP capability contract

Confirmed current capabilities:

- writable `CK.character.display.rotation.y`;
- established `CK.allDisplays` animation/occlusion refresh sequence plus shadow/matrix updates;
- `BT.maker.takeScreenshot(width,height)` frame capture;
- browser `canvas.toBlob('image/webp', quality)` still-WebP encoding;
- project-owned RIFF/VP8X/ANIM/ANMF animated container assembly.

Validated lower-resolution results on `heroforge07.1.9.98`:

- 1024 Standard / 250 frames: PASS;
- 2048 Standard / 250 frames: PASS;
- 1024 Very Slow / 750 frames: PASS;
- 2048 Slower / 500 frames: PASS;
- multiple same-session captures: PASS;
- progress/ETA and rotation restoration: PASS;
- general Cancel path: PASS by user report.

## 3072 capability status

The first 3072 Standard / 250-frame capture completed successfully at the file-structure level in approximately 25 minutes.

Confirmed:

- returned/final animation dimensions: 3072x3072;
- 250 animated frames;
- individual encoded frame payloads are also 3072-sized;
- no evidence that the custom mux itself is wrapping 2048 frame payloads as 3072.

Failed requirement:

- user visual inspection at native size reports the 3072 result is blurry and looks like a lower-resolution render enlarged to 3072.

Therefore current 3072 support is **degraded/unsupported for true-resolution output**. Passing canvas/container dimensions is insufficient evidence of source-raster fidelity.

A follow-up 1024 Standard control capture was visually correct, narrowing the issue to HeroForge's higher-resolution screenshot/render path rather than the general WebP encoder/mux.

## Short Test diagnostic capability

New standalone companion:

`entries/tampermonkey-standalone/spinny-mini-webp-short-test.user.js`

- build `0.1.0-short-test-16f-partial-arc`;
- requires the v0.2.2 profile test;
- captures 16 contiguous samples using the selected profile's normal angular step and frame duration;
- uses the same per-frame HeroForge screenshot path and WebP serialization mechanics;
- records returned canvas-size histogram and final parser/output diagnostics;
- refuses >3072 / 4096 / 8192 sizes;
- live validation pending.

This helper is diagnostic only. It can rapidly show whether a candidate fix visibly produces additional detail, but it does not itself prove HeroForge's hidden internal render-target size.

## Interaction protection trigger

Two accidental mouse-wheel camera changes during the full 3072 capture produced visible animation jumps. This is now a direct revalidation trigger/requirement for planned active-capture camera/Booth interaction protection.

## 4K Spinny incompatibility note

Do not add 4096 Spinny through the current public `BT.maker.takeScreenshot` surface while Witch Dock TRUE-resolution repair is enabled. The provider intentionally intercepts square 4096/8192 requests and routes them through the still-image repair engine.

## Revalidation triggers

Spinny Mini WebP should be re-run when:

- HeroForge screenshot/render source behavior changes;
- a candidate fix claims true 3072 source fidelity;
- character-display rotation/refresh behavior changes;
- browser WebP support/container validation changes;
- capture interaction guards are added;
- high-cost resource limits are observed.

Use Short Test first for resolution-path iteration; reserve a full 3072 run for final confirmation only after visual fidelity passes.
