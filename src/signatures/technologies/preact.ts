import type { Signature } from "../_types.js";

export const preactSignature: Signature = {
  name: "Preact",
  description: "Preact is a JavaScript library that describes itself as a fast 3kB alternative to React with the same ES6 API.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "preact": "",
    },
  },
};
