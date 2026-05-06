import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { CommandRecord } from "../types.js";

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function writeHtmlReport(
  outDir: string,
  records: CommandRecord[],
): Promise<string> {
  await mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, "summarize-report.html");

  const rows = records
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((r) => {
      const conflicts =
        r.conflicts.length > 0 ? escapeHtml(r.conflicts.join("\n")) : "";
      return `
        <tr>
          <td class="mono">${escapeHtml(r.name)}</td>
          <td>${escapeHtml(r.summary ?? "")}</td>
          <td>${escapeHtml(r.kind)}</td>
          <td>${escapeHtml(r.source.category)}</td>
          <td class="mono">${escapeHtml(r.source.path)}</td>
          <td class="mono">${conflicts}</td>
        </tr>
      `;
    })
    .join("\n");

  const html = `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SummarizeCommand Report</title>
    <style>
      :root { color-scheme: light dark; }
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif; margin: 24px; }
      h1 { margin: 0 0 8px; font-size: 20px; }
      .muted { opacity: 0.75; font-size: 12px; margin-bottom: 16px; }
      table { width: 100%; border-collapse: collapse; font-size: 13px; }
      th, td { text-align: left; border-bottom: 1px solid rgba(127,127,127,0.35); padding: 10px 8px; vertical-align: top; }
      th { position: sticky; top: 0; background: Canvas; }
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
      td.mono { white-space: pre-wrap; }
    </style>
  </head>
  <body>
    <h1>SummarizeCommand Report</h1>
    <div class="muted">Generated: ${escapeHtml(new Date().toISOString())} · Commands: ${records.length}</div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Summary</th>
          <th>Kind</th>
          <th>Source</th>
          <th>Path</th>
          <th>Conflicts</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </body>
</html>`;

  await writeFile(outPath, html, "utf8");
  return outPath;
}

