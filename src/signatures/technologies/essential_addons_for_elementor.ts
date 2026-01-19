import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const essentialAddonsForElementorSignature: Signature = {
  name: "Essential Addons for Elementor",
  description: "Essential Addons for Elementor gives you 70+ creative elements and extensions to help you extend the stock features of Elementor page builder.",
  rule: {
    confidence: "high",
    bodies: [
      "href[^>]+\\/wp\\-content\\/uploads\\/essential\\-addons\\-elementor\\/",
    ],
    urls: [
      "/wp-content/uploads/essential-addons-elementor/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
