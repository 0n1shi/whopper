import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const lightningSignature: Signature = {
  name: "Lightning",
  description:
    "Lightning is a very simple and easy to customize WordPress theme which is based on the Bootstrap.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/themes/lightning(?:-pro)?/.+lightning\\.min\\.js(?:.+ver=([\\d\\.]+))?",
    ],
    javascriptVariables: {
      "lightningOpt.header_scrool": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
