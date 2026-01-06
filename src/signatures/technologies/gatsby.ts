import type { Signature } from "../_types.js";
import { reactSignature } from "./react.js";

export const gatsbySignature: Signature = {
  name: "Gatsby",
  description:
    "Gatsby is a React-based open-source framework with performance, scalability and security built-in.",
  rule: {
    confidence: "high",
    bodies: [
      "<div[^>]+id=\"___gatsby\"",
      "<style[^>]+id=\"gatsby-inlined-css\"",
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']Gatsby(?: ([0-9.]+))?",
    ],
  },
  impliedSoftwares: [reactSignature.name],
};
