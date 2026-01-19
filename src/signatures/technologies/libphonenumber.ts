import type { Signature } from "../_types.js";

export const libphonenumberSignature: Signature = {
  name: "libphonenumber",
  description: "libphonenumber is a JavaScript library for parsing, formatting, and validating international phone numbers.",
  rule: {
    confidence: "high",
    urls: [
      "(?:/([\\d\\.]+))?/libphonenumber(?:-js\\.min)?\\.js",
    ],
    javascriptVariables: {
      "libphonenumber.AsYouType": "",
      "libphonenumber.DIGITS": "",
    },
  },
};
