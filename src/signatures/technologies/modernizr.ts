import type { Signature } from "../_types.js";

export const modernizrSignature: Signature = {
  name: "Modernizr",
  description:
    "Modernizr is a JavaScript library that detects the features available in a user's browser.",
  rule: {
    confidence: "high",
    urls: [
      "/([\\d.]+)/modernizr.*\\.js",
      "modernizr(?:\\.([\\d.]+))?.*\\.js",
    ],
    javascriptVariables: {
      "Modernizr._version": "(.+)",
    },
  },
};
