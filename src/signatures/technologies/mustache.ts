import type { Signature } from "../_types.js";

export const mustacheSignature: Signature = {
  name: "Mustache",
  description: "Mustache is a web template system.",
  rule: {
    confidence: "high",
    urls: ["mustache(?:\\.min)?\\.js"],
    javascriptVariables: {
      "Mustache.version": "^(.+)$",
    },
  },
};
