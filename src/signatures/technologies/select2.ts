import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const select2Signature: Signature = {
  name: "Select2",
  description:
    "Select2 is a jQuery based replacement for select boxes. It supports searching, remote data sets, and infinite scrolling of results.",
  rule: {
    confidence: "high",
    urls: ["select2(?:\\.min|\\.full)?\\.js"],
    javascriptVariables: {
      "jQuery.fn.select2": "",
    },
  },
  impliedSoftwares: [jquerySignature.name],
};
