import type { Signature } from "../_types.js";

export const kineticjsSignature: Signature = {
  name: "KineticJS",
  rule: {
    confidence: "high",
    urls: [
      "kinetic(?:-v?([\\d.]+))?(?:\\.min)?\\.js",
    ],
    javascriptVariables: {
      "Kinetic": "",
      "Kinetic.version": "^(.+)$",
    },
  },
};
