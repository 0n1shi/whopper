import type { Signature } from "../_types.js";

export const htmxSignature: Signature = {
  name: "Htmx",
  description: "Htmx is a JavaScript library for performing AJAX requests, triggering CSS transitions, and invoking WebSocket and server-sent events directly from HTML elements.",
  rule: {
    confidence: "high",
    bodies: [
      "data-src[^>]+\\/dist\\/htmx.min.js",
      "hx-(?:get|post|put|delete|patch|boost|trigger|swap|target|include|vals|confirm)=",
    ],
    urls: [
      "/htmx\\.org@([\\d\\.]+)",
    ],
    javascriptVariables: {
      "htmx": "",
    },
  },
};
