import type { Signature } from "../_types.js";

export const pureCssSignature: Signature = {
  name: "Pure CSS",
  description: "Pure CSS is a set of small, responsive CSS modules that can be used in web projects.",
  rule: {
    confidence: "high",
    bodies: [
      "<link[^>]+(?:([\\d.])+/)?pure(?:-min)?\\.css",
      "<div[^>]+class=\"[^\"]*pure-u-(?:sm-|md-|lg-|xl-)?\\d-\\d",
    ],
  },
};
