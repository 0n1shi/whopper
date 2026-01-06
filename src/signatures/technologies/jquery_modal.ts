import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const jqueryModalSignature: Signature = {
  name: "jQuery Modal",
  description:
    "JQuery Modal is an overlay dialog box or in other words, a popup window that is made to display on the top or 'overlayed' on the current page.",
  rule: {
    confidence: "high",
    urls: ["jquery-modal/([\\d\\.]+)/jquery\\.modal\\.min\\.js"],
    bodies: ["jquery\\.modal\\.min\\.css"],
  },
  impliedSoftwares: [jquerySignature.name],
};
