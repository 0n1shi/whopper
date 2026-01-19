import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const siteoriginVantageSignature: Signature = {
  name: "SiteOrigin Vantage",
  description: "SiteOrigin Vantage is a response, multi-purpose theme carefully developed with seamless integration into an array of amazing third-party plugins.",
  rule: {
    confidence: "high",
    bodies: [
      "vantage-style-css",
    ],
    urls: [
      "/wp-content/themes/vantage/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
