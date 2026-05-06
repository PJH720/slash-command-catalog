import { readFile } from "node:fs/promises";

import type { CommandKind, CommandRecord, SourceCategory } from "../types.js";

type ParseResult = {
  record: Omit<CommandRecord, "conflicts">;
  warnings: string[];
};

function inferSourceCategory(relPath: string): SourceCategory {
  if (relPath.startsWith(".specify/")) return "spec-kit";
  if (relPath.startsWith(".github/")) return "core";
  if (relPath.startsWith(".claude/")) return "local";
  if (relPath.startsWith("src/")) return "local";
  return "unknown";
}

function inferKind(relPath: string): CommandKind {
  if (relPath.startsWith(".github/agents/")) return "slash-command";
  if (relPath.startsWith(".github/prompts/")) return "prompt";
  if (relPath.startsWith(".claude/skills/")) return "slash-command";
  if (relPath.startsWith(".claude/commands/")) return "slash-command";
  if (relPath.startsWith(".claude/rules/")) return "rule";
  if (relPath.startsWith(".cursor/")) return "rule";
  return "unknown";
}

function parseFrontmatter(contents: string): { name: string | null; description: string | null } {
  const fm = contents.match(/^---\s*\n([\s\S]*?)\n---\s*\n/m);
  if (!fm?.[1]) return { name: null, description: null };
  const block = fm[1];

  const get = (key: string): string | null => {
    const m = block.match(new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`, "m"));
    if (!m?.[1]) return null;
    return m[1].trim().replace(/^["']|["']$/g, "");
  };

  return { name: get("name"), description: get("description") };
}

function parseNameFromPath(relPath: string): string {
  if (relPath.endsWith("/SKILL.md")) {
    // `.claude/skills/foo/SKILL.md` -> foo
    const parts = relPath.split("/");
    const idx = parts.lastIndexOf("skills");
    const dir = idx >= 0 ? parts[idx + 1] : null;
    if (dir) return dir;
  }
  const base = relPath.split("/").at(-1) ?? relPath;
  return base.replace(/\.md$/i, "");
}

function parseSummaryFromMarkdown(contents: string): string | null {
  // Heuristic: if frontmatter has description: "...", use it.
  const fm = parseFrontmatter(contents);
  if (fm.description) return fm.description;

  // Otherwise use the first non-heading non-empty line as a summary.
  const lines = contents.split("\n").map((l) => l.trim());
  for (const line of lines) {
    if (!line) continue;
    if (line.startsWith("#")) continue;
    return line;
  }
  return null;
}

export async function parseCommandFile(
  relPath: string,
  absPath: string,
): Promise<ParseResult> {
  const warnings: string[] = [];
  let contents: string;
  try {
    contents = await readFile(absPath, "utf8");
  } catch (e) {
    warnings.push(`읽기 실패: ${relPath}`);
    return {
      record: {
        name: parseNameFromPath(relPath),
        kind: inferKind(relPath),
        summary: null,
        source: { category: inferSourceCategory(relPath), path: relPath },
      },
      warnings,
    };
  }

  const fm = parseFrontmatter(contents);
  const name = fm.name ?? parseNameFromPath(relPath);

  return {
    record: {
      name,
      kind: inferKind(relPath),
      summary: parseSummaryFromMarkdown(contents),
      source: { category: inferSourceCategory(relPath), path: relPath },
    },
    warnings,
  };
}

export function applyConflictDetection(
  records: Omit<CommandRecord, "conflicts">[],
): CommandRecord[] {
  const byName = new Map<string, { idxs: number[]; paths: string[] }>();
  for (const [idx, r] of records.entries()) {
    const bucket = byName.get(r.name) ?? { idxs: [], paths: [] };
    bucket.idxs.push(idx);
    bucket.paths.push(r.source.path);
    byName.set(r.name, bucket);
  }

  return records.map((r) => {
    const bucket = byName.get(r.name);
    const conflicts =
      bucket && bucket.paths.length > 1
        ? bucket.paths.filter((p) => p !== r.source.path)
        : [];
    return { ...r, conflicts };
  });
}

