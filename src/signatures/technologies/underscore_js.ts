import type { Signature } from "../_types.js";

export const underscoreJsSignature: Signature = {
  name: "Underscore.js",
  description:
    "Underscore.js is a JavaScript library which provides utility functions for common programming tasks. It is comparable to features provided by Prototype.js and the Ruby language, but opts for a functional programming design instead of extending object prototypes.",
  cpe: "cpe:/a:underscorejs:underscore",
  rule: {
    confidence: "high",
    urls: ["underscore.*\\.js(?:\\?ver=([\\d.]+))?"],
    javascriptVariables: {
      "_.VERSION": "(.+)",
      "_.mapObject": "",
      "_.matcher": "",
      "_.allKeys": "",
    },
    requireAnyOfJavascriptVariables: ["_.mapObject", "_.matcher", "_.allKeys"],
  },
};
