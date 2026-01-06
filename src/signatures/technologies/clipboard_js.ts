import type { Signature } from "../_types.js";

export const clipboardJsSignature: Signature = {
  name: "Clipboard.js",
  description: "Clipboard.js is a library for handling clipboard actions.",
  rule: {
    confidence: "high",
    urls: ["clipboard(?:-([\\d.]+))?(?:\\.min)?\\.js"],
  },
};
