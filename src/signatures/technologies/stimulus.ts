import type { Signature } from "../_types.js";

export const stimulusSignature: Signature = {
  name: "Stimulus",
  description: "A modest JavaScript framework for the HTML you already have.",
  rule: {
    confidence: "high",
    bodies: [
      "<[^>]+data-controller",
    ],
  },
};
