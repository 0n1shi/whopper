import type { Signature } from "../_types.js";
import { reactSignature } from "./react.js";

export const chakraUiSignature: Signature = {
  name: "Chakra UI",
  description: "Chakra UI is a simple, modular and accessible component library that gives you the building blocks you need to build your React applications.",
  rule: {
    confidence: "high",
    bodies: [
      "style[^>]+chakra\\-ui\\-color\\-mode",
      "chakra-ui-dark",
      "chakra-ui-light",
      "chakra-portal",
    ],
    urls: [
      "\\.chakra-ui\\.",
    ],
  },
  impliedSoftwares: [reactSignature.name],
};
