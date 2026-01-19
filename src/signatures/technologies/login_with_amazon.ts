import type { Signature } from "../_types.js";

export const loginWithAmazonSignature: Signature = {
  name: "Login with Amazon",
  description: "Login with Amazon allows you use your Amazon user name and password to sign into and share information with participating third-party websites or apps.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "onAmazonLoginReady": "",
    },
  },
};
