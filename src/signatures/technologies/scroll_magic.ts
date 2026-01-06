import type { Signature } from "../_types.js";
import { gsapSignature } from "./gsap.js";
import { jquerySignature } from "./jquery.js";

export const scrollMagicSignature: Signature = {
  name: "ScrollMagic",
  description:
    "ScrollMagic is a jQuery plugin which essentially lets you use the scrollbar like a playback scrub control.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      ScrollMagic: "",
      "ScrollMagic.version": "^([\\d\\.]+)$",
    },
  },
  impliedSoftwares: [jquerySignature.name, gsapSignature.name],
};
