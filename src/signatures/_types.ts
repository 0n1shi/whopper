export type Confidence = "high" | "medium" | "low";
export type Runtime = "client" | "server";

export type Regex = string;

// A pattern whose version is assembled from several capture groups, for
// products that never expose the whole version in one place (TinyMCE keeps the
// major number and the rest in separate fields). `version` is a template in
// which $1, $2 … stand for the pattern's capture groups, e.g. "$1.$2"; the
// version is dropped when any group it names did not participate in the match.
// A plain Regex keeps reporting its first capture group as the version.
export type VersionedRegex = {
  regex: Regex;
  version: string;
};

export type Pattern = Regex | VersionedRegex;

export type Rule = {
  confidence: Confidence;
  headers?: Record<string, Pattern>;
  bodies?: Pattern[];
  urls?: Pattern[];
  cookies?: Record<string, Pattern>;
  javascriptVariables?: Record<string, Pattern>;
  // At least one of these variables must exist for script evidences to be kept.
  // Skipped when non-script evidences already confirm the technology.
  requireAnyOfJavascriptVariables?: string[];
};

export type ActiveRule = {
  path: string;
  bodyRegexes: Regex[];
  confidence?: Confidence;
};

export type Signature = {
  name: string;
  description?: string;
  cpe?: string;
  runtime?: Runtime;
  rule?: Rule;
  // First-hit-wins: stops at the first rule that matches.
  activeRules?: ActiveRule[];
  impliedSoftwares?: string[];
  // Names of other technologies to remove from the final output when THIS
  // technology is detected. Used when a product is built on top of another and
  // would otherwise be double-detected (e.g. PowerCMS excludes Movable Type).
  excludes?: string[];
};
