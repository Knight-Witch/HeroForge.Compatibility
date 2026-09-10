# Pre-Flight Check Log

## PFC-2026-09-10-018 — Repair protected-texture Booth lifecycle coherence

Date: 2026-09-10

### Target files

- `entries/tampermonkey-standalone/rendering-texture-quality.user.js`
- `docs/feature-specs/rendering-texture-quality.md`
- `docs/investigations/INV-0004-texture-atlas-quality-2026-09-10.md`
- `MASTER.md`
- `FEATURE_INVENTORY.md`
- `ARCHITECTURE.md`
- `COMPATIBILITY.md`
- `MIGRATION_PLAN.md`
- `TESTING.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Reviewed

- binding `PROJECT_CONTRACT.md` and repository `README.md`;
- current `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `MIGRATION_PLAN.md`, and `TESTING.md`;
- current texture-quality feature spec, investigation, and standalone v0.1.3 source;
- user-supplied Blood Moon screenshot and report that v0.1.3 improved decals but produced persistent bizarre body/face textures, with Booth off temporarily exposing the native low-resolution/seamed body before the bad state returned;
- live read-only HF-Chat-Bridge state and source probes from issues #1205, #1206, #1207, and #1209;
- live `colorBake.refresh`, `updateDisplayMaterials`, `atlasBaker.bindDisplayMaps`, `atlasBaker.bakeAtlas`, `atlasBaker.getRGBATarget`, and native `modded.buildAtlas` source;
- existing manual protected-2048 D4/Blood Moon evidence and body-mask findings;
- exact v0.1.4 runtime candidate reproduced locally from the staged Git blob, `node --check` result, and `git hash-object` result;
- feature branch head `e1562ed506fd8798860feaa5db050e1b37d9be94` and base tree `0389f601c5a2388361468ba78ceb34fcaa0793ff` before packaging.

### Confirmed

- v0.1.3 passed the adaptive allocation gate on Blood Moon by selecting 8192x8192 and reaching bodyLower/bodyUpper/face 2048.
- The user observed visibly improved decals and reported paint/color channels appeared correct; the new failure therefore does not support abandoning the 2048 target or blaming paint data.
- In the persistent broken state, `display.atlas` was the protected 8192x8192 atlas while `modded.resourceAtlas` was a different 8192x4096 atlas.
- The feature still reported active even though `modded.buildAtlas` had reverted to HeroForge's native implementation; the v0.1.3 protected wrapper was no longer installed.
- The protected/display atlas packed bodyLower/bodyUpper/face at X positions 0/2048/4096, while the current resource atlas packed them at 512/1024/1536.
- Display/color-bake material UV vectors matched the protected display atlas, proving that v0.1.3's size-only verification could accept a 2048 rectangle at the wrong lifecycle/layout context.
- HeroForge's atlas baker uses `display.atlas` dimensions plus material `uvPosScl` for its scissor/output layout, and visible display materials bind the resulting atlas render-target textures. The resource/display split is therefore a real renderer-coherence failure, not harmless duplicate metadata.
- Booth off temporarily produced a sane native/low-resolution state; the old watcher then treated loss of the protected state as a same-session repair and reintroduced the broken split.
- The correct repair boundary is renderer/session ownership: stale protected sessions must be invalidated when `display.modded`, wrapper ownership, or resource/display atlas identity changes.
- `OWNERSHIP.md` does not require a content change for this stage; `rendering.texture-quality` remains primary-maintainer TBD, reviewer Amanda, experimental standalone only.

### Material conflict risks

- Assigning the current HeroForge `resourceAtlas` to `display.atlas` during recovery can temporarily show native/low-resolution textures. This is intentional as a coherence hand-off before creating a fresh protected session; it must use only the narrow color-bake path.
- Exact pre-enable atlas restoration is safe only while the original protected session still owns the current renderer. After HeroForge replaces renderer ownership, forcing stale pre-transition atlas objects back can recreate the class of split state being fixed.
- Waiting for renderer identity/atlas objects/part signature to stabilize must remain bounded; normal HeroForge transitions must not stall the feature indefinitely.
- Repeated renderer replacement may be legitimate on some Booth transitions. v0.1.4 deliberately auto-disables after more than two recoveries in a 30-second burst rather than risk an infinite fight; human acceptance must determine whether this bound is practical.
- 8192x8192 remains a higher-VRAM fallback and must not become the default when 8192x4096 satisfies the target/no-regression contract.
- `/legacy/` and Witch Dock remain untouched.
- No broad `instantSettingsChange()`, `data.change()`, bundle patch, 4096-body promotion, or character-specific mask hard-code is permitted.

