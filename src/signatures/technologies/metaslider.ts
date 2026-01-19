import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const metaSliderSignature: Signature = {
  name: "MetaSlider",
  description: "MetaSlider is a WordPress plugin for adding responsive sliders and carousels to websites.",
  rule: {
    confidence: "high",
    bodies: [
      "/wp-content/plugins/ml-slider/",
      "metaslider-pro-public-css",
    ],
    urls: [
      "/wp-content/plugins/ml-slider(?:-pro)?/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
