import type { Signature } from "../_types.js";

export const winkSignature: Signature = {
  name: "Wink",
  description: "Wink Toolkit is a JavaScript toolkit used to build mobile web apps.",
  rule: {
    confidence: "high",
    urls: [
      "(?:_base/js/base|wink).*\\.js",
    ],
    javascriptVariables: {
      "wink.version": "^(.+)$",
    },
  },
};
