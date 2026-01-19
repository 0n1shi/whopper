import type { Signature } from "../_types.js";
import { elementorSignature } from "./elementor.js";

export const crocoblockJetelementsSignature: Signature = {
  name: "Crocoblock JetElements",
  description: "Crocoblock JetElements is an addon for Elementor that adds additional customisation options to the page builder.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "jetElements": "",
    },
  },
  impliedSoftwares: [elementorSignature.name],
};
