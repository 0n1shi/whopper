import type { Signature } from "../_types.js";
import { jquerySignature } from "./jquery.js";

export const bootstrapTableSignature: Signature = {
  name: "Bootstrap Table",
  rule: {
    confidence: "high",
    bodies: [
      "<link[^>]+href=\"[^>]*bootstrap-table(?:\\.min)?\\.css",
    ],
    urls: [
      "bootstrap-table(?:\\.min)?\\.js",
    ],
  },
  impliedSoftwares: [jquerySignature.name],
};
