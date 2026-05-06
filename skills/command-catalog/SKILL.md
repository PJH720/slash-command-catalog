---
name: command-catalog
description: Scans available commands in the current project and generates a catalog report.
disable-model-invocation: true
---

# CommandCatalog

This skill scans a small set of known locations under the current project directory and generates a report:

- `.claude/skills/` (SKILL.md)
- `.claude/commands/` (markdown command files)
- `.claude/plugins/` (if present)
- `.mcp.json` (MCP server configuration summary, if present)

It writes these artifacts to the **current working directory**:

- `summarize-report.html`
- `llms.txt`
- `llms-full.txt`

!command node "${CLAUDE_PLUGIN_ROOT}/scripts/scan_and_report.js"
