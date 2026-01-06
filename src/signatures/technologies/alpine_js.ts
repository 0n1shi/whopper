import type { Signature } from "../_types.js";

export const alpineJsSignature: Signature = {
  name: "Alpine.js",
  description: "Alpine.js is a minimal JavaScript framework for composing behavior.",
  rule: {
    confidence: "high",
    urls: ["/alpine(?:\\.min)?\\.js"],
    bodies: ["<[^>]+[^\\w-]x-data[^\\w-][^<]+"],
    javascriptVariables: {
      "Alpine.version": "^(.+)$",
    },
  },
};
