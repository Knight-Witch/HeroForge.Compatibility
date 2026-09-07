from pathlib import Path
import subprocess

BASE = '05e0e2d96d8d7a6dec9093b1c89acc89f67a3048'
PUBLIC_COMMIT = '9fa5c52fdbe2de220457a961be05e633d4b89349'


def run(*args):
    return subprocess.check_output(args, text=True).strip()


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{label}: expected 1 match, found {count}')
    return text.replace(old, new, 1)

if run('git', 'rev-parse', 'HEAD') != BASE:
    raise RuntimeError('unexpected HFC branch head')

# MASTER
p = Path('MASTER.md')
t = p.read_text(encoding='utf-8')
t = replace_once(t,
    '- Current public Witch Dock v1.2.0 commit: `b5e366e3f6c06d661e8bc1d59f8cb190ad7401f6`.',
    f'- Current public Witch Dock v1.2.0 commit: `{PUBLIC_COMMIT}`.\n- Latest module-only Stable update moves the corrected bound decal gizmo controls into Utilities and leaves the Decals tab as an upcoming-tools placeholder; the corrected gizmo runtime itself is unchanged.',
    'MASTER public commit')
t = replace_once(t,
    '2. Confirm visible order `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)` and Utilities tooltip.',
    '2. Confirm visible order `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`, the Decals placeholder `New decal tools coming shortly!`, the Bound Decal Gizmo controls under Utilities, and the Utilities tooltip.',
    'MASTER smoke step')
p.write_text(t, encoding='utf-8')

# PRE_FLIGHT
p = Path('PRE_FLIGHT_Check.md')
t = p.read_text(encoding='utf-8')
entry = f'''## PFC-2026-09-06-030 — Record public Decals/Utilities host relocation\n\nDate: 2026-09-06\n\n### Scope\n\nRecord the completed public Witch Dock module-only promotion that moves the corrected bound decal gizmo controls from Decals to Utilities and leaves a Decals placeholder for upcoming tools.\n\n### Required material reviewed\n\n- `PROJECT_CONTRACT.md`, `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`;\n- current `decals.gizmo.bound-correction` Stable status and ownership boundary;\n- validated Witch Dock Dev host-relocation commit `40fa227f13a79c5283f989c23b82485a273a2c53`;\n- public Witch Dock promotion commit `{PUBLIC_COMMIT}`.\n\n### Confirmed findings\n\n- Dev live validation passed the Decals placeholder, single Utilities gizmo section, persisted checkbox state, toggle OFF/ON, and Move/Rotate/Scale selection;\n- public Stable promotion changed only the Decals/Utilities host modules, their canonical registry versions, and Stable tracking docs;\n- corrected-gizmo service/runtime and all five source fragments were protected by hash checks and remained unchanged;\n- public Witch Dock userscript shell remains v1.2.0 because the change is manifest/module delivered;\n- no HeroForge.Compatibility runtime source changed.\n\n### Decision\n\nRecord the public host relocation. Keep `decals.gizmo.bound-correction` Stable validated; the only remaining current public gate is the existing cheap v1.2.0 smoke with the latest module refresh.\n\n**Runtime behavior changed:** no in HeroForge.Compatibility. Documentation-only checkpoint recording an external consumer UI-host promotion.\n\n---\n\n'''
header = '# Pre-Flight Check Log\n\n'
if not t.startswith(header):
    raise RuntimeError('unexpected PRE_FLIGHT header')
t = header + entry + t[len(header):]
p.write_text(t, encoding='utf-8')

# CHANGELOG
p = Path('CHANGELOG.md')
t = p.read_text(encoding='utf-8')
entry = f'''## HFC-2026-09-06-034 — Record Witch Dock Decals/Utilities host relocation\n\nDate: 2026-09-06\n\n### Summary\n\nRecorded the public Witch Dock module-only promotion that rehomes corrected bound decal gizmo controls under Utilities and leaves a Decals placeholder for upcoming tools.\n\n### External consumer status\n\n- validated Dev host-relocation commit: `40fa227f13a79c5283f989c23b82485a273a2c53`;\n- public Witch Dock Stable commit: `{PUBLIC_COMMIT}`;\n- public `decals-dev`: v1.1.0;\n- public `utilities`: v1.1.0;\n- corrected bound decal gizmo runtime: unchanged v1.1.0 / build `1.1.0-stable-undo-transform-preserve`;\n- public Witch Dock shell: unchanged v1.2.0.\n\nThe public gate protected the corrected-gizmo loader/fragments and media runtimes from modification.\n\n### HFC runtime impact\n\n**No HeroForge.Compatibility runtime behavior changed.** This is a documentation-only external-consumer checkpoint.\n\n---\n\n'''
header = '# Changelog\n\n'
if not t.startswith(header):
    raise RuntimeError('unexpected CHANGELOG header')
t = header + entry + t[len(header):]
p.write_text(t, encoding='utf-8')

