import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const allInOneSeoPackSignature: Signature = {
  name: "All in One SEO Pack",
  description:
    "All in One SEO plugin optimizes WordPress website and its content for search engines.",
  cpe: "cpe:/a:aioseo:all_in_one_seo",
  rule: {
    confidence: "high",
    bodies: ["<!-- All in One SEO Pack ([\\d.]+) "],
  },
  impliedSoftwares: [wordpressSignature.name],
};
