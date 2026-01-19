import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const rankMathSeoSignature: Signature = {
  name: "RankMath SEO",
  description: "RankMath SEO is a search engine optimization plugin for WordPress.",
  rule: {
    confidence: "high",
    bodies: [
      "/wp-content/plugins/seo-by-rank-math/",
      "rank-math-schema-pro",
      "rank-math-schema",
    ],
    urls: [
      "/wp-content/plugins/seo-by-rank-math(?:-pro)?/.+\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
