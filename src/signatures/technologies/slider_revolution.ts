import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const sliderRevolutionSignature: Signature = {
  name: "Slider Revolution",
  description: "Slider Revolution is a flexible and highly customisable slider.",
  rule: {
    confidence: "high",
    urls: ["/wp-content/plugins/revslider/"],
    bodies: [
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']Powered\\sby\\sSlider Revolution\\s([\\d\\.]+)",
    ],
    javascriptVariables: {
      "RS_MODULES.main.version": "^Slider Revolution\\s([\\d\\.]+)$",
      revapi1: "",
      revapi2: "",
      revapi3: "",
      revapi4: "",
      revapi5: "",
      revslider_showDoubleJqueryError: "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
