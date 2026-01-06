import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const neveSignature: Signature = {
  name: "Neve",
  description:
    "Neve is a super-fast, easily customizable, multi-purpose theme that works perfectly with Gutenberg and the most popular page builders as well as WooCommerce",
  rule: {
    confidence: "high",
    urls: ["themes/neve\\S*\\.js(?:\\?ver=([0-9.]+))?"],
    bodies: ["neve\\S*\\.css", "neve-theme"],
  },
  impliedSoftwares: [wordpressSignature.name],
};
