import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const themebeezCreamMagazineSignature: Signature = {
  name: "Themebeez Cream Magazine",
  description: "Cream Magazine is a news and magazine WordPress theme by Themebeez.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "cream_magazine_script_obj": "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
