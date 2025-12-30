import type { Signature } from "../_types.js";

export const bootstrapSignature: Signature = {
  name: "Bootstrap",
  description:
    "Bootstrap is a free and open-source CSS framework directed at responsive, mobile-first front-end web development. It contains CSS and JavaScript-based design templates for typography, forms, buttons, navigation, and other interface components.",
  cpe: "cpe:/a:getbootstrap:bootstrap",
  rule: {
    confidence: "high",
    bodies: [
      "Bootstrap v(\\d+\\.\\d+\\.\\d+)",
      "bootstrap.*(\\d+\\.\\d+\\.\\d+)\\.min\\.css",
      "bootstrap.*(\\d+\\.\\d+\\.\\d+)\\.min\\.js",
    ],
    javascriptVariables: {
      "bootstrap.Alert.VERSION": "(\\d+\\.\\d+\\.\\d+)",
      "jQuery.fn.tooltip.Constructor.VERSION": "(\\d+\\.\\d+\\.\\d+)",
    },
  },
};
