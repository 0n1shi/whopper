import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const ewwwImageOptimizerSignature: Signature = {
  name: "EWWW Image Optimizer",
  description: "EWWW Image Optimizer is an image optimization WordPress plugin designed to improve the performance of your website.",
  rule: {
    confidence: "high",
    bodies: [
      "/wp-content/plugins/ewww-image-optimizer/",
    ],
    urls: [
      "/wp-content/plugins/ewww-image-optimizer/",
    ],
    javascriptVariables: {
      "ewww_webp_supported": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
