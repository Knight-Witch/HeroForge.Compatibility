# INV-0003 — Photo Booth High-Resolution Still Capture

**Date:** 2026-09-05  
**Feature:** `media.screenshot-resolution`  
**HeroForge build:** `heroforge07.1.9.98`  
**Status:** diagnosis complete; standalone validated; Witch Dock Stable validated

## Diagnosis

Current native/Lob nominal 4096 and 8192 visible model detail is produced through a private tiled path using named `CK.Effects.renderToCanvas`, normally capped to 1024 phases in the tested scene. Thus normal 4096 uses 4x4/16 phases and normal 8192 uses 8x8/64 phases.

`CK.Effects.renderToCanvas` itself can produce genuine staged 4096 output.

## Accepted repair

- TRUE 4K: one 4096 Effects source phase-fed through the untouched native compositor.
- TRUE 8K: four shifted 4096 Effects sources covering the four parity groups/all 64 native 8K phase classes.
- no 8192 Effects target;
- no private helper-name dependency;
- no HeroForge bundle patch;
- no `CK.Settings.screenshotSize` mutation;
- no `CK.Capture.renderToImage` replacement.

## Rejected 8K paths

- one-shot 8192 Effects source for maintained packaged use: correct when it survives but repeatedly triggered white renderer-reset/blank output;
- sandbox/page-context change: not root cause;
- generalized packaging overhead: not root cause;
- PNG `toBlob()`/export stage: not root cause.

## Integration outcome

WITCH_DEV_PHOTO wrapped only 4096/8192 `BT.maker.takeScreenshot` requests while leaving current Lob/ADP UI injection intact.

Amanda confirmed in Dev:

- existing HeroForge UI 4096 -> repaired provider: perfect;
- existing HeroForge UI 8192 -> grouped repaired provider: perfect;
- direct Witch Dock capture worked; initial buttons required provider-toggle cycling.

The button caveat was traced to stale UI readiness after provider installation before Photo Booth enabled. Public Witch Dock promotion at `e155f2c2f961463b4a0e26f7c88f21f603ce1b95` preserved the exact Dev-tested provider and added a separate narrow readiness adapter.

Clean public Stable validation then confirmed:

- readiness adapter works without toggle cycling;
- public HeroForge/Lob 4096 route: perfect;
- public HeroForge/Lob 8192 grouped route: perfect;
- public Witch Dock direct TRUE 4K: perfect;
- public Witch Dock direct TRUE 8K: perfect.

## Remaining work

The still-capture repair itself is closed/validated. Remaining adjacent work is separate:

- Lob-absent injection into HeroForge's native resolution selector;
- future build/effect-profile regression when triggered;
- long-term maintainer assignment;
- future Foundation extraction.
