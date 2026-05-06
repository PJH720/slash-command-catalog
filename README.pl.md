# SummarizeCommand

Skanuje dostępne polecenia ze slashem w Twoim bieżącym środowisku (projekt + wtyczki + MCP) i generuje raport.

## Install & run (Claude Code plugin)

Uruchom te polecenia w czacie Claude Code.

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
