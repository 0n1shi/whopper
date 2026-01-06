import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const extendifySignature: Signature = {
  name: "Extendify",
  description:
    "Extendify (formerly Redux framework) is one of the most popular, advanced, and free to use option panel frameworks for WordPress themes and plugins.",
  rule: {
    confidence: "high",
    bodies: ["framework[^>]+Redux ([\\d\\.]+)"],
  },
  impliedSoftwares: [wordpressSignature.name],
};
