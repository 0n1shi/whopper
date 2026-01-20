import type { Signature } from "../_types.js";

export const stripeSignature: Signature = {
  name: "Stripe",
  description: "Stripe is a suite of APIs powering online payment processing and commerce solutions for internet businesses of all sizes.",
  rule: {
    confidence: "high",
    urls: [
      "js\\.stripe\\.com",
    ],
    javascriptVariables: {
      Stripe: "",
    },
  },
};
