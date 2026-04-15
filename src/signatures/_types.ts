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
  // Variables that must all exist for script evidences to be kept.
  // Skipped when non-script evidences already confirm the technology.
  requiredJavascriptVariables?: string[];
};

export type ActiveRule = {
  path: string;
  bodyRegex: Regex;
  confidence?: Confidence;
};

export type Signature = {
  name: string;
  description?: string;
  cpe?: string;
  runtime?: Runtime;
  rule?: Rule;
  activeRules?: ActiveRule[];
  impliedSoftwares?: string[];
};
