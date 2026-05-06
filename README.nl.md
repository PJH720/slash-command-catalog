# SummarizeCommand

Scant de slash-commando’s die je daadwerkelijk kunt gebruiken in je huidige omgeving (project + plugins + MCP) en genereert een rapport.

## Install & run (Claude Code plugin)

Voer deze commando’s uit in de Claude Code chat.

Install:

```text
/plugin marketplace add PJH720/slash-command-catalog
```

Run:

```text
/summarize-command
```

Outputs (written to the current working directory):

- `./summarize-report.html`
- `./llms.txt`
- `./llms-full.txt`

## Notes

- Zero-install (pure Node.js ESM). You can also run:
  - `node /absolute/path/to/scripts/scan_and_report.js`
