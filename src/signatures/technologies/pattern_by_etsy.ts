import type { Signature } from "../_types.js";

export const patternByEtsySignature: Signature = {
  name: "Pattern by Etsy",
  description: "Pattern is an offering by Etsy to set up a website for Etsy sellers, in addition to Etsy shop.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "Etsy": "",
    },
  },
};
