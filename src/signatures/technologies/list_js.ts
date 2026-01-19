import type { Signature } from "../_types.js";

export const listSignature: Signature = {
  name: "List.js",
  rule: {
    confidence: "high",
    urls: [
      "list\\.js/",
      "@([\\d.]+)/(?:/dist)?list\\.(?:min\\.)?js",
    ],
    javascriptVariables: {
      "List": "",
    },
  },
};
