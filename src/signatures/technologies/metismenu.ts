import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const metismenuSignature: Signature = {
  name: "metisMenu",
  description: "metisMenu is a collapsible jQuery menu plugin.",
  rule: {
    confidence: "high",
    urls: [
      "metismenu(?:js)?[/@]([\\d.]+)[^\"'\\s]*?metisMenu(?:js)?(?:\\.min)?\\.js",
      "(?:/|\\.)metisMenu(?:js)?(?:\\.min)?\\.js",
    ],
    javascriptVariables: {
      "MetisMenu": "",
      "metisMenu": "",
    },
  },
  impliedSoftwares: [jquerySignature.name],
};
