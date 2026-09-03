# INV-0002 — September 2026 Advanced Decal Posing breakage scope

**Status:** Active diagnosis; no runtime repair committed yet  
**Date:** 2026-09-03

## Reported failures

Current live HeroForge behavior reported by Amanda:

1. Local character JSON Save/Load controls are missing. Character-browser `Import from JSON` remains visible but does nothing.
2. Projected-decal toggle is missing. Existing projected decals retain projected behavior through pose changes.
3. Photo Booth 4K/8K capture currently produces vanilla 2048 output; higher-quality spin GIF is also not working.

## Canonical legacy reference

Use `Advanced Decal Posing (Witch's Update) v0.99.20 CLEAN` from Amanda's File Library as the current legacy behavior reference unless a newer installed source is identified. Preserve it unchanged; do not migrate its umbrella-file architecture.

Relevant legacy mechanisms:

- JSON Save/Load is injected into `heroforgeui.js` by exact compiled-source replacement and calls named CK state/load surfaces after injection.
- Character Browser `Import from JSON` wraps/mutates HeroForge native React structure and also relies on compiled action-list changes.
- Projected-decal UI is injected through compiled `heroforgeui.js` structure; renderer semantics are supplied separately by Full Res Decals/Textures.
- High-quality spin GIF is injected through compiled `boothui.js` source replacement.
- Screenshot size is written through `CK.Settings.screenshotSize` plus additional compiled render-path changes.

## Confirmed architectural context

- Existing projected decals continuing to behave as projected is consistent with the renderer half remaining functional while the Advanced Decal Posing UI injection is absent.
- The reported missing/dead controls align with legacy features whose presentation/action wiring depends on brittle compiled UI structure.
- This does not yet prove that underlying named runtime APIs are unchanged.

## Diagnosis plan

Before editing any maintained feature code:

1. Probe named current-runtime paths needed for character local JSON I/O.
2. Probe current decal mutation/state candidates needed for an independent projected toggle.
3. Probe current screenshot/render settings and Photo Booth state/functions.
4. Prefer standalone feature reconstruction against named runtime capabilities over repairing native React/minified UI injection.
5. Use current bundle transformation only where runtime access cannot reproduce required behavior.

## No runtime impact

Documentation-only investigation record. No HeroForge runtime behavior, Witch Dock code, or legacy source is changed by this file.
