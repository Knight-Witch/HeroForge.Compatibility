# ADR-0004 — External Chat-Independent Live Diagnostic Transport

**Status:** Accepted  
**Date:** 2026-09-02

## Decision

Use the separate private repository `Knight-Witch/HF-Chat-Bridge` as development diagnostic/control-plane infrastructure for live HeroForge probing from authorized ChatGPT conversations.

HF-Chat-Bridge is not the maintained HeroForge compatibility bridge used by feature modules and is not a Witch Dock runtime dependency.

## Context

HeroForge compatibility work repeatedly requires live inspection of an authenticated browser session. Without a bridge, investigation depends on Amanda manually running console snippets, copying object dumps, locating bundles, and relaying results into whichever chat is performing the repair.

The diagnostic path also needs to work across different ChatGPT conversations and projects rather than being tied to one conversation.

The first scaffold uses:

```text
Authorized ChatGPT chat/project
→ private GitHub request issue
→ local loopback relay
→ HeroForge-only Tampermonkey read-only probe
→ structured result
→ GitHub issue comment
→ requesting/other authorized ChatGPT chat
```

## Reasons

- The private GitHub repository is already accessible from normal authorized ChatGPT chats through Amanda's connected GitHub account.
- Request IDs and bridge session IDs provide correlation without conversation/project binding.
- A local relay keeps the GitHub credential out of HeroForge/Tampermonkey page context.
- A fixed read-only probe registry provides live evidence without introducing generic remote code execution.
- Transport separation allows GitHub to be replaced later, for example by MCP, without making diagnostic transport part of the maintained feature architecture.

## Security constraints

V0.1 is read-only.

The approved initial design excludes:

- arbitrary `eval` or remotely supplied JavaScript;
- arbitrary HeroForge function invocation;
- state-changing HeroForge commands;
- bundle patching;
- credential/cookie/account-data extraction;
- LAN/public listeners;
- GitHub credentials in the userscript.

Any mutation-capable extension requires separate review and explicit approval.

## Consequences

- Live diagnostics may be requested from any authorized chat/project that can access `Knight-Witch/HF-Chat-Bridge` and knows the protocol.
- Diagnostic output is evidence, not automatically a maintained compatibility guarantee.
- Validated findings must still be recorded in HeroForge.Compatibility investigations/compatibility documentation before becoming architectural truth.
- Public Witch Dock remains insulated from the diagnostic service.
- The immediate validation gate is one complete `bridge.ping` round-trip followed by bounded capability probing.
