import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const godaddyCoblocksSignature: Signature = {
  name: "GoDaddy CoBlocks",
  description: "GoDaddy CoBlocks is a suite of professional page building content blocks for the WordPress Gutenberg block editor.",
  rule: {
    confidence: "high",
    bodies: [
      "href[^>]+\\/wp\\-content\\/plugins\\/coblocks\\/",
    ],
    urls: [
      "/wp-content/plugins/coblocks/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
