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
