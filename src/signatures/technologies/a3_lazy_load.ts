import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const a3LazyLoadSignature: Signature = {
  name: "a3 Lazy Load",
  description:
    "a3 Lazy Load is a mobile oriented, very simple to use plugin that will speed up sites page load speed.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/a3-lazy-load/.+\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
    javascriptVariables: {
      a3_lazyload_extend_params: "",
      a3_lazyload_params: "",
    },
  },
  impliedSoftwares: [wordpressSignature.name],
};
