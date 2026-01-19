import type { Signature } from "../_types.js";

export const glideSignature: Signature = {
  name: "Glide.js",
  description: "Glide.js is a dependency-free JavaScript ES6 slider and carousel.",
  rule: {
    confidence: "high",
    bodies: [
      "data-glide-el",
    ],
    urls: [
      "/@glidejs/glide(?:@([\\d\\.]+))?",
    ],
    javascriptVariables: {
      "Glide": "",
    },
  },
};
