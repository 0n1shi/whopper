import type { Signature } from "../_types.js";

export const qwikSignature: Signature = {
  name: "Qwik",
  description:
    "Qwik is designed for the fastest possible page load time, by delivering pure HTML with near 0 JavaScript.",
  rule: {
    confidence: "high",
    bodies: ["q:version=\"([\\d\\.]+(?:-\\d+)?)\""],
  },
};
