import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const bricksSignature: Signature = {
  name: "Bricks",
  description: "Bricks is a premium WordPress theme that lets you visually build performant WordPress sites.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/themes/bricks/assets/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
