import type { Signature } from "../_types.js";

export const momentJsSignature: Signature = {
  name: "Moment.js",
  description:
    "Moment.js is a free and open-source JavaScript library that removes the need to use the native JavaScript Date object directly.",
  cpe: "cpe:2.3:a:momentjs:moment:*:*:*:*:*:*:*:*",
  rule: {
    confidence: "high",
    urls: ["moment(?:\\.min)?\\.js"],
    javascriptVariables: {
      moment: "",
      "moment.version": "^(.+)$",
    },
  },
};
