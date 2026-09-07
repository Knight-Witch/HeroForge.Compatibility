from pathlib import Path

PUBLIC_COMMIT = 'b5e366e3f6c06d661e8bc1d59f8cb190ad7401f6'
DEV_COMMIT = '85f386cf9b7b8a361d2162a0cec8081784a15e66'


def replace_required(path, old, new):
    p = Path(path)
    text = p.read_text()
    if old not in text:
        raise RuntimeError(f'Missing expected text in {path}: {old[:100]!r}')
    p.write_text(text.replace(old, new, 1))


def prepend_after_title(path, title, block):
    p = Path(path)
    text = p.read_text()
    marker = title + '\n\n'
    if not text.startswith(marker):
        raise RuntimeError(f'Unexpected {path} header')
    if block.strip() in text:
        return
    p.write_text(marker + block.rstrip() + '\n\n---\n\n' + text[len(marker):])


# MASTER
replace_required(
    'MASTER.md',
    '**`media.spinny-mini-webp` is standalone validated, Witch Dock Dev validated, and now promoted to public Witch Dock Stable v1.1.0. One clean public Stable smoke remains before the Stable validation gate is closed.**',
    '**`media.spinny-mini-webp` remains standalone/Dev validated and is now carried by public Witch Dock v1.2.0. The v1.2.0 host/UI release is promoted; one clean public v1.2.0 smoke remains before the current Stable gate is closed.**'
)
replace_required(
    'MASTER.md',
    '- Public Witch Dock v1.1.0 promotion commit: `8d96dd803f452c3c7b623c6963b4fdb3ef762f59`.\n- Public Stable status: **promoted; clean public smoke pending**.\n- 4K animated WebP remains deferred.',
    f'- Original public Spinny v1.1.0 promotion commit: `8d96dd803f452c3c7b623c6963b4fdb3ef762f59`.\n- Current public Witch Dock v1.2.0 commit: `{PUBLIC_COMMIT}`.\n- Public v1.2.0 adds validated tab cleanup, compact High Res service/UI ownership, and About-only Developer Mode; public Spinny service/UI source is unchanged from v1.1.0.\n- Public Stable status: **v1.2.0 promoted; clean public smoke pending**.\n- 4096 animated-WebP expansion is **not an active roadmap item** and requires no further work unless explicitly reopened.'
)
replace_required(
    'MASTER.md',
    'Public Witch Dock `Witch_Scripts` now contains the accepted Spinny delta as v1.1.0.',
    'Public Witch Dock `Witch_Scripts` now carries the accepted Spinny delta inside v1.2.0.'
)
replace_required(
    'MASTER.md',
    'Promotion commit:\n\n`8d96dd803f452c3c7b623c6963b4fdb3ef762f59`',
    f'Original Spinny promotion commit:\n\n`8d96dd803f452c3c7b623c6963b4fdb3ef762f59`\n\nCurrent public host/UI release commit:\n\n`{PUBLIC_COMMIT}`'
)
replace_required(
    'MASTER.md',
    'It did **not** merge the diverged `WITCH_DEV_UI` branch wholesale. Developer Mode, compact High Res UI, Dev module registry, Dev loader, and unrelated UI/order work remain separate.\n\nShort Test remains part of the Spinny service but is hidden in ordinary public Stable because Developer Mode was not promoted.',
    'Neither Stable promotion merged the diverged `WITCH_DEV_UI` branch wholesale. Public v1.2.0 narrowly adds the separately validated tab presentation, compact High Res service/UI split, canonical module registry, and Developer Mode v0.3.0. The Dev loader remains excluded.\n\nDeveloper Mode is public, optional/default-OFF, and toggled only from About. When enabled it reveals the existing Spinny Short Test and module/build diagnostics; normal mode still hides Short Test.'
)
start = '## Next Gate\n\nPerform one clean public Witch Dock v1.1.0 smoke with Dev/temporary Spinny scripts disabled.'
end = 'If that smoke passes, close the Stable gate with documentation-only checkpoints in both repositories. Do not repeat expensive 3072 production validation absent a regression.'
new_gate = '''## Next Gate

Perform one clean public Witch Dock v1.2.0 smoke with the Dev loader and temporary standalone Spinny scripts disabled.

Recommended minimum:

1. Update/install public Witch Dock v1.2.0 and reload HeroForge.
2. Confirm visible order `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)` and Utilities tooltip.
3. Confirm compact `High Res Image Capture` appears once above Spinny.
4. In About, enable Developer Mode and confirm Stable module versions are shown, including core v1.2.0, Developer Mode v0.3.0, High Res service v0.8.0/UI v0.3.0, and Spinny v0.5.1/UI v0.1.1.
5. Use the now-public Developer Mode `Short Test` at 1024px Standard to confirm Spinny/download/guard sanity without repeating a 250-frame production run.
6. Turn Developer Mode OFF and confirm Short Test/diagnostics disappear while ordinary tools remain functional.

If this smoke passes, close the current public Stable gate with documentation-only checkpoints. Do not repeat expensive TRUE-3K production validation absent a regression.'''
p = Path('MASTER.md')
text = p.read_text()
si = text.index(start)
ei = text.index(end, si) + len(end)
text = text[:si] + new_gate + text[ei:]
text = text.replace(
    '## 4K Spinny\n\n4096 animated WebP remains deferred because public `media.screenshot-resolution` owns square 4096/8192 still requests. A future 4K animation path requires a separately validated explicit frame-capture capability that does not displace that provider.',
    '## 4096 Spinny boundary\n\nThe technical ownership constraint remains: public `media.screenshot-resolution` owns square 4096/8192 still requests, so 4096 Spinny must not be added through that surface. **No 4096 animated-WebP expansion is currently planned.** Revisit only if the user explicitly reopens it and a clean frame-capture seam exists.'
)
Path('MASTER.md').write_text(text)

