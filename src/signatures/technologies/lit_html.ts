import type { Signature } from "../_types.js";

export const litHtmlSignature: Signature = {
  name: "lit-html",
  description:
    "lit-html is a simple, modern, safe, small and fast HTML templating library for JavaScript.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "litHtmlVersions.0": "([\\d\\.]+)",
    },
  },
};
