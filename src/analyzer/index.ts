import type { Context } from "../browser/types.js";
import type { Confidence, Signature } from "../signatures/_types.js";
import { applySignature } from "./apply.js";
import type { Detection } from "./types.js";

export function analyze(
  context: Context,
  signatures: Signature[],
): Detection[] {
  const detections: Detection[] = [];
  const impliedDetectionNamesWithConfidence: {
    name: string;
    confidence: Confidence;
    implied: string;
  }[] = [];

  for (const signature of signatures) {
    const detection = applySignature(context, signature);
    if (!detection) {
      continue;
    }

    detections.push(detection);
    impliedDetectionNamesWithConfidence.push(
      ...(signature.implies?.map((name) => ({
        name,
        confidence: detection.confidence,
        implied: detection.name,
      })) || []),
    );
  }

  for (const {
    name,
    confidence,
    implied,
  } of impliedDetectionNamesWithConfidence) {
    if (detections.find((d) => d.name === name)) {
      continue;
    }
    detections.push({
      name,
      confidence,
      implied,
    });
  }

  return detections;
}
