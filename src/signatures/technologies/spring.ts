import type { Signature } from "../_types.js";
import { javaSignature } from "./java.js";

export const springSignature: Signature = {
  name: "Spring",
  rule: {
    confidence: "high",
    headers: {
      "X-Application-Context": "",
    },
  },
  impliedSoftwares: [javaSignature.name],
};
