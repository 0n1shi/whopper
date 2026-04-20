import type { Signature } from "../_types.js";

export const animateCssSignature: Signature = {
  name: "Animate.css",
  description:
    "Animate.css is a ready-to-use library collection of CSS3 animation effects.",
  rule: {
    confidence: "high",
    urls: [
      "animate\\.css[/@]([\\d.]+)[^\"'\\s]*?animate(?:\\.min)?\\.css",
      "/animate(?:\\.min)?\\.css",
    ],
    bodies: ["animate__animated"],
  },
};