# FEATURE INVENTORY
replace_required(
    'FEATURE_INVENTORY.md',
    '| `media.spinny-mini-webp` | Higher-resolution / configurable-speed animated Spinny Mini WebP export | High | Standalone v0.5.0 validated; Witch Dock Dev v0.5.1/v0.1.1 validated; public Witch Dock v1.1.0 promoted at `8d96dd803f452c3c7b623c6963b4fdb3ef762f59`; clean public smoke pending. 4K animated WebP deferred. |',
    f'| `media.spinny-mini-webp` | Higher-resolution / configurable-speed animated Spinny Mini WebP export | High | Standalone v0.5.0 validated; Witch Dock Dev v0.5.1/v0.1.1 validated; public Witch Dock v1.2.0 at `{PUBLIC_COMMIT}` carries the unchanged Stable Spinny service/UI plus public Developer Mode; clean v1.2.0 smoke pending. 4096 expansion is not an active roadmap item. |'
)
replace_required(
    'FEATURE_INVENTORY.md',
    '- v1.1.0 promoted at commit `8d96dd803f452c3c7b623c6963b4fdb3ef762f59`;\n- Spinny service/UI vendored as self-contained public modules;\n- public userscript exposes the tested `GM_download` host;\n- Developer Mode and unrelated Dev modules were not promoted;\n- Short Test remains service-owned but hidden in ordinary Stable UI;\n- public clean smoke remains pending.\n\n4K Spinny remains deferred because square 4096/8192 screenshot requests belong to public `media.screenshot-resolution` still-capture ownership.',
    f'- original Spinny v1.1.0 promotion: `8d96dd803f452c3c7b623c6963b4fdb3ef762f59`;\n- current public v1.2.0 host/UI release: `{PUBLIC_COMMIT}`;\n- Stable Spinny service/UI source remains unchanged from v1.1.0;\n- public userscript retains the tested `GM_download` host;\n- public Developer Mode v0.3.0 is optional/default-OFF and reveals the existing Short Test only when enabled;\n- compact High Res and tab cleanup were separately validated before v1.2.0 promotion;\n- clean public v1.2.0 smoke remains pending.\n\n4096 Spinny remains technically incompatible with the current square 4096/8192 still-provider ownership surface, but **4096 animated-WebP expansion is not an active roadmap item**.'
)

