import type { Signature } from "../_types.js";

export const mermaidSignature: Signature = {
  name: "Mermaid",
  rule: {
    confidence: "high",
    bodies: [
      "<div [^>]*class=[\"']mermaid[\"']>",
    ],
    urls: [
      "/mermaid(?:\\.min)?\\.js",
    ],
    javascriptVariables: {
      "mermaid": "",
    },
  },
};
