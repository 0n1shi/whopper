import type { Signature } from "../_types.js";

export const requireJsSignature: Signature = {
  name: "RequireJS",
  description:
    "RequireJS is a JavaScript library and file loader which manages the dependencies between JavaScript files and in modular programming.",
  rule: {
    confidence: "high",
    urls: ["require.*\\.js"],
    javascriptVariables: {
      "requirejs.version": "^(.+)$",
    },
  },
};
