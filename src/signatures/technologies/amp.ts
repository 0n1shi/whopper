import type { Signature } from "../_types.js";

export const ampSignature: Signature = {
  name: "AMP",
  description: "AMP, originally created by Google, is an open-source HTML framework developed by the AMP open-source Project. AMP is designed to help webpages load faster.",
  rule: {
    confidence: "high",
    bodies: [
      "<html[^>]* (?:amp|⚡)[^-]",
      "<link rel=\"amphtml\"",
    ],
  },
};
