import type { Signature } from "../_types.js";

export const dojoSignature: Signature = {
  name: "Dojo",
  description: "Dojo is a JavaScript toolkit for building web apps.",
  cpe: "cpe:/a:dojotoolkit:dojo",
  rule: {
    confidence: "high",
    urls: ["([\\d.]+)/dojo/dojo(?:\\.xd)?\\.js"],
    javascriptVariables: {
      dojo: "",
      "dojo.version.major": "^(.+)$",
    },
  },
};
