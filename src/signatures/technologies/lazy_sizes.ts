import type { Signature } from "../_types.js";

export const lazySizesSignature: Signature = {
  name: "LazySizes",
  description:
    "LazySizes is a JavaScript library used to delay the loading of images (iframes, scripts, etc) until they come into view.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      lazySizes: "",
      lazySizesConfig: "",
    },
  },
};
