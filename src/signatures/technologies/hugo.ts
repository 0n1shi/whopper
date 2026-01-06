import type { Signature } from "../_types.js";

export const hugoSignature: Signature = {
  name: "Hugo",
  description: "Hugo is an open-source static site generator written in Go.",
  rule: {
    confidence: "high",
    bodies: [
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']Hugo ([\\d.]+)?",
    ],
  },
};
