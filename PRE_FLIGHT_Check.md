# Pre-Flight Check Log

## PFC-2026-09-05-017 — Record configurable Spinny validation and add progress/ETA UX

Date: 2026-09-05

### Target files

- `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `TESTING.md`
- `docs/feature-specs/spinny-mini-webp.md`
- `docs/investigations/INV-0004-spinny-mini-webp-2026-09-05.md`

### Reviewed

- binding `PROJECT_CONTRACT.md`
- `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`
- current Spinny Mini feature spec/investigation
- validated v0.1.0 parity reference
- configurable v0.2.0 candidate at branch head `02ffc1cfa7512af90ab7fce2afefdfe22c989806`
- user live results from multiple v0.2.0 captures on HeroForge `heroforge07.1.9.98`

### Newly confirmed live results

- 1024 Standard / 25 FPS / 250 frames: **PASS / works perfectly**.
- 2048 Standard / 25 FPS / 250 frames: **PASS / works perfectly**.
- 1024 Very Slow / 25 FPS / 750 frames: **PASS / works perfectly**.
- 1024 Very Slow output observed at approximately **34 MiB**.
- Multiple captures were run successfully in one session, providing basic repeated-use evidence.
- Existing percentage, Rendering/Encoding phase text, and selected px/frame/FPS/workload readout were explicitly reported useful and working well.
- Test context was a high-complexity figure with many kitbash parts, special paints/effects and a high decal count, with moderately high Photo Booth complexity; resource behavior remained acceptable by user report.
- User observed 1024 Very Slow capture time as roughly comparable to Lob's historical HQ Spinny GIF capture/encode/delivery time.
- 2048 / 500-frame run was still active when this pre-flight was written and is **not recorded as passed yet**.
- Per user instruction, HF-Chat-Bridge activity is not inspected while the active capture is running.

### Runtime change intent

Advance the same standalone profile script to v0.2.1 with UX-only additions:

- progress bar directly below the existing percentage/status readout;
- elapsed / estimated time-left / estimated-total display;
- ETA derived from measured wall-clock render+encode time per completed frame on the current device/figure;
- same-session timing history keyed by resolution to improve estimates for subsequent captures;
- no persistent timing history across reloads, preventing stale estimates from leaking between sessions/figures.

### Preserved behavior

- resolution/speed definitions and constant 40 ms output frame timing;
- full-revolution `CK.character.display.rotation.y` stepping;
- established display/occlusion/shadow/matrix refresh sequencing;
- `BT.maker.takeScreenshot` capture path;
- immediate static-WebP compression and compressed-payload retention;
- deterministic RIFF animated-WebP mux and parser validation;
- concurrency block, cancellation semantics and rotation restoration;
- public Witch Dock remains untouched.

### Material conflict risks

- ETA must measure capture processing time, not confuse it with animation playback duration.
- Early ETA samples can be noisy; v0.2.1 therefore warms up before using current-capture estimates.
- Figure/effect complexity can change per-frame cost; estimate must continue adapting during the run.
- Same-session history must not become persistent cross-figure state.
- UI-only change must not alter the now-validated capture/mux core.

### Recommended action

Commit v0.2.1 on `spinny-webp-hq-wip`, syntax-check it, then have the user switch after the currently running v0.2.0 capture completes. Validate the progress bar and ETA with one normal capture before any Witch Dock integration.

**Runtime behavior changed:** yes, standalone WIP UI/diagnostics only. Capture/mux behavior and public Witch Dock are unchanged.

---

## PFC-2026-09-05-016 — Add configurable Spinny WebP profile test

Date: 2026-09-05

### Target files

- `entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js` (new standalone candidate)
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `TESTING.md`
- `docs/feature-specs/spinny-mini-webp.md`
- `docs/investigations/INV-0004-spinny-mini-webp-2026-09-05.md`

### Reviewed

- binding `PROJECT_CONTRACT.md`
- branch head `442365c9d84a90d585617b07489a17ad707d0d11`
- validated v0.1.0 parity reference `entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js`
- `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`
- current Spinny Mini feature spec and investigation
- native HeroForge and historical Lob baselines
- successful 1024/250 parity result checkpointed at `442365c9d84a90d585617b07489a17ad707d0d11`

### Implementation intent

Preserve v0.1.0 unchanged as the validated fallback and add a separate v0.2.0 standalone candidate that parameterizes only the already-proven capture engine.

Profiles:

- 1024 / 2048 resolution, independent of speed;
- Standard: 10 s / 250 frames / 40 ms;
- Slow: 15 s / 375 frames / 40 ms;
- Slower: 20 s / 500 frames / 40 ms;
- Very Slow: 30 s / 750 frames / 40 ms.

The 40 ms frame duration remains constant so slower rotation gains additional angular samples rather than longer frame holds.

### Preserved behavior

- same `CK.character.display.rotation.y` full-revolution stepping;
- same HeroForge display/occlusion/shadow/matrix refresh sequencing;
- same `BT.maker.takeScreenshot(size,size)` frame source;
- same immediate browser static-WebP compression;
- same compressed-payload-only retention and canvas backing-store release;
- same deterministic RIFF/VP8X/ANIM/ANMF mux;
- same concurrency block, cancel-after-current-frame, and `finally` rotation restoration;
- no persistent HeroForge runtime override.

### Added validation/diagnostics

- final parser additionally verifies loop count and one exact frame-duration histogram;
- plain bridge-readable `diagnostics` state records requested profile, exact output bytes, parser result, and rotation-restored status;
- UI exposes selected profile and a pixel-sample workload multiplier against validated 1024 Standard.

### Material conflict risks

- The validated v0.1.0 file must remain untouched until v0.2.0 regression passes.
- 2048 Standard is 4x the pixel-sample workload of 1024 Standard.
- Slow/Slower/Very Slow multiply frame count to 1.5x/2x/3x baseline.
- 2048 Very Slow reaches 12x baseline pixel-sample workload and is intentionally not the first live test.
- Output verification currently materializes the completed WebP once as a byte array; high-cost profiles may expose a memory limit that requires a later bounded verifier.
- Public Witch Dock remains out of scope.

### Recommended action

Commit the separate v0.2.0 standalone candidate, keep v0.1.0 canonical, then run 1024 Standard regression first. Proceed to 2048 Standard only after that regression passes.

**Runtime behavior changed:** yes, by adding a new standalone experimental userscript only. Existing v0.1.0 and public Witch Dock are unchanged.

---

## PFC-2026-09-05-015 — Record successful 1024 HQ Spinny WebP parity capture

Date: 2026-09-05

### Target files

- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- `TESTING.md`
- `docs/feature-specs/spinny-mini-webp.md`
- `docs/investigations/INV-0004-spinny-mini-webp-2026-09-05.md`

### Reviewed

- binding `PROJECT_CONTRACT.md`
- current branch head `19ea283e670a0a700ee84e7b9d6b2453afb5b17a`
- standalone v0.1.0 `entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js`
- `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`
- current Spinny Mini feature spec and investigation
- historical Lob HQ output baseline and current native HeroForge WebP baseline
- user live acceptance report: “the webp worked”
- retained standalone UI status recovered through HF-Chat-Bridge: `Downloaded 1024px WebP: 250 frames / 10.0 s / 12.9 MiB`

### Confirmed

- The successful capture came from standalone v0.1.0 build `0.1.0-runtime-rotation-webp-mux`.
- v0.1.0 only downloads after mechanically verifying 1024x1024 dimensions, exactly 250 ANMF frames, and exactly 10,000 ms total animation duration.
- The mux writes every frame at 40 ms and loop count 0/infinite, so the accepted output matches the Lob parity cadence: 25 FPS effective and continuous loop.
- The retained UI reports an output size of 12.9 MiB (rounded display value).
- User reported the generated WebP worked; this closes the first 1024/250 parity milestone.
- Exact output byte count was not recoverable from the safe bridge reader because `lastCapture` is exposed through a getter; the rounded 12.9 MiB UI result is retained.
- Repeat-use and 2048/resource-limit testing remain separate next-stage work; they do not invalidate the successful first parity capture.

### Material conflict risks for the next runtime stage

- Preserve the now-working 1024/250 capture path exactly while generalizing profiles.
- 2048 multiplies pixels per frame by four and may materially increase capture time/output size.
- Slower presets that preserve 25 FPS multiply frame count and must not retain raw RGBA frames.
- Very slow + 2048 combinations may be expensive enough to require practical guardrails after measurement.
- Public Witch Dock remains out of scope until standalone profile testing passes.

### Recommended action

Checkpoint the successful parity validation in durable docs, then begin standalone 2048 plus independent speed-profile implementation by parameterizing the validated capture engine rather than replacing it.

**Runtime behavior changed:** no. This checkpoint is documentation-only. No JavaScript changed and public Witch Dock behavior is unchanged.

---

## PFC-2026-09-05-014 — Spinny Mini animated WebP reconstruction kickoff

Date: 2026-09-05

### Target files

- `entries/tampermonkey-standalone/spinny-mini-webp-hq.user.js` (planned)
- `docs/feature-specs/spinny-mini-webp.md`
- `docs/investigations/INV-0004-spinny-mini-webp-2026-09-05.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md` / `TESTING.md` when live proof exists
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Reviewed

- binding `PROJECT_CONTRACT.md`
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `ARCHITECTURE.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- `TESTING.md`
- current Photo Booth capture findings and named runtime seams
- current Lob/ADP high-quality Spinny Mini behavior as previously audited
- user-supplied archived output `The Viper.gif` recovered from ZIP for output-level parity measurement
- live native HeroForge Spinny Mini WebP trace on `heroforge07.1.9.98`

