import type { Signature } from "../_types.js";

export const corejsSignature: Signature = {
  name: "core-js",
  description:
    "core-js is a modular standard library for JavaScript, with polyfills for cutting-edge ECMAScript features.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "__core-js_shared__": "",
      "__core-js_shared__.versions.0.version": "(\\d+\\.\\d+\\.\\d+)",
      "_babelPolyfill": "",
      "core": "",
      "core.version": "(\\d+\\.\\d+\\.\\d+)",
    },
  },
};

