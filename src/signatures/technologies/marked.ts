import type { Signature } from "../_types.js";

export const markedSignature: Signature = {
  name: "Marked",
  cpe: "cpe:/a:marked_project:marked",
  rule: {
    confidence: "high",
    urls: [
      "/marked(?:\\.min)?\\.js",
    ],
    javascriptVariables: {
      "marked": "",
    },
  },
};
