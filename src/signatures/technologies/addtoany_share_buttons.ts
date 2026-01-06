import type { Signature } from "../_types.js";
import { addToAnySignature } from "./addtoany.js";
import { wordpressSignature } from "./wordpress.js";

export const addToAnyShareButtonsSignature: Signature = {
  name: "AddToAny Share Buttons",
  description:
    "AddToAny Share Buttons plugin for WordPress increases traffic and engagement by helping people share your posts and pages to any service.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/add-to-any/addtoany\\.min\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
  },
  impliedSoftwares: [wordpressSignature.name, addToAnySignature.name],
};
