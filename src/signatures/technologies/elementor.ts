import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const elementorSignature: Signature = {
  name: "Elementor",
  description: "Elementor is a website builder platform for professionals on WordPress.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/elementor(?:-pro)?/.+frontend-modules\\.min\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
    bodies: [
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']Elementor\\s([\\d\\.]+)",
    ],
    javascriptVariables: {
      "elementorFrontend.getElements": "",
      "elementorFrontendConfig.version": "([\\d\\.]+)",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
