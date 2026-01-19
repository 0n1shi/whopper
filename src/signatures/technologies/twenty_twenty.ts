import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const twentyTwentySignature: Signature = {
  name: "Twenty Twenty",
  description: "Twenty Twenty is the default WordPress theme for 2020.",
  rule: {
    confidence: "high",
    bodies: [
      "twentytwenty-style-css",
    ],
    urls: [
      "/wp-content/themes/twentytwenty/",
    ],
    javascriptVariables: {
      "twentytwenty": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
