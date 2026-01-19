import type { Signature } from "../_types.js";
import { d3Signature } from "./d3.js";

export const xchartsSignature: Signature = {
  name: "xCharts",
  rule: {
    confidence: "high",
    bodies: [
      "<link[^>]* href=\"[^\"]*xcharts(?:\\.min)?\\.css",
    ],
    urls: [
      "xcharts\\.js",
    ],
    javascriptVariables: {
      "xChart": "",
    },
  },
  impliedSoftwares: [d3Signature.name],
};
