import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const twentyTwelveSignature: Signature = {
  name: "Twenty Twelve",
  description: "Twenty Twelve is the default WordPress theme for 2012.",
  rule: {
    confidence: "high",
    bodies: [
      "twentytwelve-style-css",
    ],
    urls: [
      "/wp-content/themes/twentytwelve/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
