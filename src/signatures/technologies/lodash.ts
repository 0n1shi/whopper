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
      // Full build markers
      "_.forOwn": "",
      "_.forIn": "",
      "_.merge": "",
      // Core build markers
      "_.thru": "",
      "_.flattenDeep": "",
      "_.concat": "",
      "_.assignIn": "",
    },
    requireAnyOfJavascriptVariables: [
      "_.forOwn",
      "_.forIn",
      "_.merge",
      "_.thru",
      "_.flattenDeep",
      "_.concat",
      "_.assignIn",
    ],
  },
};
