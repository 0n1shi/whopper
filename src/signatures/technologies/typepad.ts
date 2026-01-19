import type { Signature } from "../_types.js";

export const typepadSignature: Signature = {
  name: "TypePad",
  description: "Typepad is a blog hosting service.",
  rule: {
    confidence: "high",
    bodies: [
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']typepad",
    ],
    urls: [
      "typepad\\.com",
    ],
  },
};
