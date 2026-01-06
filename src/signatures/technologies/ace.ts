import type { Signature } from "../_types.js";

export const aceSignature: Signature = {
  name: "Ace",
  description: "Ace is an embeddable code editor written in JavaScript.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "ace.EditSession": "",
      "ace.Editor": "",
      "ace.version": "([\\d\\.]+)",
    },
  },
};
