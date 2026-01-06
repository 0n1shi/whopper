import type { Signature } from "../_types.js";

export const quillSignature: Signature = {
  name: "Quill",
  description: "Quill is a free open-source WYSIWYG editor.",
  rule: {
    confidence: "high",
    urls: ["cdn\\.quilljs\\.com/([\\d\\.]+)/"],
    javascriptVariables: {
      Quill: "",
    },
  },
};
