import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * v1 목적:
 * - 현재 작업 디렉터리(CWD)를 "프로젝트 루트"로 간주
 * - 제한된 몇몇 경로만 스캔해서 slash-command 인벤토리를 수집
 * - contracts/report-schema.md + specs/001-summarize-command/data-model.md 포맷으로
 *   summarize-report.html, llms.txt, llms-full.txt 를 CWD에 생성
 */

const OUTPUT_FILES = {
  html: "summarize-report.html",
  llms: "llms.txt",
  llmsFull: "llms-full.txt",
};

function toIsoNow() {
  return new Date().toISOString();
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isPermissionError(err) {
  return (
    err &&
    typeof err === "object" &&
    ("code" in err) &&
    (err.code === "EACCES" || err.code === "EPERM")
  );
}

async function fileExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

function parseFrontmatter(md) {
  const m = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n/m);
  if (!m?.[1]) return { fm: null, body: md };
  const fmText = m[1];
  const body = md.slice(m[0].length);

  const get = (key) => {
    const re = new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`, "m");
    const mm = fmText.match(re);
    if (!mm?.[1]) return null;
    return mm[1].trim().replace(/^['"]|['"]$/g, "");
  };

  return {
    fm: {
      name: get("name"),
      description: get("description"),
    },
    body,
  };
}

function inferSourceCategory(relPath) {
  if (relPath.startsWith(".specify/")) return "spec-kit";
  if (relPath.startsWith(".github/")) return "core";
  if (relPath.startsWith(".claude/")) return "local";
  return "unknown";
}

function inferKind(relPath) {
  if (relPath.includes("/agents/")) return "slash-command";
  if (relPath.includes("/prompts/")) return "prompt";
  if (relPath.includes("/rules/")) return "rule";
  if (relPath.endsWith("/SKILL.md") || relPath.includes("/skills/")) return "slash-command";
  return "unknown";
}

function summarizeFromMarkdown(md) {
  const { fm, body } = parseFrontmatter(md);
  if (fm?.description) return fm.description;

  const lines = body.split("\n").map((l) => l.trim());
  for (const line of lines) {
    if (!line) continue;
    if (line.startsWith("#")) continue;
    return line;
  }
  return null;
}

function nameFromSkillPath(relPath) {
  // `.claude/skills/foo/SKILL.md` -> foo
  const parts = relPath.split("/");
  const idx = parts.lastIndexOf("skills");
  if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
  return null;
}

function nameFromCommandPath(relPath) {
  const base = relPath.split("/").at(-1) ?? relPath;
  return base.replace(/\.md$/i, "");
}

async function safeReadText(absPath, warnings, relLabel) {
  try {
    return await readFile(absPath, "utf8");
  } catch (err) {
    const reason = isPermissionError(err) ? "permission denied" : "read failed";
    warnings.push(`읽기 실패: ${relLabel} (${reason})`);
    return null;
  }
}

async function safeReadDir(absDir, warnings, relLabel) {
  try {
    return await readdir(absDir, { withFileTypes: true });
  } catch (err) {
    const reason = isPermissionError(err) ? "permission denied" : "readdir failed";
    warnings.push(`읽기 실패: ${relLabel} (${reason})`);
    return null;
  }
}

async function walkDir(absRoot, relRoot, warnings, onFile) {
  const entries = await safeReadDir(absRoot, warnings, relRoot);
  if (!entries) return;

  for (const e of entries) {
    const nextAbs = path.join(absRoot, e.name);
    const nextRel = path.posix.join(relRoot, e.name);
    if (e.isDirectory()) {
      await walkDir(nextAbs, nextRel, warnings, onFile);
      continue;
    }
    if (!e.isFile()) continue;
    await onFile(nextAbs, nextRel);
  }
}

function applyConflictDetection(records) {
  const byName = new Map();
  for (const r of records) {
    const bucket = byName.get(r.name) ?? [];
    bucket.push(r.source.path);
    byName.set(r.name, bucket);
  }

  return records.map((r) => {
    const paths = byName.get(r.name) ?? [];
    const conflicts = paths.length > 1 ? paths.filter((p) => p !== r.source.path) : [];
    return { ...r, conflicts };
  });
}

function renderHtml(records, generatedAt) {
  const rows = records
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((r) => {
      const conflicts = r.conflicts.length ? escapeHtml(r.conflicts.join("\n")) : "";
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

  return `<!doctype html>
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
    <div class="muted">Generated: ${escapeHtml(generatedAt)} · Commands: ${records.length}</div>
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
}

function renderLlmsQuick(records) {
  return records
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((r) => {
      const summary = r.summary ? ` — ${r.summary}` : "";
      return `/${r.name}${summary} (source: ${r.source.category}, path: ${r.source.path})`;
    })
    .join("\n");
}

function renderLlmsFull(records, meta) {
  const conflicts = records
    .filter((r) => r.conflicts.length > 0)
    .map((r) => `- ${r.name}\n  - ${[r.source.path, ...r.conflicts].join("\n  - ")}`)
    .join("\n");

  return [
    "Overview",
    `Generated: ${meta.generatedAt}`,
    `ScanRoots: ${meta.scanRoots.join(", ")}`,
    `Commands: ${records.length}`,
    "",
    "Commands",
    ...records
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .flatMap((r) => [
        `- /${r.name}`,
        `  - kind: ${r.kind}`,
        `  - source: ${r.source.category}`,
        `  - path: ${r.source.path}`,
        `  - summary: ${r.summary ?? ""}`,
      ]),
    "",
    "Conflicts",
    conflicts || "(none)",
    "",
    "ScanSummary",
    `Roots: ${meta.scanRoots.join(", ")}`,
    `Patterns: ${meta.patterns.join(", ")}`,
    meta.warnings.length ? `Warnings: ${meta.warnings.length}` : "Warnings: 0",
    ...meta.warnings.map((w) => `- ${w}`),
    "",
  ].join("\n");
}

async function collectCommandRecords(projectRoot) {
  const warnings = [];
  const records = [];

  const scanDirs = [
    ".claude/skills",
    ".claude/commands",
    ".claude/plugins",
  ];

  for (const rel of scanDirs) {
    const abs = path.join(projectRoot, rel);
    if (!(await fileExists(abs))) continue;

    await walkDir(abs, rel.replaceAll(path.sep, "/"), warnings, async (absPath, relPathPosix) => {
      if (!relPathPosix.toLowerCase().endsWith(".md")) return;

      const contents = await safeReadText(absPath, warnings, relPathPosix);
      if (contents == null) return;

      const { fm } = parseFrontmatter(contents);
      const isSkill = relPathPosix.endsWith("/SKILL.md");

      const name =
        (fm?.name && fm.name) ||
        (isSkill ? nameFromSkillPath(relPathPosix) : null) ||
        nameFromCommandPath(relPathPosix);

      const summary = fm?.description || summarizeFromMarkdown(contents);

      records.push({
        name,
        kind: inferKind(relPathPosix),
        summary,
        source: {
          category: inferSourceCategory(relPathPosix),
          path: relPathPosix,
        },
      });
    });
  }

  // MCP servers (.mcp.json) — config has server definitions, not tool lists.
  const mcpPath = path.join(projectRoot, ".mcp.json");
  if (await fileExists(mcpPath)) {
    const txt = await safeReadText(mcpPath, warnings, ".mcp.json");
    if (txt != null) {
      try {
        const json = JSON.parse(txt);
        const servers = json && typeof json === "object" ? json.mcpServers : null;
        if (!servers || typeof servers !== "object") {
          warnings.push("파싱 실패: .mcp.json (mcpServers 키를 찾지 못했습니다)");
        } else {
          for (const [serverName, cfg] of Object.entries(servers)) {
            const cmd = cfg && typeof cfg === "object" && "command" in cfg ? String(cfg.command) : "";
            const args =
              cfg && typeof cfg === "object" && Array.isArray(cfg.args)
                ? cfg.args.map(String).join(" ")
                : "";
            const summary = cmd ? `MCP server (${cmd}${args ? " " + args : ""})` : "MCP server";

            records.push({
              name: `mcp.${serverName}`,
              kind: "unknown",
              summary,
              source: {
                category: "local",
                path: `.mcp.json#mcpServers.${serverName}`,
              },
            });
          }
        }
      } catch {
        warnings.push("파싱 실패: .mcp.json (JSON parse error)");
      }
    }
  }

  return { records, warnings, scanDirs: scanDirs.map((d) => path.posix.normalize(d)) };
}

async function main() {
  const projectRoot = process.cwd();
  const generatedAt = toIsoNow();

  const { records: rawRecords, warnings, scanDirs } = await collectCommandRecords(projectRoot);
  const records = applyConflictDetection(rawRecords);

  await mkdir(projectRoot, { recursive: true });

  const html = renderHtml(records, generatedAt);
  const llms = renderLlmsQuick(records);
  const llmsFull = renderLlmsFull(records, {
    generatedAt,
    scanRoots: [projectRoot],
    patterns: scanDirs,
    warnings,
  });

  const htmlPath = path.join(projectRoot, OUTPUT_FILES.html);
  const llmsPath = path.join(projectRoot, OUTPUT_FILES.llms);
  const llmsFullPath = path.join(projectRoot, OUTPUT_FILES.llmsFull);

  await writeFile(htmlPath, html, "utf8");
  await writeFile(llmsPath, llms + "\n", "utf8");
  await writeFile(llmsFullPath, llmsFull, "utf8");

  process.stdout.write(
    [
      "SummarizeCommand report generated.",
      `- HTML: ${htmlPath}`,
      `- llms.txt: ${llmsPath}`,
      `- llms-full.txt: ${llmsFullPath}`,
      warnings.length ? `- Warnings: ${warnings.length}` : "",
      "",
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(`Error: ${msg}\n`);
  process.exitCode = 1;
});

