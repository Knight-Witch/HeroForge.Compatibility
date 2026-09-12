# INV-0004 — Current Texture Investigation State

Date: 2026-09-12  
Status: active investigation; current Blood Moon runtime state must be preserved  
Feature: `rendering.texture-quality`

> **READ THIS FILE BEFORE ANY FURTHER TEXTURE-QUALITY PROBES OR EDITS.**
>
> This is the canonical cross-chat checkpoint for the active Blood Moon texture/material investigation. Do not restart from older hypotheses merely because a chat rolled over. Treat the exclusions below as binding until genuinely new evidence reopens one.

## Current protected live baseline

Preserve the current Blood Moon state unless a specific probe requires otherwise:

- body texture: good / high-resolution;
- decals: sharp / high-resolution;
- no `poop` body corruption;
- atlas: `8192x4096`;
- live `atlasScale.bodyLower/bodyUpper/face`: protected high-resolution state, including bodyLower currently observed at `4`;
- Protected Textures standalone feature: **OFF**;
- Lob High Res Decals: **OFF**;
- do not reload, resize, mode-switch, or invoke broad settings rebuilds casually.

The active problem is **paint/material channel coherence on accessories**, not whether high-resolution body/decal textures are possible.

## Historical behavior that must guide the investigation

Before the later Protected Textures lifecycle-ownership architecture existed, the manual high-resolution recipe could enter a transient `poop` state while decals were already sharp. Without source-data edits, HeroForge could later self-heal, and a Booth/mode transition could also clear the poop while retaining high-resolution texture quality. At that point the accessory paints/material channels were not exhibiting the current errors.

This makes a skipped native renderer/lifecycle reconciliation step a supported investigation direction. It is **not yet proven** that the old poop-clear event itself repaired the accessory channel state, but the historical sequence must not be discarded.

## Confirmed current visual defects

The current good-resolution/no-poop state still has accessory channel errors, including:

- horn small-spike paint/material treatment wrong; known intended appearance includes white bases with gold tips on relevant protrusions;
- skirt/pelvis centerpiece material/color treatment wrong;
- middle circles in the hip-chain area should glow/emissive but currently appear non-glowing/gold.

Visual correctness remains human-validated only. Runtime coherence must not be treated as proof that the visible result is correct.

## Binding exclusions — DO NOT REPEAT without new evidence

### Generic stale channel rebake is already insufficient

Already performed: real forced rebakes of `physical`, `physical2`, and `emissive` while body/decal quality was good. Human result:

- body remained good/high-res;
- decals remained good/high-res;
- all previously wrong accessory paint/material channels remained wrong.

Therefore simple stale physical/emissive atlas output is **ruled out as a sufficient cause**. Do not keep repeating channel rebake variants.

### Candidate color-cache invalidation already tested

Bridge #1481 forced color-cache keys dirty for:

- `k_150`, `k_152`, `k_153`;
- `k_157`, `k_158`;
- `hornSideHumanL`, `hornSideHumanR`.

Bridge #1482 confirmed normal color keys were recomputed, atlas remained `8192x4096`, and `_atlasChanged.color === true`. The visual accessory errors survived.

Therefore stale `atlasTargetKeys.color` for those candidates is ruled out as the sufficient cause.

### Accessory skinMask mismatch is real but not established causal

Accessory `skinMask` UV mismatches were found and experimentally synchronized. `CK.character.display.modded.bakes.skinMask === false`; the original skinMask UVs were restored. Do not chase skinMask further without new evidence that connects it to the visible failures.

### GPU/mask/area dead ends already tested

Do not restart these without new evidence:

- GPU prewarming;
- 8192x6144 alone as a poop fix;
- 8192x5376 alone as a poop fix;
- body bake-material UV synchronization alone;
- cloned versus shared body masks;
- double bake / second refresh;
- GPU-cold mask prewarm;
- AAID fallback as a complete root cause;
- broad `instantSettingsChange()`;
- Booth/resize as a generic fix.

### `k_107` missing-mask defect is real but not the visible pelvis cause

`k_107` (`discus`) was confirmed to have fallen back to a 1x1 gray bake mask in the investigated state. Loading its real 256x256 mask and rebaking only that slot across color/physical/physical2/emissive produced **no visible change** in the wrong skirt/hip-chain paints.

Keep the defect recorded, but drop it as the explanation for the current visible pelvis errors.

## Newly confirmed exact meteor-hammer family mapping

