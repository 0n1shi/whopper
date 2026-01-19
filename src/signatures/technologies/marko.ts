import type { Signature } from "../_types.js";
import { nodeJsSignature } from "./node_js.js";

export const markoSignature: Signature = {
  name: "Marko",
  description: "Marko is HTML re-imagined as a language for building dynamic and reactive user interfaces.",
  rule: {
    confidence: "high",
    bodies: [
      "data-marko-key",
      "data-framework=[\"']marko[\"']",
    ],
    urls: [
      "\\.marko(\\.js)?",
    ],
    javascriptVariables: {
      "markoComponent": "",
      "markoSections": "",
      "markoVars": "",
    },
  },
  impliedSoftwares: [nodeJsSignature.name],
};
