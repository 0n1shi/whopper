import type { Signature } from "../_types.js";

export const canvasJsSignature: Signature = {
  name: "CanvasJS",
  description:
    "CanvasJS charts is a data visualisation library that runs across multiple devices and browsers.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "CanvasJS.Chart": "",
      "CanvasJS.Chart.version": "^v(.+)$",
    },
  },
};