# FEATURE_INVENTORY
p = Path('FEATURE_INVENTORY.md')
t = p.read_text(encoding='utf-8')
t = replace_once(t,
    '| `decals.gizmo.bound-correction` | Correct bound/Project-OFF decal transform gizmo | High | Witch Dock Stable; validated Move/Rotate/Scale, undo/redo, transform-state preservation and fresh-slot normalization. |',
    f'| `decals.gizmo.bound-correction` | Correct bound/Project-OFF decal transform gizmo | High | Witch Dock Stable; validated Move/Rotate/Scale, undo/redo, transform-state preservation and fresh-slot normalization. Public controls now live under Utilities as of `{PUBLIC_COMMIT}`; runtime unchanged. |',
    'FEATURE decals row')
t = t.replace('current public v1.2.0 host/UI release: `b5e366e3f6c06d661e8bc1d59f8cb190ad7401f6`;', f'current public v1.2.0 host/UI/module release: `{PUBLIC_COMMIT}`;')
p.write_text(t, encoding='utf-8')

# COMPATIBILITY
p = Path('COMPATIBILITY.md')
t = p.read_text(encoding='utf-8')
t = replace_once(t,
    '| `decals.gizmo.bound-correction` | Witch Dock Stable | 2026-09-05 | Validated separately. |',
    f'| `decals.gizmo.bound-correction` | Witch Dock Stable | 2026-09-06 | Runtime remains validated; public controls moved to Utilities after Dev smoke, Stable commit `{PUBLIC_COMMIT}`. |',
    'COMPAT decals row')
t = t.replace('current public commit `b5e366e3f6c06d661e8bc1d59f8cb190ad7401f6`', f'current public commit `{PUBLIC_COMMIT}`')
t = t.replace('Current public Witch Dock v1.2.0 commit:\n\n`b5e366e3f6c06d661e8bc1d59f8cb190ad7401f6`', f'Current public Witch Dock v1.2.0 commit:\n\n`{PUBLIC_COMMIT}`')
t = replace_once(t,
    'The v1.2.0 release leaves Stable Spinny service/UI source unchanged while adding the separately validated public tab presentation, compact High Res service/UI ownership split, canonical module registry, and About-only Developer Mode v0.3.0. Developer Mode exposes the existing Short Test only while enabled.',
    'The v1.2.0 release leaves Stable Spinny service/UI source unchanged while adding the separately validated public tab presentation, compact High Res service/UI ownership split, canonical module registry, and About-only Developer Mode v0.3.0. The latest module-only Stable update additionally moves corrected bound decal gizmo controls from Decals to Utilities without changing the gizmo runtime. Developer Mode exposes the existing Short Test only while enabled.',
    'COMPAT public paragraph')
p.write_text(t, encoding='utf-8')

# OWNERSHIP
p = Path('OWNERSHIP.md')
t = p.read_text(encoding='utf-8')
t = replace_once(t,
    '| `decals.gizmo.bound-correction` | TBD | Amanda | — | Witch Dock Stable | 2026-09-05 |',
    '| `decals.gizmo.bound-correction` | TBD | Amanda | — | Witch Dock Stable; controls hosted by Utilities, feature runtime unchanged | 2026-09-06 |',
    'OWNERSHIP decals row')
t = t.replace('current public Witch Dock v1.2.0 host/UI release: `b5e366e3f6c06d661e8bc1d59f8cb190ad7401f6`;', f'current public Witch Dock v1.2.0 host/UI/module release: `{PUBLIC_COMMIT}`;')
p.write_text(t, encoding='utf-8')

# TESTING
p = Path('TESTING.md')
t = p.read_text(encoding='utf-8')
t = replace_once(t,
    'Current public Witch Dock v1.2.0 commit:\n\n`b5e366e3f6c06d661e8bc1d59f8cb190ad7401f6`',
    f'Current public Witch Dock v1.2.0 commit:\n\n`{PUBLIC_COMMIT}`',
    'TESTING public commit')
marker = '### Required clean public smoke\n\n'
insert = '''### Decals/Utilities host relocation — DEV PASS / STABLE PROMOTED\n\nDev live validation passed:\n\n- Decals shows `New decal tools coming shortly!`;\n- no gizmo controls remain in Decals;\n- exactly one Bound Decal Gizmo section appears in Utilities;\n- persisted gizmo checkbox state survives the host move;\n- toggle OFF/ON works;\n- Move / Rotate / Scale selection works.\n\nThe Stable promotion gate additionally verified that the corrected-gizmo loader/fragments and protected media runtimes were unchanged.\n\n'''
if t.count(marker) != 1:
    raise RuntimeError('TESTING smoke marker mismatch')
t = t.replace(marker, insert + marker, 1)
t = replace_once(t,
    '2. Reload HeroForge and confirm `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`.',
    '2. Reload HeroForge and confirm `Body -> Pose -> Decals -> Booth -> JSON -> Utilities(cog)`, the Decals placeholder, and Bound Decal Gizmo controls under Utilities.',
    'TESTING smoke step')
p.write_text(t, encoding='utf-8')

expected = {
    'MASTER.md', 'PRE_FLIGHT_Check.md', 'CHANGELOG.md', 'FEATURE_INVENTORY.md',
    'COMPATIBILITY.md', 'OWNERSHIP.md', 'TESTING.md'
}
changed = set(run('git', 'diff', '--name-only').splitlines())
if changed != expected:
    raise RuntimeError(f'unexpected HFC changed files: {sorted(changed)}')
subprocess.check_call(['git', 'diff', '--check'])
print('HFC Decals/Utilities host-promotion documentation gate: PASS')
