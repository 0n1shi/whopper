import type { Signature } from "../_types.js";

export const gsapSignature: Signature = {
  name: "GSAP",
  description:
    "GSAP is an animation library that allows you to create animations with JavaScript.",
  cpe: "cpe:/a:greensock:greensock_animation_platform",
  rule: {
    confidence: "high",
    urls: ["TweenMax(?:\\.min)?\\.js"],
    javascriptVariables: {
      "TweenLite.version": "(\\d+\\.\\d+\\.\\d+)",
      "TweenMax.version": "(\\d+\\.\\d+\\.\\d+)",
      "gsap.version": "(\\d+\\.\\d+\\.\\d+)",
      gsapVersions: "",
    },
  },
};
