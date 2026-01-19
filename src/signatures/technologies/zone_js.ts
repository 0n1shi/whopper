import type { Signature } from "../_types.js";
import { angularSignature } from "./angular.js";

export const zoneJsSignature: Signature = {
  name: "Zone.js",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "Zone.root": "",
    },
  },
  impliedSoftwares: [angularSignature.name],
};
