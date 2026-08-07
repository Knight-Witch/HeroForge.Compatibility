# Tests

Tests in this repository support compatibility checks, fixture validation, standalone acceptance testing, and later integration testing.

## Current automated/static tests

### `compatibility/projected-decals-stage1.test.mjs`

Validates the Stage 1 projected-decal fixture by checking:

- the force-projection anchor occurs exactly once,
- the unequal-scaling anchor occurs exactly once,
- each transformed postcondition occurs exactly once,
- the transformed fixture parses as JavaScript,
- required custom-field references are present.

Run with:

```bash
node tests/compatibility/projected-decals-stage1.test.mjs
```

This fixture test does not replace live HeroForge testing.

## Stage 1 live acceptance tests

The detailed matrices are in `docs/feature-specs/STAGE1_AUG5_COMPATIBILITY.md`.

At minimum, live testing must cover:

- character export/import round trip,
- Photo Booth settings export/import round trip,
- projected toggle on/off,
- unequal scaling,
- native tiling interaction,
- decal layer reordering,
- undo/redo,
- save/reload persistence,
- JSON export/import persistence,
- feature disposal,
- reload-required disable behavior,
- graceful untouched-bundle fallback on a forced patch failure.

## Current status

- All three Stage 1 userscripts pass `node --check`.
- The projected fixture test passes locally.
- No Stage 1 feature has completed live acceptance testing.
- No Witch Dock Dev or Stable integration test has been performed.
