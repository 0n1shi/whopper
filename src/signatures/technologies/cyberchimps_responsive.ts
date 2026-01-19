import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const cyberchimpsResponsiveSignature: Signature = {
  name: "CyberChimps Responsive",
  description: "CyberChimps Responsive is a modern, lightweight, fully customizable, fast and responsive WordPress theme.",
  rule: {
    confidence: "high",
    bodies: [
      "href[^>]+\\/wp\\-content\\/themes\\/responsive\\/",
      "href[^>]+\\/wp\\-content\\/themes\\/responsivepro\\/",
    ],
    urls: [
      "/wp-content/themes/responsive(?:pro)?/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
