import type { Signature } from "../_types.js";
import { pythonSignature } from "./python.js";

export const uvicornSignature: Signature = {
  name: "Uvicorn",
  rule: {
    confidence: "high",
    headers: {
      "Server": "uvicorn",
    },
  },
  impliedSoftwares: [pythonSignature.name],
};
