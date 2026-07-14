# Testing

This project uses standalone-first testing before Witch Dock integration.

## Test Order

1. Audit legacy behavior.
2. Define feature boundaries.
3. Write or update the feature specification.
4. Reconstruct an isolated Tampermonkey test module.
5. Verify behavior parity against the canonical reference.
6. Extract repeated HeroForge access into the shared bridge.
7. Test enable/disable/unload behavior.
8. Test interactions with other reconstructed modules.
9. Add compatibility/fixture tests where applicable.
10. Integrate into Witch Dock Dev only after standalone validation.
11. Promote to Witch Dock Stable only after separate review.

## Standalone Feature Acceptance

Where relevant, test:

- initialization on a clean page,
- repeated use,
- undo/redo,
- save and reload persistence,
- import/export persistence,
- page reload,
- enable,
- disable,
- dispose/restore,
- required-refresh behavior,
- missing capability behavior,
- interaction with other enabled reconstructed modules.

## Patch Testing

For unavoidable bundle patches, verify:

- expected match count,
- zero-match failure reporting,
- ambiguous multi-match rejection,
- required captures,
- transformed syntax validity where practical,
- postconditions,
- no duplicate insertion,
- idempotency where expected,
- fallback behavior,
- compatibility across retained fixtures.

Fixture success does not replace live runtime testing.

## Initial Planned Standalone Sequence

1. Read-only HeroForge bridge/capability probe.
2. Camera bounds.
3. Extra mini slots.
4. Character local file I/O.
5. Photo Booth settings I/O.
6. Photo Booth shader policy.
7. Decal catalog and slot expansion.
8. Decal transform controls plus required renderer support.
9. Material controls.
10. Kitbash capacity/scaling.
11. Kitbash visibility/joint behavior.
12. High-risk capture/texture/bundle-patch features.

This order may change when normalized audits reveal tighter dependencies.