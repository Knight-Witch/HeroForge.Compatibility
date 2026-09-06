# Compatibility

Human-readable current HeroForge compatibility status. Historical detail remains available in Git history.

Current media validation target: `heroforge07.1.9.98` / 2026-09-06.

| Component | Current status | Last verified build/date | Notes |
|---|---|---|---|
| `media.screenshot-resolution` | Standalone validated; Witch Dock Stable validated | `heroforge07.1.9.98` / 2026-09-05 | Stable still-capture provider remains closed/validated. |
| `media.spinny-mini-webp` | Standalone v0.5.0 validated; Witch Dock Dev integration validated; Witch Dock Stable v1.1.0 promoted, public smoke pending | `heroforge07.1.9.98` / 2026-09-06 | Native 3072 rejected; repaired TRUE-3K validated. Public promotion commit `8d96dd803f452c3c7b623c6963b4fdb3ef762f59`. |
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
- project-owned RIFF/VP8X/ANIM/ANMF animated WebP mux;
- Witch Dock public Blob-download host through userscript `GM_download` for integrated consumer delivery.

## Validated production profiles / behaviors

- 1024 Standard / 250 frames: PASS
- 2048 Standard / 250 frames: PASS
- 1024 Very Slow / 750 frames: PASS
- 2048 Slower / 500 frames: PASS
- repaired 3072 Standard / 250 frames via TRUE-3K: PASS
- repaired 3072 Slower / 500 frames via TRUE-3K: PASS
- integrated 3072 Short Test / 16 frames: PASS
- repeated captures / parser / rotation restoration: PASS
- progress/ETA: PASS on tested captures
- general Cancel path: PASS
- frame-boundary Pause/Resume: PASS
- cancel while paused: PASS
- paused-time ETA accounting: PASS
- capture-invalidating interaction guards: PASS
- final Witch Dock Dev privileged download: PASS
- final Witch Dock Dev silent wheel/scroll suppression: PASS

## Native 3072 incompatibility

Native unrepaired 3072 remains rejected. Runtime tracing confirmed a 3072 capture camera paired with repeated 768px `CK.Effects.renderToCanvas` phase renders, producing structurally 3072 output with degraded source fidelity.

## TRUE-3K repaired frame-source capability

Maintained v0.5.0 behavior:

- 1024/2048 use native frame source;
- 3072 uses a temporary `CK.Effects.renderToCanvas` phase-feed adapter;
- one genuine 3072x3072 Effects source feeds the native compositor's validated phase topology;
- adapter validates tile/grid/phase completeness and restores the exact Effects method after each frame;
- `BT.maker.takeScreenshot` ownership is never displaced.

## Pause / interaction-guard compatibility

Validated on the current HeroForge build:

- pause request completes the active frame before stopping;
- no next angular sample begins while paused;
- TRUE-3K temporary Effects ownership is restored before entering paused state;
- resume continues at the next sample;
- cancel while paused restores state without deadlock;
- paused wall-clock time does not corrupt active ETA;
- camera/canvas and continuity-invalidating Booth interactions are blocked before mutation;
- wheel/scroll is silently blocked without a modal;
- other guarded interactions retain Keep Capture / Cancel Capture choices.

## Witch Dock consumer compatibility

Final Dev integration commit:

`fa75a9c1790009b4b4ae1a1162d419982e20545e`

Final Dev re-smoke passed the two last integration-specific risks:

- userscript-level WebP download initiation/completion: PASS;
- silent wheel/scroll block: PASS.

Public Witch Dock v1.1.0 promotion commit:

`8d96dd803f452c3c7b623c6963b4fdb3ef762f59`

Public Stable has been promoted but has not yet received a clean production smoke with Dev/temporary scripts disabled. Until that smoke passes, compatibility status is **Stable promoted / public smoke pending**, not fully Stable validated.

The public release does not depend on HeroForge.Compatibility unstable head or HF-Chat-Bridge.

## Revalidation triggers

Re-run Spinny validation when:

- HeroForge screenshot/render tile topology changes;
- `CK.Effects.renderToCanvas` behavior or camera-view shape changes;
- a GPU reports limits below the selected repaired source size;
- character-display rotation/refresh behavior changes;
- browser WebP support/container validation changes;
- Pause/interaction guard implementation changes;
- Witch Dock host integration changes lifecycle/download behavior;
- public 4096/8192 provider ownership changes;
- high-cost resource limits are observed.

## 4K Spinny incompatibility note

Do not add 4096 Spinny through the current public `BT.maker.takeScreenshot` surface while Witch Dock TRUE-resolution still repair is enabled. The provider owns square 4096/8192 requests. 4K Spinny remains deferred until a separately designed explicit frame-capture capability/bypass is validated.
