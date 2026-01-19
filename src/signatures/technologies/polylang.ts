import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const polylangSignature: Signature = {
  name: "Polylang",
  description: "Polylang is a WordPress plugin which allows you to create multilingual WordPress site.",
  rule: {
    confidence: "high",
    headers: {
      "x-redirected-by": "Polylang(?: (Pro))?",
    },
    cookies: {
      "pll_language": "[a-z]{2}",
    },
    bodies: [
      "pll_switcher",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
