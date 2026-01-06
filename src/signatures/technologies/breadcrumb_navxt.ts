import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const breadcrumbNavXtSignature: Signature = {
  name: "Breadcrumb NavXT",
  description:
    "Breadcrumb NavXT is a WordPress plugin compatible with WordPress versions 4.9 and up.",
  rule: {
    confidence: "high",
    bodies: ["<!-- Breadcrumb NavXT ([\\d\\.]+)"],
  },
  impliedSoftwares: [wordpressSignature.name],
};
