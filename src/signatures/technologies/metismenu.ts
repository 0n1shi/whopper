import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const metismenuSignature: Signature = {
  name: "metisMenu",
  description: "metisMenu is a collapsible jQuery menu plugin.",
  rule: {
    confidence: "high",
    urls: [
      "(?:/|\\.)metisMenu(?:js)?(?:\\.min)?\\.js(?:\\?([\\d\\.]+))?",
    ],
    javascriptVariables: {
      "MetisMenu": "",
      "metisMenu": "",
    },
  },
  impliedSoftwares: [jquerySignature.name],
};
