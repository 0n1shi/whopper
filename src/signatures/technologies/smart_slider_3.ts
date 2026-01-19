import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const smartSlider3Signature: Signature = {
  name: "Smart Slider 3",
  description: "Smart Slider 3 is a responsive, SEO optimized WordPress plugin.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/smart-slider-3(?:-pro)?/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
