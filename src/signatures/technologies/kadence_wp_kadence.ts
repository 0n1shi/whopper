import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const kadenceWpKadenceSignature: Signature = {
  name: "Kadence WP Kadence",
  description:
    "Kadence WP Kadence is a multipurpose WordPress theme that is available for free download and also offers a pro version.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/themes/kadence/.+navigation\\.min\\.js(?:\\?ver=([\\d\\.]+))?",
    ],
    bodies: ["kadence-global-css"],
    javascriptVariables: {
      kadence: "",
      kadenceConfig: "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
