# Testing

Standalone-first validation precedes Witch Dock integration.

## `media.screenshot-resolution`

HeroForge build: `heroforge07.1.9.98`.

### Standalone baseline

- TRUE 4096 one-source adaptive phase feed: passed mechanically and visually.
- TRUE 8192 grouped four-shifted-4096 source design: passed mechanically and visually; user reported it worked perfectly and was very easy on the GPU.
- Combined standalone v0.6 TRUE 4K regression: passed.
- Combined standalone v0.6 TRUE 8K regression: passed perfectly.
- One-shot maintained 8192 Effects path: rejected due repeated white renderer-reset/blank output.
- Sandbox/page-context, minimal packaging, and alternate export method: rejected as root-cause fixes.

### Witch Dock Dev integration

WITCH_DEV_PHOTO provider build `0.7.0-witch-dock-dev-provider` with current Lob/ADP present:

- existing Lob-injected HeroForge 4096 control -> Witch Dock provider -> repaired capture: **passed perfectly**;
- existing Lob-injected HeroForge 8192 control -> Witch Dock provider -> grouped repaired capture: **passed perfectly**;
- Witch Dock direct TRUE 4K/TRUE 8K capture behavior: **passed**;
- initial direct-button disabled state: **reproduced/diagnosed** as stale UI readiness after provider installed before Photo Booth opened;
- capture engine did not require change.

### Witch Dock Stable validation

Public consumer promotion: `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`.

Clean public smoke with temporary Dev/standalone scripts disabled:

- direct Witch Dock buttons became usable without cycling the repair toggle: **passed**;
- HeroForge/Lob 4096 -> public Witch Dock provider: **passed perfectly**;
- HeroForge/Lob 8192 -> public grouped provider: **passed perfectly**;
- public Witch Dock direct TRUE 4K: **passed perfectly**;
- public Witch Dock direct TRUE 8K: **passed perfectly**;
- user overall public result: **works perfectly**.

Stable gate: **closed / validated**.

## `media.spinny-mini-webp`

HeroForge build: `heroforge07.1.9.98`.

### Measured native baseline

- canvas: **512x512**;
- MIME: `image/webp`;
- file size: **11,331,110 bytes**;
- frames: **386**;
- per-frame duration: **17 ms**;
- total duration: **6562 ms**;
- effective FPS: **58.82**;
- loop count: **0 / infinite**;
- traced calls: 386 x `BT.maker.takeScreenshot(512,512,...)`, 386 x `CK.Effects.renderToCanvas(512,512,...)`, one `CK.Capture.renderToImage(512,512,...)`.

### Historical Lob HQ baseline

- dimensions: **1024x1024**;
- frames: **250**;
- duration: **10.000 s**;
- effective FPS: **25**;
- approximate frame delay: **40 ms**;
- file size: **145,375,926 bytes**.

### Animated-WebP mux proof

Live four-frame 128x128 proof:

- four HeroForge frames captured/encoded;
- custom RIFF animation mux produced 4 frames / 400 ms;
- output blob 9,590 bytes;
- browser `Image.decode()` PASS;
- original rotation restoration PASS.

Result: **PASS**.

### Standalone parity package v0.1.0 — validated reference

Entry: `entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js`.

Static checks:

- `node --check`: **PASS**.
- fixed profile: 1024x1024, 250 frames, 40 ms/frame, quality 0.95, infinite loop.
- concurrent capture block: present.
- cancel-after-current-frame: present.
- rotation restoration in `finally`: present.
- per-frame canvas backing store reduced after compression.
- final container parser verifies dimensions/frame count/total duration before download.

Full live parity result:

- user reported the generated WebP worked: **PASS**;
- build: `0.1.0-runtime-rotation-webp-mux`;
- parser-gated dimensions **1024x1024**: **PASS**;
- parser-gated frame count **250**: **PASS**;
- parser-gated total duration **10,000 ms**: **PASS**;
- mux frame timing **40 ms / 25 FPS**: confirmed by implementation;
- mux loop count **0 / infinite**: confirmed by implementation;
- retained post-capture UI status: `Downloaded 1024px WebP: 250 frames / 10.0 s / 12.9 MiB`;
- Photo Booth capture capability remained ready afterward.

Parity milestone: **closed / validated**. v0.1.0 remains the canonical fallback until the profile candidate passes regression.

### Configurable profile package v0.2.0 — candidate

Entry: `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`.

Implemented profiles:

- 1024 / 2048 resolution;
- Standard: 10 s / 250 frames / 40 ms;
- Slow: 15 s / 375 frames / 40 ms;
- Slower: 20 s / 500 frames / 40 ms;
- Very Slow: 30 s / 750 frames / 40 ms.

Preserved from validated v0.1.0:

- runtime display Y rotation strategy;
- refresh/occlusion/shadow/matrix sequencing;
- `BT.maker.takeScreenshot` frame path;
- immediate static-WebP compression;
- compressed payload retention and source-canvas release;
- deterministic mux;
- cancellation/concurrency behavior;
- rotation restore in `finally`.

Added:

- exact loop-count verification;
- exact ANMF frame-duration histogram verification;
- bridge-readable plain diagnostics with exact output bytes and rotation-restored status;
- pixel-sample workload display relative to 1024 Standard.

Static status:

- source review: **PASS / no identified syntax or logic blocker**;
- `node --check`: **not yet independently executed against the committed v0.2.0 file**;
- live runtime: **not yet tested**.

Required live validation order:

1. 1024 Standard regression.
2. 2048 Standard.
3. 1024 Slow.
4. 1024 Slower.
5. 1024 Very Slow.
6. 2048 + slower combinations only after resource behavior is measured.

Approximate pixel-sample workload relative to validated 1024 Standard:

- 1024 Standard: 1.0x;
- 2048 Standard: 4.0x;
- 1024 Slow: 1.5x;
- 1024 Slower: 2.0x;
- 1024 Very Slow: 3.0x;
- 2048 Very Slow: 12.0x.

Still pending:

- v0.2.0 1024 regression;
- exact full-run rotation-restored diagnostic;
- repeat full capture in one session;
- 2048 completion/output/memory behavior;
- slower-profile resource behavior;
- practical guardrails for expensive combinations.

Witch Dock integration: **not started**.

## Future regression triggers

Re-run the Photo Booth still suite when the HeroForge build materially changes, named capture/Effects capabilities change, tile topology changes, or a native true-resolution Effects path appears.

Re-run the Spinny Mini WebP suite when HeroForge character-display rotation/refresh behavior changes, `BT.maker.takeScreenshot` semantics change, browser WebP encoding support changes, or generated RIFF animation validation fails.

## Other maintained milestones

- Corrected bound decal gizmo: Witch Dock Stable with Move/Rotate/Scale undo-redo and transform-state preservation validated.
- Character local JSON: core Save/Load passed live; repeated-use/lifecycle pending.
- Projected decal state/control: runtime path confirmed; renderer dependency audit pending.
