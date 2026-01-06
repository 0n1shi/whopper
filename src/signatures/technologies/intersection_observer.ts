import type { Signature } from "../_types.js";

export const intersectionObserverSignature: Signature = {
  name: "Intersection Observer",
  description:
    "Intersection Observer is a browser API that provides a way to observe the visibility and position of a DOM element relative to the containing root element or viewport.",
  rule: {
    confidence: "high",
    urls: [
      "cdn\\.jsdelivr\\.net/npm/intersection-observer@([\\d\\.]+)",
      "/assets/(?:.+)?intersection-observer\\.[\\d\\w\\.]+\\.js",
    ],
  },
};
