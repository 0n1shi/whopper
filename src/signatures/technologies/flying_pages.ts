import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const flyingPagesSignature: Signature = {
  name: "Flying Pages",
  description: "Flying Pages is a performance optimisation plugin for WordPress websites designed to reduce page load times and improve the user experience.",
  rule: {
    confidence: "high",
    bodies: [
      "href[^>]+\\/wp\\-content\\/plugins\\/flying\\-pages\\/",
    ],
    urls: [
      "/wp-content/plugins/flying-pages/.+\\.js(?:\\?ver=([\\d\\.]+))?",
    ],
    javascriptVariables: {
      "flyingPages": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
