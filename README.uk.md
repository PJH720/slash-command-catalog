# SummarizeCommand

Сканує доступні slash-команди у вашому поточному середовищі (проєкт + плагіни + MCP) і генерує звіт.

## Install & run (Claude Code plugin)

Виконайте ці команди в чаті Claude Code.

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
