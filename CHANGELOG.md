# Changelog

This is a **rolling current changelog**. Older verbose entries remain durable in Git history and should be fetched only when relevant.

## HFC-2026-09-12-027 — Confirm native reconciliation restores channels while high-res survives

**Date:** 2026-09-12

### Summary

Recorded the decisive Blood Moon lifecycle transition: entering Kitbash and clicking the figure caused HeroForge to rebuild/reconcile the render generation, immediately restoring all previously incorrect accessory material/color/emissive channels while preserving visually high-resolution body texture, sharp decals, and a no-poop state.

### Confirmed post-reconciliation state

- atlas changed from the broken-generation `8192x4096` state to native `4096x4096`;
- `atlasScale.bodyLower/bodyUpper/face` remains `4/4/4`;
- bodyLower/bodyUpper/face each occupy `1024x1024` atlas regions;
- body/head parts remain `bakeSize=2048`, `_usedTextureSize=1024`;
- Amanda visually confirmed body/decal quality remained good and all accessory channels became correct;
- Short Crown Horn (`spikeSmall`, `k_157/k_158`) changed from the broken generation's 128 AAID selection to the correct generation's 64 AAID selection with real 128 mask;
- Celestial Circlet (`starCirclet`, `k_139`) currently uses real 64 AAID + 128 mask;
- all 16 Discus instances in the correct generation have real/non-fallback AAID and mask resources on color and emissive;
- main `elegantSimple` horns changed from fallback resources in the broken generation to real resources after reconciliation.

### Corrections to prior interpretation

- poop is **not required** for channel repair; it was an intermediate/incoherent-generation symptom in historical cases;
- persistent `8192x4096` ownership is not required for the desired high-resolution visual result;
- early targeted `bakeAtlas()` tests that did not account for `*Src -> dilate -> visible target` are no longer treated as definitive final-atlas causality tests;
- the six-piece meteorHammer family is not the user-identified hip-disc asset; Amanda identified the affected part family as Discus.

### Current direction

Investigate the native **Kitbash -> figure click** reconciliation call chain and determine the minimum programmatic sequence that preserves scale=4 / bakeSize=2048 / usedTextureSize=1024 while allowing native HeroForge to own atlas packing/resource reselection/material reconciliation.

### Runtime impact

None from this commit. Documentation only. The decisive runtime transition was user-triggered in HeroForge before the documentation update. No JavaScript, Compatibility runtime, HF-Chat-Bridge runtime, or public Witch Dock source changed.

### Validation

Post-transition runtime snapshots: Bridge #1664, #1666, #1668, #1670, #1671, #1672 plus Amanda's visual confirmation.

---

## HFC-2026-09-12-026 — Narrow paint-channel defect to bake-input execution path

**Date:** 2026-09-12

### Summary

Recorded the live Blood Moon accessory-channel investigation through the left/right horn GPU A/B. The then-current evidence ruled out simple per-slot UV mismatch and stale visible atlas bindings and narrowed the next boundary. Later HFC-2026-09-12-027 supersedes the uniform-upload focus with a confirmed native generation-reconciliation event and corrects the scratch/final atlas interpretation.

### Added / corrected at that stage

- documented BakeLayers patch selection: `aaidMap` selects patch IDs, `gradientsMap` supplies patch palettes, and `masksMap` mixes within the selected patch;
- confirmed broken-generation resource state on candidate accessories;
- recorded targeted real-AAID/mask A/Bs and Amanda's no-change results;
- confirmed packed atlas coordinates, bake UVs, and visible-material UVs agree on sampled slots;
- confirmed sampled meshes reference current visible AtlasBaker targets;
- closed the old #1507 / `HFCCandidate264` uncertainty because #1527 supplied the required later readback.

**Runtime impact:** none from the documentation commit.

---

## HFC-2026-09-12-025 — Backfill prior-chat texture evidence into the canonical ledger

**Date:** 2026-09-12

Cross-checked the INV-0004 evidence ledger against recoverable prior project conversations, handoffs, investigation documents, and bridge landmarks. Backfilled the clean native baseline, historical manual high-res recipe, AAID fallback dead ends, skinMask details, exact Bridge provenance, and old mutation-readback obligations.

**Runtime impact:** none; documentation only.

---

## HFC-2026-09-12-024 — Refactor project documentation for selective context loading

**Date:** 2026-09-12

Slimmed the binding contract, added `ACTIVE_CONTEXT.md`, split targeted policies, created the evidence-ledger/current-state architecture, and compacted root tracking docs so continuation chats load only relevant current truth.

**Runtime impact:** none; documentation/governance only.

---

## HFC-2026-09-12-023 — Add canonical texture investigation checkpoint

**Date:** 2026-09-12

Added the canonical cross-chat INV-0004 current-state checkpoint.

**Runtime impact:** none; documentation only.

---

## HFC-2026-09-11-022 — Validate rectangular protected texture atlas policy

**Date:** 2026-09-11

Advanced experimental `rendering.texture-quality` standalone to v0.1.5 after corrected detached/live testing established `8192x6144` as the smallest tested Blood Moon protected candidate reaching bodyLower/bodyUpper/face 2048 with zero unrelated allocation regression. This remains historical candidate evidence; the later native-reconciled 4096 state changes the architecture direction.

**Runtime impact:** opt-in experimental standalone only; public Witch Dock unchanged.

---

## Historical entries

Verbose history for HFC-2026-09-10-021 and earlier remains in Git history at/before commit `19234039cd4993f4a17b47123a9150d1c5a4fd83`, with older baseline history at/before `732dae09e83d712a26ac383f7b64ce9e27e07a59`.

Use Git search/commit history or the relevant feature investigation when an older change is material; do not reload historical changelog prose by default.
