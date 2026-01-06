import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const googleTagManagerForWordPressSignature: Signature = {
  name: "Google Tag Manager for WordPress",
  description:
    "Google Tag Manager for WordPress plugin places the GTM container code snippets onto your wordpress website so that you do not need to add this manually.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/duracelltomi-google-tag-manager/.+\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
    bodies: ["/wp-content/plugins/duracelltomi-google-tag-manager/"],
  },
  impliedSoftwares: [wordpressSignature.name],
};
