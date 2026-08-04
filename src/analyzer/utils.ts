import type { Confidence } from "../signatures/_types.js";

export const maxConfidence = (confidences: Confidence[]): Confidence => {
  if (confidences.includes("high")) {
    return "high";
  }
  if (confidences.includes("medium")) {
    return "medium";
  }
  return "low";
};

// Lower a confidence by one level. Used for implied (indirectly detected)
// softwares, which should never be reported with the same confidence as the
// direct detection that implied them.
export const demoteConfidence = (confidence: Confidence): Confidence => {
  if (confidence === "high") {
    return "medium";
  }
  if (confidence === "medium") {
    return "low";
  }
  return "low";
};
