import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const svgSupportSignature: Signature = {
  name: "SVG Support",
  description: "SVG Support is a WordPress plugin which allows you to safely upload SVG files to your media library and use them like any other image.",
  rule: {
    confidence: "high",
    bodies: [
      "href[^>]+\\/wp\\-content\\/plugins\\/svg\\-support\\/",
    ],
    urls: [
      "/wp-content/plugins/svg-support/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
