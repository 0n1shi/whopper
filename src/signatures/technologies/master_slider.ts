import type { Signature } from "../_types.js";

export const masterSliderSignature: Signature = {
  name: "Master Slider",
  description: "Master Slider is an SEO friendly, responsive image and video slider.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      MasterSlider: "",
      "MasterSlider.version": "^([0-9\\.]+)$",
    },
  },
};
