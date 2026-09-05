# Feature Inventory

Canonical feature-ID inventory. Historical/provisional entries remain available in Git history; this file tracks current high-value active features and status.

Risk scale: Low / Medium / High / Critical according to runtime coupling and failure blast radius.

## Active / Maintained Features

| Feature ID | Purpose | Source / reference | Risk | Status |
|---|---|---|---|---|
| `media.screenshot-resolution` | Restore genuine 4K/8K Photo Booth still-image detail | ADP v0.99.30 + current KW reconstruction | Medium | **Standalone validated on `heroforge07.1.9.98`**. v0.6: 4K = one 4096 Effects source; 8K = four shifted 4096 sources feeding native 64-phase 8192 compositor. No 8192 Effects target. |
| `decals.gizmo.bound-correction` | Correct bound decal transform gizmo placement/behavior | Current KW reconstruction | High | Witch Dock Stable; Move/Rotate/Scale undo-redo, Project state preservation, artwork-swap preservation, and fresh-slot normalization validated. |
| `character.local-export` | Export character JSON locally | Advanced Decal Posing | Medium | Standalone reconstruction committed; core Save passed live. |
| `character.local-import` | Import character JSON locally | Advanced Decal Posing | Medium | Standalone reconstruction committed; core Load passed live. |
| `decals.transform.projected` | Project ON/OFF/Native state plus renderer semantics | ADP v0.99.30 + Full Res v0.80 | Critical while renderer dependency external | Runtime state/control path confirmed; exact renderer dependency audit pending. |
| `decals.advanced-posing` | Consolidated posing workflow | ADP v0.99.30 + KW reconstruction | High | Planned feature family; dependency/provider audits pending. |
| `decals.slots.expand` | Expand body/face decal slot mappings | HF Core Tweaks | Critical | Targeted current audit pending. |
| `decals.slots.splatter` | Expand splatter mappings/slots | HF Core Tweaks | Critical | Targeted current audit pending. |

## Photo Booth Validation Note

The prior 8K one-shot full-8192 Effects approach is **rejected for maintained use** on the tested machine because it repeatedly triggered a white renderer reset / blank output failure under packaged testing. Moving between Tampermonkey sandbox and page context, simplifying packaging, and replacing `toBlob()` did not fix it. The accepted v0.6 grouped design avoids that high-pressure allocation while preserving true 8192 sampling through four shifted 4096 sources.

## Deferred / Provisional Families

Other previously inventoried rendering, texture, kitbash, material, camera, slot, catalog, and Photo Booth import/export features remain provisional or deferred and are preserved in repository history until their dedicated audit/reconstruction stage resumes.
