import type { Signature } from "../_types.js";
import { elementorSignature } from "./elementor.js";
import { wordpressSignature } from "./wordpress.js";
import { elementorSignature } from "./elementor.js";

export const elementorHeaderFooterBuilderSignature: Signature = {
  name: "Elementor Header & Footer Builder",
  description: "Elementor Header & Footer Builder is a simple yet powerful WordPress plugin that allows you to create a layout with Elementor and set it as.",
  rule: {
    confidence: "high",
    bodies: [
      "href[^>]+\\/wp\\-content\\/plugins\\/header\\-footer\\-elementor\\/",
    ],
  },
  impliedSoftwares: [elementorSignature.name, wordpressSignature.name, elementorSignature.name],
};
