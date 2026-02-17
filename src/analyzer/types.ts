import type { Confidence } from "../signatures/_types.js";

type EvidenceType = "header" | "body" | "cookie" | "script" | "url";
export type DetectionScope = "all" | "first-party";

export type Evidence = {
  type: EvidenceType;
  value: string;
  version: string | undefined;
  confidence: Confidence;
  host?: string;
  sourceUrl?: string;
};

export type Detection = {
  name: string;
  evidences?: Evidence[];
};

export type AnalyzeOptions = {
  scope?: DetectionScope;
};
