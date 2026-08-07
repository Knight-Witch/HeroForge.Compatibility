# Entrypoints

Entrypoints assemble maintained feature code for a particular host or test environment.

## Current standalone Tampermonkey entrypoints

| File | Purpose | Status |
|---|---|---|
| `tampermonkey-standalone/hf-character-json-file-io.user.js` | Complete character JSON file export/import through named runtime APIs | Standalone test v0.1.0; live validation pending |
| `tampermonkey-standalone/hf-photo-booth-settings-file-io.user.js` | Photo Booth settings file export/import through the current Booth runtime | Standalone test v0.1.0; live validation pending |
| `tampermonkey-standalone/hf-projected-decal-transform.user.js` | Experimental paired Project and Unequal Scaling UI/renderer compatibility | Critical experimental v0.1.0; live validation pending |

## Rules

- Standalone entrypoints are development/test hosts, not Witch Dock production code.
- Keep unrelated features in separate entrypoints during initial validation.
- Do not add another maintained core-bundle rewriter before shared patch infrastructure exists.
- Projected decal testing must disable other scripts that rewrite `creationkit.js`.
- Witch Dock Dev entrypoints must not be added merely because a standalone script loads successfully.
