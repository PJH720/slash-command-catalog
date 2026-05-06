import { readdir } from "node:fs/promises";
import path from "node:path";

import type { DiscoverOptions } from "../types.js";

type DiscoveredFile = {
  absPath: string;
  relPath: string;
};

function matchesPattern(relPath: string, patterns: string[]): boolean {
  // Minimal matcher: supports
  // - "**/*.md" (suffix)
  // - ".github/agents/" (prefix)
  // - "*.md" (suffix)
  // - exact path match
  for (const p of patterns) {
    if (p === relPath) return true;

    if (p.startsWith("**/")) {
      const suffix = p.slice(3);
      if (relPath.endsWith(suffix.replace("*", ""))) return true;
      if (suffix === "*.md" && relPath.endsWith(".md")) return true;
    }

    if (p.startsWith("*.")) {
      if (relPath.endsWith(p.slice(1))) return true;
    }

    if (p.endsWith("/")) {
      if (relPath.startsWith(p)) return true;
    }
  }
  return false;
}

export async function discoverFiles(
  options: DiscoverOptions,
): Promise<{ files: DiscoveredFile[]; warnings: string[] }> {
  const results: DiscoveredFile[] = [];
  const warnings: string[] = [];

  const dirPrefixPatterns = options.patterns.filter((p) => p.endsWith("/"));
  const needsFullWalk = options.patterns.some((p) => !p.endsWith("/"));

  for (const root of options.scanRoots) {
    // If the user only provided directory-prefix patterns, avoid a full repo walk
    // and only traverse those subtrees.
    if (dirPrefixPatterns.length > 0) {
      for (const p of dirPrefixPatterns) {
        await walk(path.join(root, p));
      }
    }
    if (needsFullWalk) {
      await walk(root);
    }
  }

  return { files: results, warnings };

  async function walk(currentAbs: string): Promise<void> {
    let entries: import("node:fs").Dirent[];
    try {
      entries = await readdir(currentAbs, { withFileTypes: true });
    } catch {
      warnings.push(`읽기 실패: ${path.relative(options.repoRoot, currentAbs)}`);
      return;
    }

    for (const e of entries) {
      const nextAbs = path.join(currentAbs, e.name);
      if (e.isDirectory()) {
        await walk(nextAbs);
        continue;
      }
      if (!e.isFile()) continue;

      const relPath = path.relative(options.repoRoot, nextAbs);
      if (!matchesPattern(relPath, options.patterns)) continue;

      results.push({ absPath: nextAbs, relPath });
    }
  }
}

