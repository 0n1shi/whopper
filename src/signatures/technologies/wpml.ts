import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const wpmlSignature: Signature = {
  name: "WPML",
  description: "WPML plugin makes it possible to build and run fully multilingual WordPress sites.",
  rule: {
    confidence: "high",
    urls: ["/wp-content/plugins/sitepress-multilingual-cms/"],
    bodies: [
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']WPML\\sver\\:([\\d\\.]+)",
    ],
    cookies: {
      "wp-wpml_current_language": ".*",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
