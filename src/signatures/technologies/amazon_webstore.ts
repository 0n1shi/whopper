import type { Signature } from "../_types.js";

export const amazonWebstoreSignature: Signature = {
  name: "Amazon Webstore",
  description: "Amazon Webstore is an all-in-one hosted ecommerce website solution.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "amzn": "",
    },
  },
};
