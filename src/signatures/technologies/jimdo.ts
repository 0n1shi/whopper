import type { Signature } from "../_types.js";

export const jimdoSignature: Signature = {
  name: "Jimdo",
  description: "Jimdo is a website-builder and all-in-one hosting solution, designed to enable users to build their own websites.",
  rule: {
    confidence: "high",
    headers: {
      "X-Jimdo-Instance": "",
      "X-Jimdo-Wid": "",
    },
    urls: [
      "\\.jimdo(?:site)?\\.com/",
    ],
    javascriptVariables: {
      "jimdoDolphinData": "",
    },
  },
};