### Recommended action

Commit standalone v0.1.4 with hard renderer/wrapper/atlas ownership postconditions, full target UV-location verification, stale-session invalidation, bounded wait-for-HeroForge-settle recovery, current-resource/display coherence hand-off, and fresh protected-session initialization. Preserve the existing 1024-mask / 2048-target / adaptive-atlas allocation recipe. Then test one clean Blood Moon activation and one Booth off/on lifecycle transition before proceeding to disable/re-enable and figure-change acceptance.

**Runtime behavior changed:** yes, limited to the opt-in experimental standalone feature branch. Existing maintained modules and public Witch Dock are unchanged.

---

## PFC-2026-09-10-017 — Adaptive atlas-area fallback and persistent test telemetry

Date: 2026-09-10

### Target files

- `entries/tampermonkey-standalone/rendering-texture-quality.user.js`
- `docs/feature-specs/rendering-texture-quality.md`
- `docs/investigations/INV-0004-texture-atlas-quality-2026-09-10.md`
- `MASTER.md`
- `FEATURE_INVENTORY.md`
- `ARCHITECTURE.md`
- `COMPATIBILITY.md`
- `MIGRATION_PLAN.md`
- `TESTING.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Reviewed

- binding `PROJECT_CONTRACT.md`;
- current `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `MIGRATION_PLAN.md`, and `TESTING.md`;
- current texture feature spec, investigation, and standalone v0.1.2 source;
- v0.1.2 Blood Moon panel failure supplied by Amanda;
- passive bridge recorder result from issue #1192;
- live `CK.Atlas` constructor source and native `modded.buildAtlas()` implementation;
- successful manual Blood Moon protected sequence in issues #1145/#1146;
- detached cloned-scale vs live-scale equivalence result from issue #1193;
- current bridge health and the timed-out heavy pressure-profile probe;
- feature branch head `0745d3f7254185430ce20d6254e79679025f3060` and base tree `586b8cb68be2aa2e8c94811fceb29727d5c9dff6` before packaging.

### Confirmed

- v0.1.2 failed with baseline `8192x4096`; its protected attempt produced bodyLower `1024`, bodyUpper `1024`, face `2048`.
- The last failure remained available in v0.1.2 diagnostics, but the disabled watcher replaced the visible panel error with normal Ready status on the next tick.
- The passive recorder can observe atlas/target/bake/status transitions without mutating HeroForge.
- Using a cloned target scale versus temporarily placing the same target entries on live `character.data.atlasScale` produced the same detached `8192x4096` result (`1024/1024/2048`). Scale-object identity is therefore not the missing factor.
- With unrelated slots capped to their exact pre-enable allocations, the current `8192x4096` area cannot satisfy all three 2048 targets; increasing atlas area is the next bounded variable.
- The maintained quality target remains 2048. The separate 4096-body experiment is not being promoted.
- `COMPATIBILITY.md`, `MIGRATION_PLAN.md`, and the investigation contained fixed-8192x4096 / v0.1.0-era wording that must change in the same commit so durable project state matches v0.1.3 behavior.
- `OWNERSHIP.md` does not require a runtime-stage change; primary maintainer remains TBD and Witch Dock promotion is still unapproved.

### Material conflict risks

- `8192x8192` doubles atlas area relative to `8192x4096` and may carry materially higher GPU/VRAM cost. It must be a fallback candidate only, selected only when the smaller atlas cannot satisfy postconditions.
- The fallback must be tested detached before display assignment.
- Any candidate that lowers an unrelated pre-enable slot allocation must be rejected.
- Errors must remain visible long enough for human review and must be available as plain bridge-readable data.
- Heavy Power probes can exceed the relay mutation lease; the maintained standalone must capture its own bounded telemetry instead of relying on repeated Power inspection during user testing.
- `/legacy/` and Witch Dock remain untouched.
- No broad character/settings rebuild is permitted.
- A stale/contaminated pre-enable atlas is still a bad acceptance baseline; the human test must begin after a clean page refresh.

