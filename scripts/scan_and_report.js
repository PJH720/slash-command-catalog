import { mkdir, readFile, readdir, rename, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

/**
 * Zero-install plugin runner (Node.js ESM only).
 *
 * Test locally without npm:
 *   node /absolute/path/to/scripts/scan_and_report.js
 *
 * Behavior:
 * - Uses process.cwd() as the target project root.
 * - Scans a small set of known locations under that project.
 * - Writes summarize-report.html, llms.txt, llms-full.txt into the CWD.
 */

const OUTPUT_FILES = {
  html: "llm-full.html",
  llms: "llms.txt",
  llmsFull: "llms-full.txt",
};

const LEGACY_LLM_HTML_FILENAMES = ["summarize-report.html"];

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
  if (relPath.startsWith(".claude/")) return "local";
  if (relPath.startsWith(".mcp.json")) return "local";
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
    warnings.push(`Read failed: ${relLabel} (${reason})`);
    return null;
  }
}

async function safeReadDir(absDir, warnings, relLabel) {
  try {
    return await readdir(absDir, { withFileTypes: true });
  } catch (err) {
    const reason = isPermissionError(err) ? "permission denied" : "readdir failed";
    warnings.push(`Read failed: ${relLabel} (${reason})`);
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

async function walkDirWithLimits(absRoot, relRoot, warnings, { maxDepth }, onFile, depth = 0) {
  if (depth > maxDepth) return;
  const entries = await safeReadDir(absRoot, warnings, relRoot);
  if (!entries) return;

  for (const e of entries) {
    const nextAbs = path.join(absRoot, e.name);
    const nextRel = path.posix.join(relRoot, e.name);
    if (e.isDirectory()) {
      await walkDirWithLimits(nextAbs, nextRel, warnings, { maxDepth }, onFile, depth + 1);
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
<html lang="en">
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

function getScanDirs(projectRoot) {
  // Primary mode: scan project-local `.claude/*` under the current working directory.
  // Fallback mode: if the CWD itself is a `.claude` directory, scan its direct children.
  const base = path.basename(projectRoot);
  if (base === ".claude") {
    return { mode: "dot-claude-root", dirs: ["skills", "commands", "plugins"] };
  }
  return {
    mode: "project-root",
    dirs: [".claude/skills", ".claude/commands", ".claude/plugins"],
  };
}

async function collectCommandRecords(projectRoot) {
  const warnings = [];
  const records = [];

  const scan = getScanDirs(projectRoot);
  const scanDirs = scan.dirs;

  for (const rel of scanDirs) {
    const abs = path.join(projectRoot, rel);
    if (!(await fileExists(abs))) continue;

    const relPosix = rel.replaceAll(path.sep, "/");

    // When scanning a global `~/.claude` folder, `plugins/` can be huge.
    // Limit to likely skill entrypoints to prevent OOM / "Invalid string length".
    const shouldLimitPluginScan = scan.mode === "dot-claude-root" && relPosix === "plugins";

    const walker = shouldLimitPluginScan
      ? async (onFile) => walkDirWithLimits(abs, relPosix, warnings, { maxDepth: 5 }, onFile)
      : async (onFile) => walkDir(abs, relPosix, warnings, onFile);

    await walker(async (absPath, relPathPosix) => {
      const relLower = relPathPosix.toLowerCase();
      if (shouldLimitPluginScan) {
        if (!relLower.endsWith("/skill.md")) return;
      } else {
        if (!relLower.endsWith(".md")) return;
      }

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
          warnings.push('Parse failed: .mcp.json (missing "mcpServers")');
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
        warnings.push("Parse failed: .mcp.json (JSON parse error)");
      }
    }
  }

  return { records, warnings, scanDirs: scanDirs.map((d) => path.posix.normalize(d)) };
}

async function uniqueExistingRoots(roots) {
  const out = [];
  const seen = new Set();
  for (const r of roots) {
    if (!r) continue;
    if (!(await fileExists(r))) continue;
    const normalized = path.resolve(r);
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}

async function collectFromRoots(roots) {
  const combinedRecords = [];
  const combinedWarnings = [];
  const combinedPatterns = [];

  for (const root of roots) {
    const { records, warnings, scanDirs } = await collectCommandRecords(root);
    combinedRecords.push(
      ...records.map((r) => ({
        ...r,
        source: { ...r.source, root },
      })),
    );
    combinedWarnings.push(...warnings.map((w) => `[${root}] ${w}`));
    combinedPatterns.push(...scanDirs.map((p) => `${root}:${p}`));
  }

  return { records: combinedRecords, warnings: combinedWarnings, patterns: combinedPatterns };
}

function commandFromSkillPath(relPath) {
  const m = relPath.match(/(?:^|\/)(?:\.claude\/skills|skills)\/([^/]+)\/SKILL\.md$/i);
  return m?.[1] ? m[1] : null;
}

function renderCommandCatalogHtml(entries, generatedAt) {
  const commandList = Array.from(new Set(entries.map((e) => `/${e.command}`))).sort((a, b) =>
    a.localeCompare(b),
  );
  const commandListText = commandList.join("\n");

  const rows = entries
    .slice()
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((e) => {
      return `
        <tr>
          <td class="mono">${escapeHtml("/" + e.command)}</td>
          <td>${escapeHtml(e.description ?? "")}</td>
          <td class="mono">${escapeHtml(e.path)}</td>
          <td class="mono">${escapeHtml(e.sourceRoot)}</td>
          <td><button class="copyBtn" type="button" data-copy="${escapeHtml("/" + e.command)}">Copy</button></td>
        </tr>
      `;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>CommandCatalog</title>
    <style>
      :root { color-scheme: light dark; }
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif; margin: 24px; }
      h1 { margin: 0 0 8px; font-size: 20px; }
      .muted { opacity: 0.75; font-size: 12px; margin-bottom: 16px; }
      .toolbar { display: flex; align-items: center; gap: 10px; margin: 12px 0 16px; }
      pre { margin: 0; padding: 12px; border: 1px solid rgba(127,127,127,0.35); border-radius: 8px; background: color-mix(in oklab, Canvas 92%, CanvasText 8%); overflow: auto; }
      button { font: inherit; padding: 6px 10px; border-radius: 8px; border: 1px solid rgba(127,127,127,0.35); background: Canvas; cursor: pointer; }
      button:active { transform: translateY(1px); }
      table { width: 100%; border-collapse: collapse; font-size: 13px; }
      th, td { text-align: left; border-bottom: 1px solid rgba(127,127,127,0.35); padding: 10px 8px; vertical-align: top; }
      th { position: sticky; top: 0; background: Canvas; }
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
      td.mono { white-space: pre-wrap; }
    </style>
  </head>
  <body>
    <h1>CommandCatalog</h1>
    <div class="muted">Generated: ${escapeHtml(generatedAt)} · Commands: ${entries.length}</div>
    <div class="toolbar">
      <button id="copyAllBtn" type="button">Copy all commands</button>
      <span class="muted">One command per line</span>
    </div>
    <pre class="mono" id="commandBlock">${escapeHtml(commandListText)}</pre>
    <table>
      <thead>
        <tr>
          <th>Command</th>
          <th>Description</th>
          <th>Path</th>
          <th>SourceRoot</th>
          <th>Copy</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    <script>
      (function () {
        function setTempLabel(btn, text) {
          var prev = btn.textContent;
          btn.textContent = text;
          setTimeout(function () { btn.textContent = prev; }, 800);
        }
        async function copyText(text, btn) {
          try {
            await navigator.clipboard.writeText(text);
            if (btn) setTempLabel(btn, "Copied");
          } catch (e) {
            if (btn) setTempLabel(btn, "Failed");
          }
        }
        var block = document.getElementById("commandBlock");
        var copyAllBtn = document.getElementById("copyAllBtn");
        copyAllBtn.addEventListener("click", function () {
          copyText(block.textContent, copyAllBtn);
        });
        document.addEventListener("click", function (ev) {
          var target = ev.target;
          if (!(target instanceof HTMLElement)) return;
          if (!target.classList.contains("copyBtn")) return;
          var val = target.getAttribute("data-copy") || "";
          copyText(val, target);
        });
      })();
    </script>
  </body>
</html>`;
}

async function moveIfExists(srcAbs, destDirAbs, baseName, suffix) {
  if (!(await fileExists(srcAbs))) return null;
  await mkdir(destDirAbs, { recursive: true });
  const ext = path.extname(baseName);
  const stem = ext ? baseName.slice(0, -ext.length) : baseName;
  const safeSuffix = suffix ? `-${suffix}` : "";
  let destAbs = path.join(destDirAbs, `${stem}${safeSuffix}${ext}`);
  if (await fileExists(destAbs)) {
    destAbs = path.join(destDirAbs, `${stem}${safeSuffix}-${Date.now()}${ext}`);
  }
  await rename(srcAbs, destAbs);
  return destAbs;
}

async function main() {
  const projectRoot = process.cwd();
  const generatedAt = toIsoNow();

  const roots = await uniqueExistingRoots([projectRoot, path.join(os.homedir(), ".claude")]);

  // LLM-facing reports live under report_for_llm/.
  const llmDir = path.join(projectRoot, "report_for_llm");
  await mkdir(llmDir, { recursive: true });
  const backupSuffix = generatedAt.replaceAll(":", "").replaceAll(".", "");

  // Migrate any legacy files from project root into report_for_llm/.
  await moveIfExists(path.join(projectRoot, OUTPUT_FILES.html), llmDir, OUTPUT_FILES.html, "");
  for (const legacy of LEGACY_LLM_HTML_FILENAMES) {
    await moveIfExists(path.join(projectRoot, legacy), llmDir, legacy, "");
  }
  await moveIfExists(path.join(projectRoot, OUTPUT_FILES.llms), llmDir, OUTPUT_FILES.llms, "");
  await moveIfExists(path.join(projectRoot, OUTPUT_FILES.llmsFull), llmDir, OUTPUT_FILES.llmsFull, "");

  // Backup existing report_for_llm outputs (timestamped) before overwriting.
  await moveIfExists(path.join(llmDir, OUTPUT_FILES.html), llmDir, OUTPUT_FILES.html, backupSuffix);
  await moveIfExists(path.join(llmDir, OUTPUT_FILES.llms), llmDir, OUTPUT_FILES.llms, backupSuffix);
  await moveIfExists(path.join(llmDir, OUTPUT_FILES.llmsFull), llmDir, OUTPUT_FILES.llmsFull, backupSuffix);

  const { records: rawRecords, warnings, patterns } = await collectFromRoots(roots);
  const records = applyConflictDetection(rawRecords);

  await mkdir(projectRoot, { recursive: true });

  const html = renderHtml(records, generatedAt);
  const llms = renderLlmsQuick(records);
  const llmsFull = renderLlmsFull(records, {
    generatedAt,
    scanRoots: roots,
    patterns,
    warnings,
  });

  const htmlPath = path.join(llmDir, OUTPUT_FILES.html);
  const llmsPath = path.join(llmDir, OUTPUT_FILES.llms);
  const llmsFullPath = path.join(llmDir, OUTPUT_FILES.llmsFull);

  await writeFile(htmlPath, html, "utf8");
  await writeFile(llmsPath, llms + "\n", "utf8");
  await writeFile(llmsFullPath, llmsFull, "utf8");

  const commandEntries = records
    .map((r) => {
      const command = commandFromSkillPath(r.source.path);
      if (!command) return null;
      return {
        command,
        description: r.summary ?? "",
        path: r.source.path,
        sourceRoot: r.source.root ?? "",
      };
    })
    .filter(Boolean);

  const commandCatalogHtml = renderCommandCatalogHtml(commandEntries, generatedAt);
  const commandCatalogPath = path.join(projectRoot, "CommandCatalog.html");
  await writeFile(commandCatalogPath, commandCatalogHtml, "utf8");

  process.stdout.write(
    [
      "SummarizeCommand report generated.",
      `- HTML: ${htmlPath}`,
      `- llms.txt: ${llmsPath}`,
      `- llms-full.txt: ${llmsFullPath}`,
      `- CommandCatalog.html: ${commandCatalogPath}`,
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

