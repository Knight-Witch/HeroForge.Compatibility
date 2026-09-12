# Changelog

This is a rolling current changelog. Older verbose entries remain durable in Git history and should be fetched only when relevant.

## HFC-2026-09-12-024 — Refactor project documentation for selective context loading

**Date:** 2026-09-12

Refactors project governance so fresh ChatGPT chats start from a compact binding contract plus `ACTIVE_CONTEXT.md`, then load only relevant policy/spec/source/history.

Main-branch changes:

- slim `PROJECT_CONTRACT.md`;
- add `ACTIVE_CONTEXT.md` router;
- add targeted policy files under `docs/policies/`;
- add compact paste-ready ChatGPT Project-instructions template;
- update README bootstrap guidance;
- compact root preflight/changelog behavior so old detail is retrieved from Git history rather than mandatory startup context.

The current texture-quality investigation remains on `feature/rendering-texture-quality`; main `ACTIVE_CONTEXT.md` routes texture work there rather than duplicating branch-specific investigation state.

**Runtime impact:** none. Documentation/governance only. No JavaScript, HeroForge runtime behavior, HF-Chat-Bridge runtime behavior, or public Witch Dock behavior changed.

---

## Historical entries

Main-branch project history through the Photo Booth Stable acceptance remains in Git history at/before commit `732dae09e83d712a26ac383f7b64ce9e27e07a59`.

Feature-branch-only experimental work is documented on its feature branch and is not retroactively presented as merged main behavior.
