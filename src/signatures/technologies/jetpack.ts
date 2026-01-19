import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const jetpackSignature: Signature = {
  name: "Jetpack",
  description: "Jetpack is a popular WordPress plugin created by Automattic, the people behind WordPress.com.",
  rule: {
    confidence: "high",
    bodies: [
      "href[^>]+\\/wp\\-content\\/plugins\\/jetpack\\/",
    ],
    urls: [
      "/wp-content/plugins/jetpack/",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
