import type { Signature } from "../_types.js";
import { javaSignature } from "./java.js";

export const javaServerFacesSignature: Signature = {
  name: "JavaServer Faces",
  rule: {
    confidence: "high",
    headers: {
      "X-Powered-By": "JSF(?:/([\\d.]+))?",
    },
    bodies: [
      "javax\\.faces\\.ViewState",
    ],
  },
  impliedSoftwares: [javaSignature.name],
};
