import type { Signature } from "../_types.js";

export const dropzoneSignature: Signature = {
  name: "Dropzone",
  description:
    "Dropzone is a JavaScript library that turns any HTML element into a dropzone.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      Dropzone: "",
      "Dropzone.version": "([\\d\\.]+)",
    },
  },
};
