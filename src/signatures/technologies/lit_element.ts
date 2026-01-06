import type { Signature } from "../_types.js";

export const litElementSignature: Signature = {
  name: "lit-element",
  description:
    "lit-element is a simple base class for creating web components that work in any web page with any framework.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "litElementVersions.0": "([\\d\\.]+)",
    },
  },
};
