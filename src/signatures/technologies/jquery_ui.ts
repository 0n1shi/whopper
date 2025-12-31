import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const jqueryUiSignature: Signature = {
  name: "jQuery UI",
  description:
    "jQuery UI is a collection of GUI widgets, animated visual effects, and themes implemented with jQuery, Cascading Style Sheets, and HTML.",
  cpe: "cpe:/a:jquery:jquery_ui",
  rule: {
    confidence: "high",
    urls: [
      "jquery-ui[./-]?(\\d+\\.\\d+\\.\\d+)?",
      "(\\d+\\.\\d+\\.\\d+)?/jquery-ui",
      "jquery-ui.*\\.js",
    ],
    javascriptVariables: {
      "jQuery.ui.version": "(\\d+\\.\\d+\\.\\d+)?",
    },
  },
  impliedSoftwares: [jquerySignature.name],
};
