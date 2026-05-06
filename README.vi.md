# SummarizeCommand

Quét các slash command thực sự có thể dùng trong môi trường hiện tại của bạn (project + plugins + MCP) và tạo báo cáo.

## Install & run (Claude Code plugin)

Chạy các lệnh sau trong ô chat của Claude Code.

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
