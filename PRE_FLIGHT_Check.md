# Pre-Flight Check Log

Use this file before committed repository updates to record what was checked, what can conflict, and what action is recommended.

## PFC-2026-09-05-010 — Adaptive Photo Booth true-4K repair

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
- `MASTER.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`
- `ARCHITECTURE.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- `TESTING.md`
- current Photo Booth feature specification and INV-0003
- current standalone Photo Booth v0.2 source on repository `main`
- exact user-supplied ADP v0.99.30 reference and current screenshot-menu behavior
- current HF-Chat-Bridge render/readback/camera/pixel traces
- authenticated current-build `booth.js` source slices used only for diagnosis
- named `CK.Effects.renderToCanvas` source inspection
- fixed 16-phase true-4096 reconstruction proof
- adaptive topology bridge proof and Amanda's whole-image visual acceptance

### Confirmed findings

- Repository `main` was reverified at `428f8bc64c52bd2c9485a5dd38c359eed661c02d` before this update.
- The visible current 4096 model/color path is 16 x 1024 `CK.Effects.renderToCanvas` phases; the earlier 2048 `CK.Capture.renderTarget` belongs to a separate auxiliary/frame path in the tested capture.
- A staged named 4096 Effects render contains materially more true detail than current native/Lob 4096.
- Phase-feeding that full-resolution source through the native compositor preserves native Photo Booth composition while retaining the true source detail.
- The adaptive bridge proof detected 1024 / 4x4 / 16 expected phases, supplied all 16 uniquely, returned 4096x4096, and downloaded a 9,823,790-byte PNG.
- Amanda opened that adaptive proof output and reported it looked great.
- Packaged standalone v0.4 then passed repeat capture, `CK.Effects.renderToCanvas` restoration, normal native 1024 capture afterward, and full `dispose()` cleanup; Amanda reported the installed v0.4 capture worked beautifully.
- Private helper names and source offsets are not required by the maintained repair.

### Material conflict risks

- Do not freeze current 1024/512 private topology or minified helper names as maintained API contracts.
- Constrain repair detection to coherent square-divisor Effects calls using HeroForge's temporary 4096 capture camera/view geometry.
- Mixed, duplicate, incomplete, or unrecognized topology must fail closed and restore the named method.
- If HeroForge begins providing a direct true-4096 Effects model render, pass it through unchanged.
- One true 4096 canvas plus its pixel buffer is memory-heavy; prevent concurrent captures and release temporary references promptly.
- Painterly and other effect profiles still require normal packaged regression coverage.
- 8K remains gated; `maxTextureSize = 16384` alone does not prove safe 8K memory/performance.
- No Witch Dock, Lob/ADP, `/legacy/`, or bundle patch changes in this update.

### Recommended action

Commit adaptive standalone v0.4 as the validated 4K repair and the corrected durable diagnosis/status. The packaged 4K visual, repeat-use, native-after, restoration, and dispose gates have passed on the current build. Keep 8K as a separate follow-up with explicit resource safeguards; do not integrate into Witch Dock Stable from this standalone checkpoint.

---

## Historical records

Pre-flight records through `PFC-2026-09-05-009` remain preserved in Git history at and before commit `428f8bc64c52bd2c9485a5dd38c359eed661c02d`. This file was compacted at the validated 4K checkpoint; no runtime behavior changed because of the documentation compaction.
