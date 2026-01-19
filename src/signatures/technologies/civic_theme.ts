import type { Signature } from "../_types.js";

export const civicthemeSignature: Signature = {
  name: "CivicTheme",
  description: "CivicTheme is an open source, inclusive and component-based design system. It was created so governments and corporations can rapidly assemble modern, consistent and compliant digital experiences.",
  rule: {
    confidence: "high",
    bodies: [
      "class[^>]+civictheme\\-image",
      "class[^>]+civic\\-image",
      "class[^>]+ct\\-image",
    ],
  },
};
