import type { Signature } from "../_types.js";
import { javaSignature } from "./java.js";

export const opengseSignature: Signature = {
  name: "OpenGSE",
  description: "OpenGSE is a test suite used for testing servlet compliance. It is deployed by using WAR files that are deployed on the server engine.",
  rule: {
    confidence: "high",
    headers: {
      "Server": "GSE",
    },
  },
  impliedSoftwares: [javaSignature.name],
};
