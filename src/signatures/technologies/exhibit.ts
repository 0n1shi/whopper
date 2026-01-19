import type { Signature } from "../_types.js";

export const exhibitSignature: Signature = {
  name: "Exhibit",
  rule: {
    confidence: "high",
    urls: [
      "exhibit.*\\.js",
    ],
    javascriptVariables: {
      "Exhibit": "",
      "Exhibit.version": "^(.+)$",
    },
  },
};
