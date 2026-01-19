import type { Signature } from "../_types.js";

export const inertiaJsSignature: Signature = {
  name: "Inertia.js",
  description: "Inertia.js is a protocol for creating monolithic single-page applications.",
  rule: {
    confidence: "high",
    headers: {
      "Vary": "X-Inertia",
      "X-Inertia": "",
    },
    bodies: [
      "data-page=[\"'][^\"']*component[^\"']*props[^\"']*url",
    ],
  },
};
