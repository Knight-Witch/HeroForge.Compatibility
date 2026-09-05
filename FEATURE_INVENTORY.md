# Feature Inventory

This is the canonical feature-ID inventory.

**Current status:** mixed. Entries originating only from the initial bulk audit remain provisional; entries updated by current live/runtime investigation are marked accordingly.

Risk scale:

- **Low** — runtime utility with limited surface.
- **Medium** — named internal runtime dependency or meaningful state mutation.
- **High** — invasive runtime replacement, private internal assumptions, or broad cross-feature effects.
- **Critical** — core-bundle interception/boot risk or failure capable of breaking major HeroForge functionality.

## Decals

| Feature ID | Purpose | Legacy/source reference(s) | Risk | Status |
|---|---|---|---|---|
| `decals.advanced-posing` | User-facing Witch Dock grouping for the coherent posing workflow | ADP v0.99.30 + current KW reconstruction | High | Planned host/family; implementation spec pending dependency audits |
| `decals.catalog.full-list` | Expose broader decal catalog/listing | ADP v0.99.30 | High | Confirmed current behavior; still uses `heroforgeui.js` patch in v0.99.30; reconstruction pending |
| `decals.catalog.filter-policy` | Control exclusions/manual blacklist behavior | ADP v0.99.30 | Medium/High | Current v0.99.30 filter policy confirmed; separate data/policy from UI in reconstruction |
| `decals.selection.invert` | Invert decal selection/target state | Older Advanced Decal Posing audit | Medium | Provisional; not part of current posing audit scope |
| `decals.slots.expand` | Expand body/face decal slot mappings | HF Core Tweaks; older ADP attribution unconfirmed for v0.99.30 | Critical | Requires targeted current HF Core Tweaks audit before first-pass inclusion |
| `decals.slots.splatter` | Expand splatter mappings/slots | HF Core Tweaks | Critical | Requires targeted current HF Core Tweaks audit before first-pass inclusion |
| `decals.special-part-overrides` | Special handling for hard-coded part IDs | HF Core Tweaks | High | Provisional |
| `decals.transform.range` | Expand decal move/scale ranges | ADP v0.99.30 | High legacy / Medium target | Exact v0.99.30 UI patches confirmed; target should prefer independent/runtime controls |
| `decals.transform.projected` | Project ON/OFF/Native state plus required renderer behavior | ADP v0.99.30 + Full Res v0.80 | Critical while renderer patch external | Runtime state/control path confirmed; exact current renderer dependency audit still required |
| `decals.transform.unequal-scale` | Unequal X/Y/Z scaling controls and renderer behavior | ADP + Full Res | Critical legacy | Deferred by product decision; state/input works but Project-OFF renderer enhancement is not a release blocker |
| `decals.gizmo.bound-correction` | Replace incorrect floor/origin gizmo for bound decals with projector-centered transform UI | Knight Witch current-runtime reconstruction; validated WITCH_DEV v0.4.2 repair | High | Witch Dock Stable 2026-09-05; Move/Rotate/Scale undo-redo, transform preservation, and fresh-slot first-bind normalization validated; unequal bound scale rendering/wireframe polish deferred |
| `decals.transform.tiling` | Texture/decal tiling behavior override | Full Res Decals/Textures | Critical | Provisional; outside current posing pass |
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
| `media.screenshot-resolution` | Increase screenshot size | Advanced Decal Posing | Medium | Provisional; outside current posing pass |
| `media.spin-gif-quality` | Higher-quality spin GIF/export settings | Advanced Decal Posing | High | Provisional; outside current posing pass |

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
| `character.local-export` | Export character JSON locally | Advanced Decal Posing | Medium | Standalone reconstruction committed; core Save passed live |
| `character.local-import` | Import character JSON locally | Advanced Decal Posing | Medium | Standalone reconstruction committed; core Load passed live |
| `character.pose-json-import` | Import pose-related JSON | Advanced Decal Posing | Medium | Provisional |
| `character.raw-editor.external-reck` | Third-party raw character editor reference | ReCK for Hero Forge | External | External reference only |

## Materials and Paint

| Feature ID | Purpose | Legacy source(s) | Risk | Status |
|---|---|---|---|---|
| `materials.iris-distance` | Extended iris-related control | Advanced Decal Posing | High | Provisional; outside current posing pass |
| `materials.roughness-controls` | Extended material roughness controls | Advanced Decal Posing | High | Provisional; outside current posing pass |
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
| `catalog.heat-labels` | Add/alter heat labels | Advanced Decal Posing | High | Provisional; outside current posing pass |
| `catalog.option-labels` | Add/alter option labels | Advanced Decal Posing | High | Provisional; outside current posing pass |

## Unclassified Legacy Patches

Advanced Decal Posing v0.99.30 still contains several compiled-source replacements whose user-visible purpose is not proven, including posing-adjacent short replacements around `ce`/`se`/`ge`. These remain quarantined until behavior is established.

Do not assign or migrate unexplained patches merely because they are adjacent to known decal code.
