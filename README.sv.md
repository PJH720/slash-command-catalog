# SummarizeCommand

Skannar vilka slash-kommandon som faktiskt är tillgängliga i din nuvarande miljö (projekt + plugins + MCP) och genererar en rapport.

## Install & run (Claude Code plugin)

Kör dessa kommandon i Claude Code-chatten.

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
