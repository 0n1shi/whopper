import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const jquerySparklinesSignature: Signature = {
  name: "jQuery Sparklines",
  description: "jQuery Sparklines is a plugin that generates sparklines (small inline charts) directly in the browser using data supplied either inline in the HTML, or via javascript.",
  rule: {
    confidence: "high",
    urls: [
      "jquery\\.sparkline.*\\.js",
    ],
  },
  impliedSoftwares: [jquerySignature.name],
};
