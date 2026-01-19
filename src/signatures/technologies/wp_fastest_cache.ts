import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const wpFastestCacheSignature: Signature = {
  name: "WP Fastest Cache",
  description: "WP Fastest Cache is one of a number of plugins for WordPress designed to accelerate the performance of your website.",
  rule: {
    confidence: "high",
    bodies: [
      "/wp-content/cache/wpfc-minified/",
    ],
    urls: [
      "/wp-content/cache/wpfc-minified/",
    ],
    javascriptVariables: {
      "Wpfcll": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
