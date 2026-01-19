import type { Signature } from "../_types.js";

export const boomerangSignature: Signature = {
  name: "Boomerang",
  description: "boomerang is a JavaScript library that measures the page load time experienced by real users, commonly called RUM (Real User Measurement).",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "BOOMR": "",
      "BOOMR_lstart": "",
      "BOOMR_mq": "",
    },
  },
};
