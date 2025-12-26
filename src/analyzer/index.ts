import type { Context } from "../browser/index.js";
import type { Signature } from "../signatures/_types.js";
import { applySignature } from "./apply.js";
import type { Detection } from "./types.js";

export function analyze(
  context: Context,
  signatures: Signature[],
): Detection[] {
  const detections: Detection[] = [];

  for (const signature of signatures) {
    const detection = applySignature(context, signature);
    if (!detection) {
      continue;
    }

    detections.push(detection);
  }

  return detections;
}