# COMPATIBILITY
replace_required(
    'COMPATIBILITY.md',
    '| `media.spinny-mini-webp` | Standalone v0.5.0 validated; Witch Dock Dev integration validated; Witch Dock Stable v1.1.0 promoted, public smoke pending | `heroforge07.1.9.98` / 2026-09-06 | Native 3072 rejected; repaired TRUE-3K validated. Public promotion commit `8d96dd803f452c3c7b623c6963b4fdb3ef762f59`. |',
    f'| `media.spinny-mini-webp` | Standalone v0.5.0 validated; Witch Dock Dev integration validated; public Witch Dock v1.2.0 promoted, clean v1.2.0 smoke pending | `heroforge07.1.9.98` / 2026-09-06 | Native 3072 rejected; repaired TRUE-3K validated. Spinny runtime source unchanged by v1.2.0; current public commit `{PUBLIC_COMMIT}`. |'
)
replace_required(
    'COMPATIBILITY.md',
    'Public Witch Dock v1.1.0 promotion commit:\n\n`8d96dd803f452c3c7b623c6963b4fdb3ef762f59`\n\nPublic Stable has been promoted but has not yet received a clean production smoke with Dev/temporary scripts disabled. Until that smoke passes, compatibility status is **Stable promoted / public smoke pending**, not fully Stable validated.\n\nThe public release does not depend on HeroForge.Compatibility unstable head or HF-Chat-Bridge.',
    f'Original public Spinny v1.1.0 promotion commit:\n\n`8d96dd803f452c3c7b623c6963b4fdb3ef762f59`\n\nCurrent public Witch Dock v1.2.0 commit:\n\n`{PUBLIC_COMMIT}`\n\nThe v1.2.0 release leaves Stable Spinny service/UI source unchanged while adding the separately validated public tab presentation, compact High Res service/UI ownership split, canonical module registry, and About-only Developer Mode v0.3.0. Developer Mode exposes the existing Short Test only while enabled.\n\nPublic v1.2.0 has not yet received a clean production smoke with the Dev loader/temporary scripts disabled. Until that smoke passes, compatibility status is **Stable promoted / public smoke pending**, not fully Stable validated.\n\nThe public release does not depend on HeroForge.Compatibility unstable head or HF-Chat-Bridge.'
)
replace_required(
    'COMPATIBILITY.md',
    '## 4K Spinny incompatibility note\n\nDo not add 4096 Spinny through the current public `BT.maker.takeScreenshot` surface while Witch Dock TRUE-resolution still repair is enabled. The provider owns square 4096/8192 requests. 4K Spinny remains deferred until a separately designed explicit frame-capture capability/bypass is validated.',
    '## 4096 Spinny incompatibility note\n\nDo not add 4096 Spinny through the current public `BT.maker.takeScreenshot` surface while Witch Dock TRUE-resolution still repair is enabled; the provider owns square 4096/8192 requests. This remains a compatibility boundary only. **4096 animated-WebP expansion is not an active roadmap item** unless explicitly reopened later.'
)

# OWNERSHIP
replace_required(
    'OWNERSHIP.md',
    '| `media.spinny-mini-webp` | **TBD — reconstructed from Lob behavior/current HeroForge media capabilities; maintenance agreement not assigned** | Amanda | — | Standalone v0.5.0 validated; Witch Dock Dev validated; Witch Dock Stable v1.1.0 promoted, public smoke pending | `heroforge07.1.9.98` |',
    '| `media.spinny-mini-webp` | **TBD — reconstructed from Lob behavior/current HeroForge media capabilities; maintenance agreement not assigned** | Amanda | — | Standalone v0.5.0 validated; Witch Dock Dev validated; public Witch Dock v1.2.0 promoted with unchanged Stable Spinny source; clean public smoke pending | `heroforge07.1.9.98` |'
)
replace_required(
    'OWNERSHIP.md',
    '- Developer Mode, where present in Dev, controls Short Test visibility only and does not own media behavior;',
    '- Developer Mode, now present in public Witch Dock v1.2.0 as an optional About toggle, controls Short Test visibility/diagnostics only and does not own media behavior;'
)
replace_required(
    'OWNERSHIP.md',
    '- public Witch Dock v1.1.0 is a consumer copy of the validated feature, not a transfer of ownership away from this compatibility project;',
    '- public Witch Dock v1.2.0 remains a consumer copy/host of the validated feature; its UI/diagnostic promotion does not transfer long-term feature ownership away from this compatibility project;'
)
replace_required(
    'OWNERSHIP.md',
    '- public Witch Dock Stable consumer: promoted at `8d96dd803f452c3c7b623c6963b4fdb3ef762f59`;\n- clean public smoke: pending;',
    f'- original public Spinny promotion: `8d96dd803f452c3c7b623c6963b4fdb3ef762f59`;\n- current public Witch Dock v1.2.0 host/UI release: `{PUBLIC_COMMIT}`;\n- clean public v1.2.0 smoke: pending;'
)

