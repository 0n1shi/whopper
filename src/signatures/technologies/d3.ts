import type { Signature } from "../_types.js";

export const d3Signature: Signature = {
  name: "D3",
  description:
    "D3.js is a JavaScript library for producing dynamic, interactive data visualisations in web browsers.",
  cpe: "cpe:/a:d3.js_project:d3.js",
  rule: {
    confidence: "high",
    urls: ["/d3(?:\\. v\\d+)?(?:\\.min)?\\.js"],
    javascriptVariables: {
      "d3.version": "^(.+)$",
    },
  },
};
