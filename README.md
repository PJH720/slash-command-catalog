# SummarizeCommand

Generate a report of the slash commands you can actually use in your current environment (project + plugins + MCPs), so you can escape the “discoverability crisis” caused by too many tools.

## Languages

- English (this file)
- Korean: `README.ko.md`
- Japanese: `README.ja.md`
- Chinese (Simplified): `README.zh-CN.md`
- Chinese (Traditional): `README.zh-TW.md`
- Spanish: `README.es.md`
- French: `README.fr.md`
- German: `README.de.md`
- Portuguese (Brazil): `README.pt-BR.md`
- Italian: `README.it.md`
- Turkish: `README.tr.md`
- Indonesian: `README.id.md`
- Vietnamese: `README.vi.md`
- Thai: `README.th.md`
- Polish: `README.pl.md`
- Dutch: `README.nl.md`
- Swedish: `README.sv.md`
- Russian: `README.ru.md`
- Ukrainian: `README.uk.md`
- Arabic: `README.ar.md`
- Hebrew: `README.he.md`
- Hindi: `README.hi.md`

This plugin generates a small set of **stable artifacts** that you can skim as a human or feed to an agent:

- **Human-friendly**: `summarize-report.html` (single searchable page)
- **Agent-friendly**: `llms.txt` / `llms-full.txt` (no HTML parsing required)

## Install & run (Claude Code plugin)

Run these commands **in the Claude Code chat input** (paste + send).

Install the plugin:

```text
/plugin marketplace add PJH720/slash-command-catalog
```

Then run it:

```text
/command-catalog
```

By default, it writes these files to the **current working directory**:

- `./summarize-report.html`
- `./llms.txt`
- `./llms-full.txt`

## When to use it

- You keep forgetting what `/commands` exist in a project.
- You want a quick “capabilities manifest” an agent can read without guessing.
- You suspect shadowing/duplication (same name defined in multiple places).

## What it scans (v1)

- `.claude/skills/` (SKILL.md)
- `.claude/commands/` (markdown command files)
- `.claude/plugins/` (plugin configs, if present)
- `.mcp.json` (MCP servers summary, if present)

## Notes

- The runner is **zero-install** (pure Node.js ESM) and can also be executed directly:
  - `node /absolute/path/to/scripts/scan_and_report.js`
- If your Claude Code environment blocks command execution, you may need to approve the `node .../scan_and_report.js` command when prompted.
