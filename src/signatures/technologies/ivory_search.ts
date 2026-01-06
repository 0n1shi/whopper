import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const ivorySearchSignature: Signature = {
  name: "Ivory Search",
  description:
    "Ivory Search is a WordPress search plugin that improves WordPress search by providing advanced options to extend search or exclude specific content from search.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/add-search-to-menu/.+\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
    javascriptVariables: {
      IvorySearchVars: "",
      ivory_search_analytics: "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
