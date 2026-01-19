import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const twentyNineteenSignature: Signature = {
  name: "Twenty Nineteen",
  description: "Twenty Nineteen is the default WordPress theme for 2019.",
  rule: {
    confidence: "high",
    bodies: [
      "twentynineteen-style-css",
    ],
    urls: [
      "/wp-content/themes/twentynineteen/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
