import type { Signature } from "../_types.js";

export const mathJaxSignature: Signature = {
  name: "MathJax",
  description:
    "MathJax is a cross-browser JavaScript library that displays mathematical notation in web browsers, using MathML, LaTeX and ASCIIMathML markup.",
  rule: {
    confidence: "high",
    urls: ["([\\d.]+)?/mathjax\\.js"],
    javascriptVariables: {
      MathJax: "",
      "MathJax.version": "^(.+)$",
    },
  },
};
