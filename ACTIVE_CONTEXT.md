# Active Context — `feature/rendering-texture-quality`

**Updated:** 2026-09-12  
**Active feature:** `rendering.texture-quality`  
**Current task:** Blood Moon texture/material-channel coherence investigation  
**Runtime mutation posture:** preserve current live state; diagnose before any new mutation

## Read first for this branch

For texture-quality work, the minimum continuation set is:

1. `PROJECT_CONTRACT.md`
2. this file
3. `docs/investigations/INV-0004-current-state-2026-09-12.md`
4. `docs/investigations/INV-0004-evidence-ledger.md`

Read `docs/investigations/INV-0004-texture-atlas-quality-2026-09-10.md`, the feature spec, source, or policy docs only when the next decision actually needs that detail.

Do not reread all root tracking files before routine diagnostic probes.

## Current protected live Blood Moon state

Preserve unless a specific test requires otherwise:

- body texture good / high-resolution;
- decals sharp / high-resolution;
- no current poop body corruption;
- atlas currently `8192x4096`;
- protected/high-res atlas scale state remains live, including bodyLower observed at `4`;
- Protected Textures standalone: **OFF**;
- Lob High Res Decals: **OFF**;
- do not casually reload, resize, mode-switch, enter/leave Booth, or invoke broad character/settings rebuilds.

The open problem is **accessory paint/material-channel coherence**, not whether high-resolution body/decal textures are achievable.

## Current visible defects

Human-observed wrong state includes:

- small horn protrusion/spike material/paint treatment wrong;
- skirt/pelvis centerpiece treatment wrong;
- middle hip-chain circles that should glow/emissive appear non-glowing/gold.

Runtime structural correctness does not close these defects without visual confirmation.

## Binding exclusions

Do not repeat completed paths without explicit new evidence reopening them. The authoritative list and evidence are in the current-state file/evidence ledger. Important examples:

- generic physical/physical2/emissive rebakes are insufficient;
- candidate color-cache invalidation for prior horn slots did not fix the defect;
- accessory `skinMask` mismatch is real but not established causal and was restored;
- `k_107` missing-mask defect is real but not the visible pelvis cause;
- GPU prewarm, duplicate rebake/refresh, body UV sync, mask clone/shared-mask variations, broad `instantSettingsChange()`, and atlas-size-only poop theories are not open default paths.

## Current exact mapping / upstream finding

Pelvis meteor-hammer family currently mapped to:

`k_86`, `k_87`, `k_88`, `k_113`, `k_114`, `k_115`.

Corrected paint finding:

- shader `118` = Nova 3 / emissive;
- `88` = Ancient Radiant;
- `26` = Wolfpack Gray;
- Nova 3 is on channels `0` and `5` for most mapped pieces, **not channel 6**.

For this family, current runtime evidence is coherent through:

`character.data.paints -> display.data.paints -> setPartColors/applyColor -> gradientsMap`.

That does not prove mask/patch selection, atlas pixels, or final visible binding are correct.

## Current leading investigation direction

The older pre-Protected-Textures manual workflow could reach sharp/high-res output with a transient poop state, then HeroForge could self-heal or a mode/Booth transition could clear poop while retaining good texture quality and correct accessory channels.

Supported hypothesis, **not confirmed**: the current no-poop/high-res state may have skipped a native renderer-generation reconciliation step that historically repaired/rebound accessory paint/material state.

Next diagnostic sequence:

1. map exact **visible wrong surface -> mesh slot -> patch/mask channel** for hip-chain circles and horn protrusions;
2. trace each exact surface through source paint, `paintMatch`, part color definition, prepared gradient entry, mask/channel selection, cache/material inputs;
3. compare relevant object identities/generation state for atlas, colorBake/paints, bake materials, gradients, masks, and visible bindings;
4. only after instrumentation is ready, deliberately reproduce the historical native lifecycle transition and compare before/after state;
5. do not use mode switching as a generic fix; use it only as a controlled lifecycle experiment.

## HF-Chat-Bridge boundary

HF-Chat-Bridge is healthy development infrastructure for this investigation. Current installed/working family is relay `0.2.2`, main userscript `0.3.1`, Power companion `0.1.0`.

Routine texture work should use it without loading Bridge repo docs. Read/modify Bridge documentation only if the transport itself becomes the subject.

Use narrow/compact probes. Do not fetch giant shader/function/object dumps when selected fields or summarized signatures can discriminate the hypothesis.

## Current code/promotion state

- texture standalone source remains v0.1.5 candidate on this branch;
- Protected Textures is currently OFF in the live page;
- do not rewrite the standalone around the mixed-generation hypothesis until that hypothesis has direct lifecycle evidence;
- Witch Dock Dev/Stable remain blocked for this feature.

## Update rule

After a meaningful new confirmed result, correction, ruled-out path, or change to the next investigation step, update this file only if the branch-level active context changes. Put individual probe history in the evidence ledger/current investigation instead of growing this router indefinitely.
