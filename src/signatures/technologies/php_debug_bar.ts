import type { Signature } from "../_types.js";

export const phpdebugbarSignature: Signature = {
  name: "PHPDebugBar",
  rule: {
    confidence: "high",
    urls: [
      "debugbar.*\\.js",
    ],
    javascriptVariables: {
      "PhpDebugBar": "",
      "phpdebugbar": "",
    },
  },
};
