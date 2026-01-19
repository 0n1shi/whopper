import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const twentySeventeenSignature: Signature = {
  name: "Twenty Seventeen",
  description: "Twenty Seventeen is the default WordPress theme for 2017.",
  rule: {
    confidence: "high",
    bodies: [
      "twentyseventeen-style-css",
    ],
    urls: [
      "/wp-content/themes/twentyseventeen/",
    ],
    javascriptVariables: {
      "twentyseventeenScreenReaderText": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
