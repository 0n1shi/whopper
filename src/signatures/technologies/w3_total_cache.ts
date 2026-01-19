import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const w3TotalCacheSignature: Signature = {
  name: "W3 Total Cache",
  description: "W3 Total Cache (W3TC) improves SEO and increases website performance while reducing load times by leveraging content delivery network (CDN) integration and the latest best practices.",
  rule: {
    confidence: "high",
    headers: {
      "X-Powered-By": "W3 Total Cache(?:/([\\d.]+))?",
    },
    bodies: [
      "<!--[^>]+W3 Total Cache",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
