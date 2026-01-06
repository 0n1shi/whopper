import type { Signature } from "../_types.js";

export const eleventySignature: Signature = {
  name: "Eleventy",
  description: "Eleventy (11ty) a simpler static site generator.",
  rule: {
    confidence: "high",
    bodies: [
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']Eleventy\\sv([\\d\\.]+)",
    ],
  },
};
