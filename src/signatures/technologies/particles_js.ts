import type { Signature } from "../_types.js";

export const particlesJsSignature: Signature = {
  name: "particles.js",
  description: "Particles.js is a JavaScript library for creating particles.",
  rule: {
    confidence: "high",
    urls: ["/particles(?:\\.min)?\\.js"],
    bodies: ["id=[\"']particles-js[\"']"],
    javascriptVariables: {
      particlesJS: "",
    },
  },
};
