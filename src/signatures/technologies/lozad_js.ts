import type { Signature } from "../_types.js";

export const lozadJsSignature: Signature = {
  name: "Lozad.js",
  description: "Lozad.js is a lightweight lazy-loading library that's just 535 bytes minified and gzipped.",
  rule: {
    confidence: "high",
    urls: [
      "/lozad\\.min\\.js",
    ],
    javascriptVariables: {
      "lozad": "",
    },
  },
};
