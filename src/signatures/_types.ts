export type Confidence = "high" | "medium" | "low";

export type Regex = string;

export type Rule = {
  confidence: Confidence;
  headers?: Record<string, Regex>;
  bodies?: Regex[];
  urls?: Regex[];
  cookies?: Record<string, Regex>;
  javascriptVariables?: Record<string, Regex>;
};

export type Signature = {
  name: string;
  description: string;
  cpe?: string;
  rule?: Rule;
  implies?: string[];
};
