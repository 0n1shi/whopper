import type { Signature } from "../_types.js";

export const materialDesignLiteSignature: Signature = {
  name: "Material Design Lite",
  description: "Material Design Lite is a library of components for web developers.",
  rule: {
    confidence: "high",
    bodies: [
      "<link[^>]* href=\"[^\"]*material(?:\\.[\\w]+-[\\w]+)?(?:\\.min)?\\.css",
    ],
    urls: [
      "(?:/([\\d.]+))?/material(?:\\.min)?\\.js",
    ],
    javascriptVariables: {
      "MaterialIconToggle": "",
    },
  },
};
