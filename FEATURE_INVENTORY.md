# Feature Inventory

This is the canonical feature-ID inventory.

**Current status:** provisional. The entries below were extracted from the initial bulk ZIP audit and must be confirmed against archived legacy source before reconstruction.

Risk scale:

- **Low** — runtime utility with limited surface.
- **Medium** — named internal runtime dependency or meaningful state mutation.
- **High** — invasive runtime replacement, private internal assumptions, or broad cross-feature effects.
- **Critical** — core-bundle interception/boot risk or failure capable of breaking major HeroForge functionality.

## Decals

| Feature ID | Purpose | Legacy source(s) | Risk | Status |
|---|---|---|---|---|
| `decals.catalog.full-list` | Expose broader decal catalog/listing | Advanced Decal Posing | High | Provisional |
| `decals.catalog.filter-policy` | Control exclusions/manual blacklist behavior | Advanced Decal Posing | High | Provisional |
| `decals.selection.invert` | Invert decal selection/target state | Advanced Decal Posing | Medium | Provisional |
| `decals.slots.expand` | Expand body/face decal slot mappings | HF Core Tweaks, Advanced Decal Posing | Critical | Provisional |
| `decals.slots.splatter` | Expand splatter mappings/slots | HF Core Tweaks | Critical | Provisional |
| `decals.special-part-overrides` | Special handling for hard-coded part IDs | HF Core Tweaks | High | Provisional |
| `decals.transform.range` | Expand decal scale/offset ranges | Advanced Decal Posing | High | Provisional |
| `decals.transform.projected` | Projected decal controls and renderer behavior | Advanced Decal Posing + Full Res Decals/Textures | Critical | Provisional; cross-script dependency confirmed in audit |
| `decals.transform.unequal-scale` | Unequal X/Y scaling controls and renderer behavior | Advanced Decal Posing + Full Res Decals/Textures | Critical | Provisional; cross-script dependency confirmed in audit |
| `decals.transform.tiling` | Texture/decal tiling behavior override | Full Res Decals/Textures | Critical | Provisional |
| `decals.verification.policy` | Legacy eligibility/verification bypass behavior | HF Core Tweaks | Critical | Unresolved purpose/acceptability |

## Textures and Rendering

| Feature ID | Purpose | Legacy source(s) | Risk | Status |
|---|---|---|---|---|
| `textures.atlas-profile` | Change atlas dimensions/profiles | Full Res Decals/Textures | Critical | Provisional |
| `textures.environment-map-profile` | Change environment map behavior | Full Res Decals/Textures | High | Provisional |
| `textures.pixels-per-unit` | Override texture density | Full Res Decals/Textures | Critical | Provisional |
| `textures.asset-size-exceptions` | Hard-coded size rules for specific assets | Full Res Decals/Textures | High | Provisional |
| `textures.packing-policy` | Change/suppress packing behavior or logs | Full Res Decals/Textures | High | Provisional |
| `render.output-resolution` | Change render/output resolution behavior | Full Res Decals/Textures | Critical | Provisional |
| `media.screenshot-resolution` | Increase screenshot size | Advanced Decal Posing | Medium | Provisional |
| `media.spin-gif-quality` | Higher-quality spin GIF/export settings | Advanced Decal Posing | High | Provisional |

## Kitbash

| Feature ID | Purpose | Legacy source(s) | Risk | Status |
|---|---|---|---|---|
| `kitbash.capacity` | Raise allowed kitbash part count/settings | 2000 kitbash parts | High | Provisional |
| `kitbash.cap-enforcement` | Alter or disable cap enforcement | HF Core Tweaks, 2000 kitbash parts | Critical | Provisional |
| `kitbash.iteration-limit` | Raise internal iteration limits | 2000 kitbash parts | Critical | Provisional |
| `kitbash.scale-range` | Extend kitbash scale limits | 2000 kitbash parts | High | Provisional |
| `kitbash.axis-scaling` | Enable per-axis scaling | 2000 kitbash parts | High | Provisional |
| `kitbash.bounds` | Extend placement/movement bounds | Full Res Decals/Textures | Critical | Provisional |
| `kitbash.hidden-parts` | Force hidden kit parts visible | Full Res Decals/Textures | Critical | Provisional |
| `kitbash.joint-policy` | Restricted/full joint unlock behavior | Full Res Decals/Textures | Critical | Provisional |

## Character and Pose I/O

| Feature ID | Purpose | Legacy source(s) | Risk | Status |
|---|---|---|---|---|
| `character.local-export` | Export character JSON locally | Advanced Decal Posing | Medium | Provisional |
| `character.local-import` | Import character JSON locally | Advanced Decal Posing | Medium | Provisional |
| `character.pose-json-import` | Import pose-related JSON | Advanced Decal Posing | Medium | Provisional |
| `character.raw-editor.external-reck` | Third-party raw character editor reference | ReCK for Hero Forge | External | External reference only |

## Materials and Paint

| Feature ID | Purpose | Legacy source(s) | Risk | Status |
|---|---|---|---|---|
| `materials.iris-distance` | Extended iris-related control | Advanced Decal Posing | High | Provisional |
| `materials.roughness-controls` | Extended material roughness controls | Advanced Decal Posing | High | Provisional |
| `materials.color-conversion-fix` | Work around color conversion behavior | Advanced Decal Posing | High | Provisional |
| `paint.save-count-policy` | Bypass/alter paint save limit behavior | Advanced Decal Posing | High | Provisional |

## Photo Booth and Camera

| Feature ID | Purpose | Legacy source(s) | Risk | Status |
|---|---|---|---|---|
| `photo-booth.settings-export` | Export Photo Booth settings/state | Advanced Decal Posing | High | Provisional |
| `photo-booth.settings-import` | Import Photo Booth settings/state | Advanced Decal Posing | High | Provisional |
| `photo-booth.shader-pass-policy` | Alter Photo Booth shader/effect pass behavior | Shader Fix for Photo Booth | High | Provisional |
| `camera.extended-bounds` | Extend camera control bounds | Camera Control Modifier | Low/Medium | Standalone reconstruction candidate |
| `camera.fov-control` | Extend FOV controls | Advanced Decal Posing | High | Provisional |

## Slots and Catalog UI

| Feature ID | Purpose | Legacy source(s) | Risk | Status |
|---|---|---|---|---|
| `slots.extra-minis` | Allow additional mini slots | I love extra slots | Medium | Standalone reconstruction candidate |
| `catalog.heat-labels` | Add/alter heat labels | Advanced Decal Posing | High | Provisional |
| `catalog.option-labels` | Add/alter option labels | Advanced Decal Posing | High | Provisional |

## Unclassified Legacy Patches

Advanced Decal Posing contains several compiled-source replacements whose user-visible purpose was not proven during the initial audit. These must remain quarantined until source normalization and investigation.

Do not assign them a maintained feature ID merely to preserve them.