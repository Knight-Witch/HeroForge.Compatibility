# INV-0004 Evidence Ledger — Texture Atlas / Paint-Channel Investigation

**Purpose:** compact cross-chat index of meaningful tests/findings for `rendering.texture-quality`. Consult this before proposing a materially similar probe.

Disposition vocabulary:

- **CONFIRMED** — directly observed/validated.
- **SUPPORTED** — strong inference, not yet directly proven.
- **RULED OUT AS SUFFICIENT** — real/possible factor but cannot explain the current defect by itself.
- **NOT CAUSAL FOR VISIBLE DEFECT** — experimentally altered without repairing the human-observed symptom.
- **SUPERSEDED** — interpretation/test harness corrected by later evidence.
- **DO NOT REPEAT** — completed path; requires explicit new evidence to reopen.
- **OPEN** — still needs discrimination.

| ID | Subject / test | Result | Disposition | Evidence / notes |
|---|---|---|---|---|
| TQ-001 | Native atlas pressure on Blood Moon | Complex scene can sharply reduce body/head allocations and visible quality | **CONFIRMED** | `INV-0004-texture-atlas-quality-2026-09-10.md` |
| TQ-002 | Protected body/head high allocation | Manually constructed protected atlas can raise body/head allocations substantially when valid masks/resources are preserved | **CONFIRMED** | investigation + human visual passes |
| TQ-003 | 2048 body-mask requests | HeroForge can request nonexistent `human*_mask_2048.webp`; gray fallback corrupts body paint/glyph output | **CONFIRMED / DO NOT REPEAT unsafe request path** | investigation |
| TQ-004 | Valid 1024 body-mask pinning | Valid 1024 body masks repair body paint/glyph corruption while higher source/bake settings remain | **CONFIRMED** | investigation |
| TQ-005 | Broad `instantSettingsChange()` | Correlated with renderer/material-channel corruption; rejected for maintained feature | **DO NOT REPEAT** | investigation/spec |
| TQ-006 | 8192x4096 protected candidate under v0.1.5 no-regression sweep | BL/BU/face `1024/1024/2048`, 116 unrelated regressions in that protected-candidate test | **CONFIRMED insufficient for v0.1.5 candidate-selection contract** | corrected detached sweep; do not confuse with manual recipe/current 4096 reconciled state |
| TQ-007 | 8192x5120 protected candidate | Same `1024/1024/2048`, 116 unrelated regressions | **CONFIRMED insufficient** | corrected detached sweep |
| TQ-008 | 8192x6144 protected candidate | First tested v0.1.5 candidate reaching `2048/2048/2048` with zero unrelated regressions | **CONFIRMED historical candidate result** | corrected sweep + live structural/human acceptance |
| TQ-009 | First post-disable rectangular sweep | Invalid because target `bakeSize` had already returned to 1024 | **DISCARDED / DO NOT REUSE** | investigation |
| TQ-010 | v0.1.3 Booth failure | Protected display atlas and native resource atlas diverged across renderer lifecycle; incompatible packing locations caused coherent-but-wrong body/face blocks | **CONFIRMED** | lifecycle investigation |
| TQ-011 | v0.1.4/v0.1.5 persistent lifecycle ownership | Added protected build/display/resource ownership absent from historical manual recipe | **IMPLEMENTED; now prime architecture suspect** | feature source/history + TQ-048–TQ-052 |
| TQ-012 | GPU/resource prewarm as poop root | GPU prewarm / GPU-cold mask prewarm did not resolve corruption | **RULED OUT AS SUFFICIENT / DO NOT REPEAT** | prior runtime probes |
| TQ-013 | Atlas dimension alone as poop fix | 8192x6144/5376 alone did not eliminate transient poop | **RULED OUT AS SUFFICIENT / DO NOT REPEAT** | prior runtime probes |
| TQ-014 | Full body bake-material UV synchronization | All 15 BL/BU/face bake-channel UVs synchronized; decals good, body still poop | **RULED OUT AS SUFFICIENT / DO NOT REPEAT** | prior runtime probes |
| TQ-015 | Mask clone/shared-mask variations | Insufficient to repair current corruption | **RULED OUT AS SUFFICIENT / DO NOT REPEAT** | prior runtime probes |
| TQ-016 | Double bake / second refresh | Did not fix defect | **RULED OUT AS SUFFICIENT / DO NOT REPEAT** | prior runtime probes |
| TQ-017 | Forced physical/physical2/emissive rebake | Body/decal quality remained good; wrong accessory channels survived | **RULED OUT AS SUFFICIENT / DO NOT REPEAT** | Bridge #1466 + Amanda visual confirmation |
| TQ-018 | Accessory `skinMask` UV synchronization | Mismatch real; `display.modded.bakes.skinMask === false`; original UVs restored | **RULED OUT AS DEFAULT PATH / DO NOT REPEAT absent new evidence** | #1474/#1478/#1479/#1480 |
| TQ-019 | Candidate color cache-key invalidation | Horn candidate keys recomputed, `_atlasChanged.color=true`, visual defects survived | **RULED OUT AS SUFFICIENT / DO NOT REPEAT** | #1481/#1482 + human check |
| TQ-020 | `k_107` missing mask/resource defect | Real resource substitution altered atlas content but did not repair visible wrong-channel symptom | **CONFIRMED defect; NOT CAUSAL FOR VISIBLE DEFECT as direct slot fix** | #1548/#1558 and later full-pipeline A/B + human checks |
| TQ-021 | MeteorHammer family mapping | `k_86,k_87,k_88,k_113,k_114,k_115` mapped; real shared resources loaded | **CONFIRMED mapping only** | #1560/#1561 |
| TQ-022 | MeteorHammer paint assignments | shader 118 = Nova 3/emissive; 88 = Ancient Radiant; 26 = Wolfpack Gray; Nova primarily patch 0/5, not 6 | **CONFIRMED correction** | #1563/#1564 |
| TQ-023 | MeteorHammer source → gradients path | character/display paints agree; no paintMatch redirect; prepared tested gradient slices agree | **CONFIRMED through gradientsMap** | #1563–#1565 |
| TQ-024 | Visible hip discs were assumed meteorHammer | Amanda later identified the actual problematic HeroForge asset as **Discus** | **SUPERSEDED mapping assumption / DO NOT REPEAT meteorHammer as hip-disc fix** | Amanda part-name identification + TQ-045 |
| TQ-025 | Horn mapping | User-facing **Short Crown Horn** corresponds to `spikeSmall` family `k_157/k_158`; main `elegantSimple` horns are separate | **CONFIRMED** | runtime mapping + Amanda part-name identification |
| TQ-026 | Historical manual high-res recovery | Pre-Protected-Textures high-res state could show transient poop then native self-heal/mode transition while retaining quality and correct channels | **CONFIRMED historical behavior** | Amanda observations + prior investigation |
| TQ-027 | Native reconciliation as channel repair | Kitbash → click figure repaired **all** wrong channels while body/decals stayed high-res and no poop was present | **CONFIRMED; poop not required** | Amanda visual confirmation + #1664/#1666 |
| TQ-028 | Broken state was generation-level incoherence | Per-slot source paints/gradients/UV/final target bindings could be coherent while accessory channels were wrong; native rebuild changed atlas generation/resource selection and fixed all channels | **SUPPORTED strongly / generation-level mechanism not yet exact** | TQ-039/TQ-048–TQ-052 |
| TQ-029 | Clean native Blood Moon baseline before high-res recipe | `4096x4096`; BL/BU ~256, face ~512; `bakeSize=1024`; no scale override | **CONFIRMED baseline** | recovered prior-chat record |
| TQ-030 | Historical minimal manual high-res recipe | scale 4; `bakeSize=2048`; `_usedTextureSize=1024`; valid masks; native `modded.buildAtlas`; no persistent wrapper | **CONFIRMED historical working recipe** | #1178-era record / prior chat |
| TQ-031 | Higher-res body AAID fallback | Nonexistent higher-res AAID could become 1x1 black; substituting valid AAID alone did not resolve body poop | **CONFIRMED defect; RULED OUT AS COMPLETE ROOT** | historical probes |
| TQ-032 | 5376 `skinMask` detail | stale `.3333333` height gave 1792px; body still poop; skinMask later confirmed disabled | **CONFIRMED observation; NOT SUFFICIENT** | historical + #1474/#1478/#1479 |
| TQ-033 | High quality ≠ force every slot to 2048 | Native quality collapse is 256/256/512 baseline; current visually accepted state uses 1024 body/head allocations inside 4096 atlas | **CONFIRMED scope rule, strengthened by TQ-049** | baseline + post-reconcile state |
| TQ-034 | #1507 / `HFCCandidate264` uncertainty | Later #1527 readback satisfied uncertainty obligation | **RESOLVED / DO NOT RETRY OLD MUTATION** | #1507/#1527 |
| TQ-035 | Older post-GPU-crash/account-specific potato issue | Separate persistent low-resolution complaint; root-cause link to current atlas pressure unproven | **UNRESOLVED SEPARATE PROBLEM / DO NOT CONFLATE** | older history |
| TQ-036 | BakeLayers patch selection | AAID selects patch; gradients supplies palette; masks mixes within selected patch; missing AAID can fall back black | **CONFIRMED** | live shader/getAAID source |
| TQ-037 | Broken-generation accessory resource state | `k_157/k_158` had real 128 AAID; `k_107` and main horns had fallback resources in broken generation | **CONFIRMED broken-state evidence** | #1502/#1527/#1573 etc. |
| TQ-038 | Direct real-resource targeted A/Bs | Supplying real AAID/mask to selected broken-generation slots did not visibly repair the accessory defect | **RULED OUT AS SUFFICIENT / DO NOT REPEAT as substitute for native rebuild** | targeted A/Bs + Amanda visual checks |
| TQ-039 | Broken-generation atlas-region/UV coherence | Packed atlas UV, bake UV, and live material UV matched on affected/control samples | **CONFIRMED; simple stale-UV theory ruled out** | #1583/#1584 |
| TQ-040 | Broken-generation visible target binding | Samples visibly referenced current final color/emissive AtlasBaker targets | **CONFIRMED; simple stale-final-texture theory ruled out** | #1585/#1587 |
| TQ-041 | Early left/right horn final-atlas readback after targeted bake | Readback was byte-identical, but the early targeted recipe did not yet account for `bakeAtlas` scratch target vs native `dilate` completion | **SUPERSEDED AS CAUSAL ATLAS-OUTPUT PROOF** | test-harness correction TQ-044; human no-change observation remains valid |
| TQ-042 | Main-horn real AAID / gradients nontrivial | Real AAID contains meaningful patch IDs and prepared gradients differ by patch | **CONFIRMED** | #1589 and related probes |
| TQ-043 | Prior “uniform-upload path is next boundary” conclusion | Later scratch/final discovery and native Kitbash reconciliation shifted the boundary to full generation lifecycle | **SUPERSEDED** | TQ-044/TQ-048 |
| TQ-044 | Scratch vs visible atlas pipeline | `bakeAtlas(type,map)` writes `targetsRGBA.<type>Src`; with `useLiveTextures=false`, normal completion includes decal bake + `dilate(type)` into visible target | **CONFIRMED / TEST-HARNESS CORRECTION** | live AtlasBaker source/runtime probes |
| TQ-045 | Proper full meteorHammer color pipeline | Six mapped meteorHammer slots were processed through setPartColors/decal/bake/dilate; all six final visible color regions were byte-identical | **RULED OUT AS HIP-DISC FIX / DO NOT REPEAT** | corrected native-pipeline test + Amanda part naming |
| TQ-046 | Discus real-resource full-pipeline A/B | `k_107/k_112` and `k_102/k_203` real-resource substitutions changed final color/emissive pixels; `k_102/k_203` emissive 0→5120 lit pixels each; visual wrong-channel symptom did not change | **CONFIRMED atlas effect; NOT CAUSAL FOR VISIBLE DEFECT as direct slot repair / DO NOT REPEAT** | #1629/#1636/#1657/#1660 + Amanda visual checks |
| TQ-047 | Exact user-facing affected asset names | **Short Crown Horn**, **Celestial Circlet**, **Discus** | **CONFIRMED human mapping** | Amanda 2026-09-12 |
| TQ-048 | Kitbash/click self-heal | Entering Kitbash and clicking the figure changed every incorrect accessory channel to correct; body/decals remained high-res and no poop appeared | **CONFIRMED decisive lifecycle event** | Amanda visual confirmation; post-state #1664 |
| TQ-049 | Correct post-reconcile atlas/allocation state | `display.atlas=4096x4096`; scale `4/4/4`; BL/BU/face each 1024x1024; each still `bakeSize=2048`, `_usedTextureSize=1024`; visual quality accepted | **CONFIRMED** | #1664/#1666 + Amanda visual confirmation |
| TQ-050 | Short Crown Horn resource-size reselection | Broken generation `k_157/k_158` used real 128 AAID; correct generation uses real **64 AAID** + 128 mask and 64x64 packed slots | **CONFIRMED generation change** | #1527 vs #1668/#1670 |
| TQ-051 | Correct-generation accessory resources | Celestial Circlet uses real 64 AAID + 128 mask; main elegantSimple horns changed from fallback in broken generation to real resources; all 16 Discus have zero fallback AAID/mask on color/emissive | **CONFIRMED post-reconcile state** | #1666/#1671/#1672 |
| TQ-052 | Current architecture direction | High-res source settings survive native 4096 repack; persistent giant-atlas ownership is not required for visual quality and may interfere with native resource/atlas reconciliation | **SUPPORTED STRONGLY; exact necessary native call chain OPEN** | TQ-030/TQ-048–TQ-051 |

