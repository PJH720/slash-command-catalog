# SummarizeCommand

Scannt die in deiner aktuellen Umgebung (Projekt + Plugins + MCP) verfügbaren Slash-Commands und erzeugt einen Report.

## Install & run (Claude Code plugin)

Führe diese Befehle im Claude Code Chat aus.

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
