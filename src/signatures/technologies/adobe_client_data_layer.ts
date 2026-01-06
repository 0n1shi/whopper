import type { Signature } from "../_types.js";

export const adobeClientDataLayerSignature: Signature = {
  name: "Adobe Client Data Layer",
  description:
    "Adobe Client Data Layer is a framework of JavaScript objects on your site that contains all variable values used in your implementation.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "adobeDataLayer.version": "([\\d\\.]+)",
    },
  },
};
