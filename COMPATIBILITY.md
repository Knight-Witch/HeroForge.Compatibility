# Compatibility

Human-readable current HeroForge compatibility status. Historical detail remains available in Git history.

Current media validation target: `heroforge07.1.9.98` / 2026-09-06.

| Component | Current status | Last verified build/date | Notes |
|---|---|---|---|
| `media.screenshot-resolution` | Standalone validated; Witch Dock Stable validated | `heroforge07.1.9.98` / 2026-09-05 | Stable still-capture provider remains closed/validated. |
| `media.spinny-mini-webp` | Lower-resolution validated; native 3072 rejected; TRUE-3K repair validated at Short Test level; **v0.3.0 integrated candidate pending live** | `heroforge07.1.9.98` / 2026-09-06 | Full repaired 3072 Standard still required before complete 3K profile validation. |
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

## Validated lower-resolution results

- 1024 Standard / 250 frames: PASS
- 2048 Standard / 250 frames: PASS
- 1024 Very Slow / 750 frames: PASS
- 2048 Slower / 500 frames: PASS
- repeated captures: PASS
- progress/ETA: PASS
- parser/rotation restoration: PASS
- general Cancel path: PASS by user report

## Native 3072 incompatibility

A full native 3072 Standard capture produced a structurally correct 3072x3072 / 250-frame animated WebP but was visibly blurry at native size.

Live tracing confirmed:

- 1024 capture uses a 1024 Effects render;
- 2048 capture uses repeated 1024 Effects phases;
- 3072 capture uses repeated **768 Effects phases** under a 3072 capture camera.

Current native `CK.Effects.renderToCanvas` sizes its render target from the supplied dimensions. Therefore native 3072 output dimensions do not imply 3072 source fidelity.

Status: native 3072 remains **unsupported/rejected**.

## TRUE-3K repaired frame-source capability

The standalone repair companion passed a 16-frame repaired Short Test on `heroforge07.1.9.98`.

Confirmed:

- target 3072x3072;
- native tile 768;
- grid 4x4;
- 16 expected / 16 supplied / 16 unique phases per animation frame;
- one true 3072x3072 Effects source render per animation frame;
- 256 total phases across 16 frames;
- parser: 3072x3072 / 16 frames / 640 ms / 40 ms x16 / loop 0;
- output bytes: 4,589,972;
- figure rotation restored;
- Effects method restored;
- errors null;
- user native-size fidelity inspection: PASS.

Compatibility conclusion:

**3072 source fidelity can be repaired at the named `CK.Effects.renderToCanvas` seam without replacing `BT.maker.takeScreenshot`.**

This is compatible with the current public Witch Dock still-provider ownership boundary because Spinny does not displace the provider's 4096/8192 screenshot wrapper.

## v0.3.0 integrated candidate

`entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`

Version: `0.3.0`
Build: `0.3.0-integrated-true3k-short-test`

Compatibility behavior:

- 1024/2048: native frame source;
- 3072: TRUE-3K phase-feed frame source;
- matching 3072 Effects wrapper exists only during one explicit synchronous frame capture;
- wrapper validates tile/grid/phase topology and exact source size;
- wrapper restores immediately after each frame;
- `BT.maker.takeScreenshot` ownership remains untouched;
- frame-source diagnostics are retained per repaired frame;
- Short Test uses the exact same frame-source path as full capture.

Current status: static checks PASS; live integrated Short Test pending.

## Short Test compatibility policy

Short Test is retained as a supported diagnostic operation of the Spinny service.

- standalone test harness: directly visible;
- Witch Dock normal mode: hidden;
- Witch Dock Developer Mode: visible via the Spinny UI consuming `KWDeveloperMode.enabled` / `onChange()`;
- Developer Mode controls visibility only and does not implement capture behavior.

## Revalidation triggers

Re-run Spinny validation when:

- HeroForge screenshot/render tile topology changes;
- `CK.Effects.renderToCanvas` behavior or camera-view shape changes;
- a GPU reports limits below the selected repaired source size;
- character-display rotation/refresh behavior changes;
- browser WebP support/container validation changes;
- capture interaction guards are added;
- Witch Dock host integration changes lifecycle/visibility behavior;
- high-cost resource limits are observed.

Use integrated Short Test first for 3072 compatibility checks. Reserve a full repaired revolution for final confirmation after the Short Test gate passes.

## 4K Spinny incompatibility note

Do not add 4096 Spinny through the current public `BT.maker.takeScreenshot` surface while Witch Dock TRUE-resolution still repair is enabled. The provider owns square 4096/8192 requests. 4K Spinny remains deferred until a separately designed explicit frame-capture capability/bypass is validated.
