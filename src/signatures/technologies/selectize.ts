import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const selectizeSignature: Signature = {
  name: "Selectize",
  description: "Selectize is an extensible jQuery-based custom <select> UI control.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "Selectize": "",
      "selectize": "",
    },
  },
  impliedSoftwares: [jquerySignature.name],
};
