import type { Signature } from "../_types.js";

export const bootstrapSignature: Signature = {
  name: "Bootstrap",
  description:
    "Bootstrap is a free and open-source CSS framework directed at responsive, mobile-first front-end web development. It contains CSS and JavaScript-based design templates for typography, forms, buttons, navigation, and other interface components.",
  cpe: "cpe:/a:getbootstrap:bootstrap",
  rule: {
    confidence: "high",
    bodies: [
      // Bootstrap's official dist banner always continues onto a Copyright
      // line. Requiring it avoids matching themes that embed only the first
      // line of the banner as an attribution comment without shipping
      // Bootstrap itself.
      "Bootstrap\\s+v(\\d+\\.\\d+\\.\\d+(?:-[a-zA-Z0-9.-]+)?)[^\\n]*\\s*\\*\\s*Copyright",
      "bootstrap[-/@.]?(\\d+\\.\\d+\\.\\d+(?:-[a-zA-Z0-9.-]+)?)[^\"'\\s<>]*?\\.min\\.css",
      "bootstrap[-/@.]?(\\d+\\.\\d+\\.\\d+(?:-[a-zA-Z0-9.-]+)?)[^\"'\\s<>]*?\\.min\\.js",
    ],
    javascriptVariables: {
      "bootstrap.Alert.VERSION": "(\\d+\\.\\d+\\.\\d+(?:-[a-zA-Z0-9.-]+)?)",
      "jQuery.fn.tooltip.Constructor.VERSION":
        "(\\d+\\.\\d+\\.\\d+(?:-[a-zA-Z0-9.-]+)?)",
    },
  },
};
