import type { Signature } from "../_types.js";
import { backboneJsSignature } from "./backbone_js.js";

export const marionetteJsSignature: Signature = {
  name: "Marionette.js",
  description:
    "Marionette is a composite application library for Backbone.js that aims to simplify the construction of large scale JavaScript applications. It is a collection of common design and implementation patterns found in applications.",
  rule: {
    confidence: "high",
    urls: ["backbone\\.marionette.*\\.js"],
    javascriptVariables: {
      Marionette: "",
      "Marionette.VERSION": "^(.+)$",
    },
  },
  impliedSoftwares: [backboneJsSignature.name],
};
