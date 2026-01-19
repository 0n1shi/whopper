import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const machothemesNewsmagSignature: Signature = {
  name: "MachoThemes NewsMag",
  description: "MachoThemes Newsmag is a clean and modern magazine, news or blog WordPress theme.",
  rule: {
    confidence: "high",
    bodies: [
      "href[^>]+\\/wp\\-content\\/themes\\/Newsmag",
    ],
    urls: [
      "/wp-content/themes/Newsmag(?:-child)?/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
