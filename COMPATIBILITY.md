# Compatibility

Human-readable current HeroForge compatibility status. Historical detail remains available in Git history.

Current media validation target: `heroforge07.1.9.98` / 2026-09-06.

| Component | Current status | Last verified build/date | Notes |
|---|---|---|---|
| `media.screenshot-resolution` | Standalone validated; Witch Dock Stable validated | `heroforge07.1.9.98` / 2026-09-05 | Stable still-capture provider remains closed/validated. |
| `media.spinny-mini-webp` | Committed maintained v0.3.0 validated for tested production profiles; local v0.4.0 Pause/Resume candidate live PASS | `heroforge07.1.9.98` / 2026-09-06 | Native 3072 rejected; repaired TRUE-3K validated. Interaction-guard discovery active. v0.4.0 source promotion pending. |
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

- 1024 Standard / 250 frames: PASS
- 2048 Standard / 250 frames: PASS
- 1024 Very Slow / 750 frames: PASS
- 2048 Slower / 500 frames: PASS
- 3072 Standard / 250 frames via TRUE-3K: PASS
- 3072 Slower / 500 frames via TRUE-3K: PASS
- integrated 3072 Short Test / 16 frames: PASS
- repeated captures / parser / rotation restoration: PASS
- progress/ETA: PASS on tested captures
- general Cancel path: PASS

## Native 3072 incompatibility

Native un-repaired 3072 remains rejected. Runtime tracing confirmed a 3072 capture camera with repeated 768px `CK.Effects.renderToCanvas` phase renders, producing structurally 3072 output with degraded source fidelity.

## TRUE-3K repaired frame-source capability

Maintained v0.3.0 behavior:

- 1024/2048 use native frame source;
- 3072 uses a temporary `CK.Effects.renderToCanvas` phase-feed adapter;
- one genuine 3072x3072 Effects source feeds the native compositor's validated phase topology;
- adapter validates tile/grid/phase completeness and restores the exact Effects method after each frame;
- `BT.maker.takeScreenshot` ownership is never displaced.

## Local v0.4.0 Pause/Resume validation

Candidate build: `0.4.0-frame-boundary-pause-resume`.

User reported all requested live tests successful:

- native 1024 Short Test pause/resume;
- TRUE-3K 3072 Short Test pause/resume;
- pause after current-frame completion;
- resume continuation;
- cancel while paused;
- restoration behavior;
- paused-time/ETA behavior.

Compatibility conclusion: frame-boundary Pause/Resume is supported by the tested candidate on the current HeroForge build. The committed maintained runtime remains v0.3.0 until the candidate source is promoted atomically.

## Interaction-guard compatibility investigation

Required next coverage:

- camera/canvas wheel and drag;
- Photo Booth exit;
- Booth view/backdrop/background/overlay/frame/lighting/effects edits;
- same behavior while paused;
- no coordinate assumptions across left/right/mobile layouts.

Broad DOM probe #492 exceeded the bridge result-size limit. Follow-up probes must be narrower and semantic.

## Revalidation triggers

Re-run Spinny validation when:

- HeroForge screenshot/render tile topology changes;
- `CK.Effects.renderToCanvas` behavior or camera-view shape changes;
- a GPU reports limits below the selected repaired source size;
- character-display rotation/refresh behavior changes;
- browser WebP support/container validation changes;
- Pause/interaction guard implementation changes;
- Witch Dock host integration changes lifecycle/visibility behavior;
- high-cost resource limits are observed.

## 4K Spinny incompatibility note

Do not add 4096 Spinny through the current public `BT.maker.takeScreenshot` surface while Witch Dock TRUE-resolution still repair is enabled. The provider owns square 4096/8192 requests. 4K Spinny remains deferred until a separately designed explicit frame-capture capability/bypass is validated.

## Spinny v0.5.0 compatibility checkpoint

Validated on `heroforge07.1.9.98`: maintained v0.5.0 preserves tested 1024/2048/TRUE-3K behavior and adds live-validated frame-boundary Pause/Resume plus interaction guards. Native unrepaired 3072 remains rejected; 4096 animated WebP remains deferred.
