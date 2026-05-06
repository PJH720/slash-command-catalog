# SummarizeCommand

סורק את פקודות ה־slash הזמינות בפועל בסביבה הנוכחית שלך (פרויקט + תוספים + MCP) ומייצר דוח.

## Install & run (Claude Code plugin)

הרץ את הפקודות הבאות בצ׳אט של Claude Code.

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
