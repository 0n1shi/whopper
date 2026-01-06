import type { Signature } from "../_types.js";

export const knockoutJsSignature: Signature = {
  name: "Knockout.js",
  description:
    "Knockout.js is basically a library written in JavaScript, based on MVVM pattern that helps developers build rich and responsive websites.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "ko.version": "^(.+)$",
    },
  },
};
