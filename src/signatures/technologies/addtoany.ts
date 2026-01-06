import type { Signature } from "../_types.js";

export const addToAnySignature: Signature = {
  name: "AddToAny",
  description:
    "AddToAny is a universal sharing platform that can be integrated into a website by use of a web widget or plugin.",
  rule: {
    confidence: "high",
    urls: ["addtoany\\.com/menu/page\\.js"],
    javascriptVariables: {
      a2apage_init: "",
    },
  },
};
