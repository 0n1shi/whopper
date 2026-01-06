import type { Signature } from "../_types.js";

export const lodashSignature: Signature = {
  name: "Lodash",
  description:
    "Lodash is a JavaScript library which provides utility functions for common programming tasks using the functional programming paradigm.",
  cpe: "cpe:/a:lodash:lodash",
  rule: {
    confidence: "high",
    urls: ["lodash.*\\.js"],
    javascriptVariables: {
      "_.VERSION": "(.+)",
      "_.differenceBy": "",
      "_.templateSettings.imports._.templateSettings.imports._.VERSION": "(.+)",
    },
  },
};
