import type { Evidence } from "../analyzer/types.js";
import type { Confidence } from "../signatures/_types.js";

export type DetectedSoftware = {
  name: string;
  description: string;
  versions?: string[];
  cpes?: string[];
  confidence: Confidence;
  evidences?: Evidence[];
  impliedBy?: string;
};

export type DetectCommandOutput = {
  detectedSoftwares: DetectedSoftware[];
};
