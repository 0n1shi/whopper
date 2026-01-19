import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const gtranslateSignature: Signature = {
  name: "GTranslate",
  description: "GTranslate is a website translator which can translate any website to any language automatically.",
  rule: {
    confidence: "high",
    bodies: [
      "href[^>]+\\/wp\\-content\\/plugins\\/gtranslate\\/",
      "src[^>]+\\/wp\\-content\\/plugins\\/gtranslate\\/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
