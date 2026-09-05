# Photo Booth Screenshot Resolution

**Feature ID:** `media.screenshot-resolution`  
**Title:** True high-resolution Photo Booth still capture  
**Status:** standalone validated; Witch Dock Stable promoted, clean public smoke pending  
**Risk:** Medium  
**Primary maintainer:** TBD (Lob-derived feature; ownership not assigned)  
**Reviewer:** Amanda  
**Last verified HeroForge build:** `heroforge07.1.9.98` / 2026-09-05

## Purpose

Restore genuine 4096px and 8192px Photo Booth still-image detail while preserving HeroForge's native Booth staging/compositor.

## Maintained design

TRUE 4K:

1. native `BT.maker.takeScreenshot(4096,4096)` owns Booth staging/composition;
2. temporarily wrap named `CK.Effects.renderToCanvas`;
3. render one true 4096x4096 Effects source;
4. phase-feed it through the live native tiled topology;
5. restore the named method and release buffers.

TRUE 8K:

1. native `BT.maker.takeScreenshot(8192,8192)` owns final composition;
2. detect the live native phase topology;
3. render four shifted 4096x4096 Effects sources;
4. each supplies one parity group / 16 current native phase classes;
5. all 64 current 8K phases are covered without an 8192 Effects target;
6. release each source/buffer as its phases complete.

One-shot 8192 is rejected for maintained packaged use on the tested machine.

## Witch Dock provider integration

Public/Dev provider ownership is downstream of UI:

- intercept only square 4096 and 8192 `BT.maker.takeScreenshot` requests;
- normal resolutions pass through unchanged;
- current Lob/ADP may continue injecting 4096/8192 choices into HeroForge's own Photo Booth UI;
- those existing choices transparently use the Witch Dock repair;
- Lob itself is not modified;
- Witch Dock direct TRUE 4K/8K buttons provide Lob-free access;
- injecting 4096/8192 into HeroForge's own selector when Lob is absent remains a separate future UI adapter.

WITCH_DEV_PHOTO Lob-present integration passed both 4096 and 8192 perfectly. Public Stable promotion is Witch Dock commit `e155f2c2f961463b4a0e26f7c88f21f603ce1b95`.

## Lifecycle

- default enabled;
- concurrent high-resolution capture blocked;
- reversible provider wrapper around `BT.maker.takeScreenshot`;
- temporary Effects wrapper only during repaired capture;
- disable restores upstream ownership when still intact;
- ownership loss reports degraded state rather than blindly stacking wrappers;
- no bundle patch, screenshot-size setting mutation, or Capture.renderToImage replacement.

## Current gate

Run a clean public refresh smoke with temporary standalone/Dev test scripts disabled. Long-term feature maintainer assignment and future Foundation extraction remain open.
