import type { Signature } from "../_types.js";

export const katexSignature: Signature = {
  name: "KaTeX",
  description:
    "KaTeX is a cross-browser JavaScript library that displays mathematical notation in web browsers.",
  rule: {
    confidence: "high",
    urls: [
      "katex(?:@|/)([0-9.]+)(?:/dist)?/katex(?:\\.min)?\\.(?:mjs|js|css)",
    ],
    javascriptVariables: {
      katex: "",
      "katex.version": "^(.+)$",
    },
  },
};
