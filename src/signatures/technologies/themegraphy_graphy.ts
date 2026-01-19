import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const themegraphyGraphySignature: Signature = {
  name: "Themegraphy Graphy",
  description: "Themegraphy Graphy is now compatible with WordPress 5.0 and Gutenberg blog-oriented WordPress theme.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/themes/graphy(?:-pro)?/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
