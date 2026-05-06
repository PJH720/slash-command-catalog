# SummarizeCommand

สแกนคำสั่งแบบสแลชที่ใช้ได้จริงในสภาพแวดล้อมปัจจุบันของคุณ (โปรเจกต์ + ปลั๊กอิน + MCP) และสร้างรายงาน

## Install & run (Claude Code plugin)

รันคำสั่งเหล่านี้ในช่องแชทของ Claude Code

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
