import type { Signature } from "../_types.js";
import { wordpressSignature } from "./wordpress.js";

export const wpmuDevSmushSignature: Signature = {
  name: "WPMU DEV Smush",
  description:
    "WPMU DEV Smush is a WordPress plugin that allows you to optimise images without losing quality.",
  rule: {
    confidence: "high",
    urls: [
      "/wp-content/plugins/wp-smushit(?:-pro)?/.+\\.js(?:\\?ver=(\\d+(?:\\.\\d+)+))?",
    ],
  },
  impliedSoftwares: [wordpressSignature.name],
};
