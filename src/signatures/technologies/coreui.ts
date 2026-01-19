import type { Signature } from "../_types.js";

export const coreuiSignature: Signature = {
  name: "CoreUI",
  description: "CoreUI provides cloud hosting, web and mobile design, animations, wireframes, and UX testing services.",
  rule: {
    confidence: "high",
    urls: [
      "webpackJsonp@coreui/coreui",
    ],
    javascriptVariables: {
      "coreui": "",
    },
  },
};
