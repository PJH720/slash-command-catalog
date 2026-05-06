# SummarizeCommand

Mevcut ortamınızda (proje + eklentiler + MCP) gerçekten kullanılabilen slash komutlarını tarar ve bir rapor üretir.

## Install & run (Claude Code plugin)

Bu komutları Claude Code sohbet girişinde çalıştırın.

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