### Recommended action

Commit standalone v0.1.3 with adaptive detached atlas candidates (`8192x4096`, then `8192x8192`), persistent error latch, capped attempt history, state-change timeline, exact pre-enable rollback, and the existing 1024 mask safety. Test from a page refresh and read the standalone telemetry through HF-Chat-Bridge after the single human enable action.

**Runtime behavior changed:** yes, limited to the opt-in experimental standalone feature branch. Existing maintained runtime modules and public Witch Dock are unchanged.

---

## PFC-2026-09-10-016 — Preserve exact pre-enable atlas during protected-texture apply

Date: 2026-09-10

### Target files

- `entries/tampermonkey-standalone/rendering-texture-quality.user.js`
- `docs/feature-specs/rendering-texture-quality.md`
- `ARCHITECTURE.md`
- `TESTING.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Reviewed

- binding `PROJECT_CONTRACT.md` and current texture-quality feature branch state;
- standalone v0.1.1 source and second clean-load Blood Moon failure;
- read-only post-failure runtime snapshot from HF-Chat-Bridge issue #1191;
- live `CK.Atlas` constructor and `getTargetTextureSize()` source;
- successful manual protected-2048 history for Blood Moon and D4;
- current feature spec, architecture boundary, testing record, and changelog.

### Confirmed

- v0.1.1 again failed with `Protected atlas could not allocate 2048px for bodyLower.`
- v0.1.1 restored bodyLower/bodyUpper/face `bakeSize` and `_usedTextureSize` to 1024 after failure.
- v0.1.1 did **not** preserve the pre-enable atlas state: its rollback/native-reference path left both active and resource atlas at 8192x4096.
- Calling HeroForge's original `buildAtlas()` to create a safety baseline is therefore not behavior-neutral on an extreme figure; it can produce a different allocation budget than the atlas HeroForge was actually displaying.
- The correct initial safety reference is the exact current `display.atlas` captured before any feature mutation, with the exact `modded.resourceAtlas` retained for restoration.
- Initial protected allocation can derive unrelated-slot caps from that displayed baseline while allowing only bodyLower/bodyUpper/face up to 2048.
- Failure/disable can restore the exact captured atlas objects instead of generating another native atlas.

### Material conflict risks

- A displayed atlas captured after previous experimental contamination is not a clean native baseline; human retry must begin after page refresh.
- Allocation caps are valid only for the captured part set. The feature must detect part-set changes and reinitialize instead of reusing stale caps.
- Failure rollback must restore original part metadata, mask overrides, `buildAtlas` ownership, active atlas, and resource atlas.
- `/legacy/` and public Witch Dock remain untouched.
- No broad settings/character rebuild is permitted.

### Recommended action

Commit standalone v0.1.2 using the exact pre-enable displayed atlas as the initial allocation baseline and exact atlas-object restoration on failure/disable. Re-run Blood Moon from a clean page refresh. If allocation still fails, use the new baseline/attempted allocation diagnostics rather than adding further speculative state changes.

**Runtime behavior changed:** yes, limited to the opt-in experimental standalone feature branch. Existing maintained runtime modules and public Witch Dock are unchanged.

---

## PFC-2026-09-10-015 — Repair standalone protected-atlas allocation gate

Date: 2026-09-10

### Target files

- `entries/tampermonkey-standalone/rendering-texture-quality.user.js`
- `docs/feature-specs/rendering-texture-quality.md`
- `ARCHITECTURE.md`
- `TESTING.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Reviewed

- binding `PROJECT_CONTRACT.md` and current texture-quality feature branch state;
- standalone v0.1.0 source and clean-load failure message;
- live `CK.Atlas` constructor source and `CK.Atlas.getTargetTextureSize()` source;
- Blood Moon clean runtime part metadata (`bakeSize`, `bakeSizeScalar`, `_idealTextureSize`);
- successful manual protected-2048 bridge history and failed standalone rollback state;
- current feature spec, architecture notes, and test gate.

