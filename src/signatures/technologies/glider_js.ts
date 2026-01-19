import type { Signature } from "../_types.js";

export const gliderSignature: Signature = {
  name: "Glider.js",
  description: "Glider.js is a fast, lightweight, responsive, dependency-free scrollable list with customisable paging controls.",
  rule: {
    confidence: "high",
    urls: [
      "(?:/|@)?([\\d\\.]{2,})?/glider\\.min\\.js",
    ],
  },
};