## Current next work

The current correct figure is valuable evidence. Preserve it.

1. Inspect the native **Kitbash → figure click** call path read-only.
2. Identify the exact generation/reconciliation sequence: native `modded.buildAtlas`, resource-size selection, paints/material setup, `colorBake.refresh`, atlas packing/dilation, `updateDisplayMaterials`, or related calls.
3. Determine the minimum safe sequence that preserves `atlasScale=4`, `bakeSize=2048`, `_usedTextureSize=1024` while letting native HeroForge own the actual atlas/resource rebuild.
4. Do not intentionally recreate the broken state on the current figure merely for instrumentation.
5. After the native lifecycle is understood, redesign the standalone narrowly and validate Standalone → Witch Dock Dev → Stable.

Do not use poop creation, generic rebakes, skinMask sync, broad cache invalidation, arbitrary atlas-size forcing, guessed Discus slot corrections, or `instantSettingsChange()` as free-standing fixes.

## Ledger maintenance rule

Add or revise a row only when evidence materially changes the hypothesis space, corrects an earlier test interpretation, establishes reusable mapping/state, or closes/reopens a path. Reference bridge issue/request IDs instead of embedding raw JSON.

## Audit status

The ledger includes recoverable historical/chat evidence plus the 2026-09-12 live lifecycle investigation through the decisive Kitbash/click reconciliation. If later recovered evidence conflicts with a row, preserve the old observation but correct its disposition/interpretation rather than silently deleting history.
