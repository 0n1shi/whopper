import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const twentyFourteenSignature: Signature = {
  name: "Twenty Fourteen",
  description: "Twenty Fourteen is the default WordPress theme for 2014.",
  rule: {
    confidence: "high",
    bodies: [
      "twentyfourteen-style-css",
      "twentyfourteen-lato-css",
    ],
    urls: [
      "/wp-content/themes/twentyfourteen/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
