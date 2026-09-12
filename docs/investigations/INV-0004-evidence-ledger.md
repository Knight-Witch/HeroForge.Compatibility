# INV-0004 Evidence Ledger — Texture Atlas / Paint-Channel Investigation

**Purpose:** compact cross-chat index of meaningful tests/findings for `rendering.texture-quality`. Consult this before proposing a materially similar probe.

Disposition vocabulary:

- **CONFIRMED** — directly observed/validated.
- **SUPPORTED** — strong inference, not yet directly proven.
- **RULED OUT AS SUFFICIENT** — real/possible factor but cannot explain the current defect by itself.
- **NOT CAUSAL FOR CURRENT DEFECT** — experimentally changed/fixed with no relevant visual result.
- **DO NOT REPEAT** — completed path; requires explicit new evidence to reopen.
- **OPEN** — still needs discrimination.

| ID | Subject / test | Result | Disposition | Evidence / notes |
|---|---|---|---|---|
| TQ-001 | Native atlas pressure on Blood Moon | Complex scene can sharply reduce body/head allocations and visible quality | **CONFIRMED** | `INV-0004-texture-atlas-quality-2026-09-10.md` |
| TQ-002 | Protected body/head 2048 allocation | Manually constructed protected atlas can hold bodyLower/bodyUpper/face at 2048 with correct valid masks | **CONFIRMED** | investigation + human visual passes |
| TQ-003 | 2048 body-mask requests | HeroForge can request nonexistent `human*_mask_2048.webp`; gray fallback corrupts body paint/glyph output | **CONFIRMED / DO NOT REPEAT unsafe request path** | investigation |
| TQ-004 | Valid 1024 body-mask pinning | Restoring/pinning valid 1024 body masks repairs body skin/glyph corruption while destination allocation can remain 2048 | **CONFIRMED** | investigation |
| TQ-005 | Broad `instantSettingsChange()` | Correlated with renderer/material-channel corruption; rejected for maintained feature | **DO NOT REPEAT** | investigation/spec |
| TQ-006 | 8192x4096 protected candidate under exact Blood Moon no-regression budget | BL/BU/face `1024/1024/2048`, 116 unrelated regressions | **CONFIRMED insufficient for v0.1.5 candidate-selection contract** | corrected detached sweep; do not confuse with historical manual 8192x4096 recipe in TQ-030 |
| TQ-007 | 8192x5120 protected candidate | Same `1024/1024/2048`, 116 unrelated regressions | **CONFIRMED insufficient** | corrected detached sweep |
| TQ-008 | 8192x6144 protected candidate | First tested v0.1.5 candidate reaching `2048/2048/2048` with zero unrelated regressions | **CONFIRMED** | corrected sweep + live structural/human acceptance |
| TQ-009 | First post-disable rectangular sweep | Invalid because target `bakeSize` had already returned to 1024 | **DISCARDED / DO NOT REUSE** | investigation |
| TQ-010 | v0.1.3 Booth failure | Protected display atlas and native resource atlas diverged across renderer lifecycle; incompatible packing locations caused coherent-but-wrong body/face blocks | **CONFIRMED** | lifecycle investigation |
| TQ-011 | v0.1.4/v0.1.5 lifecycle ownership architecture | Added wrapper/display/resource ownership and fresh-session recovery | **IMPLEMENTED; current broader effect still under investigation** | feature source/history |
| TQ-012 | GPU/resource prewarm as poop root | GPU prewarm and GPU-cold mask prewarm did not resolve the relevant corruption | **RULED OUT AS SUFFICIENT / DO NOT REPEAT** | prior runtime probes/current-state checkpoint |
| TQ-013 | 8192x6144 or 8192x5376 alone as poop fix | Atlas dimensions/threshold alone did not eliminate transient poop state | **RULED OUT AS SUFFICIENT / DO NOT REPEAT** | prior runtime probes |
| TQ-014 | Full body bake-material UV synchronization | All 15 BL/BU/face bake-channel UVs were synchronized in the 5376 experiment; decals looked good, body still poop | **RULED OUT AS SUFFICIENT / DO NOT REPEAT** | prior runtime probes |
| TQ-015 | Mask clone/shared-mask variations | Insufficient to fix current corruption | **RULED OUT AS SUFFICIENT / DO NOT REPEAT** | prior runtime probes |
| TQ-016 | Double bake / second refresh | Did not fix defect | **RULED OUT AS SUFFICIENT / DO NOT REPEAT** | prior runtime probes |
| TQ-017 | Forced physical/physical2/emissive rebake | Body/decal quality remained good; wrong accessory material/paint channels remained wrong | **RULED OUT AS SUFFICIENT / DO NOT REPEAT** | Bridge #1466 + Amanda visual confirmation |
| TQ-018 | Accessory `skinMask` UV synchronization | Mismatch was real; `display.modded.bakes.skinMask === false`; visual cause not established; original UVs restored | **RULED OUT AS CURRENT DEFAULT PATH / DO NOT REPEAT absent new evidence** | #1474 mismatch; #1478/#1479 bake disabled; #1480 restore |
| TQ-019 | Candidate color cache-key invalidation | `k_150/152/153/157/158` + `hornSideHumanL/R` keys recomputed; atlas stayed `8192x4096`; `_atlasChanged.color === true`; Amanda subsequently confirmed body/decal/no-poop stayed good and horn/skirt/hip-chain paint defects still survived | **RULED OUT AS SUFFICIENT / DO NOT REPEAT** | Bridge #1481/#1482 + human visual confirmation |
| TQ-020 | `k_107` missing mask | `discus` used 1x1 gray fallback; real 256 mask loaded and slot rebaked with no visible pelvis/chain change | **CONFIRMED defect; NOT CAUSAL FOR CURRENT VISIBLE PELVIS ERROR** | Bridge #1548/#1558 + human check |
| TQ-021 | Exact meteor-hammer family mapping | Hip/pelvis chain family includes `k_86,k_87,k_88,k_113,k_114,k_115`; real 512 mask loaded | **CONFIRMED** | Bridge #1560/#1561 |
| TQ-022 | Meteor-hammer paint assignments | Corrected mapping: shader 118 = Nova 3/emissive; 88 = Ancient Radiant; 26 = Wolfpack Gray; Nova 3 sits on patch 0/5 for most pieces, not patch 6 | **CONFIRMED correction** | Bridge #1563/#1564 and runtime shader data |
| TQ-023 | Meteor-hammer source -> prepared palette path | `character.data.paints` == `display.data.paints`; no per-slot `paintMatch`; part color definitions map `metal..metal6` to patch 0..6; tested `gradientsMap` slices match source paints | **CONFIRMED through gradientsMap only** | Bridge #1563-#1565 |
| TQ-024 | Final visible chain-circle patch selection | Which exact meteorHammer patch/AAID region produces the visibly wrong middle circles is not yet established | **OPEN** | next exact-surface diagnostic target |
| TQ-025 | Horn exact visible-part/patch mapping | Main `elegantSimple` horns are `hornSideHumanL/R`; `k_157/k_158` are separate `spikeSmall` pieces. Exact visibly wrong sub-surface within main horn still needs patch-region proof | **PARTLY CONFIRMED / OPEN patch mapping** | Bridge mapping + TQ-037/TQ-041 |
| TQ-026 | Historical manual high-res recovery | Before Protected Textures lifecycle ownership, sharp/high-res output could coexist with transient poop; HeroForge could later self-heal with **no Booth, mode switch, resize, or user action**, and Booth/mode transitions could also trigger recovery while retaining quality/correct accessory channels | **CONFIRMED historical behavior** | Amanda observation + prior investigation history; see TQ-030 exact recipe |
| TQ-027 | Current no-poop state skipped native reconciliation | Current body/decals are good while accessory channels remain wrong; older successful path passed through native recovery | **SUPPORTED hypothesis, not confirmed** | active context/current-state |
| TQ-028 | Mixed renderer-generation accessory state | Source paints/gradients can be coherent while visible channels are wrong; generation/object identity mismatch remains a plausible lifecycle-level boundary, but current per-slot UV and live-atlas bindings are coherent | **OPEN / NARROWED** | TQ-039/TQ-040 eliminate simple stale UV/target binding |
| TQ-029 | Clean native Blood Moon baseline before historical recipe | Atlas `4096x4096`; bodyLower/bodyUpper `256x256`, face `512x512`; `bakeSize=1024`; `_usedTextureSize≈256/256/512`; no live atlasScale overrides | **CONFIRMED baseline** | recovered prior-chat investigation record |
| TQ-030 | Exact pre-Protected-Textures manual high-res recipe | Live `atlasScale.bodyLower/bodyUpper/face=4`; target `bakeSize=2048`; `_usedTextureSize=1024`; valid 1024 body masks; native `modded.buildAtlas`; **no persistent protected wrapper/recovery loop**; produced `8192x4096` with 2048 body/head slots | **CONFIRMED historical working recipe / DO NOT SUBSTITUTE with v0.1.5 architecture when comparing behavior** | bridge period around #1178/#1184 + prior-chat record |
| TQ-031 | Higher-res AAID fallback | High body targets caused nonexistent higher-res AAID requests to fall back to a **1x1 black texture**; forcing valid persistent 512 AAIDs still left body poop | **CONFIRMED defect; RULED OUT AS COMPLETE ROOT CAUSE / DO NOT REPEAT as standalone fix** | recovered prior-chat investigation record |
| TQ-032 | 8192x5376 `skinMask` threshold detail | 5376 exposed stale `.3333333` skinMask height = **1792 px**; body still poop; mismatch did not explain older 6144 corruption and skinMask bake was later confirmed disabled | **CONFIRMED observation; NOT SUFFICIENT / DO NOT REPEAT without new evidence** | prior runtime probes + #1474/#1478/#1479 |
| TQ-033 | Distinguish resolution target from blanket 2048 forcing | Native collapse to 256/256/512 is the observed quality failure; 2048 is a validated protected target, not proof every slot/source must be forced to 2048 | **CONFIRMED scope rule** | clean baseline + valid 1024-mask findings |
| TQ-034 | Former #1507 / `HFCCandidate264` mutation uncertainty | Later readback in #1527 satisfied the uncertainty obligation; no blind retry is needed. Reopen only if that exact path becomes independently relevant | **RESOLVED / DO NOT RETRY OLD MUTATION** | #1507/#1508 handoff + #1527 readback |
| TQ-035 | Older account/session-specific potato-resolution problem | Earlier cross-browser/cache/driver/new-mini tests showed a separate persistent low-resolution complaint after the GPU-crash period, but no root-cause link to the current atlas-pressure mechanism has been proven | **UNRESOLVED SEPARATE PROBLEM / DO NOT CONFLATE** | older conversation history; current INV-0004 intentionally scopes claims to current runtime |
| TQ-036 | BakeLayers patch-selection architecture | `aaidMap` supplies patch IDs into `getColor(id,masks)`; `gradientsMap` supplies that patch's palette; `masksMap` mixes wash/highlight/special *inside* the selected patch. `getAAID()` falls back to black when expected AAID is not loaded | **CONFIRMED** | live shader + `getAAID` source, #1568/#1571 and prior source probe |
| TQ-037 | Accessory AAID runtime state | meteorHammer family has real shared 512 AAID; `k_157/k_158` have real 128 AAID; `k_107` and `hornSideHumanL/R` currently carry 1x1 black fallback AAID. Real missing 256 AAID resources exist and can be fetched | **CONFIRMED defect** | #1573/#1576 |
| TQ-038 | `k_107` and left-main-horn real-AAID+mask targeted A/B | Temporarily supplied real AAID+mask and targeted atlas writes; Amanda saw **no change**; body/decals remained good and no poop. Do not repeat this direct-uniform targeted recipe | **RULED OUT AS SUFFICIENT / DO NOT REPEAT** | #1577/#1579 + Amanda visual confirmation |
| TQ-039 | Atlas-region / UV coherence for affected slots | Packed atlas rectangle, color bake `uvPosScl`, and visible material `uvPosScl` match exactly for `k_107`, both main horns, `k_87`, and `k_157` | **CONFIRMED; simple stale-slot-UV theory ruled out** | #1583/#1584 |
| TQ-040 | Visible render-target binding | Body, meteorHammer, `k_107`, and main horn visibly sample the same live `AtlasBaker.targetsRGBA[color]` and emissive targets that `bakeAtlas()` writes into | **CONFIRMED; stale duplicate visible-atlas binding ruled out** | #1585/#1587 |
| TQ-041 | Left/right main-horn GPU color-atlas A/B | After left-only real-AAID+mask targeted bake, left and untouched right 256×256 color regions were **byte-for-byte identical**: same hash/channel sums, `diffBytes=0`, `diffPixels=0` | **CONFIRMED: correction did not produce different atlas pixels** | #1588 + Amanda visual no-change |
| TQ-042 | Real main-horn AAID and prepared gradients are nontrivial | Real 256 AAID has 65,536 nonzero pixels / 256 encoded values; horn `patchCount=2`; patch-0 and patch-1 gradient rows differ; source paints are `{0:109,1:85}` | **CONFIRMED** | #1589 |
| TQ-043 | Current narrowed boundary | Because real AAID is nontrivial and gradients differ but left-only direct-uniform correction yielded byte-identical atlas output, the next investigation boundary is the actual bake-material/uniform upload path (`setUniform/getUniform`, `enterBakeRender`, renderer submission), not visible-material interpretation | **SUPPORTED; needs direct source/probe proof** | TQ-036 through TQ-042 |

