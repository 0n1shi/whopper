import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const translateWordPressSignature: Signature = {
  name: "Translate WordPress",
  description:
    "Translate WordPress is a website translator plugin which can translate any website to any language automatically. Translate WordPress plugin is now a part of GTranslate family.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/google-language-translator/.+scripts\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
