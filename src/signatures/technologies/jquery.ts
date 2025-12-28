import type { Signature } from "../_types.js";

export const jquerySignature: Signature = {
  name: "jQuery",
  description:
    "jQuery is a JavaScript library which is a free, open-source software designed to simplify HTML DOM tree traversal and manipulation, as well as event handling, CSS animation, and Ajax.",
  cpe: "cpe:/a:jquery:jquery",
  rule: {
    confidence: "high",
    urls: [
      "jquery",
      "/jquery(?:-(\\d+\\.\\d+\\.\\d+))?[/.-]?",
      "(\\d+\\.\\d+\\.\\d+)?/jquery[/.-]?",
    ],
    javascriptVariables: {
      "$.fn.jquery": "(\\d+\\.\\d+\\.\\d+)",
      "jQuery.fn.jquery": "(\\d+\\.\\d+\\.\\d+)",
    },
  },
};
