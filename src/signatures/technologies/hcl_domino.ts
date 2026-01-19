import type { Signature } from "../_types.js";
import { javaSignature } from "./java.js";

export const hclDominoSignature: Signature = {
  name: "HCL Domino",
  description: "HCL Domino, formerly called IBM Domino (1995) and Lotus Domino (1989), is an enterprise server application development platform.",
  cpe: "cpe:/a:ibm:lotus_domino",
  rule: {
    confidence: "high",
    headers: {
      "Server": "^Lotus-Domino$",
    },
  },
  impliedSoftwares: [javaSignature.name],
};
