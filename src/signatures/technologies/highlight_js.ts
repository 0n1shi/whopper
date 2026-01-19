import type { Signature } from "../_types.js";

export const highlightSignature: Signature = {
  name: "Highlight.js",
  rule: {
    confidence: "high",
    urls: [
      "/(?:([\\d.])+/)?highlight(?:\\.min)?\\.js",
    ],
    javascriptVariables: {
      "hljs.highlightBlock": "",
      "hljs.listLanguages": "",
    },
  },
};
