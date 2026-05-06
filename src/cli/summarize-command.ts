#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";

import { discoverFiles } from "../core/discover.js";
import { applyConflictDetection, parseCommandFile } from "../core/parse.js";
import { writeHtmlReport } from "../core/reportHtml.js";
import { writeLlmsReports } from "../core/reportLlms.js";
import type { CommandRecord, DiscoverOptions, ReportArtifacts } from "../types.js";

function getRepoRoot(): string {
  // dist/cli/... or src/cli/... → repo root is 2 levels up from dist or src
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, "..", "..", "..");
}

function parseArgs(argv: string[]): { outDir: string; pdf: boolean } {
  // Minimal arg parsing: --out <dir>, --pdf
  let outDir = "./summarize-report";
  let pdf = false;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--pdf") {
      pdf = true;
      continue;
    }
    if (a === "--out") {
      const next = argv[i + 1];
      if (!next) throw new Error("--out requires a value");
      outDir = next;
      i++;
      continue;
    }
  }

  return { outDir, pdf };
}

async function main(): Promise<void> {
  const { outDir, pdf } = parseArgs(process.argv.slice(2));
  const repoRoot = getRepoRoot();
  const outAbs = path.resolve(process.cwd(), outDir);

  const warnings: string[] = [];
  if (pdf) {
    warnings.push("PDF 출력은 v1에서 아직 구현되지 않았습니다. HTML/LLMS만 생성합니다.");
  }

  const discoverOptions: DiscoverOptions = {
    repoRoot,
    scanRoots: [repoRoot],
    patterns: [
      ".github/agents/",
      ".github/prompts/",
      ".claude/skills/",
      ".claude/commands/",
      ".claude/plugins/",
    ],
  };

  const { files, warnings: discoverWarnings } = await discoverFiles(discoverOptions);
  warnings.push(...discoverWarnings);
  const parsed: Omit<CommandRecord, "conflicts">[] = [];

  for (const f of files) {
    // Filter to repo-local markdown only (defense-in-depth).
    if (!f.relPath.endsWith(".md")) continue;
    const res = await parseCommandFile(f.relPath, f.absPath);
    warnings.push(...res.warnings);
    parsed.push(res.record);
  }

  const records = applyConflictDetection(parsed);

  const htmlPath = await writeHtmlReport(outAbs, records);
  const { llmsPath, llmsFullPath } = await writeLlmsReports(outAbs, records, {
    scanRoots: discoverOptions.scanRoots,
    patterns: discoverOptions.patterns,
    warnings,
  });

  const artifacts: ReportArtifacts = {
    htmlPath,
    llmsPath,
    llmsFullPath,
    pdfPath: null,
    generatedAt: new Date().toISOString(),
    scanRoots: discoverOptions.scanRoots,
    warnings,
  };

  // Human-friendly output to stdout (not JSON for v1).
  process.stdout.write(
    [
      "SummarizeCommand report generated.",
      `- HTML: ${artifacts.htmlPath}`,
      `- llms.txt: ${artifacts.llmsPath}`,
      `- llms-full.txt: ${artifacts.llmsFullPath}`,
      warnings.length ? `- Warnings: ${warnings.length}` : "",
      "",
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(`Error: ${msg}\n`);
  process.exitCode = 1;
});

