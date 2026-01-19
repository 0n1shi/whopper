import type { Signature } from "../_types.js";

export const hatenaBlogSignature: Signature = {
  name: "Hatena Blog",
  description: "Hatena Blog is one of the traditional blog platforms in Japan.",
  rule: {
    confidence: "high",
    urls: [
      "cdn\\.blog\\.st-hatena\\.com/",
    ],
  },
};
