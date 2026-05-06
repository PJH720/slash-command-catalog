# SummarizeCommand

Memindai slash command yang benar-benar tersedia di lingkungan Anda saat ini (project + plugin + MCP) dan menghasilkan laporan.

## Install & run (Claude Code plugin)

Jalankan perintah berikut di input chat Claude Code.

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
