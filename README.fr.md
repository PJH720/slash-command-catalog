# SummarizeCommand

Scanne les commandes slash disponibles dans votre environnement actuel (projet + plugins + MCP) et génère un rapport.

## Install & run (Claude Code plugin)

Exécutez ces commandes dans le chat de Claude Code.

Install:

```text
/plugin marketplace add PJH720/slash-command-catalog
```

Run:

```text
/command-catalog
```

Outputs (written to the current working directory):

- `./summarize-report.html`
- `./llms.txt`
- `./llms-full.txt`

## Notes

- Zero-install (pure Node.js ESM). You can also run:
  - `node /absolute/path/to/scripts/scan_and_report.js`
