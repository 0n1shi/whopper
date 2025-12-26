import type { Confidence } from "../signatures/_types.js";

type EvidenceType = "header" | "body";

export type Evidence = {
  type: EvidenceType;
  value: string;
  version: string | undefined;
  confidence: Confidence;
};

export type Detection = {
  name: string;
  confidence: Confidence;
  evidences: Evidence[];
};
