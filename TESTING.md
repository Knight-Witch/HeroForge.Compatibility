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

Static/public preparation:

- exact Dev-tested provider blob promoted: parity confirmed by identical blob SHA;
- public readiness adapter: JavaScript syntax passed;
- public manifest: JSON parse passed;
- `Witch_Dock.user.js`: unchanged;
- `tools/Booth.js`: unchanged.

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

A real native HeroForge Spinny Mini WebP was captured and parsed:

- canvas: **512x512**;
- MIME: `image/webp`;
- file size: **11,331,110 bytes**;
- frames: **386**;
- per-frame duration: **17 ms** for all 386 frames;
- total duration: **6562 ms**;
- effective FPS: **58.82**;
- loop count: **0 / infinite**;
- traced calls: 386 x `BT.maker.takeScreenshot(512,512,...)`, 386 x `CK.Effects.renderToCanvas(512,512,...)`, one `CK.Capture.renderToImage(512,512,...)`.

### Historical Lob HQ output baseline

Original GIF bytes supplied in ZIP and measured directly:

- dimensions: **1024x1024**;
- frames: **250**;
- duration: **10.000 s**;
- effective FPS: **25**;
- approximate frame delay: **40 ms**;
- file size: **145,375,926 bytes**.

Initial WebP parity target: **1024x1024 / 250 frames / 40 ms / 10.0 s / infinite loop**.

### Animated-WebP mux proof

Live HeroForge microproof using only runtime rotation/capture plus browser static-WebP encoding:

- rotated current character through four test angles;
- captured four 128x128 HeroForge frames;
- encoded each as static `image/webp`;
- extracted compressed WebP image chunks;
- assembled project-owned RIFF/VP8X/ANIM/ANMF animated WebP;
- result blob size: **9,590 bytes**;
- browser `Image.decode()` accepted output at **128x128**;
- frame count: **4**;
- total duration: **400 ms**;
- original character rotation restored: **PASS**.

Result: **PASS**. Native closure-local animated-WebP encoder is not required for the first maintained implementation.

Local synthetic mux proof:

- 64x64 / 3 frames;
- generated animated WebP recognized as animated WebP by independent file/image tooling;
- loop metadata decoded correctly.

Result: **PASS**.

### Standalone parity package v0.1.0

Entry: `entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js`.

Static checks:

- `node --check`: **PASS**.
- fixed requested profile: 1024x1024, 250 frames, 40 ms/frame, quality 0.95, infinite loop.
- concurrent capture block: present.
- cancel-after-current-frame: present.
- rotation restoration in `finally`: present.
- per-frame canvas backing store reduced after compression.
- final container parser verifies dimensions/frame count/total duration before download.

Full live test status:

- 1024x1024 full render: **pending user test**;
- 250-frame completion: **pending user test**;
- visual one-revolution direction/cadence: **pending user test**;
- downloaded animated WebP playback: **pending user test**;
- post-capture orientation restoration: **pending user test**;
- repeated-use acceptance: **pending**.

Witch Dock integration: **not started**.

## Future regression triggers

Re-run the Photo Booth still suite when the HeroForge build materially changes, named capture/Effects capabilities change, tile topology changes, or a native true-resolution Effects path appears. Lob-absent HeroForge-native resolution-menu injection is a separate UI-adapter test track and does not reopen the validated capture-engine gate.

Re-run the Spinny Mini WebP suite when HeroForge character-display rotation/refresh behavior changes, `BT.maker.takeScreenshot` semantics change, browser WebP encoding support changes, or the generated RIFF animation fails structural/browser validation.

## Other maintained milestones

- Corrected bound decal gizmo: Witch Dock Stable with Move/Rotate/Scale undo-redo and transform-state preservation validated.
- Character local JSON: core Save/Load passed live; repeated-use/lifecycle pending.
- Projected decal state/control: runtime path confirmed; renderer dependency audit pending.