# TESTING
replace_required(
    'TESTING.md',
    '## Witch Dock Stable promotion gate — PROMOTED / PUBLIC SMOKE PENDING\n\nPublic Witch Dock v1.1.0 promotion commit:',
    '## Witch Dock Stable promotion gate — v1.2.0 PROMOTED / PUBLIC SMOKE PENDING\n\nOriginal public Spinny v1.1.0 promotion commit:'
)
replace_required(
    'TESTING.md',
    '`8d96dd803f452c3c7b623c6963b4fdb3ef762f59`\n\nStatic promotion gate passed before `Witch_Scripts` advanced. Coverage included:',
    f'`8d96dd803f452c3c7b623c6963b4fdb3ef762f59`\n\nCurrent public Witch Dock v1.2.0 commit:\n\n`{PUBLIC_COMMIT}`\n\nThe v1.2.0 Stable gate additionally protected public Spinny service/UI hashes unchanged while promoting the live-tested tab cleanup, High Res service/UI ownership split and Developer Mode v0.3.0. Static promotion coverage included:'
)
old_smoke = '''### Required clean public smoke

Do not repeat expensive TRUE-3K production runs absent a regression. Minimum public Stable smoke:

1. Update/install public Witch Dock v1.1.0 and approve `GM_download` permission if prompted.
2. Disable the Dev loader and temporary/standalone Spinny scripts.
3. Reload HeroForge.
4. Open Photo Booth and confirm public Spinny renders under the existing High Resolution Capture section.
5. Run 1024px Standard / 250 frames, the cheapest public full profile because Short Test is hidden in Stable.
6. Confirm WebP download succeeds.
7. During capture, confirm wheel over the HeroForge canvas has no effect and shows no modal.
8. Confirm one non-wheel guarded camera/Booth action still shows Keep Capture / Cancel Capture.

If this passes, mark public Stable validated with documentation-only checkpoints in Witch Dock and HeroForge.Compatibility.'''
new_smoke = '''### Required clean public smoke

Do not repeat expensive TRUE-3K production runs absent a regression. Minimum public v1.2.0 smoke:

1. Update/install public Witch Dock v1.2.0; disable the Dev loader and temporary/standalone Spinny scripts.
2. Reload HeroForge and confirm `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`.
3. Confirm the compact High Res section appears once and Spinny remains below it.
4. Enable Developer Mode from About and confirm public Stable module versions/builds are reported.
5. Run 1024px Standard **Short Test** (now available only while Developer Mode is enabled) and confirm WebP download succeeds.
6. During Short Test, confirm wheel over the HeroForge canvas is silently blocked and one non-wheel continuity-invalidating action still produces the guard warning.
7. Turn Developer Mode OFF and confirm Short Test/tool diagnostics/High Res developer controls disappear cleanly.

If this passes, mark the current public Stable gate validated with documentation-only checkpoints in Witch Dock and HeroForge.Compatibility.'''
replace_required('TESTING.md', old_smoke, new_smoke)
replace_required(
    'TESTING.md',
    'Witch Dock service retains `captureShortTest()`, but normal public UI hides it. Dev Developer Mode may reveal it through the Spinny host; Developer Mode does not duplicate media capture logic.\n\n## 4K Spinny\n\nDeferred. Current Witch Dock TRUE-resolution still provider owns square 4096/8192 screenshot requests.',
    'Witch Dock service retains `captureShortTest()`. Normal public UI hides it; public Developer Mode v0.3.0 reveals it while enabled. Developer Mode does not duplicate or own media capture logic.\n\n## 4096 Spinny\n\nCurrent Witch Dock TRUE-resolution still provider owns square 4096/8192 screenshot requests. **No 4096 animated-WebP work is currently planned**; retain this as a compatibility constraint only.'
)

