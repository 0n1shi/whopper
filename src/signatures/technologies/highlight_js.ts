import type { Signature } from "../_types.js";

export const highlightSignature: Signature = {
  name: "Highlight.js",
  rule: {
    confidence: "high",
    urls: [
      "highlight\\.?js[/@]([\\d.]+)[^\"'\\s]*?/highlight(?:\\.min)?\\.js",
      "highlightjs/cdn-(?:assets|release)@([\\d.]+)[^\"'\\s]*?/highlight(?:\\.min)?\\.js",
      "/highlight(?:\\.min)?\\.js",
    ],
    javascriptVariables: {
      "hljs.highlightBlock": "",
      "hljs.listLanguages": "",
    },
  },
};
