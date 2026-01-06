import type { Signature } from "../_types.js";

export const backboneJsSignature: Signature = {
  name: "Backbone.js",
  description:
    "BackboneJS is a JavaScript library that allows to develop and structure the client side applications that run in a web browser.",
  cpe: "cpe:/a:backbone_project:backbone",
  rule: {
    confidence: "high",
    urls: ["backbone.*\\.js"],
    javascriptVariables: {
      Backbone: "",
      "Backbone.VERSION": "^(.+)$",
    },
  },
};