# FEATURE SPEC
replace_required(
    'docs/feature-specs/spinny-mini-webp.md',
    'Current disposition: **standalone validated; Witch Dock Dev validated; public Witch Dock Stable v1.1.0 promoted; clean public smoke pending.**\n\nPublic promotion commit: `8d96dd803f452c3c7b623c6963b4fdb3ef762f59`.',
    f'Current disposition: **standalone validated; Witch Dock Dev validated; public Witch Dock v1.2.0 promoted; clean public v1.2.0 smoke pending.**\n\nOriginal Spinny promotion commit: `8d96dd803f452c3c7b623c6963b4fdb3ef762f59`.\n\nCurrent public host/UI release commit: `{PUBLIC_COMMIT}`. Spinny service/UI runtime source is unchanged by v1.2.0.'
)
replace_required(
    'docs/feature-specs/spinny-mini-webp.md',
    '4096 animated WebP remains deferred until a separately validated explicit animation-frame path can coexist with still-provider ownership.',
    'The 4096 ownership collision remains a compatibility constraint, but **4096 animated-WebP expansion is not an active roadmap item** unless explicitly reopened.'
)
replace_required(
    'docs/feature-specs/spinny-mini-webp.md',
    '- Witch Dock Dev Developer Mode ON: visible through Spinny host;\n- Developer Mode OFF: hidden;\n- Developer Mode controls presentation only; it does not own capture logic.\n\nPublic Stable v1.1.0 does not promote Developer Mode, so Short Test is hidden there.',
    '- Witch Dock Developer Mode ON: visible through Spinny host in Dev and public Stable v1.2.0;\n- Developer Mode OFF: hidden;\n- Developer Mode controls presentation/diagnostics only; it does not own capture logic.\n\nPublic Stable v1.2.0 includes Developer Mode v0.3.0 as an optional/default-OFF About toggle, so Short Test is available for troubleshooting without exposing it in normal mode.'
)
replace_required(
    'docs/feature-specs/spinny-mini-webp.md',
    '## Public Stable promotion\n\nPublic Witch Dock v1.1.0 was promoted at:\n\n`8d96dd803f452c3c7b623c6963b4fdb3ef762f59`\n\nThe promotion includes only the accepted Spinny service/UI, public manifest entries, userscript download host and tracking docs. It excludes Developer Mode, compact High Res UI, Dev module registry, Dev loader and unrelated Dev branch changes.\n\nStatus is **Stable promoted / clean public smoke pending**. Do not label fully Stable validated until that clean smoke runs with Dev/temporary Spinny scripts disabled.',
    f'''## Public Stable promotion

Original Spinny promotion (Witch Dock v1.1.0):

`8d96dd803f452c3c7b623c6963b4fdb3ef762f59`

Current public Witch Dock v1.2.0 host/UI release:

`{PUBLIC_COMMIT}`

The v1.2.0 promotion keeps Stable Spinny service/UI source unchanged and narrowly adds the separately validated tab presentation, compact High Res service/UI ownership split, canonical module registry and Developer Mode v0.3.0. The Dev loader remains excluded.

Status is **Stable promoted / clean public v1.2.0 smoke pending**. Do not label the current public gate fully validated until that smoke runs with Dev/temporary scripts disabled.'''
)
old_spec_smoke = '''## Clean public smoke gate

Minimum required test:

1. Public Witch Dock v1.1.0 active; Dev/temporary Spinny scripts disabled.
2. Photo Booth opens and Spinny UI renders normally.
3. 1024px Standard / 250 frames completes.
4. WebP download succeeds through the public host.
5. Wheel over HeroForge canvas during capture is silently ignored.
6. One non-wheel continuity-invalidating action still produces the guard warning.

If this passes, close the public Stable gate with documentation-only checkpoints. A new expensive 3072 production run is not required absent regression evidence.'''
new_spec_smoke = '''## Clean public smoke gate

Minimum required test:

1. Public Witch Dock v1.2.0 active; Dev/temporary Spinny scripts disabled.
2. Confirm the promoted tab presentation and compact High Res section.
3. Enable Developer Mode from About and confirm public module versions/builds.
4. Run 1024px Standard Short Test and confirm WebP download succeeds through the public host.
5. Confirm wheel over HeroForge canvas is silently ignored and one non-wheel continuity-invalidating action still produces the guard warning.
6. Disable Developer Mode and confirm diagnostic/Short Test UI cleans up normally.

If this passes, close the current public Stable gate with documentation-only checkpoints. A new expensive 3072 production run is not required absent regression evidence.'''
replace_required('docs/feature-specs/spinny-mini-webp.md', old_spec_smoke, new_spec_smoke)

