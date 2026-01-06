import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const wpFormsSignature: Signature = {
  name: "WPForms",
  description: "WPForms is a drag and drop WordPress form builder.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/wpforms(?:-lite)?/.+(?:frontend\\.min|wpforms)\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
    javascriptVariables: {
      wpforms: "",
      wpforms_settings: "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
