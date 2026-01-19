import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const wpBakerySignature: Signature = {
  name: "wpBakery",
  description: "WPBakery is a drag and drop visual page builder plugin for WordPress.",
  rule: {
    confidence: "high",
    bodies: [
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']WPBakery",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