## Current next probes

Only after checking the table above:

1. inspect `enterBakeRender` / `exitBakeRender` and `SK.Patched` `setUniform` / `getUniform` / shader-upload behavior;
2. determine whether mutating `material.uniforms.aaidMap.value` bypasses the authoritative uniform state used during renderer submission;
3. if source evidence proves `setUniform()` is the authoritative path, run **one bounded color-only left-horn A/B** using `setUniform("aaidMap", realAAID)` and `setUniform("masksMap", realMask)`, with immediate GPU target readback and restoration;
4. continue exact meteorHammer surface/patch mapping separately; do not infer the visible middle-circle patch from source paint order alone;
5. only after current bake-input path is understood, consider an instrumented historical native reconciliation transition.

Do not use generic rebakes, physical/physical2/emissive rebakes, skinMask sync, broad cache invalidation, mode switching, atlas-size changes, AAID substitution by direct `.uniforms.*.value`, GPU prewarm, or duplicate refresh as free-standing “try it again” fixes. They require specific new evidence that changes the prior disposition.

## Ledger maintenance rule

Add one row only when a probe materially changes the hypothesis space, establishes a reusable mapping/fact, corrects an earlier claim, or closes/reopens a path. Do not copy raw JSON payloads here; reference their bridge issue/request IDs.

## Historical-chat audit status

On 2026-09-12 the ledger was cross-checked against recoverable prior project conversations, the prior continuation handoff, current investigation documents, and bridge landmarks. That audit backfilled TQ-029 through TQ-035 and enriched TQ-014/TQ-017/TQ-018/TQ-019/TQ-026.

The subsequent live pass added TQ-036 through TQ-043 and closed TQ-034. This materially reduces repeat risk but is not a claim that every sentence from every historical ChatGPT transcript has been reproduced verbatim. If a later recovered chat yields a unique test/result not represented here, add it as a new row rather than reopening old probes by memory alone.
