import type { Signature } from "../_types.js";

export const lenisSignature: Signature = {
  name: "Lenis",
  description:
    "Lenis is a smooth scroll library to normalise the scrolling experience across devices.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      lenisVersion: "([\\d\\.]+)",
    },
  },
};
