import type { Signature } from "../_types.js";

export const riotSignature: Signature = {
  name: "Riot",
  description: "Riot is a JavaScript-based user interface library.",
  rule: {
    confidence: "high",
    urls: [
      "riot(?:\\+compiler)?(?:\\.min)?\\.js",
    ],
    javascriptVariables: {
      "riot": "",
    },
  },
};
