import type { Signature } from "../_types.js";

export const dayJsSignature: Signature = {
  name: "Day.js",
  description: "Day.js is a minimalist JavaScript library that parses, validates, manipulates, and displays dates and times.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "dayjs": "",
    },
  },
};
