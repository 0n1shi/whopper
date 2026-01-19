import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const colibriWpSignature: Signature = {
  name: "Colibri WP",
  description: "Colibri WP is a drag-and-drop WordPress website builder.",
  rule: {
    confidence: "high",
    bodies: [
      "href[^>]+\\/wp\\-content\\/plugins\\/colibri\\-page\\-builder",
    ],
    urls: [
      "/wp-content/plugins/colibri-page-builder.+\\.js(?:.+ver=([\\d\\.\\-\\w]+))?",
    ],
    javascriptVariables: {
      "Colibri": "",
      "colibriData": "",
      "colibriFrontendData": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
