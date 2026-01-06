import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const siteKitSignature: Signature = {
  name: "Site Kit",
  description:
    "Site Kit is a one-stop solution for WordPress users to use everything Google has to offer to make them successful on the web.",
  rule: {
    confidence: "high",
    bodies: ["Site Kit by Google ?([\\d.]+)?"],
  },
  impliedSoftwares: [wordpressSignature.name],
};
