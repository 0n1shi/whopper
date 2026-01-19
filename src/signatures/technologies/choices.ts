import type { Signature } from "../_types.js";

export const choicesSignature: Signature = {
  name: "Choices",
  description: "Choices.js is a lightweight, configurable select box/text input plugin.",
  rule: {
    confidence: "high",
    urls: [
      "choices\\.js(?:@|/)?([\\d\\.]+)?.+choices\\.min\\.js",
      "/modules/choices/js/choices\\.js",
    ],
    javascriptVariables: {
      "Choices": "",
    },
  },
};
