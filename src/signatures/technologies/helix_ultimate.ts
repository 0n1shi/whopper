import type { Signature } from "../_types.js";
import { joomlaSignature } from "./joomla.js";

export const helixUltimateSignature: Signature = {
  name: "Helix Ultimate",
  description: "Helix Ultimate a free template framework for Joomla.",
  rule: {
    confidence: "high",
    bodies: [
      "sp-header",
      "helix-ultimate",
    ],
  },
  impliedSoftwares: [joomlaSignature.name],
};
