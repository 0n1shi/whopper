import type { Signature } from "../_types.js";
import { wixSignature } from "./wix.js";

export const wixEcommerceSignature: Signature = {
  name: "Wix eCommerce",
  rule: {
    confidence: "high",
    bodies: [
      "wixstores",
      "wix-viewer-model",
    ],
  },
  impliedSoftwares: [wixSignature.name],
};
