# Compatibility

Human-readable current HeroForge compatibility status. Historical detail remains available in Git history.

Current media validation target: `heroforge07.1.9.98` / 2026-09-06.

| Component | Current status | Last verified build/date | Notes |
|---|---|---|---|
| `media.screenshot-resolution` | Standalone validated; Witch Dock Stable validated | `heroforge07.1.9.98` / 2026-09-05 | Stable still-capture provider remains closed/validated. |
| `media.spinny-mini-webp` | **Standalone v0.3.0 validated for tested production profiles** | `heroforge07.1.9.98` / 2026-09-06 | 1024/2048 validated; native 3072 rejected; repaired TRUE-3K validated through 16f Short Test, 250f full and 500f full. Pause/interaction guards next. |
| `decals.gizmo.bound-correction` | Witch Dock Stable | 2026-09-05 | Validated separately. |
| Character local JSON | Core Save/Load passed live | 2026-09-03 | Lifecycle/repeated-use pending. |
| Projected decal state/control | Runtime path confirmed | September 2026 | Renderer dependency audit pending. |
| HF-Chat-Bridge | Live validated development transport | September 2026 | Development-only; not a production dependency. |
| Shared maintained compatibility bridge/Foundation | Not implemented | — | Planned extraction target. |

## Spinny capability contract

Confirmed named/runtime capabilities:

- writable `CK.character.display.rotation.y`;
- established display/occlusion/shadow/matrix refresh sequencing;
- `BT.maker.takeScreenshot(width,height)`;
- `CK.Effects.renderToCanvas(width,height,camera,aa)`;
- browser static WebP encoding via `canvas.toBlob('image/webp', quality)`;
- project-owned RIFF/VP8X/ANIM/ANMF animated WebP mux.

## Validated production profiles / behaviors

- 1024 Standard / 250 frames: PASS, including v0.3.0 post-consolidation regression
- 2048 Standard / 250 frames: PASS
- 1024 Very Slow / 750 frames: PASS
- 2048 Slower / 500 frames: PASS
- 3072 Standard / 250 frames via TRUE-3K: PASS by full-run user validation
- 3072 Slower / 500 frames via TRUE-3K: PASS by full-run user validation and successful runtime timing-history write
- integrated 3072 Short Test / 16 frames: PASS
- repeated captures / parser / rotation restoration: PASS
- progress/ETA: PASS on tested captures
- general Cancel path: PASS by user report

## Native 3072 incompatibility

A native un-repaired 3072 capture can be structurally 3072 while visibly losing source fidelity.

Live tracing confirmed:

- 1024 capture uses a 1024 Effects render;
- 2048 capture uses repeated 1024 Effects phases;
- 3072 capture uses repeated 768 Effects phases under a 3072 capture camera.

Current native `CK.Effects.renderToCanvas` sizes its render target from the supplied dimensions. Therefore native 3072 output dimensions do not imply 3072 source fidelity.

Status: native 3072 remains **unsupported/rejected**.

## TRUE-3K repaired frame-source capability

Maintained v0.3.0 behavior:

- 1024/2048 use native frame source;
- 3072 uses a temporary `CK.Effects.renderToCanvas` phase-feed adapter;
- one genuine 3072x3072 Effects source feeds the native compositor's validated phase topology;
- the adapter validates tile/grid/phase completeness and source size;
- the exact Effects method is restored after each repaired frame;
- `BT.maker.takeScreenshot` ownership is never displaced.

This remains compatible with Witch Dock's current still-provider ownership boundary because the still provider owns square 4096/8192 screenshot routing while Spinny repairs 3072 one layer lower.

## Final v0.3.0 runtime evidence

HF-Chat-Bridge issue #491 confirmed the post-consolidation 1024 Standard run:

- 250/250 rendered and encoded;
- parser 1024x1024 / 250 frames / 10,000 ms / 40 ms x250 / loop 0;
- output 12,035,026 bytes;
- rotation restored true;
- error null.

The same runtime retained a successful `3072:true3k-phase-feed` history record for a 500-frame full run with average frame time ~3032.42 ms and tail ~373.7 ms. v0.3.0 writes that history only after successful mux/parser/download. User native-size inspection of the 500-frame output passed.

## Short Test compatibility policy

Short Test is retained as a supported diagnostic operation of the Spinny service.

- standalone test harness: directly visible;
- Witch Dock normal mode: hidden;
- Witch Dock Developer Mode: visible through the Spinny UI consuming `KWDeveloperMode.enabled` / `onChange()`;
- Developer Mode controls visibility only and does not implement capture behavior.

## Revalidation triggers

Re-run Spinny validation when:

- HeroForge screenshot/render tile topology changes;
- `CK.Effects.renderToCanvas` behavior or camera-view shape changes;
- a GPU reports limits below the selected repaired source size;
- character-display rotation/refresh behavior changes;
- browser WebP support/container validation changes;
- capture Pause/interaction guards are added;
- Witch Dock host integration changes lifecycle/visibility behavior;
- high-cost resource limits are observed.

Use the integrated Short Test first for future 3072 compatibility checks.

## 4K Spinny incompatibility note

Do not add 4096 Spinny through the current public `BT.maker.takeScreenshot` surface while Witch Dock TRUE-resolution still repair is enabled. The provider owns square 4096/8192 requests. 4K Spinny remains deferred until a separately designed explicit frame-capture capability/bypass is validated.
