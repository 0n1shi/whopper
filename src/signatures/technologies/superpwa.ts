import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";
import { pwaSignature } from "./pwa.js";

export const superpwaSignature: Signature = {
  name: "SuperPWA",
  description: "SuperPWA helps to easily convert your WordPress website into Progressive Web Apps instantly through our widely used PWA software without in coding.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "superpwa_sw": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name, pwaSignature.name],
};
