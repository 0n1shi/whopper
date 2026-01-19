import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const akismetSignature: Signature = {
  name: "Akismet",
  description: "Akismet is a service that filters spam from comments, trackbacks, and contact form messages.",
  rule: {
    confidence: "high",
    bodies: [
      "href[^>]+\\/wp\\-content\\/plugins\\/akismet\\/",
    ],
    urls: [
      "/wp-content/plugins/akismet/.+\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
    javascriptVariables: {
      "ak_js.checkValidity": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
