import type { Signature } from "../_types.js";

export const mooToolsSignature: Signature = {
  name: "MooTools",
  description: "MooTools is a compact JavaScript framework.",
  rule: {
    confidence: "high",
    urls: ["mootools.*\\.js"],
    javascriptVariables: {
      MooTools: "",
      "MooTools.version": "^(.+)$",
    },
  },
};
