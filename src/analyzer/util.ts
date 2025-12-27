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

export function getValByPath(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as any)[key];
    }
    return undefined;
  }, obj);
}
