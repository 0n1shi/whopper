import type { Signature } from "../_types.js";

export const raphaelSignature: Signature = {
  name: "Raphael",
  description:
    "Raphael is a cross-browser JavaScript library that draws Vector graphics for websites.",
  rule: {
    confidence: "high",
    urls: ["raphael(?:-([\\d.]+))?(?:\\.min)?\\.js"],
    javascriptVariables: {
      "Raphael.version": "^(.+)$",
    },
  },
};
