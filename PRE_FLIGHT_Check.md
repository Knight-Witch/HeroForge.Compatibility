# Pre-Flight Check Log

## PFC-2026-09-06-022 — Record TRUE-3K repaired Short Test validation

Date: 2026-09-06

### Scope

Documentation-only validation checkpoint after live completion of `spinny-mini-webp-3k-repair-companion.user.js` v0.1.0.

### Target files

- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `TESTING.md`
- `docs/feature-specs/spinny-mini-webp.md`
- `docs/investigations/INV-0004-spinny-mini-webp-2026-09-05.md`
- `docs/validation/spinny-mini-webp-true3k-repair-2026-09-06.md` (new)

### Required material reviewed

- binding `PROJECT_CONTRACT.md`;
- branch head before this checkpoint: `d7b160465d699a9d48a75a1286fd67e914933de4`;
- `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`;
- current Spinny feature spec and investigation;
- TRUE-3K repair companion source committed at the prior checkpoint;
- live user visual result after repaired 3072 Short Test;
- HF-Chat-Bridge read-only result issue #489.

### Confirmed live result

TRUE-3K repaired Short Test:

- build: `0.1.0-3072-effects-source-phase-feed`;
- status: `passed`;
- started: `2026-09-06T09:04:26.293Z`;
- completed: `2026-09-06T09:04:56.741Z`;
- elapsed: approximately 30.448 seconds;
- target: 3072x3072;
- GPU max texture size: 16384;
- GPU max renderbuffer size: 16384;
- animation frames: 16;
- every frame: native tile 768, grid 4, 16 expected / 16 supplied / 16 unique phases, one genuine 3072 Effects source render;
- total supplied phases: 256;
- native full-resolution passthrough calls: 0;
- output bytes: 4,589,972;
- parser: 3072x3072, 16 frames, 640 ms total, 40 ms x16, loop 0;
- rotation restored: true;
- Effects method restored: true;
- repair error: null;
- Short Test error: null;
- user native-size visual inspection: **PASS — output now appears genuinely 3K rather than blurry/upscaled**.

### Conclusion

The TRUE-3K frame-source repair is validated for the 16-frame Short Test on `heroforge07.1.9.98`.

The observed native 768px Effects phases are the confirmed source-fidelity defect. Supplying the native 4x4 phase compositor from one real 3072x3072 Effects source per animation frame repairs the visual fidelity while preserving HeroForge's native compositor.

### Important gate distinction

This checkpoint validates the **frame-source repair**, not yet the complete production 3072 profile.

Before 3072 can be considered fully validated for maintained Spinny use:

1. integrate the repair into the maintained standalone Spinny capture/profile path;
2. re-run the integrated Short Test;
3. run one full repaired 3072 Standard / 250-frame revolution;
4. confirm output, parser, rotation restoration, resource behavior and native-size visual fidelity.

### Preserved boundaries

- no runtime source changed in this checkpoint;
- main Spinny v0.2.2 remains unchanged;
- Short Test source remains unchanged;
- TRUE-3K companion source remains unchanged;
- public Witch Dock remains unchanged;
- 4K Spinny remains deferred;
- Pause/input guards remain a separate later stage.

### Test status

- TRUE-3K repaired Short Test mechanical diagnostics: **PASS**.
- TRUE-3K repaired Short Test native-size visual fidelity: **PASS by user report**.
- full repaired 3072 Standard: pending.

**Runtime behavior changed:** no. Documentation-only validation checkpoint.

---

## PFC-2026-09-06-021 — Add TRUE-3K Effects-source repair companion

Added the standalone candidate after confirming native 3072 uses 768px Effects phases. The candidate has now passed the live Short Test gate described above.

**Runtime behavior changed:** standalone diagnostic repair companion only.

---

Historical pre-flight records through PFC-2026-09-06-020 remain preserved in Git history.