### Confirmed baseline

- New feature ID: `media.spinny-mini-webp`.
- This supersedes the provisional inventory label `media.spin-gif-quality`; the maintained target is animated WebP, not GIF.
- Native HeroForge Spinny Mini WebP output measured from a real capture:
  - 512x512;
  - 386 frames;
  - 17 ms/frame;
  - 6562 ms total revolution;
  - 58.82 FPS effective;
  - infinite loop;
  - 11,331,110-byte `image/webp` blob;
  - 386 calls to `BT.maker.takeScreenshot(512,512,...)` and 386 matching `CK.Effects.renderToCanvas(512,512,...)` calls.
- User-supplied historical Lob Higher Quality Spinny Mini GIF measured from original bytes:
  - 1024x1024;
  - 250 frames;
  - 10.0 s total duration;
  - 25 FPS effective;
  - approximately 40 ms/frame;
  - 145,375,926 bytes.
- First parity target is therefore animated WebP at 1024x1024, 250 frames, 10.0 s / 25 FPS.
- Future speed presets are a separate dimension from resolution; slower presets should preserve smooth motion by increasing angular samples/frame count rather than merely holding a sparse frame set longer.

### Integration priority

1. Reuse current named runtime capture/render capabilities and the native animated-WebP encoder if a stable callable seam can be found.
2. Runtime capability/object-shape discovery.
3. Webpack/module discovery if the encoder is closure-local.
4. Do not resurrect Lob's exact compiled-string patch architecture unless runtime access is proven insufficient.

### Material conflict risks

- Native WebP encoder may be closure-local rather than exposed through a named runtime API.
- Resolution, angular sample count, and playback timing may be controlled by separate private values.
- A 1024x250 capture increases render cost substantially over native 512; memory must be released frame-by-frame or in bounded batches.
- Existing `media.screenshot-resolution` provider wraps high-resolution still capture requests; Spinny implementation must coexist without recursively routing each animation frame into the still-image 4K/8K repair path.
- Lob's current Higher Quality Spinny Mini generator is broken after the HeroForge update and cannot be used as a live caller; parity is defined from historical output plus audited legacy arguments.

### Recommended action

Continue live runtime/module discovery until the current WebP encoder and spin-loop control surface are identified. Build a standalone Tampermonkey parity entry before any Witch Dock integration.

**Runtime behavior changed:** no. This is pre-flight/documentation only.

---

Historical pre-flight entries through PFC-2026-09-05-013 remain preserved in Git history at/before `732dae09e83d712a26ac383f7b64ce9e27e07a59`.
