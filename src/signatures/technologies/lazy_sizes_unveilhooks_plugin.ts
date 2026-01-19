import type { Signature } from "../_types.js";

export const lazysizesUnveilhooksPluginSignature: Signature = {
  name: "LazySizes unveilhooks plugin",
  description: "LazySizes unveilhooks plugin extends lazySizes to lazyload scripts/widgets, background images, styles and video/audio elements.",
  rule: {
    confidence: "high",
    urls: [
      "ls\\.unveilhooks(?:\\.min)?\\.js",
    ],
  },
};
