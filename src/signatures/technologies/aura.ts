import type { Signature } from "../_types.js";

export const auraSignature: Signature = {
  name: "Aura",
  description: "Aura is an open-source UI framework built by Salesforce for developing dynamic web apps for mobile and desktop devices.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "Aura.app": "siteforce\\:communityApp",
    },
  },
};
