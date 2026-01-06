import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const autoptimizeSignature: Signature = {
  name: "Autoptimize",
  description:
    "Autoptimize is a WordPress plugin that optimises website performance by aggregating, minifying, and compressing HTML, CSS, and JavaScript files.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/autoptimize/.+\\.js(?:\\?ao_version=(\\d+(?:\\.\\d+)+))?",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
