# SummarizeCommand

掃描你目前環境（專案 + 外掛 + MCP）中實際可用的斜線指令，並產生報告。

## Install & run (Claude Code plugin)

在 Claude Code 的聊天輸入框中依序執行以下指令。

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
