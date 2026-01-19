import type { Signature } from "../_types.js";

export const hoganSignature: Signature = {
  name: "Hogan.js",
  rule: {
    confidence: "high",
    urls: [
      "hogan-[.-]([\\d.]*\\d)[^/]*\\.js",
      "([\\d.]+)/hogan(?:\\.min)?\\.js",
    ],
    javascriptVariables: {
      "Hogan": "",
    },
  },
};
