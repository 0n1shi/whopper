import type { Signature } from "../_types.js";

export const uiKitSignature: Signature = {
  name: "UIKit",
  description: "UIKit is a front-end framework for developing web interfaces.",
  rule: {
    confidence: "high",
    bodies: [
      "<[^>]+class=\"[^\"]*(?:uk-container|uk-section)",
    ],
    urls: [
      "uikit.*\\.js",
    ],
  },
};
