# SummarizeCommand

Esegue la scansione dei comandi slash disponibili nel tuo ambiente (progetto + plugin + MCP) e genera un report.

## Install & run (Claude Code plugin)

Esegui questi comandi nella chat di Claude Code.

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
