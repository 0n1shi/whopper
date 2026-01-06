import type { Signature } from "../_types.js";

export const tinySliderSignature: Signature = {
  name: "Tiny Slider",
  description: "Tiny Slider is a vanilla javascript slider for all purposes.",
  rule: {
    confidence: "high",
    urls: ["(?:/([\\d\\.]+)/min/)?tiny-slider(?:\\.min)?\\.js"],
  },
};
