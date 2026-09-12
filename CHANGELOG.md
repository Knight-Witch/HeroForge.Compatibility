# Changelog

This is a **rolling current changelog**. Older verbose entries remain durable in Git history and should be fetched only when relevant.

## HFC-2026-09-12-026 — Narrow paint-channel defect to bake-input execution path

**Date:** 2026-09-12

### Summary

Recorded the live Blood Moon accessory-channel investigation through the left/right horn GPU A/B. The current evidence rules out missing AAID/mask assets, per-slot atlas UV mismatch, and stale visible atlas bindings as sufficient explanations for the visible horn/skirt errors.

### Added / corrected

- documented BakeLayers patch selection: `aaidMap` selects patch IDs, `gradientsMap` supplies patch palettes, and `masksMap` mixes within the selected patch;
- confirmed real shared meteorHammer 512 AAID and real `spikeSmall` 128 AAID, while `k_107` and main `elegantSimple` horns currently carry 1×1 black fallback AAIDs;
- recorded successful fetch of the missing real 256 AAID resources;
- recorded targeted `k_107` and left-main-horn real-AAID+mask A/Bs and Amanda's no-change result while body/decals stayed high-res and no poop returned;
- confirmed packed atlas coordinates, color-bake UVs, and visible-material UVs agree on affected/control slots;
- confirmed affected/control meshes sample the same live AtlasBaker color/emissive targets;
- recorded GPU readback proving left and right main-horn color regions remained byte-identical after the left-only correction;
- confirmed the real main-horn AAID is nontrivial and horn patch-0/patch-1 gradient rows differ;
- narrowed the next diagnostic boundary to Patched-material uniform upload / `enterBakeRender` renderer submission;
- closed the old #1507 / `HFCCandidate264` uncertainty because #1527 supplied the required later readback.

### Runtime impact

None from this commit. Documentation only. The runtime probes referenced above were bounded bridge diagnostics and have already completed/restored; no JavaScript or public Witch Dock source changed.

### Validation

Evidence rows cross-checked against Bridge #1573–#1590 and Amanda's visual confirmation. Current 8192×4096 high-res/no-poop state remains the protected baseline.

---

## HFC-2026-09-12-025 — Backfill prior-chat texture evidence into the canonical ledger

**Date:** 2026-09-12

### Summary

Cross-checked the new INV-0004 evidence ledger against recoverable prior project conversations, the prior continuation handoff, current investigation documents, and bridge landmarks so completed texture tests do not disappear at chat rollover.

### Added / corrected

- clean native Blood Moon baseline (`4096x4096`, BL/BU `256`, face `512`, bakeSize `1024`, no live atlasScale override);
- exact historical pre-Protected-Textures manual high-res recipe around #1178/#1184 (`atlasScale=4`, `bakeSize=2048`, `_usedTextureSize=1024`, valid 1024 masks, native `buildAtlas`, no persistent wrapper);
- AAID 1x1-black fallback as a real but insufficient cause;
- 8192x5376 / `.3333333` skinMask = 1792px threshold detail;
- the full 15-channel body bake-material UV-sync failure result;
- bridge IDs for the physical/emissive rebake and skinMask sequence;
- explicit human visual survival of the defects after #1481/#1482;
- the #1507 / `HFCCandidate264` uncertain-mutation readback obligation;
- the older account/session-specific potato-resolution problem as separate/unproven relative to the current atlas-pressure mechanism;
- stronger wording that historical poop could self-heal without Booth, mode switch, resize, or user action.

### Runtime impact

None. Documentation only. No JavaScript, HeroForge runtime state, HF-Chat-Bridge runtime behavior, or public Witch Dock behavior changed.

### Validation

Ledger was compared against the current active-context exclusions and no previously ruled-out path was reopened.

---

## HFC-2026-09-12-024 — Refactor project documentation for selective context loading

**Date:** 2026-09-12

### Summary

Refactors project governance/documentation so fresh ChatGPT continuation chats can recover current truth without loading the entire repository history before every task.

### Changed

- slimmed `PROJECT_CONTRACT.md` to broadly binding rules plus policy routing;
- added branch/task `ACTIVE_CONTEXT.md`;
- split detailed policy into targeted files under `docs/policies/`;
- added a compact INV-0004 evidence ledger with explicit dispositions/DO-NOT-REPEAT results;
- compacted `MASTER.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `TESTING.md`, `PRE_FLIGHT_Check.md`, and README to current-state/navigation roles instead of duplicated history;
- added a paste-ready compact ChatGPT Project-instructions template;
- formalized context-efficient bridge probing and cross-repository ownership boundaries;
- changed preflight from “read every root document every time” to `PROJECT_CONTRACT.md` + `ACTIVE_CONTEXT.md` + only relevant targeted documents/source.

### Runtime impact

None. Documentation/governance only. No JavaScript, HeroForge runtime behavior, HF-Chat-Bridge runtime behavior, or public Witch Dock behavior changed.

### Validation

Final tree/diff review passed: documentation/governance paths only.

---

## HFC-2026-09-12-023 — Add canonical texture investigation checkpoint

**Date:** 2026-09-12

Added `docs/investigations/INV-0004-current-state-2026-09-12.md` so continuation chats preserve the current Blood Moon high-resolution/no-poop baseline, binding DO-NOT-REPEAT exclusions, meteorHammer mapping/corrections, paint-gradient findings, and the renderer-generation reconciliation hypothesis/next step.

**Runtime impact:** none; documentation only.

---

## HFC-2026-09-11-022 — Validate rectangular protected texture atlas policy

**Date:** 2026-09-11

Advanced experimental `rendering.texture-quality` standalone to v0.1.5 after corrected detached/live testing established `8192x6144` as the smallest tested Blood Moon candidate reaching bodyLower/bodyUpper/face 2048 with zero unrelated allocation regression. v0.1.4 lifecycle ownership/coherence safeguards were preserved; maintained 8192x8192 fallback was removed.

Key result: live 8192x6144 passed target allocation, valid 1024 masks, display/resource atlas identity, UV coherence, and human visual acceptance before rollback.

**Runtime impact:** opt-in experimental standalone only; public Witch Dock unchanged.

---

## Historical entries

Verbose history for HFC-2026-09-10-021 and earlier remains in Git history at/before commit `19234039cd4993f4a17b47123a9150d1c5a4fd83`, with older baseline history at/before `732dae09e83d712a26ac383f7b64ce9e27e07a59`.

Use Git search/commit history or the relevant feature investigation when an older change is material; do not reload historical changelog prose by default.
