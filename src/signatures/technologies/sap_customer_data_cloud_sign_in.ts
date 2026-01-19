import type { Signature } from "../_types.js";

export const sapCustomerDataCloudSignInSignature: Signature = {
  name: "SAP Customer Data Cloud Sign-in",
  rule: {
    confidence: "high",
    urls: [
      "\\.gigya\\.com/JS/gigya\\.js",
    ],
  },
};
