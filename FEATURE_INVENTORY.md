# Feature Inventory

This is the canonical feature-ID inventory.

**Current status:** mixed. Most entries remain provisional because immutable legacy sources have not yet been archived. Stage 1 entries are identified separately and are not considered validated until acceptance testing is complete.

Risk scale:

- **Low** — runtime utility with limited surface.
- **Medium** — named internal runtime dependency or meaningful state mutation.
- **High** — invasive runtime replacement, private internal assumptions, or broad cross-feature effects.
- **Critical** — core-bundle interception/boot risk or failure capable of breaking major HeroForge functionality.

Status terms used below:

- **Provisional** — identified through audit; maintained behavior not yet reconstructed.
- **Standalone test implementation** — code exists; live acceptance testing pending.
- **Experimental standalone** — code exists but remains unsuitable for integration due to risk or incomplete validation.
- **Deprecated candidate** — current HeroForge behavior may supersede the legacy feature; explicit review still required.

## Decals

| Feature ID | Purpose | Legacy source(s) | Risk | Status |
|---|---|---|---|---|
| `decals.catalog.full-list` | Expose broader decal catalog/listing | Advanced Decal Posing | High | Provisional; August 5 filter rewrite requires new design |
| `decals.catalog.filter-policy` | Control exclusions/manual blacklist behavior | Advanced Decal Posing | High | Provisional; August 5 filter rewrite requires new design |
| `decals.selection.invert` | Invert decal selection/target state | Advanced Decal Posing | Medium | Provisional; old UI anchor absent |
| `decals.slots.expand` | Expand body/face decal slot mappings | HF Core Tweaks, Advanced Decal Posing | Critical | Provisional |
| `decals.slots.splatter` | Expand splatter mappings/slots | HF Core Tweaks | Critical | Provisional |
| `decals.special-part-overrides` | Special handling for hard-coded part IDs | HF Core Tweaks | High | Provisional |
| `decals.transform.range` | Expand decal scale/offset ranges | Advanced Decal Posing | High | Provisional; old anchors moved or changed |
| `decals.transform.projected` | Projected decal controls and renderer behavior | Advanced Decal Posing + Full Res Decals/Textures | Critical | Experimental standalone v0.1.0; static patch validation passed for `heroforge08.1.9.74`; live testing pending |
| `decals.transform.unequal-scale` | Unequal X/Y/Z scaling controls and renderer behavior | Advanced Decal Posing + Full Res Decals/Textures | Critical | Coupled to `decals.transform.projected`; experimental standalone v0.1.0; live testing pending |
| `decals.transform.tiling` | Texture/decal tiling behavior override | Full Res Decals/Textures | Critical | Deprecated candidate; native projected-decal Tiling confirmed on `heroforge08.1.9.74` |
| `decals.verification.policy` | Legacy eligibility/verification bypass behavior | HF Core Tweaks | Critical | Unresolved purpose/acceptability |

## Textures and Rendering

| Feature ID | Purpose | Legacy source(s) | Risk | Status |
|---|---|---|---|---|
| `textures.atlas-profile` | Change atlas dimensions/profiles | Full Res Decals/Textures | Critical | Provisional; several current anchors still observed but behavior untested |
| `textures.environment-map-profile` | Change environment map behavior | Full Res Decals/Textures | High | Provisional |
| `textures.pixels-per-unit` | Override texture density | Full Res Decals/Textures | Critical | Provisional; current anchor observed |
| `textures.asset-size-exceptions` | Hard-coded size rules for specific assets | Full Res Decals/Textures | High | Provisional |
| `textures.packing-policy` | Change/suppress packing behavior or logs | Full Res Decals/Textures | High | Provisional |
| `render.output-resolution` | Change render/output resolution behavior | Full Res Decals/Textures | Critical | Provisional; old weak anchor absent |
| `media.screenshot-resolution` | Increase screenshot size | Advanced Decal Posing | Medium | Provisional; current option loop moved to `boothui.js` |
| `media.spin-gif-quality` | Higher-quality spin GIF/export settings | Advanced Decal Posing | High | Provisional; current actions moved to `boothui.js` |

## Kitbash

