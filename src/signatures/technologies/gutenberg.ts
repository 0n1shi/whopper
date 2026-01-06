import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const gutenbergSignature: Signature = {
  name: "Gutenberg",
  description:
    "Gutenberg is the code name for the new block based editor introduced in WordPress 5.",
  rule: {
    confidence: "high",
    urls: ["/wp-content/plugins/gutenberg/"],
    bodies: ["/wp-content/plugins/gutenberg/"],
  },
  impliedSoftwares: [wordpressSignature.name],
};
