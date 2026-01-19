import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const famethemesOnepressSignature: Signature = {
  name: "FameThemes OnePress",
  description: "FameThemes OnePress is a free portfolio one page WordPress theme suited for an individual or digital agency.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "OnePress_Plus": "",
      "onepressIsMobile": "",
      "onepress_js_settings": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