| Feature ID | Purpose | Legacy source(s) | Risk | Status |
|---|---|---|---|---|
| `kitbash.capacity` | Raise allowed kitbash part count/settings | 2000 kitbash parts | High | Provisional |
| `kitbash.cap-enforcement` | Alter or disable cap enforcement | HF Core Tweaks, 2000 kitbash parts | Critical | Provisional |
| `kitbash.iteration-limit` | Raise internal iteration limits | 2000 kitbash parts | Critical | Provisional |
| `kitbash.scale-range` | Extend kitbash scale limits | 2000 kitbash parts | High | Provisional |
| `kitbash.axis-scaling` | Enable per-axis scaling | 2000 kitbash parts | High | Native per-axis kitbash scaling exists; legacy scope and remaining need unresolved |
| `kitbash.bounds` | Extend placement/movement bounds | Full Res Decals/Textures | Critical | Provisional; current anchor observed |
| `kitbash.hidden-parts` | Force hidden kit parts visible | Full Res Decals/Textures | Critical | Provisional; current anchor observed |
| `kitbash.joint-policy` | Restricted/full joint unlock behavior | Full Res Decals/Textures | Critical | Provisional; loader shape changed and old assignment anchor is absent |

## Character and Pose I/O

| Feature ID | Purpose | Legacy source(s) | Risk | Status |
|---|---|---|---|---|
| `character.local-file-io` | Independent complete character JSON export/import | Advanced Decal Posing | Medium | Standalone test implementation v0.1.0; live round trip pending |
| `character.local-export` | Export character JSON locally | Advanced Decal Posing | Medium | Implemented through `character.local-file-io`; not yet validated |
| `character.local-import` | Import character JSON locally | Advanced Decal Posing | Medium | Implemented through `character.local-file-io`; not yet validated |
| `character.pose-json-import` | Import pose-related JSON | Advanced Decal Posing | Medium | Provisional; separate from complete character import |
| `character.raw-editor.external-reck` | Third-party raw character editor reference | ReCK for Hero Forge | External | External reference only |

## Materials and Paint

| Feature ID | Purpose | Legacy source(s) | Risk | Status |
|---|---|---|---|---|
| `materials.iris-distance` | Extended iris-related control | Advanced Decal Posing | High | Provisional; Clover restored current UI anchor |
| `materials.roughness-controls` | Extended material roughness controls | Advanced Decal Posing | High | Provisional; Clover restored current UI anchor |
| `materials.color-conversion-fix` | Work around color conversion behavior | Advanced Decal Posing | High | Provisional; old anchor absent and original bug status unverified |
| `paint.save-count-policy` | Bypass/alter paint save limit behavior | Advanced Decal Posing | High | Provisional |

## Photo Booth and Camera

| Feature ID | Purpose | Legacy source(s) | Risk | Status |
|---|---|---|---|---|
| `photo-booth.settings-file-io` | Independent Photo Booth settings export/import | Advanced Decal Posing | High | Standalone test implementation v0.1.0; `BT.maker.effectState.save/load` observed; live round trip pending |
| `photo-booth.settings-export` | Export Photo Booth settings/state | Advanced Decal Posing | High | Implemented through `photo-booth.settings-file-io`; not yet validated |
| `photo-booth.settings-import` | Import Photo Booth settings/state | Advanced Decal Posing | High | Implemented through `photo-booth.settings-file-io`; not yet validated |
| `photo-booth.shader-pass-policy` | Alter Photo Booth shader/effect pass behavior | Shader Fix for Photo Booth | High | Provisional |
| `camera.extended-bounds` | Extend camera control bounds | Camera Control Modifier | Low/Medium | Standalone reconstruction candidate |
| `camera.fov-control` | Extend FOV controls | Advanced Decal Posing | High | Provisional; HeroForge now has native Booth/Token FOV controls |

Known external consumers affected by the Booth rewrite but not implemented here:

- Witch Dock Persistent Booth View.
- Witch Dock Black Canvas Background.

Their repair belongs in the Witch Dock project after the shared Booth runtime is validated.

## Slots and Catalog UI

| Feature ID | Purpose | Legacy source(s) | Risk | Status |
|---|---|---|---|---|
| `slots.extra-minis` | Allow additional mini slots | I love extra slots | Medium | Standalone reconstruction candidate |
| `catalog.heat-labels` | Add/alter heat labels | Advanced Decal Posing | High | Provisional |
| `catalog.option-labels` | Add/alter option labels | Advanced Decal Posing | High | Provisional; one old anchor moved into Booth environment UI and is not the original catalog target |

## Unclassified Legacy Patches

Advanced Decal Posing contains several compiled-source replacements whose user-visible purpose was not proven during the initial audit. These must remain quarantined until source normalization and investigation.

Do not assign them a maintained feature ID merely to preserve them.
