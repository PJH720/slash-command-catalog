# SummarizeCommand

Escanea los comandos con barra disponibles en tu entorno actual (proyecto + plugins + MCP) y genera un informe.

## Install & run (Claude Code plugin)

Ejecuta estos comandos en el chat de Claude Code.

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
