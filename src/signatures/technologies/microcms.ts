import type { Signature } from "../_types.js";

export const microcmsSignature: Signature = {
  name: "microCMS",
  description: "microCMS is a Japan-based headless CMS that enables editors and developers to build delicate sites and apps.",
  rule: {
    confidence: "high",
    bodies: [
      "src[^>]+.microcms\\-assets.io\\/",
      "microcms-assets",
      "io",
    ],
  },
};
