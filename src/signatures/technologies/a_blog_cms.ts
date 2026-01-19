import type { Signature } from "../_types.js";
import { phpSignature } from "./php.js";

export const aBlogCmsSignature: Signature = {
  name: "a-blog cms",
  description: "a-blog cms is a content management system.",
  rule: {
    confidence: "high",
    bodies: [
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']a-blog cms",
    ],
  },
  impliedSoftwares: [phpSignature.name],
};
