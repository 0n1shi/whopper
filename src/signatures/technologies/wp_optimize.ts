import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const wpOptimizeSignature: Signature = {
  name: "WP-Optimize",
  description: "WP-Optimize is an all-in-one WordPress plugin that cleans your database, compresses your large images and caches your site.",
  rule: {
    confidence: "high",
    bodies: [
      "<!--[^>]+Cached by WP-Optimize",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
