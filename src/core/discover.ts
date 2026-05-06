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
): Promise<DiscoveredFile[]> {
  const results: DiscoveredFile[] = [];

  for (const root of options.scanRoots) {
    await walk(root);
  }

  return results;

  async function walk(currentAbs: string): Promise<void> {
    let entries: import("node:fs").Dirent[];
    try {
      entries = await readdir(currentAbs, { withFileTypes: true });
    } catch {
      // Ignore unreadable directories. Warnings are handled at a higher layer.
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