The pelvis/chain structure includes the following `meteorHammer` family slots:

- `k_86`, `k_87`, `k_88`, `k_113`, `k_114`, `k_115`.

They share the real loaded `meteorHammer_mask_512.webp` mask in the current runtime.

Their source paint assignments currently include:

- `k_86`: `0=118`, `5=118`, `6=88`;
- `k_87`: `0=118`, `5=118`, `6=26`;
- `k_88`: `0=118`, `5=118`, `6=26`;
- `k_113`: `0=118`, `5=118`, `6=26`;
- `k_114`: `0=118`, `5=118`, `6=88`;
- `k_115`: `0-5=88`, `6=26`.

Shader identities established from runtime:

- `118` = **Nova 3** / emissive;
- `88` = **Ancient Radiant**;
- `26` = **Wolfpack Gray**.

Important correction: an earlier statement that Nova 3 was on channel 6 was wrong. Nova 3 is on channels `0` and `5` for most of the mapped meteorHammer pieces; channel `6` is non-Nova on these slots.

## Upstream paint/palette findings

For `k_86/k_87/k_88/k_113/k_114/k_115`:

- `CK.character.data.paints` and `CK.character.display.data.paints` agree;
- no per-slot `display.modded.paintMatch` entry exists for these six slots;
- each part exposes seven color definitions mapping directly `metal`, `metal1`, ... `metal6` to patch IDs `0..6`;
- tested `gradientsMap` slices are coherent with source assignments;
- on `k_87`, patch `0` and patch `5` carry Nova 3 color/emissive data, while patch `6` carries Wolfpack Gray/non-emissive data.

Thus the observed path is coherent at least through:

`character.data.paints -> display.data.paints -> setPartColors/applyColor -> gradientsMap`

This does **not** prove the final atlas pixels or visible material interpretation are correct.

## Exact next investigation direction

Do not continue generic rebakes. The next allowed work is diagnostic and upstream/downstream boundary mapping:

1. Establish exact **visible wrong surface -> mesh slot -> patch ID / mask region** mapping for the hip-chain circles and horn protrusions.
2. For each exact visible bad surface, trace:
   - source paint assignment;
   - any `paintMatch` redirection;
   - part color definition / patch index;
   - prepared `gradientsMap` entry;
   - mask/channel-index selection used by the base paint bake;
   - resulting color cache key and material-channel inputs.
3. Compare object identities/generation state for atlas, colorBake/paints, bake materials, gradient maps, masks, and visible atlas bindings to test whether the current no-poop state is a **mixed renderer generation**.
4. Instrument the native lifecycle before deliberately reproducing the historical Booth/mode/self-heal transition. The goal is to discover what HeroForge changes when the old poop state clears — not to treat mode switching itself as the fix.
5. Only after exact mapping and generation evidence exists should another reversible mutation be attempted.

## Strong supported hypothesis, not yet confirmed

The current state may have reached high-resolution body/decal output while **skipping the native reconciliation transition** that historically followed the transient poop state. The old transition may have rebuilt/rebound accessory paint/material state as part of a broader renderer-generation handoff.

This would explain why:

- body/decal quality is currently correct;
- generic rebakes and cache invalidations do not repair the accessory errors;
- source paint data and prepared gradients can look coherent while visible accessory channels remain wrong;
- the older pre-Protected-Textures manual workflow ultimately produced both high quality and correct accessory channels after HeroForge recovered.

Do not promote this hypothesis to confirmed until a before/after lifecycle trace shows the relevant state change.

## Architecture implication under investigation

Protected Textures v0.1.4/v0.1.5 added lifecycle ownership that the historical manual recipe did not have: protected `buildAtlas` wrapper ownership, renderer/session invariants, display/resource atlas alignment, and protected-session recovery. This architecture may be preventing a native transitional/reconciliation path that the older successful workflow relied upon.

Do **not** rewrite the standalone yet. First identify the native reconciliation behavior and then decide which lifecycle ownership rules are actually safe.

## Cross-chat rule

Any continuation chat must read:

1. `PROJECT_CONTRACT.md` and normal repository preflight documents;
2. `docs/investigations/INV-0004-texture-atlas-quality-2026-09-10.md`;
3. **this file**.

Before proposing a probe, check it against the binding exclusions above. If it substantially duplicates a completed probe, do not run it unless new evidence specifically reopens that path.

Documentation-only checkpoint. **No runtime behavior changed by this commit.**
