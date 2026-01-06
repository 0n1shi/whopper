import type { Signature } from "../_types.js";

export const codeMirrorSignature: Signature = {
  name: "CodeMirror",
  description:
    "CodeMirror is a JavaScript component that provides a code editor in the browser.",
  rule: {
    confidence: "high",
    javascriptVariables: {
      CodeMirror: "",
      "CodeMirror.version": "^(.+)$",
    },
  },
};
