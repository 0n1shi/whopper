import type { Confidence } from "../signatures/_types.js";

type EvidenceType = "header" | "body" | "cookie" | "script" | "url";

export type Evidence = {
  type: EvidenceType;
  value: string;
  version: string | undefined;
  confidence: Confidence;
};

export type Detection = {
  name: string;
  evidences?: Evidence[];
};