### Confirmed

- v0.1.0 failed closed before protected activation because bodyLower did not receive 2048px.
- The `CK.Atlas` fourth constructor argument is a per-slot maximum allocation map.
- v0.1.0 omitted that map, allowing unrelated slots to compete for ideal resolution until the global packer stepped all allocations down.
- The corrected design first obtains HeroForge's own native atlas allocation budget, preserves each unrelated slot at no more than its native allocation, and raises only bodyLower/bodyUpper/face caps to 2048.
- The failed v0.1.0 attempt restored body/head bake ceilings to native 1024 values; no half-enabled 2048 state remained.
- Public Witch Dock remains outside this test stage.

### Material conflict risks

- The original HeroForge `buildAtlas()` call used to establish the native baseline must remain narrow and must not invoke broad character/settings reconstruction.
- Native-cap derivation must not accidentally classify target slots as protected regressions.
- Disable/rollback must restore original `buildAtlas` ownership and native runtime metadata.
- `/legacy/` and public Witch Dock remain untouched.

### Recommended action

Commit standalone v0.1.1 with the native-allocation-cap builder and rerun the clean-load Blood Moon enable test. Do not proceed to disable/re-enable/figure-change acceptance until initial activation succeeds visually and mechanically.

**Runtime behavior changed:** yes, limited to the opt-in experimental standalone feature branch. Existing maintained runtime modules and public Witch Dock are unchanged.

---

## PFC-2026-09-10-014 — Create experimental protected texture-quality standalone

Date: 2026-09-10

### Target files

- `entries/tampermonkey-standalone/rendering-texture-quality.user.js`
- `docs/feature-specs/rendering-texture-quality.md`
- `docs/investigations/INV-0004-texture-atlas-quality-2026-09-10.md`
- `MASTER.md`
- `ARCHITECTURE.md`
- `FEATURE_INVENTORY.md`
- `COMPATIBILITY.md`
- `OWNERSHIP.md`
- `MIGRATION_PLAN.md`
- `TESTING.md`
- `PRE_FLIGHT_Check.md`
- `CHANGELOG.md`

### Reviewed

- binding `PROJECT_CONTRACT.md`;
- `README.md`, `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `MIGRATION_PLAN.md`, and `TESTING.md`;
- current standalone Tampermonkey packaging pattern (`photo-booth-true-resolution.user.js`);
- current feature-spec pattern;
- HF-Chat-Bridge runtime findings from D4 and Blood Moon, including mask-path/resource probes, atlas allocation probes, color/decal bake UV probes, and broad-rebuild failure states;
- current live visual acceptance from Amanda.

### Confirmed

- Blood Moon can be degraded natively to 256px bodyLower/bodyUpper and 512px face within a 4096x4096 atlas.
- D4 and Blood Moon both support a protected 8192x4096 atlas with 2048 bodyLower/bodyUpper/face allocations.
- Valid 1024 body masks prevent the nonexistent 2048-mask fallback corruption observed during experiments.
- Narrow color-bake refresh preserves correct final materials on the accepted path; broad `instantSettingsChange()` is rejected.
- Final Blood Moon protected state was visually accepted for body, seams, paints/channels and high-confidence decal quality.
- A 4096-body detached layout is possible but is outside the maintained first target.

### Material conflict risks

- `/legacy/` is immutable and is not touched.
- Public Witch Dock is not touched.
- No bundle patch is introduced.
- No character-specific mask path/object is persisted.
- Feature starts disabled and fails closed if required capabilities/resources/postconditions fail.
- Loaded mask resource cache ownership has no confirmed explicit release API yet; this limitation is documented.

### Recommended action

Create one isolated feature-branch commit containing the experimental standalone v0.1.0 and durable documentation. Human standalone lifecycle acceptance is the next gate; do not integrate Witch Dock yet.

**Runtime behavior changed:** yes, but only by adding a new opt-in standalone experimental userscript on the Compatibility feature branch. Existing maintained runtime files and public Witch Dock behavior are unchanged.

---

Historical pre-flight entries through PFC-2026-09-05-013 remain preserved in Git history at/before `732dae09e83d712a26ac383f7b64ce9e27e07a59`.
