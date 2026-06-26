export type Confidence = "high" | "medium" | "low";
export type Runtime = "client" | "server";

export type Regex = string;

export type Rule = {
  confidence: Confidence;
  headers?: Record<string, Regex>;
  bodies?: Regex[];
  urls?: Regex[];
  cookies?: Record<string, Regex>;
  javascriptVariables?: Record<string, Regex>;
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
