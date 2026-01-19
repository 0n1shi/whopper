import type { Signature } from "../_types.js";

export const alertifyJsSignature: Signature = {
  name: "AlertifyJS",
  description: "AlertifyJS is a JavaScript framework for developing browser dialogs and notifications.",
  rule: {
    confidence: "high",
    urls: [
      "/alertify/alertify\\.min\\.js",
    ],
    javascriptVariables: {
      "alertify.defaults.autoReset": "",
    },
  },
};
