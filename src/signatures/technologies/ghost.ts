import type { Signature } from "../_types.js";

export const ghostSignature: Signature = {
  name: "Ghost",
  description:
    "Ghost is a powerful app for new-media creators to publish, share, and grow a business around their content.",
  rule: {
    confidence: "high",
    headers: {
      "X-Ghost-Cache-Status": "",
    },
    bodies: [
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']Ghost(?:\\s([\\d.]+))?",
    ],
  },
};
