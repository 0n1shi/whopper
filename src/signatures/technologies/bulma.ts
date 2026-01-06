import type { Signature } from "../_types.js";

export const bulmaSignature: Signature = {
  name: "Bulma",
  description: "Bulma is a free class-based framework for CSS.",
  rule: {
    confidence: "high",
    bodies: ["bulma(?:-docs)?\\.min\\.css"],
    javascriptVariables: {
      "Bulma.VERSION": "([\\d\\.]+)",
    },
  },
};
