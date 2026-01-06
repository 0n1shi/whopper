import type { Signature } from "../_types.js";

export const prototypeSignature: Signature = {
  name: "Prototype",
  description:
    "Prototype is a JavaScript Framework that aims to ease development of web applications.",
  cpe: "cpe:/a:prototypejs:prototype",
  rule: {
    confidence: "high",
    urls: ["(?:prototype|protoaculous)(?:-([\\d.]*[\\d]))?.*\\.js"],
    javascriptVariables: {
      "Prototype.Version": "^(.+)$",
    },
  },
};
