import type { Signature } from "../_types.js";

export const photoSwipeSignature: Signature = {
  name: "PhotoSwipe",
  description:
    "PhotoSwipe is an open-source gallery to support JavaScript-based image zooming.",
  rule: {
    confidence: "high",
    urls: ["photoswipe/([\\d\\.]+)/photoswipe\\.min\\.js"],
    javascriptVariables: {
      PhotoSwipe: "",
      PhotoSwipeUI_Default: "",
      photoswipeParseHash: "",
    },
  },
};
