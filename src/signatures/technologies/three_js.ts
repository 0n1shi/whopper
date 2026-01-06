import type { Signature } from "../_types.js";

export const threeJsSignature: Signature = {
  name: "Three.js",
  description:
    "Three.js is a cross-browser JavaScript library and application programming interface used to create and display animated 3D computer graphics in a web browser using WebGL.",
  rule: {
    confidence: "high",
    urls: ["three(?:\\.min)?\\.js"],
    javascriptVariables: {
      "THREE.REVISION": "^(.+)$",
      __THREE__: "^(.+)$",
    },
  },
};
