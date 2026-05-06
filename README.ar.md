# SummarizeCommand

يقوم بمسح أوامر الشرطة المائلة المتاحة فعلاً في بيئتك الحالية (المشروع + الإضافات + MCP) ويُنشئ تقريراً.

## Install & run (Claude Code plugin)

نفّذ الأوامر التالية في محادثة Claude Code.

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
