export type SourceCategory = "core" | "spec-kit" | "local" | "unknown";

export type CommandKind = "slash-command" | "prompt" | "rule" | "unknown";

export type CommandSource = {
  category: SourceCategory;
  path: string; // repo-relative path
};

export type CommandRecord = {
  name: string;
  kind: CommandKind;
  summary: string | null;
  source: CommandSource;
  conflicts: string[];
};

export type DiscoverOptions = {
  repoRoot: string;
  scanRoots: string[]; // absolute paths
  patterns: string[]; // simple glob-like: supports "**/*" and "*.md" and directory prefixes
};

export type ReportOptions = {
  outDir: string; // absolute
  includePdf: boolean;
};

export type ReportArtifacts = {
  htmlPath: string | null;
  llmsPath: string;
  llmsFullPath: string;
  pdfPath: string | null;
  generatedAt: string;
  scanRoots: string[];
  warnings: string[];
};

