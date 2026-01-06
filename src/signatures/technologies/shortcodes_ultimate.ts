import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const shortcodesUltimateSignature: Signature = {
  name: "Shortcodes Ultimate",
  description: "Shortcodes Ultimate is a comprehensive collection of visual components for WordPress.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/shortcodes-ultimate/.+index\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
