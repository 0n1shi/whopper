import type { Signature } from "../_types.js";

export const hammerJsSignature: Signature = {
  name: "Hammer.js",
  description: "Hammer.js is a library for multi-touch gestures.",
  rule: {
    confidence: "high",
    urls: ["hammer(?:\\.min)?\\.js"],
    javascriptVariables: {
      "Ha.VERSION": "^(.+)$",
      Hammer: "",
      "Hammer.VERSION": "^(.+)$",
    },
  },
};
