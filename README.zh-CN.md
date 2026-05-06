# SummarizeCommand

扫描你当前环境（项目 + 插件 + MCP）中实际可用的斜杠命令，并生成报告。

## Install & run (Claude Code plugin)

在 Claude Code 的聊天输入框中依次运行以下命令。

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
