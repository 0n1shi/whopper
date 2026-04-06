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
  requiredJavascriptVariables?: string[];
};

export type Signature = {
  name: string;
  description?: string;
  cpe?: string;
  runtime?: Runtime;
  rule?: Rule;
  impliedSoftwares?: string[];
};
