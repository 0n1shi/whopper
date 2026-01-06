import type { Signature } from "../_types.js";

export const scriptaculousSignature: Signature = {
  name: "script.aculo.us",
  description: "script.aculo.us is a JavaScript effects library.",
  rule: {
    confidence: "high",
    urls: ["/(?:scriptaculous|protoaculous)(?:\\.js|/)"],
    javascriptVariables: {
      "Scriptaculous.Version": "^(.+)$",
    },
  },
};
