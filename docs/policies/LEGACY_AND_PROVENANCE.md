# Legacy and Provenance Policy

Load this policy when auditing/importing legacy, Lob-authored, historical, or third-party material. It is not required for unrelated runtime investigations.

## Immutable references

All original source/reference material under `/legacy/` is immutable. Never edit those files in place.

If behavior must be repaired or reconstructed:

- preserve the original untouched;
- create maintained code outside `/legacy/`;
- document the relationship and provenance.

## Provenance

Where known, preserve:

- original filename and author;
- version/source/date imported;
- whether the file came from a Tampermonkey export;
- whether it is Lob-authored, Knight Witch-authored, or third-party;
- whether it was already modified before import.

Tampermonkey `.options.json` and `.storage.json` exports belong in a clearly separated legacy-metadata area.

## Third-party code

Do not silently absorb third-party code into maintained project source. Before adoption, identify source/author, relevant redistribution/licensing constraints, and whether the project should depend on, wrap, reference, or leave the code external.

## Required legacy audit categories

For a significant legacy script, investigate as relevant:

- actual user-visible features and mixed/unrelated feature families;
- dead, unfinished, commented-out, or duplicate code;
- hidden cross-script dependencies;
- created/modified globals;
- replaced runtime functions;
- permanent/non-configurable overrides;
- DOM/React/Webpack/module dependencies;
- bundle interception and exact/regex replacements;
- load order and initialization races;
- settings/storage keys;
- hard-coded part/asset/account identifiers;
- trust-sensitive/destructive behavior;
- failure modes;
- recommended feature split/disposition.

Unknown behavior must be investigated, quarantined, or explicitly marked unresolved. Do not silently carry unexplained hacks into maintained architecture.

## Trust-sensitive legacy behavior

Account-specific kill switches, redirects, page blanking, hidden disabling logic, credential access, or similar behavior must not be migrated without an explicit approved requirement. Preserve such behavior only in immutable legacy reference and document it.
