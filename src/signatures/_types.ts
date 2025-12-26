export type Confidence = "high" | "medium" | "low";

export type Match = {
  contains?: string;
  regex?: string;
};

export type Rule = {
  headers?: Record<string, Match>;
  bodies?: Match[];
  urls?: Match[];
  cookies?: Record<string, Match>;
  globals?: Match[];
};

export type Signature = {
  name: string;
  rules: Rule[];
  confidence: Confidence;
};
