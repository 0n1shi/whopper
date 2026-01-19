import type { Signature } from "../_types.js";
import { elementorSignature } from "./elementor.js";

export const elementskitSignature: Signature = {
  name: "ElementsKit",
  description: "ElementsKit is an addon for Elementor that adds additional customisation options to the page builder.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "ElementsKit_Helper": "",
      "elementskit": "",
    },
  },
  impliedSoftwares: [elementorSignature.name],
};
