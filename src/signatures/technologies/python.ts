import type { Signature } from "../_types.js";

export const pythonSignature: Signature = {
  name: "Python",
  description: "Python is an interpreted and general-purpose programming language.",
  cpe: "cpe:/a:python:python",
  rule: {
    confidence: "high",
    headers: {
      Server: "(?:^|\\s)Python(?:/([\\d.]+))?",
    },
  },
};
