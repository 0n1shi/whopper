import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const perfmattersSignature: Signature = {
  name: "Perfmatters",
  description: "Perfmatters is a performance optimisation plugin for WordPress websites.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/(?:plugins|cache|uploads)/perfmatters/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
