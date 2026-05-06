import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { CommandRecord } from "../types.js";

export async function writeLlmsReports(
  outDir: string,
  records: CommandRecord[],
  meta?: { scanRoots?: string[]; patterns?: string[]; warnings?: string[] },
): Promise<{ llmsPath: string; llmsFullPath: string }> {
  await mkdir(outDir, { recursive: true });

  const llmsPath = path.join(outDir, "llms.txt");
  const llmsFullPath = path.join(outDir, "llms-full.txt");

  const quickLines = records
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((r) => {
      const summary = r.summary ? ` — ${r.summary}` : "";
      return `/${r.name}${summary} (source: ${r.source.category}, path: ${r.source.path})`;
    })
    .join("\n");

  const conflicts = records
    .filter((r) => r.conflicts.length > 0)
    .map((r) => `- ${r.name}\n  - ${[r.source.path, ...r.conflicts].join("\n  - ")}`)
    .join("\n");

  const scanRoots = meta?.scanRoots ?? [];
  const patterns = meta?.patterns ?? [];
  const warnings = meta?.warnings ?? [];

  const full = [
    "Overview",
    `Generated: ${new Date().toISOString()}`,
    scanRoots.length ? `ScanRoots: ${scanRoots.join(", ")}` : "ScanRoots: (unknown)",
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
    scanRoots.length ? `Roots: ${scanRoots.join(", ")}` : "Roots: (unknown)",
    patterns.length ? `Patterns: ${patterns.join(", ")}` : "Patterns: (unknown)",
    `Warnings: ${warnings.length}`,
    ...warnings.map((w) => `- ${w}`),
    "",
  ].join("\n");

  await writeFile(llmsPath, quickLines + "\n", "utf8");
  await writeFile(llmsFullPath, full, "utf8");

  return { llmsPath, llmsFullPath };
}

