import type { Signature } from "../_types.js";

export const xpressengineSignature: Signature = {
  name: "XpressEngine",
  rule: {
    confidence: "high",
    bodies: [
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']XpressEngine",
    ],
  },
};
