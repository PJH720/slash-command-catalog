# Command Catalog

Generate a report of the slash commands you can actually use in your current environment (project + plugins + MCPs), so you can escape the “discoverability crisis” caused by too many tools.

###### Languages

English | [简体中文](docs/i18n/README.zh-CN.md) | [繁體中文](docs/i18n/README.zh-TW.md) | [日本語](docs/i18n/README.ja.md) | [Español](docs/i18n/README.es.md) | [Français](docs/i18n/README.fr.md) | [Deutsch](docs/i18n/README.de.md) | [Português(BR)](docs/i18n/README.pt-BR.md) | [Italiano](docs/i18n/README.it.md) | [Türkçe](docs/i18n/README.tr.md) | [Bahasa Indonesia](docs/i18n/README.id.md) | [Tiếng Việt](docs/i18n/README.vi.md) | [ไทย](docs/i18n/README.th.md) | [Polski](docs/i18n/README.pl.md) | [Nederlands](docs/i18n/README.nl.md) | [Svenska](docs/i18n/README.sv.md) | [Русский](docs/i18n/README.ru.md) | [Українська](docs/i18n/README.uk.md) | [한국어](docs/i18n/README.ko.md) | [العربية](docs/i18n/README.ar.md) | [עברית](docs/i18n/README.he.md) | [हिन्दी](docs/i18n/README.hi.md)

This plugin generates a small set of **stable artifacts** that you can skim as a human or feed to an agent:

- **Human-friendly**: `summarize-report.html` (single searchable page)
- **Agent-friendly**: `llms.txt` / `llms-full.txt` (no HTML parsing required)

## Install & run (Claude Code plugin)

Run these commands **in the Claude Code chat input** (paste + send).

Add this repository as a plugin marketplace:

```text
/plugin marketplace add PJH720/slash-command-catalog
```

Install the plugin from that marketplace:

```text
/plugin install command-catalog@pjh720-slash-command-catalog
```

```text
/reload-plugins
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
