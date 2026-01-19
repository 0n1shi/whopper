import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const wpRoyalAsheSignature: Signature = {
  name: "WP-Royal Ashe",
  description: "WP-Royal Ashe is a personal and multi-author WordPress blog theme.",
  rule: {
    confidence: "high",
    bodies: [
      "ashe-style-css",
    ],
    urls: [
      "/wp-content/themes/ashe(?:-pro-premium)?/",
    ],
    javascriptVariables: {
      "ashePreloader": "",
      "asheStickySidebar": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
