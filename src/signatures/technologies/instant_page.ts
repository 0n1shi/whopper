import type { Signature } from "../_types.js";

export const instantPageSignature: Signature = {
  name: "Instant.Page",
  description: "Instant.Page is a JavaScript library which uses just-in-time preloading technique to make websites faster.",
  rule: {
    confidence: "high",
    urls: [
      "instant\\.page",
    ],
  },
};
