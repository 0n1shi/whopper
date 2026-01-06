import type { Signature } from "../_types.js";

export const polyfillSignature: Signature = {
  name: "Polyfill",
  description:
    "Polyfill is a service which accepts a request for a set of browser features and returns only the polyfills that are needed by the requesting browser.",
  rule: {
    confidence: "high",
    urls: ["polyfill\\.io/v([\\d\\.]+)"],
  },
};
