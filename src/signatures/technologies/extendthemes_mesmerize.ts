import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const extendthemesMesmerizeSignature: Signature = {
  name: "ExtendThemes Mesmerize",
  description: "ExtendThemes Mesmerize is an flexible, multipurpose WordPress theme.",
  rule: {
    confidence: "high",
    bodies: [
      "mesmerize-style-css",
    ],
    urls: [
      "/wp-content/themes/mesmerize(?:-pro)?/",
    ],
    javascriptVariables: {
      "MesmerizeKube": "",
      "mesmerizeDomReady": "",
      "mesmerizeFooterParalax": "",
      "mesmerizeMenuSticky": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
