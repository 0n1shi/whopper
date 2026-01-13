import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const yoastSeoSignature: Signature = {
  name: "Yoast SEO",
  description:
    "Yoast SEO is a search engine optimisation plugin for WordPress and other platforms.",
  cpe: "cpe:/a:yoast:yoast_seo",
  rule: {
    confidence: "high",
    bodies: [
      "<!-- This site is optimized with the Yoast (?:WordPress )?SEO plugin v([^\\s]+) -",
      "<!-- This site is optimized with the Yoast SEO Premium plugin v(?:[^\\s]+) \\\\(Yoast SEO v([^\\s]+)\\\\) -",
      "yoast-schema-graph",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
