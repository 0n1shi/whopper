import type { Signature } from "../_types.js";

export const toastrSignature: Signature = {
  name: "toastr",
  description:
    "toastr is a Javascript library for non-blocking notifications. The goal is to create a simple core library that can be customized and extended.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      "toastr.version": "(.*)",
    },
  },
};
