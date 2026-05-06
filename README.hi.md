# SummarizeCommand

आपके वर्तमान वातावरण (प्रोजेक्ट + प्लगइन्स + MCP) में वास्तव में उपलब्ध स्लैश कमांड्स को स्कैन करके रिपोर्ट बनाता है।

## Install & run (Claude Code plugin)

इन कमांड्स को Claude Code चैट इनपुट में चलाएँ।

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
