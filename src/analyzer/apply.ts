import type { Context } from "../browser/index.js";
import type { Signature } from "../signatures/_types.js";
import type { Detection, Evidence } from "./types.js";
import { matchString } from "./match.js";
import { maxConfidence } from "./util.js";

export const applySignature = (
  context: Context,
  signature: Signature,
): Detection | undefined => {
  const evidences: Evidence[] = [];
  for (const rule of signature.rules) {
    // Match headers
    if (rule.headers) {
      for (const [header, match] of Object.entries(rule.headers)) {
        const response = context.responses.find(
          (res) => res.headers[header.toLowerCase()],
        );
        if (!response) {
          continue;
        }

        const headerValue = response.headers[header.toLowerCase()];
        if (!headerValue) {
          continue;
        }

        const result = matchString(headerValue, match);
        if (!result.hit) {
          continue;
        }

        evidences.push({
          type: "header",
          value: `${header}: ${headerValue}`,
          version: result.match,
          confidence: signature.confidence,
        });
      }
    }

    // Match bodies
    if (rule.bodies) {
      for (const match of rule.bodies) {
        for (const response of context.responses) {
          const body = response.headers["content-type"]?.includes("text")
            ? response.body
            : "";
          if (!body) {
            continue;
          }
          const result = matchString(body, match);
          if (!result.hit) {
            continue;
          }

          evidences.push({
            type: "body",
            value: `${body.substring(0, 100)}...`,
            version: result.match,
            confidence: signature.confidence,
          });
        }
      }
    }
  }

  if (evidences.length > 0) {
    return {
      name: signature.name,
      confidence: maxConfidence(evidences.map((e) => e.confidence)),
      evidences,
    };
  }

  return undefined;
};
