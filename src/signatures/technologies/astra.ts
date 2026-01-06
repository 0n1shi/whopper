import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const astraSignature: Signature = {
  name: "Astra",
  description: "Astra is a fast, lightweight, and highly customizable WordPress Theme.",
  rule: {
    confidence: "high",
    urls: [
      "themes/astra\\S*\\.js(?:\\?ver=([0-9.]+))?",
      "astra\\S*\\.css(?:\\?ver=([0-9.]+))?",
    ],
    bodies: ["astra-theme", "astra-"],
  },
  impliedSoftwares: [wordpressSignature.name],
};
