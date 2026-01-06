import type { Signature } from "../_types.js";

export const fingerprintJsSignature: Signature = {
  name: "FingerprintJS",
  description:
    "FingerprintJS is a browser fingerprinting library that queries browser attributes and computes a hashed visitor identifier from them.",
  rule: {
    confidence: "high",
    urls: [
      "fingerprint(?:/fp)?(\\d)?(?:\\.min)?\\.js",
      "fingerprintjs(?:\\-pro|2)?(?:@|/)(\\d.*?)?/",
    ],
    javascriptVariables: {
      Fingerprint: "(\\d)?$",
      Fingerprint2: "",
      "Fingerprint2.VERSION": "^(.+)$",
      FingerprintJS: "",
    },
  },
};
