import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const twentyFifteenSignature: Signature = {
  name: "Twenty Fifteen",
  description: "Twenty Fifteen is the default WordPress theme for 2015.",
  rule: {
    confidence: "high",
    bodies: [
      "twentyfifteen-style-css",
    ],
    urls: [
      "/wp-content/themes/twentyfifteen/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
