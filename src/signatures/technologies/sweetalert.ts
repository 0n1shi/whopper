import type { Signature } from "../_types.js";

export const sweetalertSignature: Signature = {
  name: "SweetAlert",
  description: "SweetAlert is a beautiful replacement for JavaScript's alert.",
  rule: {
    confidence: "high",
    bodies: [
      "<link[^>]+?href=\"[^\"]+sweet-alert(?:\\.min)?\\.css",
    ],
    urls: [
      "sweet(?:-)?alert(?:\\.min)?\\.js",
    ],
  },
};
