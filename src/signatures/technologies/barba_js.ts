import type { Signature } from "../_types.js";

export const barbaJsSignature: Signature = {
  name: "Barba.js",
  description:
    "Barba.js is a small and easy-to-use javascript library that helps you creating fluid and smooth transitions between your website's pages.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "barba.version": "^([\\d\\.]+)$",
    },
  },
};
