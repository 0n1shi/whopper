import type { Evidence } from "../analyzer/types.js";
import type { Confidence } from "../signatures/_types.js";

export type DetectedSoftware = {
  name: string;
  description?: string;
  version?: string;
  cpe?: string;
  confidence: Confidence;
  evidences?: Evidence[];
  impliedBy?: string;
};

export type DetectCommandOutput = {
  detectedSoftwares: DetectedSoftware[];
};