# PRE-FLIGHT and CHANGELOG
prepend_after_title(
    'PRE_FLIGHT_Check.md', '# Pre-Flight Check Log',
    f'''## PFC-2026-09-06-029 — Record public Witch Dock v1.2.0 UI/diagnostics promotion

Date: 2026-09-06

### Scope

Record the completed narrow public Witch Dock v1.2.0 promotion after live Dev validation of tab cleanup, compact High Res service/UI ownership, and Developer Mode public-readiness. Spinny runtime source is intentionally unchanged from public v1.1.0.

### Required material reviewed

- `PROJECT_CONTRACT.md`, `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`;
- `docs/feature-specs/spinny-mini-webp.md`;
- public Witch Dock v1.1.0 baseline and v1.2.0 promotion candidate;
- validated `WITCH_DEV_UI` tab presentation, High Res v0.8.0/v0.3.0 split and Developer Mode v0.3.0;
- final public branch `Witch_Scripts` at `{PUBLIC_COMMIT}`.

### Confirmed findings

- public Witch Dock advanced by fast-forward from v1.1.0 commit `8d96dd803f452c3c7b623c6963b4fdb3ef762f59` to v1.2.0 commit `{PUBLIC_COMMIT}`;
- promotion remained one narrow commit and did not merge `WITCH_DEV_UI` wholesale;
- protected public Spinny service/UI, Booth, readiness adapter and corrected decal-gizmo hashes remained unchanged during the release gate;
- public v1.2.0 adds validated tab order/cog presentation, High Res service-only/UI-only ownership and About-only Developer Mode v0.3.0;
- Developer Mode reads the active public manifest registry and reveals the existing Spinny Short Test only while enabled;
- all release syntax/manifest/ownership/hash/static gates passed before `Witch_Scripts` advanced;
- user explicitly removed 4096 animated-WebP expansion and Developer Mode hotkey from the active roadmap;
- one clean public v1.2.0 smoke remains before closing the current Stable validation gate.

### Decision

Record the external consumer promotion as complete. Next gate is a cheap public v1.2.0 smoke using Developer Mode + 1024 Short Test; do not repeat expensive full/TRUE-3K production validation absent a regression.

**Runtime behavior changed:** no in HeroForge.Compatibility. Documentation-only checkpoint recording an already-completed external consumer promotion.'''
)

prepend_after_title(
    'CHANGELOG.md', '# Changelog',
    f'''## HFC-2026-09-06-033 — Record Witch Dock v1.2.0 UI/Developer Mode promotion

Date: 2026-09-06

### Summary

Recorded public Witch Dock v1.2.0 after the separately validated tab, High Res ownership and Developer Mode deltas were narrowly promoted to Stable.

### External consumer status

- validated Developer Mode Dev candidate: v0.3.0 / build `0.3.0-public-ready-manifest-source`, Dev head `{DEV_COMMIT}`;
- public Witch Dock v1.2.0 commit: `{PUBLIC_COMMIT}`;
- public High Res service/UI: v0.8.0 / v0.3.0;
- public Developer Mode: v0.3.0, optional/default-OFF and About-only;
- public canonical module registry now follows the active Stable manifest;
- public Spinny service/UI source remains unchanged from v1.1.0;
- protected Spinny/Booth/readiness/decal-gizmo hashes and release static gates passed;
- public v1.2.0 clean smoke remains pending.

4096 animated-WebP expansion and a Developer Mode hotkey are no longer active roadmap items and require no further work unless explicitly reopened.

### HFC runtime impact

**No HeroForge.Compatibility runtime behavior changed.** Maintained standalone Spinny remains v0.5.0 / build `0.5.0-integrated-pause-interaction-guards`. This commit updates durable project state only.'''
)

# Normalize docs to repository whitespace policy.
for rel in [
    'MASTER.md', 'PRE_FLIGHT_Check.md', 'CHANGELOG.md', 'FEATURE_INVENTORY.md',
    'COMPATIBILITY.md', 'OWNERSHIP.md', 'TESTING.md', 'docs/feature-specs/spinny-mini-webp.md'
]:
    p = Path(rel)
    lines = [line.rstrip() for line in p.read_text().splitlines()]
    p.write_text('\n'.join(lines).rstrip() + '\n')
