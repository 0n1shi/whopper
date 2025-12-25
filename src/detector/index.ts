import type { Context } from "../browser/index.js";
import type { Signature } from "../signatures/_types.js";
import { applySignature } from "./matcher.js";
import type { Detection } from "./types.js";

export function detect(context: Context, signatures: Signature[]): Detection[] {
  const detections: Detection[] = [];

  for (const signature of signatures) {
    const [matched, evidences] = applySignature(context, signature);
    if (matched) {
      detections.push({
        name: signature.name,
        confidence: signature.confidence,
        evidences,
      });
    }
  }

  return detections;
}
