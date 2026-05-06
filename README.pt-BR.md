# SummarizeCommand

Escaneia os slash commands disponíveis no seu ambiente atual (projeto + plugins + MCP) e gera um relatório.

## Install & run (Claude Code plugin)

Execute estes comandos no chat do Claude Code.

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
