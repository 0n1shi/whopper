import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const fullPageJsSignature: Signature = {
  name: "fullPage.js",
  description:
    "fullPage.js a jQuery and vanilla JavaScript plugin for fullscreen scrolling websites.",
  rule: {
    confidence: "high",
    urls: ["/fullPage\\.js(?:/([\\d\\.]+)/)?"],
    javascriptVariables: {
      "fullpage_api.version": "([\\d\\.]+)",
    },
  },
  impliedSoftwares: [jquerySignature.name],
};
