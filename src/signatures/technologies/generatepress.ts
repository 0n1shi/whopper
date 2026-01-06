import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const generatePressSignature: Signature = {
  name: "GeneratePress",
  description:
    "GeneratePress is a lightweight WordPress theme that focuses on speed, stability, and accessibility",
  rule: {
    confidence: "high",
    urls: ["themes/generatepress\\S*\\.js(?:\\?ver=([0-9.]+))?"],
    bodies: ["generatepress\\S*\\.css", "generatepress-theme"],
    javascriptVariables: {
      generatepressMenu: "",
      generatepressNavSearch: "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
