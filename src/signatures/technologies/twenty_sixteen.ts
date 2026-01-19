import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const twentySixteenSignature: Signature = {
  name: "Twenty Sixteen",
  description: "Twenty Sixteen is the default WordPress theme for 2016.",
  rule: {
    confidence: "high",
    bodies: [
      "twentysixteen-style-css",
    ],
    urls: [
      "/wp-content/themes/twentysixteen/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
