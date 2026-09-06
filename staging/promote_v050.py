from pathlib import Path
import hashlib, sys

target=Path(sys.argv[1])
stage=Path(sys.argv[2])
source=stage/'entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js'
expected='4d450bd18c427e31ea8a38825ed9c8223045a4834a526ec041ca04256d654ce3'
data=source.read_bytes()
actual=hashlib.sha256(data).hexdigest()
if actual != expected: raise SystemExit('source checksum mismatch: '+actual)
(target/'entries/tampermonkey-standalone/spinny-mini-webp-profiles.user.js').write_bytes(data)

def prepend(path, text):
    p=target/path
    p.write_text(text.rstrip()+'\n\n---\n\n'+p.read_text())

def append(path, text):
    p=target/path
    p.write_text(p.read_text().rstrip()+'\n\n'+text.rstrip()+'\n')

prepend(Path('CHANGELOG.md'), '''# Changelog

## HFC-2026-09-06-031 — Promote validated Spinny v0.5.0

Date: 2026-09-06

Promoted the exact live-tested consolidated Spinny source as maintained v0.5.0 / build `0.5.0-integrated-pause-interaction-guards`.

Live validation passed for 1024 and TRUE-3K 3072 capture, safe frame-boundary Pause/Resume, cancel while paused, paused-time ETA accounting, camera wheel/drag protection, Booth-control protection, Keep Capture, guard-triggered cancel, and protection while paused.

Exact promoted source SHA-256: `4d450bd18c427e31ea8a38825ed9c8223045a4834a526ec041ca04256d654ce3`.

Disposition advances to Witch Dock Dev candidate. Public Stable remains a separate gate.

**Runtime behavior changed:** yes — maintained standalone runtime advances to v0.5.0.''')
prepend(Path('PRE_FLIGHT_Check.md'), '''# Pre-Flight Check Log

## PFC-2026-09-06-027 — Promote validated Spinny v0.5.0

Date: 2026-09-06

Reviewed `PROJECT_CONTRACT.md`, `MASTER.md`, `PRE_FLIGHT_Check.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `FEATURE_INVENTORY.md`, `COMPATIBILITY.md`, `OWNERSHIP.md`, `TESTING.md`, Spinny feature/investigation/validation records, maintained source, and the exact live-tested v0.5.0 candidate.

Risks checked: TRUE-3K parity, screenshot-provider ownership, safe pause boundary, cancel while paused, ETA accounting, interaction guard false positives/negatives, restoration, and continued 4096/8192 animation deferral.

Decision: promote exact checksum-verified v0.5.0 source and advance to Witch Dock Dev.''')
append(Path('MASTER.md'), '''## Spinny v0.5.0 validated standalone checkpoint

`media.spinny-mini-webp` maintained runtime is now v0.5.0 / `0.5.0-integrated-pause-interaction-guards`. Pause/Resume and capture-invalidating interaction guards passed live testing. Disposition: Witch Dock Dev candidate; public Stable remains untouched until integrated Dev smoke and approval.''')
append(Path('FEATURE_INVENTORY.md'), '''## Spinny v0.5.0 status

`media.spinny-mini-webp`: standalone v0.5.0 validated on `heroforge07.1.9.98`; TRUE-3K 3072, Pause/Resume, cancel-while-paused, and interaction guards passed. Witch Dock Dev integration is the next promotion gate.''')
append(Path('COMPATIBILITY.md'), '''## Spinny v0.5.0 compatibility checkpoint

Validated on `heroforge07.1.9.98`: maintained v0.5.0 preserves tested 1024/2048/TRUE-3K behavior and adds live-validated frame-boundary Pause/Resume plus interaction guards. Native unrepaired 3072 remains rejected; 4096 animated WebP remains deferred.''')
append(Path('OWNERSHIP.md'), '''## Spinny v0.5.0 maintenance note

Pause/Resume and interaction guards are now part of maintained `media.spinny-mini-webp`, not separate companion utilities. Long-term primary maintainer assignment remains unchanged/TBD.''')
append(Path('TESTING.md'), '''## Spinny v0.5.0 integrated standalone gate — PASS

Live user validation passed for 1024 Short Test pause/resume, TRUE-3K 3072 Short Test, cancel while paused, camera wheel/drag guard, Booth-control guard, Keep Capture, guard-triggered cancel requiring repeat action, and guard behavior while paused. Exact promoted source SHA-256: `4d450bd18c427e31ea8a38825ed9c8223045a4834a526ec041ca04256d654ce3`.''')
append(Path('docs/feature-specs/spinny-mini-webp.md'), '''## Maintained v0.5.0 lifecycle / guard status

Version `0.5.0`, build `0.5.0-integrated-pause-interaction-guards`, is the maintained standalone implementation. Pause occurs only after a completed encoded frame; paused wall-clock time is separated from active ETA; cancel while paused restores state; capture-invalidating HeroForge interaction is blocked before mutation with Keep Capture / Cancel Capture choices. Consolidated guard integration passed live.''')
val=target/'docs/validation/spinny-mini-webp-v0.5.0-pause-guards-2026-09-06.md'
val.write_text('''# Spinny Mini WebP v0.5.0 — Pause + Interaction Guard Validation\n\nDate: 2026-09-06\nHeroForge: `heroforge07.1.9.98`\nBuild: `0.5.0-integrated-pause-interaction-guards`\n\n## Result\n\nPASS.\n\nLive validation confirmed the consolidated script preserved capture behavior and passed frame-boundary Pause/Resume, cancel while paused, ETA pause accounting, camera wheel/drag protection, Booth-control protection, Keep Capture, guard-triggered cancellation, protection while paused, and TRUE-3K 3072 output.\n\nExact promoted source SHA-256: `4d450bd18c427e31ea8a38825ed9c8223045a4834a526ec041ca04256d654ce3`.\n\nNext gate: Witch Dock Dev integration; public Stable remains separate.\n''')
print('prepared HFC v0.5 promotion')
