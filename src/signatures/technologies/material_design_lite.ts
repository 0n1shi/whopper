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
      "(?:code\\.)?getmdl\\.io/([\\d.]+)/material(?:\\.min)?\\.js",
      "material-design-lite[/@]([\\d.]+)[^\"'\\s]*?material(?:\\.min)?\\.js",
      "/material(?:\\.min)?\\.js",
    ],
    javascriptVariables: {
      "MaterialIconToggle": "",
    },
  },
};
