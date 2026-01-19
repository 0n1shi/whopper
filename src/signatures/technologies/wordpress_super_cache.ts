import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const wordPressSuperCacheSignature: Signature = {
  name: "WordPress Super Cache",
  description: "WordPress Super Cache is a static caching plugin for WordPress.",
  rule: {
    confidence: "high",
    headers: {
      "WP-Super-Cache": "",
    },
    bodies: [
      "<!--[^>]+WP-Super-Cache",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
