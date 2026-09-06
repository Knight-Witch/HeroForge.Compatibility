# Compatibility

Human-readable current HeroForge compatibility status. Historical detail remains available in Git history.

Current media validation target: `heroforge07.1.9.98` / 2026-09-06.

| Component | Current status | Last verified build/date | Notes |
|---|---|---|---|
| `media.screenshot-resolution` | Standalone validated; Witch Dock Stable validated | `heroforge07.1.9.98` / 2026-09-05 | Stable still-capture provider remains closed/validated. |
| `media.spinny-mini-webp` | **1024/2048 validated; native 3072 rejected; TRUE-3K frame-source repair validated by Short Test** | `heroforge07.1.9.98` / 2026-09-06 | Full repaired 3072 Standard remains pending before complete 3K profile validation. |
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
- browser static WebP encoding through `canvas.toBlob('image/webp', quality)`;
- project-owned RIFF/VP8X/ANIM/ANMF animated WebP mux.

## Validated lower-resolution results

- 1024 Standard / 250 frames: PASS
- 2048 Standard / 250 frames: PASS
- 1024 Very Slow / 750 frames: PASS
- 2048 Slower / 500 frames: PASS
- repeated captures: PASS
- progress/ETA: PASS
- parser/rotation restoration: PASS
- general Cancel path: PASS by user report

## Native 3072 incompatibility — confirmed

A full native 3072 Standard capture produced a structurally correct 3072x3072 / 250-frame animated WebP but was visibly blurry at native size.

Live render tracing confirmed:

- 1024 capture uses a 1024 Effects render;
- 2048 capture uses repeated 1024 Effects phases;
- 3072 capture uses repeated **768 Effects phases** while retaining a 3072 capture camera.

The current native `CK.Effects.renderToCanvas` sizes its render target from those supplied dimensions. Therefore native 3072 output dimensions do not imply 3072 scene/Effects fidelity.

Status: native 3072 true-resolution output remains **unsupported/rejected**.

## Short Test diagnostic — compatible / validated

`spinny-mini-webp-short-test.user.js` build `0.1.0-short-test-16f-partial-arc` is validated as rapid diagnostic infrastructure. It produces a 16-frame partial animation using normal profile angular spacing/timing and reproduced the native 3072 blur reliably.

## TRUE-3K repair — validated frame-source capability

`spinny-mini-webp-3k-repair-companion.user.js` build `0.1.0-3072-effects-source-phase-feed` passed the repaired Short Test on `heroforge07.1.9.98`.

Confirmed:

- 16 repaired frames;
- native topology: 768 tile, 4x4 grid;
- 16/16 expected/supplied/unique phases per frame;
- one true 3072x3072 Effects source render per frame;
- 256 total phases;
- parsed output: 3072x3072 / 16 frames / 640 ms / 40 ms x16 / loop 0;
- output bytes: 4,589,972;
- rotation restoration: true;
- Effects restoration: true;
- errors: null;
- user native-size fidelity inspection: PASS.

Compatibility conclusion:

**The named `CK.Effects.renderToCanvas` seam can repair 3072 source fidelity without replacing `BT.maker.takeScreenshot`.** This preserves the public Witch Dock 4096/8192 provider's ownership boundary.

The repair still requires runtime topology validation and must fail safely if HeroForge changes tile/grid/phase behavior.

## Remaining 3072 gate

The repair is validated at the frame-source/Short Test level. A maintained full 3072 profile is not yet closed until:

1. the repair is integrated into the maintained standalone Spinny capture path;
2. integrated Short Test passes;
3. one full repaired 3072 Standard / 250-frame revolution passes mechanically and visually.

## Interaction protection trigger

Two accidental mouse-wheel camera changes during the first full 3072 run produced visible animation jumps. Camera and Booth-state guards are therefore required before Witch Dock integration.

## 4K Spinny incompatibility note

Square 4096/8192 `BT.maker.takeScreenshot` requests are currently owned by the Witch Dock TRUE-resolution still provider. 4K Spinny remains deferred until a separate explicit frame-capture capability/bypass is designed and validated.

## Revalidation triggers

Re-run relevant Spinny gates when:

- HeroForge screenshot tile topology changes;
- `CK.Effects.renderToCanvas` behavior changes;
- repaired 3072 capture service changes;
- character rotation/refresh sequencing changes;
- browser WebP support/container behavior changes;
- capture interaction guards are added;
- high-cost resource limits are observed.
