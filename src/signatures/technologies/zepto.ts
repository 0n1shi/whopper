import type { Signature } from "../_types.js";

export const zeptoSignature: Signature = {
  name: "Zepto",
  rule: {
    confidence: "high",
    urls: [
      "zepto.*\\.js",
    ],
    javascriptVariables: {
      "Zepto": "",
    },
  },
};
