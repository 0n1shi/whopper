import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const seedprodComingSoonSignature: Signature = {
  name: "SeedProd Coming Soon",
  description: "SeedProd Coming Soon is a page builder allows you to add a new website under construction page to your WordPress site without hiring a developer.",
  rule: {
    confidence: "high",
    bodies: [
      "href[^>]+\\/wp\\-content\\/plugins\\/coming\\-soon\\/",
    ],
    urls: [
      "/wp-content/plugins/coming-soon/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
