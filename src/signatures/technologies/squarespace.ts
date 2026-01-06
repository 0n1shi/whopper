import type { Signature } from "../_types.js";

export const squarespaceSignature: Signature = {
  name: "Squarespace",
  description:
    "Squarespace provides Software-as-a-Service (SaaS) for website building and hosting, and allows users to use pre-built website templates.",
  rule: {
    confidence: "high",
    headers: {
      server: "Squarespace",
    },
    javascriptVariables: {
      Squarespace: "",
      "Static.SQUARESPACE_CONTEXT.templateVersion": "^(\\d(?:\\.\\d)?)$",
    },
  },
};
