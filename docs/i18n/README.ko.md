# SummarizeCommand

Generate a report of the slash commands you can actually use in your current environment (project + plugins + MCPs), so you can escape the “discoverability crisis” caused by too many tools.

This plugin generates:

- **Human-friendly**: `summarize-report.html` (single searchable page)
- **Agent-friendly**: `llms.txt` / `llms-full.txt` (no HTML parsing required)

## Quickstart (Claude Code plugin, recommended)

```text
/plugin marketplace add PJH720/slash-command-catalog
/command-catalog
```

By default, it writes these files to the **current directory**:

- `./summarize-report.html`
- `./llms.txt`
- `./llms-full.txt`

## What it scans (v1)

- `.claude/skills/` (SKILL.md)
- `.claude/commands/` (markdown command files)
- `.claude/plugins/` (plugin configs, if present)
- `.mcp.json` (MCP servers summary, if present)

## Safety

- Do not commit secrets: `.env`, tokens, keys, certificates, personal data
