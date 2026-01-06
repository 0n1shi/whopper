import type { Signature } from "../_types.js";

export const yuiSignature: Signature = {
  name: "YUI",
  description:
    "YUI is a JavaScript and CSS library with more than 30 unique components including low-level DOM utilities and high-level user-interface widgets.",
  cpe: "cpe:/a:yahoo:yui",
  rule: {
    confidence: "high",
    urls: ["(?:/yui/|yui\\.yahooapis\\.com)"],
    javascriptVariables: {
      "YAHOO.VERSION": "^(.+)$",
      "YUI.version": "^(.+)$",
    },
  },
};
