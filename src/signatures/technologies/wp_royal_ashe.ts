import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const wpRoyalAsheSignature: Signature = {
  name: "WP-Royal Ashe",
  description:
    "WP-Royal Ashe is a personal and multi-author WordPress blog theme.",
  rule: {
    confidence: "high",
    bodies: ["(?<![\\w-])ashe-style-css(?![\\w-])"],
    urls: ["/wp-content/themes/ashe(?:-pro-premium)?/"],
    javascriptVariables: {
      ashePreloader: "",
      asheStickySidebar: "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
