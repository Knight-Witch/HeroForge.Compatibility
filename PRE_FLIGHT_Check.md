# Pre-Flight Check Log

Use this file before committed repository updates to record what was checked, conflict risks, and recommended action.

## PFC-2026-09-05-011 — Photo Booth grouped true-8K + combined v0.6 validation

**Date:** 2026-09-05

### Target files

- `entries/tampermonkey-standalone/photo-booth-true-resolution.user.js`
- `docs/feature-specs/photo-booth-screenshot-resolution.md`
- `docs/investigations/INV-0003-photo-booth-high-res-capture-2026-09-05.md`
- `MASTER.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `TESTING.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Required material reviewed

- `PROJECT_CONTRACT.md`
- current `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, and `TESTING.md`
- current Photo Booth feature spec and INV-0003
- validated v0.4 4K standalone baseline at commit `9e0ae2af0c7f9e3d33c4c0295310c0824adfbc9b`
- successful one-shot 8192 bridge proof
- failed packaged v0.5/v0.5.1/v0.5.2/v0.5.3 8192 experiments
- successful grouped v0.5.4 4x4096 8K experiment
- combined v0.6 packaged 4K and 8K user acceptance

### Confirmed findings

- Repository `main` remained at validated 4K checkpoint `9e0ae2af0c7f9e3d33c4c0295310c0824adfbc9b` before this update.
- One-shot true 8192 Effects rendering is mechanically possible but repeatedly triggers a white renderer-reset / blank-output cliff in packaged use on the tested machine.
- Changing Tampermonkey execution realm, simplifying packaging, and replacing `toBlob()` do not eliminate the failure.
- Four shifted 4096 Effects sources can cover all 64 native 8K phase classes without an 8192 Effects target.
- Grouped v0.5.4 completed successfully and Amanda reported it was very easy on the GPU and visually perfect.
- Combined v0.6 then passed both TRUE 4K and TRUE 8K visual acceptance.

### Material conflict risks

- Do not reintroduce a one-shot 8192 Effects target into the maintained 8K path without new evidence.
- Continue deriving native topology from live calls; do not freeze minified private helper names or source offsets.
- Mixed/duplicate/incomplete topology must fail closed and restore the named Effects method.
- Preserve the validated v0.4 4K behavior while sharing the grouped engine.
- No Witch Dock, Lob/ADP, `/legacy/`, or HeroForge bundle changes in this checkpoint.
- `ARCHITECTURE.md` and `OWNERSHIP.md` require no runtime-architecture or ownership change for this standalone validation checkpoint.

### Recommended action

Commit combined standalone v0.6 as the validated 4K+8K baseline. Treat 8K grouped 4x4096 as the maintained design and the one-shot 8192 variants as rejected experiments. Keep Witch Dock integration as a separate explicit Dev-stage decision.

---

Historical pre-flight records remain preserved in Git history through the preceding validated 4K checkpoint.
