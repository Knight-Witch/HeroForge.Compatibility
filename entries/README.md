# Entrypoints

Planned runtime entrypoints:

- `tampermonkey-standalone/` — isolated development and parity-test builds.
- `witch-dock-dev/` — adapters/hosts used only after standalone validation.

Entrypoints should reuse the same underlying feature modules where practical rather than maintaining separate feature implementations.