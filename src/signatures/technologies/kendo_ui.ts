import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const kendoUiSignature: Signature = {
  name: "Kendo UI",
  description:
    "Kendo UI is a HTML5 user interface framework for building interactive and high-performance websites and applications.",
  rule: {
    confidence: "high",
    bodies: ["styles/kendo\\.common(?:\\.min)?\\.css"],
    javascriptVariables: {
      kendo: "",
      "kendo.version": "^(.+)$",
    },
  },
  impliedSoftwares: [jquerySignature.name],
};
