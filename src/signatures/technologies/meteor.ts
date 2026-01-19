import type { Signature } from "../_types.js";
import { mongoDbSignature } from "./mongodb.js";
import { nodeJsSignature } from "./node_js.js";

export const meteorSignature: Signature = {
  name: "Meteor",
  rule: {
    confidence: "high",
    bodies: [
      "<link[^>]+__meteor-css__",
    ],
    javascriptVariables: {
      "Meteor": "",
      "Meteor.release": "^METEOR@([\\d.]+)",
    },
  },
  impliedSoftwares: [mongoDbSignature.name, nodeJsSignature.name],
};
