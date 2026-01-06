import type { Signature } from "../_types.js";
import { d3Signature } from "./d3.js";

export const plotlySignature: Signature = {
  name: "Plotly",
  description: "Plotly is a graphing library for interactive charts.",
  rule: {
    confidence: "high",
    urls: ["https?://cdn\\.plot\\.ly/plotly"],
    javascriptVariables: {
      "Plotly.version": "([\\d.])",
    },
  },
  impliedSoftwares: [d3Signature.name],
};
